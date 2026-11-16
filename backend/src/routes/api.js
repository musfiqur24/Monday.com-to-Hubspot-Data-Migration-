import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createHash } from 'node:crypto';
import { readMapping, writeMapping, mappingSchema } from '../config.js';
import { readExcel } from '../services/excel.js';
import { suggestMappings, normalize } from '../services/contactMapping.js';
import { fail, safeError } from '../lib/sanitize.js';
import { dashboard } from '../services/dashboard.js';
import { hubspotMigration } from './hubspotMigration.js';
import { logger } from '../lib/logger.js';
export function api(runtime) {
  const router = Router(), { migration, hubspot, root } = runtime;
  const upload = multer({ dest: path.join(root, 'tmp'), limits: { fileSize: 50 * 1024 ** 2, files: 1, fields: 0 } });
  router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.use('/hubspot', hubspotMigration(runtime));
  router.get('/dashboard', (req, res) => res.json(dashboard(runtime.state.db)));
  router.get('/config', async (req, res) => {
    const mapping = readMapping(); let columns = [], workbookError = null, workbookSummary = null, previews = {}, savedProgress = null, columnCoverage=[];
    try {
      const activeFile = runtime.file;
      if (activeFile && (await fs.stat(activeFile).catch(() => null))) {
        const workbook = await readExcel(activeFile, { ...mapping, contactMode: 'upsert' }); columns = workbook.columns;
        const matchCol = (a, b) => a === b || normalize(a) === normalize(b) || normalize(a).replace(/s$/, "") === normalize(b).replace(/s$/, "");
        columnCoverage=columns.map(column=>({column,destination:column===mapping.emailColumn?'email':mapping.columns.find(c=>matchCol(c.excel, column))?.hubspotProperty||mapping.propertyMappings.find(c=>matchCol(c.excel, column))?.hubspotProperty||'',populatedRows:workbook.contacts.filter(row=>String(row.values[column]??'').trim()).length}));
        const fileBaseName = path.basename(activeFile, path.extname(activeFile));
        const effectiveSheet = (mapping.sheet && mapping.sheet !== 'client') ? mapping.sheet : fileBaseName;
        workbookSummary = { filename:path.basename(activeFile), sheetName:effectiveSheet, availableSheets:workbook.availableSheets, rows:workbook.rows, contacts:workbook.contacts.length, files:workbook.groups.reduce((n,g)=>n+g.files.length,0), columns:columns.length, issues:workbook.issues.length };
        for (const column of columns) previews[column] = workbook.contacts.slice(0,3).map(row => {
          const files = workbook.groups.find(g=>g.email===row.email && g.column.excel===column)?.files;
          return files ? `${files.length} ${files.length===1?'file':'files'}` : String(row.values[column]||'').slice(0,100);
        });
        if (runtime.state) {
          const contacts=workbook.contacts.map(row=>runtime.state.contact(row.email)), files=workbook.groups.flatMap(g=>g.files.map(f=>runtime.state.get(g,f)));
          savedProgress={contactsCompleted:contacts.filter(c=>c?.status==='completed').length, contactsFailed:contacts.filter(c=>c&&c.status!=='completed').length, filesUploaded:files.filter(f=>f?.hubspot_file_id).length, filesCompleted:files.filter(f=>f?.status==='completed').length, filesFailed:files.filter(f=>['failed','upload_uncertain'].includes(f?.status)).length};
        }
      }
    } catch(e) {workbookError=safeError(e);}
    res.json({mapping,columns,workbookError,workbookSummary,previews,savedProgress,columnCoverage,credentialsConfigured:Boolean(runtime.config.mondayToken&&runtime.config.hubspotToken&&runtime.config.hubspotPortalId)});
  });
  router.get('/properties', async (req, res) => { if (!runtime.config.hubspotToken) throw fail('Configure the HubSpot token in .env and restart.'); res.json((await hubspot.properties()).filter(p => p.type === 'string' && p.fieldType === 'file').map(({ name, label }) => ({ name, label }))); });
  router.get('/contact-mapping', async (req, res) => {
    if (!runtime.config.hubspotToken) throw fail('Configure the HubSpot Service Key in .env and restart.');
    if (!runtime.file || !(await fs.stat(runtime.file).catch(() => null))) return res.json({ properties: [], mappings: [] });
    const mapping = readMapping(), workbook = await readExcel(runtime.file, mapping), properties = await hubspot.properties();
    res.json({ properties: properties.map(({ name, label, type, fieldType, options, modificationMetadata, calculated, externalOptions }) => ({ name, label, type, fieldType, options, modificationMetadata, calculated, externalOptions })), mappings: suggestMappings(workbook.columns, properties, mapping) });
  });
  router.put('/config', (req, res) => { if (migration.status.running) return res.status(409).json({ error: 'A job is running.' }); const result = mappingSchema.safeParse(req.body); if (!result.success) return res.status(400).json({ error: 'Invalid mapping. Check column names, unique property names and strategies.' }); res.json(writeMapping(result.data)); });
  router.post('/upload', async (req, res, next) => {
    if (migration.status.running) return res.status(409).json({ error: 'A job is running.' });
    // Reserve the same cross-process lock used by migration while receiving the workbook.
    try { await migration.exclusive(async () => {
      await new Promise((resolve, reject) => upload.single('file')(req, res, e => e ? reject(e) : resolve()));
      if (!req.file) throw fail('Select an Excel workbook (.xlsx) or CSV file.');
      try {
        const isXlsx = req.file.originalname.toLowerCase().endsWith('.xlsx');
        const isCsv = req.file.originalname.toLowerCase().endsWith('.csv');
        if (!isXlsx && !isCsv) throw fail('Only XLSX workbooks and CSV files are supported.');
        const ext = isCsv ? '.csv' : '.xlsx';
        const baseName = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9 _-]/g, '_').trim() || 'uploaded_workbook';
        let destFile = path.join(root, 'data', `${baseName}${ext}`);
        try {
          await fs.copyFile(req.file.path, destFile);
        } catch (copyErr) {
          if (['EPERM', 'EACCES', 'EBUSY'].includes(copyErr.code)) {
            // If the target file is locked by another application (e.g. Excel), save under a unique timestamp
            destFile = path.join(root, 'data', `${baseName}_${Date.now()}${ext}`);
            await fs.copyFile(req.file.path, destFile);
          } else {
            throw copyErr;
          }
        }
        runtime.file = destFile;
        const detected = await readExcel(destFile, readMapping());
        try {
          const currentMapping = readMapping();
          currentMapping.sheet = baseName;
          writeMapping(currentMapping);
        } catch (e) {}
        res.json({
          sheetName: baseName,
          actualWorksheet: detected.sheetName,
          availableSheets: detected.availableSheets,
          columns: detected.columns,
          rows: detected.rows,
          issues: detected.issues
        });
      } finally { await fs.unlink(req.file.path).catch(() => {}); }
    }); } catch (error) { next(error); }
  });
  router.post('/workbook/clear', (req, res) => {
    if (migration.status.running) return res.status(409).json({ error: 'A job is running.' });
    runtime.file = null;
    try {
      const currentMapping = readMapping();
      currentMapping.sheet = 'Combined';
      writeMapping(currentMapping);
    } catch (e) {}
    res.json({ success: true, message: 'Workbook cleared.' });
  });
  router.post('/preflight', async (req, res) => {
    if (!runtime.file || !(await fs.stat(runtime.file).catch(() => null))) throw fail('Please upload or select a CSV or Excel workbook first.');
    res.json(await migration.preflight(runtime.file, readMapping()));
  });
  router.post('/run', async (req, res, next) => {
    const body = req.body || {};
    if (Object.keys(body).some(k => !['dryRun','retryFailed','confirmation'].includes(k)) || (body.dryRun !== undefined && typeof body.dryRun !== 'boolean') || (body.retryFailed !== undefined && typeof body.retryFailed !== 'boolean')) return res.status(400).json({ error: 'dryRun and retryFailed must be booleans.' });
    if (body.dryRun === false && body.confirmation !== 'RUN FOR REAL') return res.status(400).json({ error: 'A real run requires confirmation: RUN FOR REAL.' });
    if (!runtime.file || !(await fs.stat(runtime.file).catch(() => null))) return res.status(400).json({ error: 'Please upload or select a CSV or Excel workbook first.' });
    if (migration.status.running) return res.status(409).json({ error: 'A job is running.' });
    const runId = randomUUID();
    const job = migration.run(runtime.file, readMapping(), body);
    // exclusive acquires the lock synchronously before its first await.
    if (!migration.status.running) return job.catch(next);
    job.catch(() => {}); res.status(202).json({ runId });
  });
  router.post('/cancel', (req, res) => {
    const cancelled = migration.cancel();
    res.json({ cancelled, message: cancelled ? 'Migration cancelled.' : 'No migration was running.' });
  });
  router.post('/restart', (req, res) => {
    res.json({ message: 'Restarting…' });
    setTimeout(() => process.exit(0), 300);
  });
  /**
   * Re-bind the saved state database to the currently configured credentials
   * without erasing any upload progress or contact records.
   *
   * Use this when you have rotated API tokens and the tool refuses to start
   * with "State is bound to different credentials."  Confirm that the new
   * tokens still point to the same HubSpot portal and Monday account before
   * calling this endpoint.
   */
  router.post('/reset-credentials', (req, res) => {
    if (migration.status.running) return res.status(409).json({ error: 'A job is running. Cancel it before resetting credentials.' });
    if (!runtime.config.mondayToken || !runtime.config.hubspotToken)
      return res.status(400).json({ error: 'Both MONDAY_API_TOKEN and HUBSPOT_PRIVATE_APP_TOKEN must be set in .env before rebinding.' });
    const newHash = createHash('sha256')
      .update(`${runtime.config.mondayToken}\0${runtime.config.hubspotToken}`)
      .digest('hex');
    runtime.state.rebindAccount(newHash);
    res.json({ ok: true, message: 'Credentials rebound. All saved progress is preserved. You can now run the migration.' });
  });
  router.get('/status', (req, res) => res.json(migration.status));
  router.get('/progress', (req, res) => {
    res.set({ 'Content-Type': 'text/event-stream', Connection: 'keep-alive', 'Cache-Control': 'no-cache' }); res.flushHeaders();
    const send = state => res.write(`data: ${JSON.stringify(state)}\n\n`); send(migration.status); migration.on('progress', send);
    const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 15000);
    req.on('close', () => { clearInterval(heartbeat); migration.off('progress', send); });
  });
  router.get('/report', async (req, res) => {
    let report = migration.report;
    if (!report) { const reports = (await fs.readdir(path.join(root, 'reports'))).filter(n => /^migration-[\dTZ-]+\.csv$/.test(n)).sort(); if (reports.length) report = path.join(root, 'reports', reports.at(-1)); }
    if (!report) return res.status(404).json({ error: 'No report yet.' }); res.download(report);
  });
  router.get('/contact-report', async (req, res) => {
    let report = migration.contactReport;
    if (!report) { const reports = (await fs.readdir(path.join(root,'reports'))).filter(n => /^contacts-[\dTZ-]+\.csv$/.test(n)).sort(); if (reports.length) report = path.join(root,'reports',reports.at(-1)); }
    if (!report) return res.status(404).json({error:'No contact report yet.'}); res.download(report);
  });
  router.get('/history', async (req, res) => {
    try {
      const reportsDir = path.join(root, 'reports');
      let files = [];
      try {
        files = await fs.readdir(reportsDir);
      } catch {
        files = [];
      }

      const historyRuns = await Promise.all(
        files
          .filter(f => f.endsWith('.csv') || f.endsWith('.json'))
          .map(async (filename) => {
            const filepath = path.join(reportsDir, filename);
            const stats = await fs.stat(filepath);
            let module = 'Monday to HubSpot';
            let type = 'File Migration';
            let timestamp = stats.mtime;
            let status = 'completed'; // default

            if (filename.startsWith('contacts-')) {
              type = 'Contacts Report';
              const match = filename.match(/contacts-(.+)\.csv/);
              if (match) {
                const dateStr = match[1].replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, 'T$1:$2:$3.$4Z');
                const parsed = new Date(dateStr);
                if (!isNaN(parsed.getTime())) timestamp = parsed;
              }
            } else if (filename.startsWith('migration-')) {
              type = 'Asset / File Migration';
              const match = filename.match(/migration-(.+)\.csv/);
              if (match) {
                const dateStr = match[1].replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, 'T$1:$2:$3.$4Z');
                const parsed = new Date(dateStr);
                if (!isNaN(parsed.getTime())) timestamp = parsed;
              }
            } else if (filename.startsWith('hubspot-data-migrate-')) {
              module = 'HubSpot Data Migrate';
              type = 'Results CSV';
            } else if (filename.startsWith('validation-issues')) {
              module = 'HubSpot Validation';
              type = 'Issues Report';
            }

            // Peek at tail of CSV to derive status (failed / partial / completed)
            if (filename.endsWith('.csv') && stats.size > 0) {
              try {
                const tailSize = Math.min(stats.size, 4096);
                const buf = Buffer.alloc(tailSize);
                const fh = await fs.open(filepath, 'r');
                await fh.read(buf, 0, tailSize, stats.size - tailSize);
                await fh.close();
                const tail = buf.toString('utf8');
                const lowerTail = tail.toLowerCase();
                // Count failed / error rows
                const failedCount = (lowerTail.match(/\bfailed\b/g) || []).length
                                  + (lowerTail.match(/\berror\b/g) || []).length;
                const hasUncertain = lowerTail.includes('uncertain');
                if (failedCount > 2) {
                  status = hasUncertain ? 'partial' : 'failed';
                } else if (failedCount > 0 || hasUncertain) {
                  status = 'partial';
                } else {
                  status = 'completed';
                }
              } catch {
                status = 'completed';
              }
            }

            return {
              filename,
              module,
              type,
              status,
              size: stats.size,
              createdAt: timestamp.toISOString(),
            };
          })
      );

      historyRuns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const db = runtime.state.db;
      const count = (sql) => {
        try { return db.prepare(sql).get()?.total ?? 0; } catch { return 0; }
      };

      const totalContacts = count("SELECT COUNT(*) total FROM contacts WHERE status='completed'");
      const totalFiles = count("SELECT COUNT(*) total FROM files WHERE status='completed'");
      const failedContacts = count("SELECT COUNT(*) total FROM contacts WHERE status IN ('failed','uncertain')");
      const failedFiles = count("SELECT COUNT(*) total FROM files WHERE status IN ('failed','upload_uncertain')");

      let recentEvents = [];
      try {
        recentEvents = db.prepare(
          "SELECT id, row_email, column_name, step, created_at FROM events ORDER BY id DESC LIMIT 50"
        ).all();
      } catch {
        recentEvents = [];
      }

      res.json({
        summary: {
          totalRuns: historyRuns.length,
          totalContacts,
          totalFiles,
          failedItems: failedContacts + failedFiles,
          latestRun: historyRuns[0]?.createdAt ?? null,
        },
        runs: historyRuns,
        recentEvents,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.get('/history/download', async (req, res) => {
    const filename = req.query.file;
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    const filepath = path.join(root, 'reports', filename);
    try {
      await fs.access(filepath);
      res.download(filepath, filename);
    } catch {
      res.status(404).json({ error: 'Report file not found' });
    }
  });

  // DELETE single report file
  router.delete('/history/delete', async (req, res) => {
    const filename = req.query.file;
    if (!filename || filename.includes('..') || /[/\\]/.test(filename)) {
      logger.warn(`[Delete History] Rejected invalid filename: ${filename}`, { method: req.method });
      return res.status(400).json({ error: 'Invalid filename' });
    }
    const filepath = path.join(root, 'reports', filename);
    try {
      await fs.unlink(filepath);
      logger.info(`[Delete History] Successfully deleted report: ${filename}`, { method: req.method });
      res.json({ ok: true, filename });
    } catch (err) {
      logger.error(`[Delete History] Failed to delete report ${filename}: ${err.message}`, { method: req.method });
      res.status(404).json({ error: 'File not found' });
    }
  });

  // DELETE multiple report files
  router.post('/history/delete-many', async (req, res) => {
    const { filenames } = req.body || {};
    if (!Array.isArray(filenames) || filenames.length === 0) {
      logger.warn('[Delete History] Bulk delete request missing filenames array', { method: req.method });
      return res.status(400).json({ error: 'filenames array required' });
    }
    const invalid = filenames.find(f => !f || f.includes('..') || /[/\\]/.test(f));
    if (invalid) {
      logger.warn(`[Delete History] Invalid filename in bulk delete: ${invalid}`, { method: req.method });
      return res.status(400).json({ error: 'Invalid filename in list' });
    }
    logger.info(`[Delete History] Initiating bulk deletion for ${filenames.length} report files`, { method: req.method });
    const results = await Promise.allSettled(
      filenames.map(f => fs.unlink(path.join(root, 'reports', f)))
    );
    const deleted = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - deleted;
    logger.info(`[Delete History] Bulk delete finished: ${deleted} deleted, ${failed} failed`, { method: req.method });
    res.json({ deleted, failed });
  });

  return router;
}
