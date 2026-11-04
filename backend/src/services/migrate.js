import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import pLimit from "p-limit";
import PQueue from "p-queue";
import { readExcel } from "./excel.js";
import { strategyPlan } from "./strategies.js";
import { writeReport, writeContactReport } from "./report.js";
import { planContactData, validationMessage } from "./contactMapping.js";
import { batchSyncContacts, syncContact } from "./contacts.js";
import { verifyUploadedFile } from "./integrity.js";
import { sanitize, fail, safeError } from "../lib/sanitize.js";

// Maximum contacts sent to batch/upsert per call (HubSpot limit = 100)
const CONTACT_BATCH_SIZE = 100;

function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export class Migration extends EventEmitter {
  constructor({ state, monday, hubspot, config, root }) {
    super();
    Object.assign(this, { state, monday, hubspot, config, root });
    this.status = {
      running: false,
      completed: 0,
      total: 0,
      phase: "idle",
      logs: [],
      contactsTotal: 0,
      contactsDone: 0,
      filesTotal: 0,
      filesDone: 0,
      batchesSent: 0,
      batchesTotal: 0,
      startedAt: null,
      eta: null,
    };
    this.report = null;
    this.logId = 0;
    this.abortController = null;
  }

  cancel() {
    if (!this.status.running) return false;
    this.abortController?.abort();
    this.progress({
      phase: "failed",
      error: "Migration cancelled by user.",
      running: false,
    });
    return true;
  }

  progress(values) {
    Object.assign(this.status, values);
    const message = values.error || values.message;
    if (message) {
      const entry = {
        id: ++this.logId,
        timestamp: new Date().toISOString(),
        level: values.error ? "error" : "info",
        message,
      };
      this.status.logs = [...this.status.logs, entry].slice(-150);
      this.emit("activity", entry);
    }
    this.emit("progress", { ...this.status });
  }

  throttle() {
    if (this.limit)
      this.limit.concurrency = Math.max(1, this.limit.concurrency - 1);
    this.progress({
      message: "Rate limited; backing off and reducing concurrency.",
    });
  }

  async exclusive(fn) {
    if (this.status.running) {
      const e = fail("A migration or preflight is already running.");
      e.status = 409;
      throw e;
    }
    const lock = path.join(this.root, "state/run.lock");
    let fd;
    try {
      fd = fs.openSync(lock, "wx", 0o600);
    } catch {
      // Check if stale lock from a previously killed or crashed process
      let stale = false;
      try {
        const recordedPid = parseInt(fs.readFileSync(lock, "utf8").trim(), 10);
        if (recordedPid && Number.isFinite(recordedPid)) {
          try {
            process.kill(recordedPid, 0);
          } catch (err) {
            if (err.code === "ESRCH") {
              stale = true;
            } else if (process.platform === "win32") {
              // On Windows, checking a dead process can throw EPERM instead of ESRCH
              try {
                const { execSync } = await import("node:child_process");
                const out = execSync(
                  `powershell -NoProfile -Command "Get-Process -Id ${recordedPid} -ErrorAction SilentlyContinue"`,
                  { encoding: "utf8", timeout: 2000 },
                );
                if (!out.trim().length) stale = true;
              } catch {
                stale = true;
              }
            }
          }
        } else {
          stale = true;
        }
      } catch {
        stale = true;
      }

      if (stale) {
        try {
          fs.unlinkSync(lock);
          fd = fs.openSync(lock, "wx", 0o600);
        } catch {}
      }

      if (!fd) {
        const e = fail(
          "Another process holds state/run.lock. See README if a previous process crashed.",
        );
        e.status = 409;
        throw e;
      }
    }
    fs.writeFileSync(fd, String(process.pid));
    this.progress({
      running: true,
      completed: 0,
      error: null,
      summary: null,
      preflight: null,
      message: null,
      contactsTotal: 0,
      contactsDone: 0,
      filesTotal: 0,
      filesDone: 0,
      batchesSent: 0,
      batchesTotal: 0,
      startedAt: new Date().toISOString(),
      eta: null,
    });
    this.abortController = new AbortController();
    try {
      return await fn(this.abortController.signal);
    } catch (error) {
      // Log the real error internally so TypeErrors etc. are diagnosable in the terminal
      if (!error?.safeMessage) console.error("[internal]", error);
      if (!this.abortController?.signal.aborted)
        this.progress({ phase: "failed", error: safeError(error) });
      throw error;
    } finally {
      this.abortController = null;
      fs.closeSync(fd);
      fs.unlinkSync(lock);
      this.progress({ running: false });
    }
  }

  /* ─── preflight ─────────────────────────────────────────────────────────── */
  async inspect(file, mapping) {
    this.progress({
      phase: "preflight",
      message: "Checking workbook, credentials, properties and contacts.",
    });
    if (!this.config.mondayToken || !this.config.hubspotToken)
      throw fail("Set MONDAY_API_TOKEN and HUBSPOT_PRIVATE_APP_TOKEN in .env.");
    if (!fs.existsSync(file))
      throw fail(
        "Workbook missing. Upload an XLSX file or place data/Monday_CRM_contact.xlsx in the project.",
      );

    this.progress({ message: "Reading Excel workbook." });
    const workbook = await readExcel(file, mapping);
    this.progress({
      message: `Workbook read: ${workbook.rows} rows, ${workbook.groups.reduce((n, g) => n + g.files.length, 0)} file links, ${workbook.issues.length} parsing issues.`,
    });

    this.progress({ message: "Checking Monday token and account access." });
    await this.monday.check();
    this.progress({
      message: "Monday access confirmed. Checking HubSpot token.",
    });
    await this.hubspot.check();
    this.progress({
      message: "HubSpot access confirmed. Validating mapped file properties.",
    });

    // Bind resumable state to credentials to prevent file IDs crossing portals.
    this.state.bindAccount(
      createHash("sha256")
        .update(`${this.config.mondayToken}\0${this.config.hubspotToken}`)
        .digest("hex"),
    );

    const properties = new Map(),
      plans = new Map();
    for (const column of mapping.columns) {
      const max = Math.max(
        1,
        ...workbook.groups
          .filter((g) => g.column.excel === column.excel)
          .map((g) => g.files.length),
      );
      for (
        let i = 0;
        i < (column.multiFileStrategy === "numbered" ? max : 1);
        i++
      ) {
        const name = i
          ? `${column.hubspotProperty}_${i + 1}`
          : column.hubspotProperty;
        if (!properties.has(name)) {
          this.progress({ message: `Checking HubSpot property: ${name}.` });
          properties.set(name, await this.hubspot.property(name));
        }
      }
      strategyPlan(column, max, properties, mapping);
    }

    let contactData;
    if (mapping.contactMode === "upsert") {
      this.progress({
        message:
          "Loading all HubSpot contact properties and validating mapped Excel values.",
      });
      contactData = await planContactData(workbook, mapping, this.hubspot, path.basename(file));
      workbook.issues.push(...contactData.issues);
    }

    // ── Batch-lookup contacts by email ────────────────────────────────────────
    const allEmails = [
      ...new Set(
        mapping.contactMode === "upsert"
          ? workbook.contacts.map((c) => c.email)
          : workbook.groups.map((g) => g.email),
      ),
    ];
    this.progress({
      message: `Batch-matching ${allEmails.length} contacts by email in HubSpot.`,
      contactsTotal: allEmails.length,
    });
    const contacts = await this.hubspot.batchLookupContacts(allEmails);
    const matched = [...contacts.values()].filter(Boolean).length;
    this.progress({
      message: `HubSpot batch lookup complete: ${matched} matched, ${allEmails.length - matched} not found.`,
      contactsDone: 0,
    });

    const fallback = [];
    for (const g of workbook.groups) {
      const plan = strategyPlan(g.column, g.files.length, properties, mapping);
      plans.set(g, plan);
      if (plan.fallback.length)
        fallback.push({ column: g.column.excel, missing: plan.fallback });
    }

    // Prevent overlapping numbered mappings from silently overwriting one another.
    const targets = new Map();
    for (const g of workbook.groups) {
      const plan = plans.get(g);
      const names =
        plan.strategy === "numbered"
          ? plan.names
          : plan.patchFirst
            ? [g.column.hubspotProperty]
            : [];
      for (const n of names) {
        const key = `${g.email}:${n}`;
        if (targets.has(key)) throw fail(`Mappings overlap at property ${n}.`);
        targets.set(key, true);
      }
    }

    const summary = {
      contacts: contacts.size,
      rows: workbook.rows,
      files: workbook.groups.reduce((n, g) => n + g.files.length, 0),
      contactsNotFound: [...contacts.values()].filter((v) => !v).length,
      contactsToCreate:
        mapping.contactMode === "upsert"
          ? [...contacts.values()].filter((v) => !v).length
          : 0,
      contactsToUpdate:
        mapping.contactMode === "upsert"
          ? [...contacts.values()].filter(Boolean).length
          : 0,
      propertiesToCreate: contactData?.creates || [],
      unmappedColumns: contactData?.unmapped || [],
      issues: workbook.issues,
      fallback,
      columns: workbook.columns,
    };

    this.progress({
      preflight: summary,
      total: summary.files,
      message: `Preflight complete: ${summary.contacts} contacts, ${summary.files} files, ${summary.contactsToCreate} to create, ${summary.contactsToUpdate} to update, ${summary.issues.length} validation issues.`,
    });

    return { workbook, plans, contacts, summary, contactData };
  }

  preflight(file, mapping) {
    return this.exclusive(async () => {
      const result = await this.inspect(file, mapping);
      this.progress({ phase: "preflight_complete" });
      return result.summary;
    });
  }

  /* ─── main run ──────────────────────────────────────────────────────────── */
  run(file, mapping, { dryRun = true, retryFailed = false } = {}) {
    return this.exclusive(async () => {
      const { workbook, plans, contacts, summary, contactData } =
        await this.inspect(file, mapping);
      if (workbook.issues.length && !dryRun)
        throw fail(validationMessage(workbook.issues));

      this.limit = pLimit(this.config.concurrency);
      // Per-file concurrency: allow more files to flow in parallel than contact groups
      // This saturates the network while keeping contact-group ordering intact
      const fileLimit = pLimit(this.config.concurrency * 3);
      const results = [];
      let uploaded = 0;
      let filesProcessed = 0;
      const upsert = mapping.contactMode === "upsert";
      const contactCounts = { created: 0, updated: 0, failed: 0 };

      this.progress({
        phase: dryRun ? "dry_run" : "migration",
        dryRun,
        completed: 0,
        total: summary.files,
        filesTotal: summary.files,
        contactsTotal: summary.contacts,
        contactsDone: 0,
        batchesTotal: Math.ceil(summary.contacts / CONTACT_BATCH_SIZE),
        batchesSent: 0,
        message: dryRun
          ? "Dry run started. No downloads or HubSpot changes will be made."
          : `Real migration started. ${summary.files} files · ${summary.contacts} contacts · batches of ${CONTACT_BATCH_SIZE}.`,
      });

      /* ── Pre-resolve ALL Monday assets in parallel batches ──────────────── */
      // Collect all asset IDs that aren’t already uploaded, resolve them all up-front
      // in batches of 50 to avoid per-group serial API calls.
      const globalAssets = new Map();
      if (!dryRun) {
        const needAssets = workbook.groups.flatMap((g) => {
          const prior = g.files.map((f) => this.state.get(g, f));
          const plan = plans.get(g);
          const contact = contacts.get(g.email);
          const target = JSON.stringify([
            contact,
            plan.strategy,
            plan.names,
            mapping.noteSetFirst,
            g.files.map((v) => v.assetId),
          ]);
          if (
            prior.every(
              (r, i) =>
                (plan.strategy === "first_only" && i > 0) ||
                (r?.status === "completed" &&
                  Boolean(r.hubspot_file_id) &&
                  r.target === target),
            )
          )
            return [];
          return g.files
            .filter((f) => {
              const r = this.state.get(g, f);
              return !r?.hubspot_file_id;
            })
            .map((f) => f.assetId);
        });
        const uniqueAssetIds = [...new Set(needAssets)];
        if (uniqueAssetIds.length) {
          this.progress({
            message: `Pre-resolving ${uniqueAssetIds.length} Monday assets in parallel…`,
          });
          const RESOLVE_BATCH = 50;
          const resolveChunks = [];
          for (let i = 0; i < uniqueAssetIds.length; i += RESOLVE_BATCH)
            resolveChunks.push(uniqueAssetIds.slice(i, i + RESOLVE_BATCH));
          const resolveLimit = pLimit(4); // 4 parallel Monday API calls
          const resolved = await Promise.allSettled(
            resolveChunks.map((chunk) =>
              resolveLimit(() => this.monday.resolve(chunk)),
            ),
          );
          let resolvedCount = 0;
          for (const r of resolved) {
            if (r.status === "fulfilled") {
              for (const [k, v] of r.value) {
                globalAssets.set(k, v);
                resolvedCount++;
              }
            }
          }
          this.progress({
            message: `Pre-resolved ${resolvedCount} of ${uniqueAssetIds.length} Monday assets.`,
          });
        }
      } else {
        // In dry-run, resolve all assets for validation
        const allIds = [
          ...new Set(
            workbook.groups.flatMap((g) => g.files.map((f) => f.assetId)),
          ),
        ];
        if (allIds.length) {
          const RESOLVE_BATCH = 50;
          const resolveChunks = [];
          for (let i = 0; i < allIds.length; i += RESOLVE_BATCH)
            resolveChunks.push(allIds.slice(i, i + RESOLVE_BATCH));
          this.progress({
            message: `Dry-run: resolving ${allIds.length} Monday assets in ${resolveChunks.length} batches…`,
          });
          const resolveLimit = pLimit(4);
          let resolvedCount = 0;
          await Promise.allSettled(
            resolveChunks.map((chunk) =>
              resolveLimit(async () => {
                const result = await this.monday.resolve(chunk);
                for (const [k, v] of result) globalAssets.set(k, v);
                resolvedCount += chunk.length;
                this.progress({
                  completed: Math.min(
                    summary.files,
                    Math.round(
                      (resolvedCount / allIds.length) * summary.files * 0.5,
                    ),
                  ),
                  message: `Dry-run: resolved ${resolvedCount} / ${allIds.length} Monday assets…`,
                });
              }),
            ),
          );
          this.progress({
            completed: 0,
            message: `Dry-run: all ${allIds.length} Monday assets resolved. Checking file links…`,
          });
        }
      }

      /* ── per-group file upload helper ─────────────────────────────────── */
      const processGroup = async (g, groupIndex, totalGroups) => {
        const label = `Group ${groupIndex + 1}/${totalGroups}`;
        const plan = plans.get(g);
        const records = [],
          groupResults = [];
        const contact = contacts.get(g.email);
        const target = JSON.stringify([
          contact,
          plan.strategy,
          plan.names,
          mapping.noteSetFirst,
          g.files.map((v) => v.assetId),
        ]);
        const prior = g.files.map((f) => this.state.get(g, f));
        const terminal = (r, i) =>
          (plan.strategy === "first_only" && i > 0) ||
          (r?.status === "completed" &&
            Boolean(r.hubspot_file_id) &&
            r.target === target);
        const retryable = (r) =>
          !r ||
          !r.hubspot_file_id ||
          [
            "pending",
            "skipped",
            "failed",
            "contact_not_found",
            "uploaded",
            "uploading",
            "upload_uncertain",
            "resolved",
            "downloaded",
          ].includes(r.status);

        if (
          !dryRun &&
          (prior.every(terminal) || (retryFailed && !prior.some(retryable)))
        ) {
          results.push(
            ...g.files.map((f, i) => ({
              ...prior[i],
              row_email: g.email,
              column_name: g.column.excel,
              asset_id: f.assetId,
              source_url: f.url,
              filename: prior[i]?.filename || f.filename,
              status: "skipped",
              error:
                retryFailed && !prior.some(retryable)
                  ? "Not selected by retry-failed"
                  : null,
            })),
          );
          filesProcessed += g.files.length;
          this.progress({
            completed: Math.min(summary.files, filesProcessed),
            message: `${label}: skipped ${g.files.length} files already completed or outside retry selection.`,
          });
          return { records, groupResults };
        }

        const folder =
          "/" +
          this.config.baseFolder
            .split("/")
            .filter(Boolean)
            .map(sanitize)
            .join("/") +
          "/" +
          sanitize(g.column.excel) +
          "/" +
          sanitize(g.email) +
          "/";
        const collisions = new Map();
        for (const f of g.files) {
          const name = sanitize(f.filename).toLowerCase();
          collisions.set(name, (collisions.get(name) || 0) + 1);
        }

        // Build a flat list of (file, index) to process
        const fileBatches = [];
        for (let start = 0; start < g.files.length; start += 50) {
          const batchFiles = g.files.slice(start, start + 50);
          fileBatches.push({ start, batchFiles });
        }

        // Process each 50-file batch; within each batch files run in parallel via fileLimit
        for (const { start, batchFiles } of fileBatches) {
          // The global assets map already has our resolved assets from pre-resolution.
          // Only do a batch-resolve if we hit entries older than 30 min or missing from pre-fetch.
          const resolvedAt = Date.now();

          // Process files within this batch in parallel
          const batchTasks = batchFiles.map((f, offset) =>
            fileLimit(async () => {
              const index = start + offset;
              let rec = dryRun
                ? {
                    row_email: g.email,
                    column_name: g.column.excel,
                    asset_id: f.assetId,
                    source_url: f.url,
                    filename: f.filename,
                  }
                : this.state.ensure(g, f);
              let temp;
              try {
                if (plan.strategy === "first_only" && index > 0) {
                  rec = {
                    ...rec,
                    status: "skipped",
                    error: "first_only strategy",
                  };
                  if (!dryRun)
                    this.state.update(g, f, {
                      status: "skipped",
                      error: "first_only strategy",
                    });
                } else if (dryRun) {
                  const a = globalAssets.get(f.assetId);
                  if (!a)
                    throw fail(
                      "Monday asset not found or inaccessible; /resources/ ID assumption could not be verified.",
                    );
                  if (String(a.id) !== f.assetId)
                    throw fail("Monday asset ID mismatch.");
                  const saved = this.state.get(g, f);
                  rec = {
                    ...rec,
                    status: saved?.hubspot_file_id
                      ? "would_reuse"
                      : "would_upload",
                    hubspot_file_id: saved?.hubspot_file_id || null,
                    error: null,
                    hubspot_contact_id: contact,
                  };
                } else {
                  if (rec.status === "completed" && rec.target === target) {
                    return {
                      rec: { ...rec, status: "skipped" },
                      mainRec: rec,
                      skipped: true,
                    };
                  }
                  if (!rec.hubspot_file_id) {
                    if (["uploading", "upload_uncertain"].includes(rec.status)) {
                      this.state.update(g, f, { status: "pending", error: null });
                      rec.status = "pending";
                    }
                    // Use pre-resolved asset; re-resolve if missing or stale (>30 min)
                    let a = globalAssets.get(f.assetId);
                    if (!a || Date.now() - resolvedAt > 1800000) {
                      const fresh = await this.monday.resolve([f.assetId]);
                      a = fresh.get(f.assetId);
                      if (a) globalAssets.set(f.assetId, a);
                    }
                    if (!a)
                      throw fail(
                        "Monday asset not found or inaccessible; /resources/ ID assumption could not be verified.",
                      );
                    this.state.update(g, f, { status: "resolved" });
                    this.progress({
                      message: `${label}, file ${index + 1}/${g.files.length}: downloading from Monday.`,
                    });
                    temp = await this.monday.download(
                      a,
                      path.join(this.root, "tmp"),
                    );
                    this.progress({
                      message: `${label}, file ${index + 1}/${g.files.length}: downloaded ${(temp.size / 1024).toFixed(1)} KB. Uploading to HubSpot.`,
                    });
                    let filename = sanitize(a.name || f.filename);
                    const apiCollision =
                      [...globalAssets.values()].filter(
                        (other) =>
                          sanitize(other.name).toLowerCase() ===
                          filename.toLowerCase(),
                      ).length > 1;
                    const savedCollision = this.state.db
                      .prepare(
                        "SELECT asset_id FROM files WHERE row_email=? AND column_name=? AND filename=? COLLATE NOCASE AND asset_id<>?",
                      )
                      .get(g.email, g.column.excel, filename, f.assetId);
                    if (
                      apiCollision ||
                      savedCollision ||
                      (collisions.get(sanitize(f.filename).toLowerCase()) ||
                        0) > 1 ||
                      g.files.some(
                        (other) =>
                          other !== f &&
                          sanitize(other.filename).toLowerCase() ===
                            filename.toLowerCase(),
                      )
                    )
                      filename = `${f.assetId}-${filename}`;
                    this.state.update(g, f, {
                      status: "downloaded",
                      filename,
                      size: temp.size,
                      sha256: temp.sha256,
                    });
                    this.state.update(g, f, { status: "uploading" });
                    let remote;
                    try {
                      remote = await this.hubspot.upload(
                        temp,
                        filename,
                        folder,
                      );
                    } catch (error) {
                      this.state.update(g, f, {
                        status:
                          error.status && error.status < 500
                            ? "failed"
                            : "upload_uncertain",
                        error: safeError(error),
                      });
                      throw error;
                    }
                    if (!remote.id) {
                      this.state.update(g, f, { status: "upload_uncertain" });
                      throw fail(
                        "Upload response missing file ID; reconcile before retrying.",
                      );
                    }
                    rec = this.state.update(g, f, {
                      hubspot_file_id: String(remote.id),
                      status: "uploaded",
                      access: remote.access || null,
                    });
                    uploaded++;
                  }
                  this.progress({
                    message: `${label}, file ${index + 1}/${g.files.length}: verifying HubSpot file.`,
                  });
                  const remote = await this.hubspot.file(rec.hubspot_file_id);
                  const verified = await verifyUploadedFile({
                    record: rec,
                    remote,
                    sourceFile: temp,
                    sourceAssetId: f.assetId,
                    monday: this.monday,
                    hubspot: this.hubspot,
                    folder: path.join(this.root, "tmp"),
                    activity: (message) =>
                      this.progress({
                        message: `${label}, file ${index + 1}/${g.files.length}: ${message}`,
                      }),
                  });
                  if (verified.method !== "size")
                    this.progress({
                      message: `${label}, file ${index + 1}/${g.files.length}: verified by ${verified.method}.`,
                    });
                  this.state.update(g, f, {
                    verification_method: verified.method,
                    verified_size: verified.remoteSize,
                    verification_fingerprint: verified.fingerprint,
                  });
                  if (temp) {
                    await unlink(temp.path);
                    temp = null;
                  }
                  rec = this.state.update(g, f, {
                    status:
                      contact || upsert ? "uploaded" : "contact_not_found",
                    hubspot_contact_id: contact,
                    error:
                      contact || upsert
                        ? null
                        : "Contact not found; uploaded file retained for a later run.",
                    target,
                  });
                  return { rec, mainRec: rec, skipped: false };
                }
                return { rec, mainRec: null, skipped: false };
              } catch (error) {
                if (!dryRun) {
                  const latest = this.state.get(g, f);
                  rec = this.state.update(g, f, {
                    status: ["upload_uncertain", "uploading"].includes(
                      latest.status,
                    )
                      ? "upload_uncertain"
                      : "failed",
                    error: safeError(error),
                  });
                } else
                  rec = { ...rec, status: "failed", error: safeError(error) };
                return { rec, mainRec: null, skipped: false, error: true };
              } finally {
                if (temp) await unlink(temp.path).catch(() => {});
              }
            }),
          ); // end fileLimit

          // Collect results from parallel file tasks in order
          const batchOutcomes = await Promise.all(batchTasks);
          for (const outcome of batchOutcomes) {
            if (!outcome) continue;
            const { rec, mainRec, skipped } = outcome;
            if (skipped) {
              groupResults.push({ ...mainRec, status: "skipped" });
              records.push(mainRec);
            } else {
              groupResults.push(rec);
              if (mainRec && !dryRun) records.push(mainRec);
            }
            filesProcessed++;
            this.progress({
              completed: Math.min(summary.files, filesProcessed),
              message: `${label}, file: ${rec.status}${rec.error ? ` — ${rec.error}` : "."}`,
            });
          }
        } // end fileBatches loop

        return { records, groupResults };
      }; // end processGroup

      /* ── non-upsert (file-only) mode ──────────────────────────────────── */
      if (!upsert) {
        const groupsWithAttach = [];
        await Promise.all(
          workbook.groups.map((g, index) =>
            this.limit(async () => {
              const { records, groupResults } = await processGroup(
                g,
                index,
                workbook.groups.length,
              );
              results.push(...groupResults);
              this.progress({
                message: `Processed ${Math.min(summary.files, filesProcessed)} of ${summary.files} files.`,
              });
              if (!dryRun)
                groupsWithAttach.push({
                  g,
                  records,
                  groupResults,
                  contact: contacts.get(g.email),
                });
            }),
          ),
        );

        if (!dryRun) {
          for (const {
            g,
            records,
            groupResults,
            contact,
          } of groupsWithAttach) {
            const plan = plans.get(g);
            if (
              !contact ||
              records.length !==
                (plan.strategy === "first_only" ? 1 : g.files.length)
            )
              continue;
            try {
              const ids = records.map((r) => r.hubspot_file_id);
              const properties = {};
              if (plan.strategy === "same_property")
                properties[g.column.hubspotProperty] = ids.join(";");
              else if (plan.strategy === "numbered")
                ids.forEach((id, i) => {
                  properties[plan.names[i]] = id;
                });
              else if (plan.patchFirst)
                properties[g.column.hubspotProperty] = ids[0];
              if (plan.strategy === "note") {
                const key = createHash("sha256")
                  .update(JSON.stringify([contact, g.column.excel, ids]))
                  .digest("hex");
                let note = this.state.note(key);
                if (!note) {
                  this.state.saveNote(key, "creating");
                  const created = await this.hubspot.note(contact, ids, key);
                  if (!created.id)
                    throw fail(
                      "Note creation outcome uncertain; reconcile before retrying.",
                    );
                  this.state.saveNote(key, "created", String(created.id));
                  note = this.state.note(key);
                }
                if (!note.note_id)
                  throw fail(
                    "Note creation outcome uncertain; reconcile before retrying.",
                  );
                await this.hubspot.verifyNote(note.note_id, contact, ids);
                this.state.saveNote(key, "verified", note.note_id);
              }
              if (Object.keys(properties).length) {
                this.progress({
                  message: `updating and verifying contact file properties.`,
                });
                await this.hubspot.patch(contact, properties);
              }
              for (const f of g.files.slice(0, records.length))
                this.state.update(g, f, { status: "completed", error: null });
              for (const r of groupResults)
                if (r.status !== "skipped") r.status = "completed";
            } catch (error) {
              this.progress({
                message: `Attachment failed — ${safeError(error)}`,
              });
              for (const f of g.files.slice(0, records.length))
                this.state.update(g, f, {
                  status: "failed",
                  error: safeError(error),
                });
              for (const r of groupResults)
                if (r.status !== "skipped") {
                  r.status = "failed";
                  r.error = safeError(error);
                }
            }
          }
        }
      }

      /* ── upsert mode ──────────────────────────────────────────────────── */
      if (upsert && !dryRun) {
        // ── Step A: batch-create any new properties ────────────────────────
        if (contactData.creates.length) {
          this.progress({
            message: `Batch-creating ${contactData.creates.length} new contact properties.`,
          });
          await this.hubspot.batchCreateProperties(contactData.creates);
          this.progress({
            message: `${contactData.creates.length} properties created.`,
          });
        }

        // ── Step B: parallel file uploads across all contacts ─────────────
        const stagedByEmail = new Map(); // email → { groupsData: [{ g, records, groupResults }] }
        // Run all contacts’ file uploads in parallel (bounded by this.limit)
        await Promise.all(
          workbook.contacts.map((row, index) =>
            this.limit(async () => {
              const groups = workbook.groups.filter(
                (g) => g.email === row.email,
              );
              const groupsData = [];
              // Groups for a single contact run sequentially (ordering of file IDs matters)
              for (let gi = 0; gi < groups.length; gi++) {
                const { records, groupResults } = await processGroup(
                  groups[gi],
                  gi,
                  groups.length,
                );
                groupsData.push({ g: groups[gi], records, groupResults });
              }
              stagedByEmail.set(row.email, groupsData);
              this.progress({
                message: `Files staged for contact ${index + 1}/${workbook.contacts.length}: ${row.email}`,
              });
            }),
          ),
        );

        // ── Step C: batch-upsert contacts in chunks of 100 ────────────────
        this.progress({
          message: `Batch-upserting ${workbook.contacts.length} contacts in HubSpot.`,
        });
        let completedContacts = 0;
        const contactInputs = [];
        const previouslyCompletedBatchUpdates = [];
        for (const row of workbook.contacts) {
          const groupsData = stagedByEmail.get(row.email) || [];
          const batchName = path.basename(file).replace(/\.[^/.]+$/, "");
          const properties = {
            ...contactData.payloads.get(row.email),
            bulked_import: "true",
            import_source_file: path.basename(file),
            migration_batch: batchName,
          };
          let deferContact = false;
          const failedFileDetails = [];
          for (const { g, records } of groupsData) {
            const plan = plans.get(g);
            const files = g.files.slice(
              0,
              plan.strategy === "first_only" ? 1 : g.files.length,
            );
            const saved = files.map((f) => this.state.get(g, f));
            // Detect any file in this group that did not successfully upload
            for (const s of saved) {
              if (s && !["uploaded", "completed"].includes(s.status)) {
                deferContact = true;
                failedFileDetails.push(
                  `[${g.column.excel}] ${s.filename || s.asset_id}: ${s.error || s.status}`,
                );
              }
            }
            const available = saved.filter(
              (r) =>
                r?.hubspot_file_id &&
                ["uploaded", "completed"].includes(r.status),
            );
            const ids = available.map((r) => r.hubspot_file_id);
            // Only assign file IDs when ALL files in the group succeeded
            if (ids.length > 0 && !deferContact) {
              if (plan.strategy === "same_property")
                properties[g.column.hubspotProperty] = ids.join(";");
              else if (plan.strategy === "numbered")
                ids.forEach((id, i) => {
                  properties[plan.names[i]] = id;
                });
              else if (plan.patchFirst)
                properties[g.column.hubspotProperty] = ids[0];
            }
          }
          if (deferContact) {
            contactCounts.failed++;
            contacts.delete(row.email);
            const msg =
              `Contact deferred — ${failedFileDetails.length} file(s) failed: ${failedFileDetails.join(" | ")}`;
            this.state.saveContact(row.email, "failed", null, msg, failedFileDetails.join(" | "));
            completedContacts++;
            this.progress({ message: `${row.email}: deferred — ${msg}` });
          } else {
            // Check if already completed on resumable re-runs
            const prev = this.state.contact(row.email);
            if (prev?.status === "completed" && prev.contact_id) {
              contacts.set(row.email, prev.contact_id);
              contactCounts.updated++;
              completedContacts++;
              // Ensure full properties (including file links and migration flag) are updated in HubSpot
              previouslyCompletedBatchUpdates.push({
                id: prev.contact_id,
                email: row.email,
                properties,
              });
            } else {
              contactInputs.push({ email: row.email, properties });
            }
          }
        }

        this.progress({
          contactsDone: Math.min(summary.contacts, completedContacts),
        });

        // Send contacts in batch chunks of 100 — emit ETA-aware progress
        let batchIdx = 0;
        const batchChunks = chunks(contactInputs, CONTACT_BATCH_SIZE);
        for (const batchSlice of batchChunks) {
          batchIdx++;
          const now = Date.now();
          const elapsed = this.status.startedAt
            ? (now - Date.parse(this.status.startedAt)) / 1000
            : 0;
          const doneContacts = completedContacts;
          const ratePerSec =
            elapsed > 5 && doneContacts > 0 ? doneContacts / elapsed : null;
          const remaining = Math.max(
            0,
            this.status.contactsTotal - doneContacts,
          );
          const etaSec = ratePerSec ? Math.round(remaining / ratePerSec) : null;
          this.progress({
            message: `Upserting batch ${batchIdx}/${batchChunks.length} (${batchSlice.length} contacts)…`,
            batchesSent: batchIdx,
            eta: etaSec,
          });
          const batchResults = await batchSyncContacts(
            batchSlice,
            contacts,
            this.hubspot,
            this.state,
          );
          for (const [email, res] of batchResults) {
            if (res.error) {
              contactCounts.failed++;
            } else {
              contacts.set(email, res.id);
              contactCounts[res.created ? "created" : "updated"]++;
            }
            completedContacts++;
          }
          this.progress({
            contactsDone: Math.min(summary.contacts, completedContacts),
            message: `Batch ${batchIdx}/${batchChunks.length} done — ${contactCounts.created} created, ${contactCounts.updated} updated, ${contactCounts.failed} failed so far.`,
          });
        }

        // Update properties and migration_batch for previously completed contacts from this workbook
        if (previouslyCompletedBatchUpdates.length > 0) {
          this.progress({
            message: `Updating ${previouslyCompletedBatchUpdates.length} previously completed contacts in HubSpot…`,
          });
          const updateChunks = chunks(previouslyCompletedBatchUpdates, CONTACT_BATCH_SIZE);
          let updateIdx = 0;
          for (const slice of updateChunks) {
            updateIdx++;
            this.progress({
              message: `Updating contacts batch ${updateIdx}/${updateChunks.length} (${slice.length} contacts)…`,
            });
            await this.hubspot.batchUpdateContacts(slice);
          }
          this.progress({
            message: `Properties and migration_batch updated for all ${previouslyCompletedBatchUpdates.length} previously completed contacts.`,
          });
        }

        // ── Step D: batch-create notes for note-strategy groups ────────────
        const pendingNotes = [];
        for (const row of workbook.contacts) {
          const contactId = contacts.get(row.email);
          if (!contactId) continue;
          const groupsData = stagedByEmail.get(row.email) || [];
          for (const { g, records } of groupsData) {
            const plan = plans.get(g);
            if (plan.strategy !== "note") continue;
            const files = g.files.slice(
              0,
              plan.strategy === "first_only" ? 1 : g.files.length,
            );
            const ids = files
              .map((f) => this.state.get(g, f)?.hubspot_file_id)
              .filter(Boolean);
            if (!ids.length) continue;
            const key = createHash("sha256")
              .update(JSON.stringify([contactId, g.column.excel, ids]))
              .digest("hex");
            if (!this.state.note(key)) {
              this.state.saveNote(key, "creating");
              pendingNotes.push({
                contactId,
                ids,
                marker: key,
                g,
                files,
                key,
                row,
              });
            }
          }
        }

        if (pendingNotes.length) {
          this.progress({
            message: `Batch-creating ${pendingNotes.length} file attachment notes.`,
          });
          const noteResults = await this.hubspot.batchCreateNotes(
            pendingNotes.map(({ contactId, ids, key }) => ({
              contactId,
              ids,
              marker: key,
            })),
          );
          // Persist + verify notes
          const noteIds = noteResults.map((r) => r.noteId);
          const verifiedNotes = await this.hubspot.batchReadNotes(noteIds);
          for (let i = 0; i < noteResults.length; i++) {
            const { noteId, contactId } = noteResults[i];
            const { ids, key, files, g, row } = pendingNotes[i];
            const verified = verifiedNotes.get(noteId);
            const attachOk =
              verified?.properties?.hs_attachment_ids === ids.join(";");
            const assocOk = verified?.associations?.contacts?.results?.some(
              (r) => String(r.id) === String(contactId),
            );
            if (!attachOk || !assocOk) {
              this.progress({
                message: `Note ${noteId}: verification failed for ${row.email}.`,
              });
              this.state.saveNote(key, "failed", noteId);
            } else {
              this.state.saveNote(key, "verified", noteId);
            }
          }
          this.progress({
            message: `${noteResults.length} notes created and verified.`,
          });
        }

        // ── Step E: finalize file records ──────────────────────────────────
        for (const row of workbook.contacts) {
          const contactId = contacts.get(row.email);
          const groupsData = stagedByEmail.get(row.email) || [];
          for (const { g, records, groupResults } of groupsData) {
            const plan = plans.get(g);
            const files = g.files.slice(
              0,
              plan.strategy === "first_only" ? 1 : g.files.length,
            );
            const target = JSON.stringify([
              contactId,
              plan.strategy,
              plan.names,
              mapping.noteSetFirst,
              g.files.map((v) => v.assetId),
            ]);
            for (const f of files) {
              const currentRec = this.state.get(g, f);
              const fileUploaded = Boolean(currentRec?.hubspot_file_id);
              const isOk = Boolean(contactId && fileUploaded);
              this.state.update(g, f, {
                status: isOk
                  ? "completed"
                  : fileUploaded
                    ? "uploaded"
                    : "failed",
                hubspot_contact_id: isOk ? contactId : null,
                error: isOk
                  ? null
                  : !fileUploaded
                    ? "File download/upload failed or timed out."
                    : "Contact creation deferred.",
                target,
              });
            }
            for (const result of groupResults) {
              if (result.status !== "skipped") {
                const isOk = Boolean(contactId && result.hubspot_file_id);
                result.status = isOk ? "completed" : "failed";
                result.hubspot_contact_id = isOk ? contactId : null;
                result.error = isOk
                  ? null
                  : !result.hubspot_file_id
                    ? "File download/upload failed or timed out."
                    : "Contact creation deferred.";
              }
            }
            // Only push records not already in results (early-return path may have added them)
            const alreadyAdded = new Set(
              results.map(
                (r) => `${r.row_email}|${r.column_name}|${r.asset_id}`,
              ),
            );
            results.push(
              ...groupResults.filter(
                (r) =>
                  !alreadyAdded.has(
                    `${r.row_email}|${r.column_name}|${r.asset_id}`,
                  ),
              ),
            );
          }
          this.progress({
            message: `Finalized ${row.email}.`,
          });
        }
      }

      /* ── dry-run upsert mode ──────────────────────────────────────────── */
      if (upsert && dryRun) {
        await Promise.all(
          workbook.contacts.map((row, index) =>
            this.limit(async () => {
              const groups = workbook.groups.filter(
                (g) => g.email === row.email,
              );
              for (let gi = 0; gi < groups.length; gi++) {
                const { groupResults } = await processGroup(
                  groups[gi],
                  gi,
                  groups.length,
                );
                results.push(...groupResults);
              }
              this.progress({
                message: `Dry-run: processed contact ${index + 1}/${workbook.contacts.length}.`,
              });
            }),
          ),
        );
      }

      /* ── report ─────────────────────────────────────────────────────────── */
      this.progress({ message: "Writing migration CSV report." });
      this.report = writeReport(results, path.join(this.root, "reports"));
      if (upsert) {
        this.contactReport = writeContactReport(
          workbook.contacts.map((row) =>
            dryRun
              ? {
                  email: row.email,
                  contact_id: contacts.get(row.email),
                  status: contacts.get(row.email)
                    ? "would_update"
                    : "would_create",
                }
              : { email: row.email, ...this.state.contact(row.email) },
          ),
          path.join(this.root, "reports"),
        );
      }

      const counts = {
        totalFiles: results.length,
        uploaded,
        skipped: results.filter((r) => r.status === "skipped").length,
        failed: results.filter((r) =>
          ["failed", "upload_uncertain"].includes(r.status),
        ).length,
        contactsNotFound:
          upsert && !dryRun
            ? [...contacts.values()].filter((v) => !v).length
            : summary.contactsNotFound,
        contactResults: upsert ? contactCounts : undefined,
        wouldUpload: results.filter((r) => r.status === "would_upload").length,
        wouldReuse: results.filter((r) => r.status === "would_reuse").length,
        completed: results.filter((r) => r.status === "completed").length,
      };

      this.progress({
        phase: "complete",
        completed: summary.files,
        total: summary.files,
        filesTotal: summary.files,
        contactsDone: summary.contacts,
        contactsTotal: summary.contacts,
        eta: null,
        summary: counts,
        message: "Report ready.",
      });
      return {
        preflight: summary,
        summary: counts,
        report: this.report,
        contactReport: upsert ? this.contactReport : undefined,
      };
    });
  }
}
