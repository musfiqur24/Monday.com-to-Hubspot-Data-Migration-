import sharp from "sharp";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { fail } from "../lib/sanitize.js";
// libvips file caching can retain Windows file handles after comparison.
sharp.cache({ files: 0 });
async function fileMd5(filename) {
  const hash = createHash("md5");
  for await (const chunk of createReadStream(filename)) hash.update(chunk);
  return hash.digest("hex");
}
async function pixels(filename) {
  const image = sharp(filename, {
    limitInputPixels: 40000000,
    failOn: "warning",
  });
  const metadata = await image.metadata();
  if (
    !["png", "jpeg", "webp", "gif", "tiff"].includes(metadata.format) ||
    (metadata.pages || 1) !== 1
  )
    throw fail(
      "Image integrity comparison supports single-frame raster images only.",
    );
  const hash = createHash("sha256");
  let info;
  const stream = image.rotate().toColourspace("srgb").ensureAlpha().raw();
  stream.on("info", (value) => {
    info = value;
  });
  for await (const chunk of stream) hash.update(chunk);
  return {
    width: info.width,
    height: info.height,
    channels: info.channels,
    sha256: hash.digest("hex"),
  };
}
export async function sameImagePixels(original, uploaded) {
  const source = await pixels(original),
    destination = await pixels(uploaded);
  return (
    source.width === destination.width &&
    source.height === destination.height &&
    source.channels === destination.channels &&
    source.sha256 === destination.sha256
  );
}
export async function verifyUploadedFile({
  record,
  remote,
  sourceFile,
  sourceAssetId,
  monday,
  hubspot,
  folder,
  activity = () => {},
}) {
  if (remote.access !== "PRIVATE")
    throw fail(
      "HubSpot file privacy verification failed: expected PRIVATE access. Uploaded file ID retained; attachment blocked.",
    );
  const fingerprint =
    remote.fileMd5 && remote.updatedAt
      ? createHash("sha256")
          .update(
            JSON.stringify([
              record.hubspot_file_id,
              remote.fileMd5,
              remote.updatedAt,
              remote.size,
              remote.access,
              record.sha256,
            ]),
          )
          .digest("hex")
      : null;
  if (Number(remote.size) === record.size)
    return { method: "size", remoteSize: Number(remote.size), fingerprint };
  if (
    fingerprint &&
    record.verification_fingerprint === fingerprint &&
    ["source_md5", "sha256", "identical_pixels"].includes(
      record.verification_method,
    )
  )
    return {
      method: record.verification_method,
      remoteSize: record.verified_size,
      fingerprint,
    };
  activity(
    "Byte sizes differ; checking the private HubSpot copy against the source.",
  );
  let source = sourceFile,
    destination;
  try {
    if (!source) {
      const asset = (await monday.resolve([sourceAssetId])).get(sourceAssetId);
      if (!asset)
        throw fail(
          "Cannot verify the original Monday asset for the existing HubSpot upload.",
        );
      source = await monday.download(asset, folder);
    }
    if (source.sha256 !== record.sha256 || source.size !== record.size)
      throw fail(
        "Monday source changed since upload. Existing upload retained; reconcile before attaching.",
      );
    // HubSpot's authenticated file metadata identifies the uploaded original even
    // when its CDN optimizes/re-encodes an image. Compare the entire source file.
    if (
      remote.fileMd5 &&
      /^[a-f0-9]{32}$/i.test(remote.fileMd5) &&
      (await fileMd5(source.path)).toLowerCase() ===
        remote.fileMd5.toLowerCase()
    )
      return {
        method: "source_md5",
        remoteSize: Number(remote.size),
        fingerprint,
      };
    const signed = await hubspot.signedFile(record.hubspot_file_id);
    if (!signed.url)
      throw fail(
        "HubSpot did not return a private download URL for integrity verification.",
      );
    destination = await monday.download({ public_url: signed.url }, folder);
    if (destination.sha256 === source.sha256)
      return { method: "sha256", remoteSize: destination.size, fingerprint };
    if (
      remote.type === "IMG" ||
      remote.type === "IMAGE" ||
      /\.(?:jpe?g|png|webp|gif|tiff?)$/i.test(record.filename)
    ) {
      if (await sameImagePixels(source.path, destination.path))
        return {
          method: "identical_pixels",
          remoteSize: destination.size,
          fingerprint,
        };
      throw fail(
        "HubSpot image content differs from the original: decoded pixels do not match. Uploaded file retained; attachment blocked.",
      );
    }
    throw fail(
      `HubSpot file content mismatch: source ${record.size} bytes, HubSpot copy ${destination.size} bytes, different SHA-256. Uploaded file retained; attachment blocked.`,
    );
  } finally {
    if (destination) await unlink(destination.path).catch(() => {});
    if (source && source !== sourceFile)
      await unlink(source.path).catch(() => {});
  }
}
