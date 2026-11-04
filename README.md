# Hubspot Migration Tool

Local Node.js + Express tool for importing workbook records into HubSpot, replacing associations between existing records, and moving Monday attachments into **PRIVATE** HubSpot Files. The Monday workflow matches contacts on trimmed, lowercase email, supports creating/updating contacts or attaching files to existing contacts only, and assigns the returned file IDs to mapped contact properties. The tool never deletes CRM records or files.

## Setup

The application source is separated into `backend/src/` (Express API, CLI and migration services) and `frontend/public/` (browser UI, styles and module navigation). Run all npm commands from the repository root. Express serves the frontend at the same local address as the API; no separate frontend server or build is needed.

Shared frontend components live in `frontend/public/ui.js` and `ui.css`: accessible toast notifications, workflow progress indicators and API response handling. Lucide icons are served locally from the installed npm package; no external CDN is required.

The dashboard opens first, with saved migration totals by object and eight weeks of activity across all modules. Monday contacts use their latest saved completion timestamp; HubSpot records and files use their earliest saved completion. Weeks start Monday in UTC. Notes have no saved timestamps and are included only in all-time totals. The dashboard refreshes every 30 seconds while visible.

Navigation lists **Dashboard**, **HubSpot** (Data Migrate and Association Migration), then **Monday to HubSpot**. Association Migration has Objects & files, Match columns, Review & validate, and Run & monitor steps. The record-import modules retain Choose workbook, Map columns, Review & validate, and Run & monitor. Switching modules preserves each workflow's state and live migration progress.

## HubSpot workbook imports

Data Migrate imports a local CSV/XLSX export into the destination account configured by `HUBSPOT_PORTAL_ID` and `HUBSPOT_PRIVATE_APP_TOKEN`. Association Migration only replaces relationships between existing records; it never creates records or uploads property values. The server verifies that the token belongs to that portal before discovery or migration. No Monday token is needed for these modules. Configure the token with account-details read access, object/schema read access for discovery, and record read/write access for records being imported. Association replacement needs read access to both objects, association labels/limits and existing records, plus permission to edit their associations.

All HubSpot API calls throughout the application, including Monday attachments, contacts, notes and files, use **2026-09** endpoints. Legacy API URLs are rejected by the shared client. Object discovery combines account-specific object activation status, custom object schemas and property metadata for standard CRM object IDs. Deactivated, archived or inaccessible objects are excluded; missing discovery scopes are reported. The object list is cached for five minutes and can be refreshed from the first step.

1. **Choose workbook:** first select an object fetched from the portal dropdown. Its label, object type ID and portal ID are saved for this workflow. Then upload a CSV/XLSX file up to 50 MB and select its worksheet. Headers must be unique and non-empty. Workbooks support up to 100,000 rows and 500 columns.
2. **Map columns:** the selected object type ID is used to fetch that object's properties automatically. Choose the match column and map writable properties. **Record ID** updates existing destination records only. Contact **email** or a property configured with unique values supports create/update. To create other objects, use a destination unique property containing a stable source identifier. Source-account Record IDs are not destination Record IDs. Blank cells are ignored; they do not erase values. Dates use ISO format, and dropdowns use internal option values. Changing objects clears old mappings and validation results.
3. **Review & validate:** check properties, values, existing matches and required fields. Duplicate identifiers are merged when values agree; conflicting values block the run.
4. **Run & monitor:** run a dry preview before selecting a real migration and typing `RUN FOR REAL`. Every run repeats validation. Dry previews never write to HubSpot. Real writes and associations are read back and verified. The monitor polls every two seconds and provides row outcome CSV reports. Stop requests finish the in-flight record before releasing the shared migration lock.

HubSpot workbooks, mappings, job summaries and record progress are persisted in the existing ignored `data/`, `state/` and `reports/` folders. On a repeat run, unchanged records are verified and reused; associations are applied idempotently. Match keys prevent duplicate creation after an interrupted write. After a server crash, verify the PID in `state/run.lock` is no longer running before removing that lock and resuming. Keep one project/state database per destination account. No remote data is deleted.

The dashboard includes records completed by Data Migrate, grouped by object, together with Monday migration totals. Association-only runs do not increase migrated-record totals. Repeated imports of the same destination object/record ID are counted once. HubSpot weekly totals use the earliest saved completion for each destination record.

The implementation follows HubSpot's [object APIs](https://developers.hubspot.com/docs/api-reference/latest/crm/using-object-apis), [properties API](https://developers.hubspot.com/docs/api-reference/latest/crm/properties/guide), [object activation API](https://developers.hubspot.com/docs/api-reference/latest/crm/crm-data-model/guide), [schemas API](https://developers.hubspot.com/docs/api-reference/latest/crm/objects/schemas/guide), and [record association API](https://developers.hubspot.com/docs/api-reference/latest/crm/associations/associate-records/guide).

## Association-only replacement

1. **Objects & files:** choose a source object and upload its file in the left panel; choose a target object and upload its file in the right panel. Both objects come from the configured portal. Use **Get association labels** outside the two panels, then select one or more labels. The directional label category and type ID are persisted. Changing an object clears its file and the label selection.
2. **Match columns:** choose one destination record-ID column from each file. Data rows are paired by original row position, starting after the header. IDs in each cell are split on commas or `|`, trimmed and deduplicated. Every source ID in one row is paired with every target ID in the same-position row. Duplicate pairs across rows are merged. Blank/missing rows, invalid IDs and nonexistent destination records block the run. One-to-one, one-to-many, many-to-one and many-to-many relationships are supported, up to 100,000 distinct pairs per job.
3. **Review & validate:** the server checks all referenced IDs, the selected directional labels and forward association limits, then paginates through existing relationships from the uploaded source IDs to the selected target object type. The review shows removal/creation counts, cardinality, label IDs and example pairs. A dry preview creates a CSV plan and makes no association or property writes. If files, labels or existing relationships change after validation, the real run is blocked until they are reviewed again.
4. **Run & monitor:** choose a real run and type `RUN FOR REAL`. Before any removal, the original relationships and their label types are saved in an immutable JSON backup and SQLite run journal. **Phase 1** removes all relationships from the uploaded source IDs to the selected target object type, including links to target IDs absent from the target file. It verifies removal before **Phase 2** creates the planned pairs with the selected labels and verifies the results. Unlisted source records and other object types are outside the removal scope. No CRM records, properties or association-label definitions are created or deleted.

CSV cells containing commas must be quoted according to normal CSV rules. For example, source cell `101|102` and target cell `"201,202"` in the matching row produce `101→201`, `101→202`, `102→201` and `102→202`.

Runs share the cross-process migration lock with the other modules. A stop request finishes the current HubSpot request, then halts. Association replacement is a two-phase process rather than an atomic HubSpot transaction: a failure or stop after phase 1 can leave partial relationships. Retry the reviewed replacement to reach the planned state, or type `RESTORE BACKUP` to restore the last replacement's original snapshot. Restoration verifies that the backup belongs to the configured portal and that its referenced records still exist before changing relationships. Backups, reports, input files and journals remain in ignored local folders. Live edits in HubSpot should be paused while a replacement or restore is running.

The service uses the documented 2026-09 association label, limit, paginated read, batch/archive and batch/create endpoints. It never calls record upsert or property-write endpoints. The former combined record-and-association import routes are disabled.

## Monday to HubSpot setup

Shared local settings and runtime folders remain at the root: `.env`, `config/`, `data/`, `reports/`, `state/` and `tmp/`. Existing saved progress and mappings continue to use the same paths.

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
- [HubSpot Files 2026-09 upload](https://developers.hubspot.com/docs/api-reference/latest/files/files/upload-file): `POST /files/2026-09/files`, multipart `file`, `fileName`, `folderPath`, JSON `options`. PRIVATE access is required and verified via `GET /files/2026-09/files/{id}`. The requested duplication options are sent; the published endpoint describes `options` as a JSON string without enumerating those nested options.
- [HubSpot property types](https://developers.hubspot.com/docs/api-reference/latest/crm/properties/guide): file properties store file IDs, with type `string` and fieldType `file`. Discovery: `GET /crm/properties/2026-09/contacts`; validation: `GET /crm/properties/2026-09/contacts/{name}`.
- [HubSpot contact search](https://developers.hubspot.com/docs/api-reference/latest/crm/search/guide): `POST /crm/objects/2026-09/contacts/search`, email `EQ`; token check: `GET /crm/objects/2026-09/contacts?limit=1&properties=email`. Updates: `PATCH /crm/objects/2026-09/contacts/{id}` with string IDs, followed by GET verification.
- [HubSpot Notes](https://developers.hubspot.com/docs/api-reference/latest/crm/activities/notes/guide): `POST /crm/objects/2026-09/notes`, `hs_timestamp`, `hs_attachment_ids` separated by semicolons; Note → contact association type `202`. GET verifies attachments and contact association.

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

`contactMode: "upsert"` loads all valid-email rows, including contacts without attachments. HubSpot properties are discovered with `GET /crm/properties/2026-09/contacts`. Suggestions require a unique writable match by normalized name or label; ambiguous/unmatched columns remain blank for review. All detail columns must be represented in the review table before upsert runs. The saved `propertyMappings` configuration controls the fields written. A blank destination explicitly skips that column. Empty cells never erase existing HubSpot values.

Text is preserved. Numbers, ISO dates/Excel date cells, booleans and dropdown options are validated during preflight; dropdown labels are translated to internal option values. Ambiguous dates and unknown options block real runs. Duplicate emails are merged, but conflicting nonempty mapped values are reported for correction. Email-less rows cannot be created because email is the required match key. The full Name column is not automatically split into first and last names; choose its destination explicitly.

After attachments are staged and pass PRIVATE/size checks, missing contacts are created with mapped fields and file IDs using `POST /crm/objects/2026-09/contacts`; matches are updated with PATCH. Values are read back for verification. An attachment failure defers that contact instead of silently omitting a required file. Saved upload IDs and contact IDs are reused on retries. Note attachments are associated after contact creation. Contacts without attachments can be created/updated independently. Contact outcomes are also saved in SQLite's `contacts` table and shown in the summary/activity log.

To create a missing detail property, enter its internal name, choose Text/Number/Date/Yes-no, and explicitly check Create if missing. Preflight lists proposed definitions but makes no changes. The real run uses `POST /crm/properties/2026-09/contacts`, group `contactinformation`. Add `crm.schemas.contacts.write` to the Service Key only if using this feature. Existing property types/options are never silently changed. Configure any necessary sensitive-data settings in HubSpot before mapping health fields; generic new-property definitions do not configure those settings.

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
