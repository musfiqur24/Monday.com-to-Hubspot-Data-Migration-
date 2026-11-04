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
export function api(runtime) {
  const router = Router(), { migration, hubspot, root } = runtime;
  const upload = multer({ dest: path.join(root, 'tmp'), limits: { fileSize: 50 * 1024 ** 2, files: 1, fields: 0 } });
  router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.get('/config', async (req, res) => {
    const mapping = readMapping(); let columns = [], workbookError = null, workbookSummary = null, previews = {}, savedProgress = null, columnCoverage=[];
    try {
      const activeFile = runtime.file;
      if (activeFile && (await fs.stat(activeFile).catch(() => null))) {
        const workbook = await readExcel(activeFile, { ...mapping, contactMode: 'upsert' }); columns = workbook.columns;
        const matchCol = (a, b) => a === b || normalize(a) === normalize(b) || normalize(a).replace(/s$/, "") === normalize(b).replace(/s$/, "");
        columnCoverage=columns.map(column=>({column,destination:column===mapping.emailColumn?'email':mapping.columns.find(c=>matchCol(c.excel, column))?.hubspotProperty||mapping.propertyMappings.find(c=>matchCol(c.excel, column))?.hubspotProperty||'',populatedRows:workbook.contacts.filter(row=>String(row.values[column]??'').trim()).length}));
        workbookSummary = { filename:path.basename(activeFile), rows:workbook.rows, contacts:workbook.contacts.length, files:workbook.groups.reduce((n,g)=>n+g.files.length,0), columns:columns.length, issues:workbook.issues.length };
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
    res.json({mapping,columns,workbookError,workbookSummary,previews,savedProgress,columnCoverage,credentialsConfigured:Boolean(runtime.config.mondayToken&&runtime.config.hubspotToken)});
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
        const detected = await readExcel(req.file.path, readMapping());
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
        res.json({ columns: detected.columns, rows: detected.rows, issues: detected.issues });
      } finally { await fs.unlink(req.file.path).catch(() => {}); }
    }); } catch (error) { next(error); }
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
  return router;
}
