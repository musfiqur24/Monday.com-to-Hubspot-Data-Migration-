import fs from "node:fs";
import path from "node:path";
const headers = [
  "row_email",
  "column_name",
  "asset_id",
  "source_url",
  "filename",
  "status",
  "hubspot_file_id",
  "hubspot_contact_id",
  "error",
  "sha256",
  "size",
  "verification_method",
  "verified_size",
  "created_at",
  "updated_at",
];
function csv(value) {
  let s = String(value ?? "");
  if (/^[=+@\-\t\r\n]/.test(s)) s = `'${s}`;
  return `"${s.replaceAll('"', '""')}"`;
}
export function writeReport(rows, folder) {
  const filename = path.join(
    folder,
    `migration-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`,
  );
  fs.writeFileSync(
    filename,
    "\uFEFF" +
      [headers, ...rows.map((row) => headers.map((h) => row[h]))]
        .map((row) => row.map(csv).join(","))
        .join("\r\n"),
    { mode: 0o600 },
  );
  return filename;
}
export function writeContactReport(rows, folder) {
  const columns = ["email", "contact_id", "status", "error", "failed_files"];
  const filename = path.join(
    folder,
    `contacts-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`,
  );
  fs.writeFileSync(
    filename,
    "\uFEFF" +
      [columns, ...rows.map((row) => columns.map((h) => row?.[h]))]
        .map((row) => row.map(csv).join(","))
        .join("\r\n"),
    { mode: 0o600 },
  );
  return filename;
}
