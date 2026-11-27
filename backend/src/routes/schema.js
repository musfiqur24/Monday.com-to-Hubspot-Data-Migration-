import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { HubspotSchema } from '../services/hubspotSchema.js';
import { readHubspotWorkbook } from '../services/hubspotWorkbook.js';
import { fail, safeError } from '../lib/sanitize.js';

export function schemaRoutes(rt) {
  const router = Router();
  const schema = new HubspotSchema(rt);
  const upload = multer({
    dest: path.join(rt.root, 'tmp'),
    limits: { fileSize: 50 * 1024 ** 2, files: 1, fields: 5 }
  });

  // GET /api/hubspot/schema/groups/:objectType
  router.get('/groups/:objectType', async (req, res) => {
    try {
      const groups = await schema.getGroups(req.params.objectType);
      res.json({ groups });
    } catch (err) {
      res.status(400).json({ error: safeError(err) });
    }
  });

  // POST /api/hubspot/schema/groups/:objectType
  router.post('/groups/:objectType', async (req, res) => {
    try {
      const { name, label, displayOrder } = req.body || {};
      const result = await schema.createGroup(req.params.objectType, { name, label, displayOrder });
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: safeError(err) });
    }
  });

  // POST /api/hubspot/schema/groups/:objectType/batch
  router.post('/groups/:objectType/batch', async (req, res) => {
    try {
      const { groups } = req.body || {};
      const results = await schema.createGroupsBatch(req.params.objectType, groups);
      res.json({ results });
    } catch (err) {
      res.status(400).json({ error: safeError(err) });
    }
  });

  // GET /api/hubspot/schema/properties/:objectType
  router.get('/properties/:objectType', async (req, res) => {
    try {
      const properties = await schema.getProperties(req.params.objectType);
      res.json({ properties });
    } catch (err) {
      res.status(400).json({ error: safeError(err) });
    }
  });

  // POST /api/hubspot/schema/properties/:objectType
  router.post('/properties/:objectType', async (req, res) => {
    try {
      const { groupName, name, label, type, fieldType, description, options } = req.body || {};
      const result = await schema.createProperty(req.params.objectType, {
        groupName,
        name,
        label,
        type,
        fieldType,
        description,
        options
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: safeError(err) });
    }
  });

  // POST /api/hubspot/schema/properties/:objectType/batch
  router.post('/properties/:objectType/batch', async (req, res) => {
    try {
      const { properties, createMissingGroups = true } = req.body || {};
      const results = await schema.createPropertiesBatch(req.params.objectType, properties, { createMissingGroups });
      res.json({ results });
    } catch (err) {
      res.status(400).json({ error: safeError(err) });
    }
  });

  // POST /api/hubspot/schema/parse (parse uploaded CSV or XLSX)
  router.post('/parse', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Please choose a CSV or XLSX file.' });
    try {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (!['.csv', '.xlsx'].includes(ext)) {
        throw fail('Only CSV and XLSX files are supported.');
      }
      const parsed = await readHubspotWorkbook(req.file.path, ext);
      // summary.columns is {name, samples}[] — extract string names
      const headers = (parsed.summary?.columns || []).map(c =>
        typeof c === 'object' ? String(c.name || '') : String(c || '')
      ).filter(Boolean);
      const rows = (parsed.rows || []).slice(0, 500).map(r => r.values);
      res.json({
        filename: req.file.originalname,
        headers,
        rows,
        totalRows: parsed.summary.rows
      });
    } catch (err) {
      res.status(400).json({ error: safeError(err) });
    } finally {
      await fs.unlink(req.file.path).catch(() => {});
    }
  });

  return router;
}
