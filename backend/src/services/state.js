import Database from "better-sqlite3";
import { fail } from "../lib/sanitize.js";
export class State {
  constructor(filename) {
    this.db = new Database(filename);
    this.db.pragma("journal_mode = WAL");
    this.db
      .exec(`CREATE TABLE IF NOT EXISTS files (row_email TEXT, column_name TEXT, asset_id TEXT, source_url TEXT, filename TEXT, status TEXT DEFAULT 'pending', hubspot_file_id TEXT, hubspot_contact_id TEXT, error TEXT, sha256 TEXT, size INTEGER, access TEXT, target TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(row_email,column_name,asset_id));
    CREATE TABLE IF NOT EXISTS contacts (email TEXT PRIMARY KEY, contact_id TEXT, status TEXT, error TEXT, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, row_email TEXT, column_name TEXT, asset_id TEXT, step TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS notes (fingerprint TEXT PRIMARY KEY, note_id TEXT, status TEXT);
    CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT);
    CREATE INDEX IF NOT EXISTS idx_files_collision ON files(row_email, column_name, filename COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_files_status ON files(status);`);
    const fields = this.db
      .prepare("PRAGMA table_info(files)")
      .all()
      .map((f) => f.name);
    if (!fields.includes("verification_method"))
      this.db.exec("ALTER TABLE files ADD COLUMN verification_method TEXT");
    if (!fields.includes("verified_size"))
      this.db.exec("ALTER TABLE files ADD COLUMN verified_size INTEGER");
    if (!fields.includes("verification_fingerprint"))
      this.db.exec(
        "ALTER TABLE files ADD COLUMN verification_fingerprint TEXT",
      );
    // Migrate contacts table — add failed_files column if absent
    const contactFields = this.db
      .prepare("PRAGMA table_info(contacts)")
      .all()
      .map((f) => f.name);
    if (!contactFields.includes("failed_files"))
      this.db.exec("ALTER TABLE contacts ADD COLUMN failed_files TEXT");
  }
  key(g, f) {
    return [g.email, g.column.excel, f.assetId];
  }
  get(g, f) {
    return this.db
      .prepare(
        "SELECT * FROM files WHERE row_email=? AND column_name=? AND asset_id=?",
      )
      .get(...this.key(g, f));
  }
  ensure(g, f) {
    this.db
      .prepare(
        "INSERT OR IGNORE INTO files(row_email,column_name,asset_id,source_url,filename) VALUES(?,?,?,?,?)",
      )
      .run(...this.key(g, f), f.url, f.filename);
    return this.get(g, f);
  }
  update(g, f, values) {
    const allowed = new Set([
      "filename",
      "status",
      "hubspot_file_id",
      "hubspot_contact_id",
      "error",
      "sha256",
      "size",
      "access",
      "target",
      "verification_method",
      "verified_size",
      "verification_fingerprint",
    ]);
    if (Object.keys(values).some((k) => !allowed.has(k)))
      throw new Error("Invalid state field");
    this.db
      .prepare(
        `UPDATE files SET ${Object.keys(values)
          .map((k) => `${k}=?`)
          .join(
            ",",
          )},updated_at=CURRENT_TIMESTAMP WHERE row_email=? AND column_name=? AND asset_id=?`,
      )
      .run(...Object.values(values), ...this.key(g, f));
    if (values.status)
      this.db
        .prepare(
          "INSERT INTO events(row_email,column_name,asset_id,step) VALUES(?,?,?,?)",
        )
        .run(...this.key(g, f), values.status);
    return this.get(g, f);
  }
  note(key) {
    return this.db.prepare("SELECT * FROM notes WHERE fingerprint=?").get(key);
  }
  contact(email) {
    return this.db.prepare("SELECT * FROM contacts WHERE email=?").get(email);
  }
  saveContact(email, status, id = null, error = null, failedFiles = null) {
    this.db
      .prepare(
        "INSERT INTO contacts(email,status,contact_id,error,failed_files) VALUES(?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET status=excluded.status,contact_id=COALESCE(excluded.contact_id,contacts.contact_id),error=excluded.error,failed_files=excluded.failed_files,updated_at=CURRENT_TIMESTAMP",
      )
      .run(email, status, id, error, failedFiles);
  }
  saveNote(key, status, id = null) {
    this.db
      .prepare("INSERT OR REPLACE INTO notes VALUES(?,?,?)")
      .run(key, id, status);
  }
  bindAccount(account) {
    const prior = this.db
      .prepare("SELECT value FROM metadata WHERE key='account'")
      .get();
    if (prior && prior.value !== account)
      throw fail(
        "State is bound to different credentials. Verify the accounts and follow README token-rotation guidance.",
      );
    this.db
      .prepare("INSERT OR IGNORE INTO metadata VALUES('account',?)")
      .run(account);
  }
  /**
   * Re-bind the state database to new credentials without wiping progress data.
   * Only safe to call after verifying that the new tokens belong to the same
   * HubSpot portal and Monday account as the original run.
   */
  rebindAccount(account) {
    this.db
      .prepare(
        "INSERT INTO metadata(key,value) VALUES('account',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      )
      .run(account);
  }
  close() {
    this.db.close();
  }
}
