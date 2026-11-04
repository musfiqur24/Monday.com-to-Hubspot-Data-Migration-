import fs from "node:fs";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createHash, randomUUID } from "node:crypto";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { jsonRequest } from "../lib/http.js";
import { retry } from "../lib/retry.js";
import { fail } from "../lib/sanitize.js";
export async function validateDownloadUrl(
  raw,
  allowedHost,
  lookupHost = lookup,
) {
  const url = new URL(raw);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    isIP(url.hostname) ||
    !(url.hostname.endsWith(".monday.com") || url.hostname === allowedHost)
  )
    throw fail("Download host is not permitted.");
  const addresses = await lookupHost(url.hostname, { all: true });
  if (
    !addresses.length ||
    addresses.some(({ address }) =>
      /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.|::|f[cd]|fe[89ab])/i.test(
        address,
      ),
    )
  )
    throw fail("Download host resolves to a private network.");
  return url;
}
export class Monday {
  constructor(config, throttle = () => {}, { lookupHost = lookup } = {}) {
    this.config = config;
    this.throttle = throttle;
    this.lookupHost = lookupHost;
  }
  async query(query, variables = {}) {
    return retry(
      async () => {
        const result = await jsonRequest("https://api.monday.com/v2", {
          method: "POST",
          headers: {
            Authorization: this.config.mondayToken,
            "API-Version": this.config.mondayVersion,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, variables }),
          onThrottle: this.throttle,
        });
        if (result.errors?.length) {
          const codes = result.errors.map((e) =>
            String(e.extensions?.code || ""),
          );
          const limited = codes.some((c) =>
            /limit|complexity|concurrency/i.test(c),
          );
          const error = fail(
            limited
              ? "Monday rate or complexity limit."
              : "Monday query failed. Check token, asset access and API version.",
          );
          Object.assign(error, {
            retryable: limited,
            status: limited ? 429 : 400,
            retryAfter:
              result.errors[0].extensions?.retry_in_seconds ||
              result.extensions?.retry_in_seconds,
          });
          throw error;
        }
        if (!result.data) throw fail("Monday returned no data.");
        return result.data;
      },
      { onThrottle: this.throttle },
    );
  }
  async check() {
    return (await this.query("query { me { id account { id } } }")).me;
  }
  async resolve(ids) {
    const data = await this.query(
      "query ($ids: [ID!]!) { assets(ids: $ids) { id name public_url url file_extension file_size } }",
      { ids },
    );
    return new Map((data.assets || []).map((a) => [String(a.id), a]));
  }
  async download(asset, folder, maxRetries = 2, onProgress = () => {}) {
    if (asset.file_size > this.config.maxBytes)
      throw fail("File exceeds the configured size cap.");
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let currentAsset = asset;
      if (attempt > 0 && asset.id) {
        try {
          const fresh = await this.resolve([asset.id]);
          if (fresh.has(String(asset.id)))
            currentAsset = fresh.get(String(asset.id));
        } catch {}
        await new Promise((r) => setTimeout(r, attempt * 1200));
      }
      const signed = new URL(currentAsset.public_url);
      let url = await validateDownloadUrl(
        signed.href,
        signed.hostname,
        this.lookupHost,
      );
      const filename = path.join(folder, `${randomUUID()}.part`);
      let size = 0;
      const hash = createHash("sha256");
      try {
        const signal = AbortSignal.timeout(this.config.timeout);
        let response;
        for (let redirects = 0; redirects <= 5; redirects++) {
          response = await fetch(url, { redirect: "manual", signal });
          if (![301, 302, 303, 307, 308].includes(response.status)) break;
          const location = response.headers.get("location");
          await response.body?.cancel();
          if (!location || redirects === 5)
            throw fail("Download redirect limit exceeded.");
          url = await validateDownloadUrl(
            new URL(location, url).href,
            signed.hostname,
            this.lookupHost,
          );
        }
        if (!response.ok || !response.body) {
          await response.body?.cancel();
          throw fail(`Download failed (HTTP ${response.status}).`);
        }
        if (
          Number(response.headers.get("content-length")) > this.config.maxBytes
        ) {
          await response.body.cancel();
          throw fail("File exceeds the configured size cap.");
        }
        const total = Number(response.headers.get("content-length")) || currentAsset.file_size || 0;
        let lastReported = 0;
        const meter = new Transform({
          transform: (chunk, encoding, callback) => {
            size += chunk.length;
            if (size > this.config.maxBytes)
              return callback(fail("File exceeds the configured size cap."));
            hash.update(chunk);
            if (size - lastReported >= 3 * 1024 * 1024 || (total && size === total)) {
              lastReported = size;
              try { onProgress(size, total); } catch (_) {}
            }
            callback(null, chunk);
          },
        });
        await pipeline(
          Readable.fromWeb(response.body),
          meter,
          fs.createWriteStream(filename, {
            flags: "wx",
            mode: 0o600,
            highWaterMark: 1024 * 1024,
          }),
          { signal },
        );
        if (
          Number.isFinite(currentAsset.file_size) &&
          size !== currentAsset.file_size
        )
          throw fail("Monday file size does not match downloaded bytes.");
        return { path: filename, size, sha256: hash.digest("hex") };
      } catch (error) {
        await unlink(filename).catch(() => {});
        if (attempt === maxRetries) throw error;
      }
    }
  }
}
