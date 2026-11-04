# TRT migration

Local Node.js + Express tool for moving Monday attachments into **PRIVATE** HubSpot Files and assigning the returned file IDs to existing contact file properties. Contacts are matched on trimmed, lowercase email. It supports creating missing contacts and updating matching contacts by email, or attaching files to existing contacts only. It never deletes remote data.

## Setup

Use Node.js 20 or newer (tested here with Node 24). From this directory:

```powershell
npm install
Copy-Item .env.example .env
npm start
```

Fill in `.env` locally, then open **http://127.0.0.1:3000**. Restart after changing environment variables. If Node is not on PATH on Windows, add your installed Node folder to the current shell PATH first.

Place the workbook at `data/Monday_CRM_contact.xlsx` or upload it in the UI. The worksheet defaults to `Combined`; its name and email/name columns are editable. The application detects actual columns and row counts rather than assuming 67 × 74. XLSX uploads are limited to 20 MB. Empty cells are ignored. Duplicate email/column rows are merged and asset IDs deduplicated in workbook order.

Generate a Monday personal API token in your Monday profile's developer/API settings. The token must have access to the source boards/assets. Configure `MONDAY_API_VERSION` explicitly; the default is `2026-07`, identified as stable/current by the documentation checked during implementation. Tokens and source data must never be committed.

Create a HubSpot Service Key in the client's portal under **Development → Keys → Service keys**, and configure:

- `files`
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.schemas.contacts.read`

Save the Service Key in `.env` as `HUBSPOT_PRIVATE_APP_TOKEN`. This existing variable name is retained for compatibility; its value is sent as a Bearer token. A private app, HubSpot CLI project, and CLI Personal Access Key are not required for this local migration tool. An existing private-app access token with the same scopes also works. See the [Service Key setup guide](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys). Keep `.env.example` blank and use `.env` for real credentials. If `.env` already exists, edit it directly instead of copying the template over it.

Use **Load HubSpot file properties** to populate the property-name suggestions, then replace the placeholder mappings. Properties must already exist and must have `type: string`, `fieldType: file`, and writable values. The contact details mapping can propose new properties for explicit review; these are created only during a real run when Create if missing is checked. File properties must already exist. Sensitive-data property access may require additional portal-specific permissions/scopes.

## Dry-run-first workflow

1. Choose contact behavior: create missing contacts and update matches, or attach files to existing contacts only. The project is configured for create/update mode.
2. Upload/select the workbook. Load all contact properties, review suggested mappings for every detail column, and save. Blank destinations are explicitly ignored; they are listed in preflight. Email and attachment columns have dedicated mappings.
3. Run **Preflight**. Review contacts, files, missing contacts, parsing errors and numbered-property fallbacks. Fix mapping/parse errors before continuing.
4. Run **Dry run**. It resolves Monday asset IDs and reports proposed uploads. It does not download files or write anything to HubSpot. Signed download URLs are never persisted.
5. Review the report, contact create/update counts, validation issues, ignored columns and proposed new properties. Type `RUN FOR REAL`, then click **Run migration** to upload, save contacts and attach. Every real run repeats preflight. Existing mapped property values can be replaced.
6. Use **Retry failed** for recovery. It defaults to dry run; select the real retry checkbox and provide the confirmation for real changes. Uploaded file IDs are retained when a contact is missing, so re-running after importing that contact attaches the existing uploads.

CLI uses the same service layer:

```powershell
npm run migrate -- --preflight
npm run migrate -- --dry-run
npm run migrate -- --run-for-real
npm run migrate -- --run-for-real --retry-failed
npm run migrate -- --dry-run --file "data/another.xlsx"
```

No flag means dry run. Do not run the CLI and UI simultaneously against the same state. `state/run.lock` enforces cross-process exclusion. After a crash, confirm the recorded PID is no longer running before removing this one lock file. Never delete the SQLite database to recover a failed file: doing so loses upload IDs and can create duplicates.

## Multiple files and recovery

`numbered` uses `property`, `property_2`, `property_3`, etc. Preflight validates every required numbered property. The default `numberedFallback: "note"` attaches all files to a contact Note if a numbered property is missing; set it to `"fail"` to block instead. `noteSetFirst: true` also assigns the first file to the main property. `first_only` records surplus files as skipped and never downloads them.

SQLite keys files by `(email, column, asset_id)` and records stage events, SHA-256, byte size, upload IDs and errors. Matching completed targets are skipped on rerun. Uploaded files are checked for size and PRIVATE access before attachment. Contact property writes and Note attachments/associations are read back and verified. A group with a failed file is retained for retry without shifting numbered slots. Files that uploaded successfully in that group are reused.

There is no distributed transaction between local SQLite and HubSpot. A network loss/process crash after HubSpot accepts an upload or Note but before its ID is saved has an **uncertain outcome**. The tool deliberately blocks another automatic POST for that record. Reconcile the file/Note in HubSpot with the local row before resuming; preserve the database and ask a developer to record the remote ID in `files.hubspot_file_id` or `notes.note_id` and the corresponding uploaded/created status. Reconcile creating Notes using the deterministic group marker in the Note body. HTTP 429 and 5xx are retried for safe requests and contact PATCHes; non-idempotent file/Note POSTs are not blindly retried. A definite rejected file upload (such as 429) is retryable on the next run.

The state database is bound to a hash of both configured tokens, preventing accidental reuse against another portal. Keep one project/state database per client.

**Token rotation guidance** — If you see *"State is bound to different credentials"* after updating `.env`:

1. Confirm the new tokens still belong to the **same HubSpot portal and Monday account** as the original run.
2. In the UI go to **Step 4 → Run & monitor** and click **⟳ Rebind credentials**. This updates only the credential hash — all upload progress and contact records are preserved.
3. Alternatively call `POST /api/reset-credentials` directly.

If you cannot confirm the portal/account is unchanged, delete `state/migration.sqlite` to start fresh (losing saved upload progress) rather than risk cross-portal data contamination.

Original filenames are sanitized for Windows/path safety, retaining spaces and commas. Known collisions within an email/column folder receive the asset-ID prefix. Remote existing files are never overwritten. HubSpot may further disambiguate names of pre-existing unrelated files. Folder paths are `/Monday Migration/<column>/<email>/` by default. Source URLs are restricted to HTTPS Monday subdomains, and only the exact signed host returned by the authenticated Monday API (plus Monday subdomains) can be downloaded. Redirects to other hosts are blocked. Downloads have DNS private-address checks, a byte cap and a total timeout; temp files are deleted on success or failure. Files left by an OS/process crash may remain in `tmp/`; inspect and remove those only after confirming no job is running. Use a trusted local network/DNS environment.

## Reports and privacy

Each dry/real run produces `reports/migration-<timestamp>.csv`, one row per parsed file. Parsing issues appear separately in preflight and block real runs. Reports include email, source URL (the original protected Monday URL, never the signed URL), asset ID, filename, status and saved HubSpot IDs. Summaries distinguish new uploads, completed assignments, skipped files, failures and missing contacts. Reports and SQLite contain personal/health information: protect their filesystem permissions and backups, and apply the client's retention policy. SQLite is not encrypted by this tool; use device encryption and restricted OS access.

Get the client's sign-off before storing health information and Medicare images in HubSpot, including agreement on access permissions, appropriate HubSpot features/subscription and retention. PRIVATE file access is enforced, but users with appropriate portal permissions can still view the data.

The server binds only to `127.0.0.1`, uses Helmet/CSP, rejects cross-origin and unexpected Host headers, and enables no CORS. Open the numeric loopback URL shown above. Tokens, signed URLs, raw API error bodies and file contents are excluded from logs/errors. Progress uses counts rather than names/emails. `.env`, `data/`, `tmp/`, `reports/`, `state/` and SQLite files are ignored by Git. Do not expose this local app through a tunnel or reverse proxy.

## API decisions and references

Checked against official documentation during implementation:

- [Monday assets](https://developer.monday.com/api-reference/reference/assets-1): `POST https://api.monday.com/v2`, `assets(ids: [ID!]!) { id name public_url url file_extension file_size }`. Groups are resolved in batches of at most 50 and immediately processed; signed URLs expire after about an hour.
- [Monday versions](https://developer.monday.com/api-reference/docs/api-versioning): configurable `API-Version` header. Token check uses `me { id account { id } }`.
- [HubSpot Files v3 upload](https://developers.hubspot.com/docs/api-reference/legacy/files/files/upload-file): `POST /files/v3/files`, multipart `file`, `fileName`, `folderPath`, JSON `options`. PRIVATE access is required and verified via `GET /files/v3/files/{id}`. The requested duplication options are sent; the published endpoint describes `options` as a JSON string without enumerating those nested options.
- [HubSpot property types](https://developers.hubspot.com/docs/api-reference/legacy/crm/properties/guide): file properties store file IDs, with type `string` and fieldType `file`. Discovery: `GET /crm/v3/properties/contacts`; validation: `GET /crm/v3/properties/contacts/{name}`.
- [HubSpot contact search](https://developers.hubspot.com/docs/api-reference/legacy/crm/search/guide): `POST /crm/v3/objects/contacts/search`, email `EQ`; token check: `GET /crm/v3/objects/contacts?limit=1&properties=email`. Updates: `PATCH /crm/v3/objects/contacts/{id}` with string IDs, followed by GET verification.
- [HubSpot Notes](https://developers.hubspot.com/docs/api-reference/legacy/crm/activities/notes/guide): `POST /crm/v3/objects/notes`, `hs_timestamp`, `hs_attachment_ids` separated by semicolons; Note → contact association type `202`. GET verifies attachments and contact association.

The `/resources/{number}/` → asset-ID assumption cannot be established from the URL format documentation alone. **It has not yet been verified against the client's Monday account.** Dry run queries those exact IDs and reports inaccessible/missing IDs as failures. An absent ID can also mean insufficient access or a deleted asset. Review successful resolutions against source filenames before a real run.

## Troubleshooting

- Missing workbook/tokens: populate `.env`, restart, and upload the XLSX. No live preflight can run until those inputs exist.
- Invalid file property: choose the internal name, not its display label; verify it is a writable file upload property. Create numbered properties yourself or enable Note fallback.
- Missing contact: finish the separate CSV import; retry will reuse the upload.
- 401/403: check token scopes, source board access and portal permissions. Raw remote errors are intentionally not shown.
- Rate limits: exponential backoff honors Retry-After; throttles lower active concurrency. HubSpot uses a conservative 8-token/8-per-second bucket and a separate 4-per-second search limiter.
- Native SQLite installation failure: use a supported Node release and ensure the package's prebuilt binary can download; otherwise install Python and Visual Studio C++ build tools. This project uses better-sqlite3 12 for Node 20–24 compatibility.
- Temp failure or size mismatch: inspect the local report; uploaded IDs remain saved and are never automatically uploaded again.

Tests use `node:test` and Undici MockAgent with external networking disabled; no real Monday/HubSpot API calls are made.

## Full contact migration

`contactMode: "upsert"` loads all valid-email rows, including contacts without attachments. HubSpot properties are discovered with `GET /crm/v3/properties/contacts`. Suggestions require a unique writable match by normalized name or label; ambiguous/unmatched columns remain blank for review. All detail columns must be represented in the review table before upsert runs. The saved `propertyMappings` configuration controls the fields written. A blank destination explicitly skips that column. Empty cells never erase existing HubSpot values.

Text is preserved. Numbers, ISO dates/Excel date cells, booleans and dropdown options are validated during preflight; dropdown labels are translated to internal option values. Ambiguous dates and unknown options block real runs. Duplicate emails are merged, but conflicting nonempty mapped values are reported for correction. Email-less rows cannot be created because email is the required match key. The full Name column is not automatically split into first and last names; choose its destination explicitly.

After attachments are staged and pass PRIVATE/size checks, missing contacts are created with mapped fields and file IDs using `POST /crm/v3/objects/contacts`; matches are updated with PATCH. Values are read back for verification. An attachment failure defers that contact instead of silently omitting a required file. Saved upload IDs and contact IDs are reused on retries. Note attachments are associated after contact creation. Contacts without attachments can be created/updated independently. Contact outcomes are also saved in SQLite's `contacts` table and shown in the summary/activity log.

To create a missing detail property, enter its internal name, choose Text/Number/Date/Yes-no, and explicitly check Create if missing. Preflight lists proposed definitions but makes no changes. The real run uses `POST /crm/v3/properties/contacts`, group `contactinformation`. Add `crm.schemas.contacts.write` to the Service Key only if using this feature. Existing property types/options are never silently changed. Configure any necessary sensitive-data settings in HubSpot before mapping health fields; generic new-property definitions do not configure those settings.

File integrity handles HubSpot optimization without treating every size change as corruption. PRIVATE access is always required. Equal sizes pass the size check. For different sizes, the tool re-resolves/downloads the Monday original, verifies its saved SHA-256, and compares its MD5 against the authenticated HubSpot `fileMd5` metadata. A match verifies that HubSpot received the original even when the CDN serves an optimized image. If that checksum is unavailable or different, the private copy is downloaded and compared by SHA-256, then exact decoded pixels for supported single-frame images. Different image pixels without a matching original checksum remain blocked; there is no visual tolerance or approximate matching. Proofs are stored in SQLite and reused only while the source hash and HubSpot checksum, update timestamp, size and access remain unchanged. Temporary verification downloads are removed. The original upload IDs are retained.

Run `npm run verify-files` to audit existing uploads and cache local proofs without changing any HubSpot file or contact. Stop any active migration before running it; the same process lock applies. The file CSV includes the verification method and verified size.

The supplied workbook uses `triage_status` for Monday Status, not HubSpot's unrelated content-membership Status property. Medicare expiry values are preserved in the existing `medicare_expiry_date___text` property because the source mixes month/year and free text. Name maps to `full_name`. No expiry day is guessed and no dropdown options are silently changed.
### Postal code and client Type mapping

`Postcode` maps to HubSpot `zip` (Postal Code), preserving text and leading zeros present in the source. Excel `Type` maps to `hs_content_membership_status` (HubSpot label Status): `Active Client` → `active`, and `Inactive Client` / `No Longer Client` → `inactive`. Empty values leave the destination unchanged. The separate Excel `Status` column continues to map to `triage_status`. The per-column `valueMap` is editable as JSON in the mapping table; translations are case-insensitive, and results must still match the destination property's valid internal options. They are applied during preflight and real runs.
### Multiple URLs in an Excel hyperlink cell

The displayed URL list is parsed in full, even when Excel's single clickable hyperlink target points only at its first file. Splitting occurs only before a new HTTP(S) URL after a comma; filename commas and narrow no-break spaces are preserved. With the current workbook, this finds **259 attachments**: 188 Bloodwork, 70 Medicare and 1 ERX. The former 135 count reflected only the first hyperlink target in some cells. Saved uploads remain reusable, so the remaining 124 file references can be processed without reuploading the original 135.

All three file columns now use `numbered` with Note fallback. Additional numbered file properties are used when present; otherwise all IDs are attached to a contact Note and the main property holds the first file. Check the timeline Note to see all attachments; a single main property does not imply only one file was uploaded. ERX no longer defaults to first_only.

### Recreating deleted contacts

In create/update mode, deleting or archiving a contact in HubSpot makes it eligible for creation again on the next real run. The tool first checks for an active email match and updates that match when found. If the cached record is missing/archived and the email has no active match, it creates a replacement, saves its new ID, and reuses existing file uploads. Ambiguous creation outcomes still require reconciliation before another POST to prevent duplicates.

### Guided local interface

Start with `npm start` and open the loopback URL printed in the terminal. After updating the app, restart the server and hard-refresh the browser (Ctrl+Shift+R).

1. **Choose workbook:** upload an XLSX or use the workbook already in `data/`. Check the contact/file counts and choose whether to create missing contacts.
2. **Map columns:** search and filter columns, preview values, and select HubSpot internal property names. Configure value translations with From/To fields. File columns can keep all attachments together in one property. Source remains excluded. Use Configure to change a column between contact details and file attachments.
3. **Review & validate:** save and run preflight. Inspect create/update counts, ignored columns, proposed new properties and row-specific issues. Editing mappings invalidates previous validation.
4. **Run & monitor:** dry preview is selected by default. A real migration requires a successful current preflight and typing `RUN FOR REAL`. Watch live activity, file/contact outcomes and download the reports. Successful uploads are reused.

The progress bar stays below 100% while contact processing is still running, even if every file has already been processed. Saved progress is historical; preflight checks current HubSpot records.

### Show all files in the same property

The default `multiFileStrategy` is now `same_property` for all three file columns. All verified HubSpot file IDs are joined with semicolons and written into the mapped file property, so HubSpot shows multiple file entries together in that property. No numbered properties or Note fallback are required in this mode. Existing migration Notes are retained. `numbered`, `note`, and `first_only` remain optional compatibility strategies. Read-back verification checks the saved property value. See the official HubL `files_by_ids` example, which splits a file property's multiple IDs using semicolons: https://developers.hubspot.de/docs/cms/reference/hubl/functions.
