import pLimit from "p-limit";
import path from "node:path";
import { createHash } from "node:crypto";
import { runtime } from "./services/runtime.js";
import { verifyUploadedFile } from "./services/integrity.js";
import { fail, safeError } from "./lib/sanitize.js";
const rt = runtime();
rt.migration.on("activity", (entry) =>
  console.log(`[${entry.timestamp}] ${entry.message}`),
);
try {
  await rt.migration.exclusive(async () => {
    if (!rt.config.mondayToken || !rt.config.hubspotToken)
      throw fail("Configure both API tokens in .env.");
    rt.state.bindAccount(
      createHash("sha256")
        .update(`${rt.config.mondayToken}\0${rt.config.hubspotToken}`)
        .digest("hex"),
    );
    const rows = rt.state.db
      .prepare("SELECT * FROM files WHERE hubspot_file_id IS NOT NULL")
      .all();
    const counts = { total: rows.length, verified: 0, failed: 0, methods: {} };
    const limit = pLimit(rt.config.concurrency);
    rt.migration.progress({
      phase: "integrity_audit",
      total: rows.length,
      message: `Checking ${rows.length} saved uploads. No contacts or HubSpot files will be changed.`,
    });
    await Promise.all(
      rows.map((row) =>
        limit(async () => {
          try {
            const remote = await rt.hubspot.file(row.hubspot_file_id);
            const verified = await verifyUploadedFile({
              record: row,
              remote,
              sourceAssetId: row.asset_id,
              monday: rt.migration.monday,
              hubspot: rt.hubspot,
              folder: path.join(rt.root, "tmp"),
            });
            rt.state.update(
              { email: row.row_email, column: { excel: row.column_name } },
              { assetId: row.asset_id },
              {
                verification_method: verified.method,
                verified_size: verified.remoteSize,
                verification_fingerprint: verified.fingerprint,
              },
            );
            counts.verified++;
            counts.methods[verified.method] =
              (counts.methods[verified.method] || 0) + 1;
          } catch (error) {
            counts.failed++;
            rt.migration.progress({
              message: `Saved upload check failed: ${safeError(error)}`,
            });
          }
          rt.migration.progress({
            completed: counts.verified + counts.failed,
            message: `Verified ${counts.verified}/${rows.length} saved uploads; ${counts.failed} failed checks.`,
          });
        }),
      ),
    );
    console.log(JSON.stringify(counts, null, 2));
    if (counts.failed) process.exitCode = 1;
  });
} catch (error) {
  console.error(safeError(error));
  process.exitCode = 1;
} finally {
  rt.state.close();
}
