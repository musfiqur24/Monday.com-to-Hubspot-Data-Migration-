import { fail, safeError } from '../lib/sanitize.js';

export function normalizeIdentifier(val, maxLen = 50) {
  let s = String(val || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');

  // HubSpot requirement: Property names must contain only lowercase letters, numbers, and underscores.
  // They MUST start with a letter (not a number, not an underscore)!
  if (!s || !/^[a-z]/.test(s)) {
    s = 'p_' + s.replace(/^_+/, '');
  }
  if (maxLen && s.length > maxLen) {
    s = s.slice(0, maxLen).replace(/_+$/, '');
  }
  return s;
}

export function mapHubspotFieldType(rawType) {
  const str = String(rawType || '').toLowerCase().trim();
  if (str.includes('multi-line') || str.includes('multiline') || str.includes('textarea')) {
    return { type: 'string', fieldType: 'textarea' };
  }
  if (str.includes('file')) {
    return { type: 'string', fieldType: 'file' };
  }
  // Check single checkbox / boolean before multi-checkbox
  if (str.includes('single checkbox') || str.includes('boolean') || str.includes('bool') || str.includes('yes/no')) {
    return { type: 'bool', fieldType: 'booleancheckbox' };
  }
  if (str.includes('multiple checkboxes') || str.includes('checkboxes')) {
    return { type: 'enumeration', fieldType: 'checkbox' };
  }
  if (str.includes('dropdown') || str.includes('select') || str.includes('enumeration') || str.includes('radio') || str.includes('association')) {
    return { type: 'enumeration', fieldType: 'select' };
  }
  if (str.includes('date and time') || str.includes('datetime')) {
    return { type: 'datetime', fieldType: 'date' };
  }
  if (str.includes('date')) {
    return { type: 'date', fieldType: 'date' };
  }
  if (str.includes('number') || str.includes('currency') || str.includes('calculation') || str.includes('rollup') || str.includes('score')) {
    return { type: 'number', fieldType: 'number' };
  }
  if (str.includes('single-line') || str.includes('text') || str.includes('phone') || str.includes('email') || str.includes('url')) {
    return { type: 'string', fieldType: 'text' };
  }
  return { type: 'string', fieldType: 'text' };
}

export class HubspotSchema {
  constructor(rt) {
    this.rt = rt;
  }

  requireToken() {
    if (!this.rt.config.hubspotToken) {
      throw fail('Configure HUBSPOT_PRIVATE_APP_TOKEN in .env and restart.');
    }
  }

  async resolveObjectType(type) {
    this.requireToken();
    const obj = await this.rt.hubspot.portal.object(type);
    return obj.objectTypeId;
  }

  // GET /crm/properties/2026-09/{objectType}/groups
  async getGroups(type) {
    this.requireToken();
    const objectTypeId = await this.resolveObjectType(type);
    const res = await this.rt.hubspot.request(`/crm/properties/2026-09/${encodeURIComponent(objectTypeId)}/groups`);
    return (res.results || []).map(g => ({
      name: g.name,
      label: g.label,
      displayOrder: g.displayOrder ?? -1,
      archived: Boolean(g.archived)
    })).sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name));
  }

  // POST /crm/properties/2026-09/{objectType}/groups
  async createGroup(type, { name, label, displayOrder }) {
    this.requireToken();
    const objectTypeId = await this.resolveObjectType(type);
    const cleanName = normalizeIdentifier(name);
    if (!cleanName) throw fail('Group name (internal name) is required.');
    if (!label || !String(label).trim()) throw fail('Group label is required.');

    const body = {
      name: cleanName,
      label: String(label).trim(),
      displayOrder: typeof displayOrder === 'number' ? displayOrder : Number(displayOrder) || -1
    };

    try {
      const res = await this.rt.hubspot.request(
        `/crm/properties/2026-09/${encodeURIComponent(objectTypeId)}/groups`,
        { method: 'POST', body }
      );
      return { status: 'created', group: res };
    } catch (err) {
      if (err.status === 409 || String(err.message || '').includes('already exists') || String(err.details || '').includes('already exists')) {
        return { status: 'already_exists', name: cleanName, label: body.label, message: 'Group already exists.' };
      }
      throw err;
    }
  }

  // Batch create groups
  async createGroupsBatch(type, groups) {
    this.requireToken();
    const objectTypeId = await this.resolveObjectType(type);
    if (!Array.isArray(groups) || !groups.length) {
      throw fail('No groups provided to create.');
    }

    const results = [];
    const seenNames = new Set();

    for (const item of groups) {
      const rawName = item.name || item.groupName || item.group_name || item['HubSpot Groups'] || '';
      const rawLabel = item.label || item.groupLabel || item.group_label || item['HubSpot Groups'] || rawName;
      const cleanName = normalizeIdentifier(rawName);

      if (!cleanName || !rawLabel) {
        results.push({
          name: rawName || 'unnamed',
          label: rawLabel || 'unnamed',
          displayOrder: item.displayOrder ?? -1,
          status: 'failed',
          error: 'Missing internal name or label'
        });
        continue;
      }

      if (seenNames.has(cleanName)) {
        continue; // deduplicate
      }
      seenNames.add(cleanName);

      try {
        const res = await this.createGroup(objectTypeId, {
          name: cleanName,
          label: rawLabel,
          displayOrder: item.displayOrder ?? -1
        });
        results.push({
          name: cleanName,
          label: rawLabel,
          displayOrder: item.displayOrder ?? -1,
          status: res.status,
          error: null
        });
      } catch (err) {
        results.push({
          name: cleanName,
          label: rawLabel,
          displayOrder: item.displayOrder ?? -1,
          status: 'failed',
          error: safeError(err)
        });
      }
    }
    return results;
  }

  // GET /crm/properties/2026-09/{objectType}
  async getProperties(type) {
    this.requireToken();
    const objectTypeId = await this.resolveObjectType(type);
    const res = await this.rt.hubspot.request(`/crm/properties/2026-09/${encodeURIComponent(objectTypeId)}`);
    return (res.results || []).map(p => ({
      name: p.name,
      label: p.label,
      groupName: p.groupName,
      type: p.type,
      fieldType: p.fieldType,
      description: p.description || '',
      options: p.options || []
    })).sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name));
  }

  // POST /crm/properties/2026-09/{objectType}
  async createProperty(type, { groupName, name, label, type: propType, fieldType, description = '', options }) {
    this.requireToken();
    const objectTypeId = await this.resolveObjectType(type);
    const cleanName = normalizeIdentifier(name);
    const cleanGroup = normalizeIdentifier(groupName);

    if (!cleanGroup) throw fail('groupName is required.');
    if (!cleanName) throw fail('name (internal name) is required.');
    if (!label || !String(label).trim()) throw fail('label is required.');

    // Auto-map human friendly field type names (e.g. "Dropdown select", "Single-line text")
    const mapped = mapHubspotFieldType(fieldType || propType);
    const resolvedType = (['string', 'number', 'date', 'datetime', 'enumeration', 'bool'].includes(String(propType || '').toLowerCase()))
      ? String(propType).toLowerCase()
      : mapped.type;
    const resolvedFieldType = (['text', 'textarea', 'number', 'date', 'select', 'checkbox', 'booleancheckbox', 'radio', 'file'].includes(String(fieldType || '').toLowerCase()))
      ? String(fieldType).toLowerCase()
      : mapped.fieldType;

    const body = {
      groupName: cleanGroup,
      name: cleanName,
      label: String(label).trim(),
      type: resolvedType,
      fieldType: resolvedFieldType,
    };

    if (description && String(description).trim()) {
      body.description = String(description).trim();
    }

    // Format options if provided (or default option for enumeration/bool)
    if (resolvedType === 'bool' || resolvedFieldType === 'booleancheckbox') {
      body.type = 'bool';
      body.fieldType = 'booleancheckbox';
      body.options = [
        { label: 'Yes', value: 'true', displayOrder: 0, hidden: false },
        { label: 'No', value: 'false', displayOrder: 1, hidden: false }
      ];
    } else if (options) {
      if (Array.isArray(options)) {
        body.options = options.map((opt, idx) => {
          if (typeof opt === 'object' && opt !== null) {
            return {
              label: String(opt.label || opt.value || `Option ${idx + 1}`),
              value: normalizeIdentifier(opt.value || opt.label || `option_${idx + 1}`),
              displayOrder: opt.displayOrder ?? idx
            };
          }
          return {
            label: String(opt).trim(),
            value: normalizeIdentifier(opt) || `option_${idx + 1}`,
            displayOrder: idx
          };
        });
      } else if (typeof options === 'string' && options.trim()) {
        const parts = options.split(/[;,|]/).map(s => s.trim()).filter(Boolean);
        body.options = parts.map((opt, idx) => ({
          label: opt,
          value: normalizeIdentifier(opt) || `option_${idx + 1}`,
          displayOrder: idx
        }));
      }
    } else if (resolvedType === 'enumeration' || ['select', 'checkbox', 'radio'].includes(resolvedFieldType)) {
      // HubSpot requires at least one option for enumeration properties
      body.options = [
        { label: 'Option 1', value: 'option_1', displayOrder: 0 }
      ];
    }

    try {
      const res = await this.rt.hubspot.request(
        `/crm/properties/2026-09/${encodeURIComponent(objectTypeId)}`,
        { method: 'POST', body }
      );
      return { status: 'created', property: res };
    } catch (err) {
      const errMsg = String(err.message || '') + ' ' + String(err.details || '');
      if (
        err.status === 409 ||
        errMsg.includes('already exists') ||
        errMsg.includes('Property labels must be unique') ||
        errMsg.includes('has the same label as')
      ) {
        return { status: 'already_exists', name: cleanName, label: body.label, groupName: cleanGroup, message: err.message || 'Property or label already exists in HubSpot.' };
      }
      throw err;
    }
  }

  // Batch create properties group-wise
  async createPropertiesBatch(type, properties, { createMissingGroups = true } = {}) {
    this.requireToken();
    const objectTypeId = await this.resolveObjectType(type);
    if (!Array.isArray(properties) || !properties.length) {
      throw fail('No properties provided to create.');
    }

    // Fulfill: "Create the group first, then create the property with that group's name"
    if (createMissingGroups) {
      try {
        const existingGroups = await this.getGroups(objectTypeId);
        const existingGroupNames = new Set(existingGroups.map(g => g.name.toLowerCase()));

        const groupsToEnsure = new Map();
        for (const p of properties) {
          const gName = normalizeIdentifier(p.groupName || p.group_name || p.group || p['HubSpot Groups'] || '');
          const gLabel = p.groupLabel || p.group_label || p['HubSpot Groups'] || p.groupName || gName;
          if (gName && !existingGroupNames.has(gName)) {
            groupsToEnsure.set(gName, gLabel);
          }
        }

        for (const [gName, gLabel] of groupsToEnsure.entries()) {
          try {
            await this.createGroup(objectTypeId, { name: gName, label: gLabel, displayOrder: -1 });
            existingGroupNames.add(gName);
          } catch {
            existingGroupNames.add(gName);
          }
        }
      } catch (err) {
        console.warn('[hubspotSchema] Could not pre-verify groups:', err.message);
      }
    }

    const results = [];
    const seenPropertyNames = new Set();

    // Pre-screen existing properties in HubSpot to avoid redundant API calls and label collision errors
    const existingByName = new Map();
    const existingByLabel = new Map();
    try {
      const existingProps = await this.getProperties(objectTypeId);
      for (const p of existingProps) {
        if (p.name) existingByName.set(p.name.toLowerCase(), p);
        if (p.label) existingByLabel.set(String(p.label).trim().toLowerCase(), p);
      }
    } catch (err) {
      console.warn('[hubspotSchema] Could not pre-fetch existing properties:', err.message);
    }

    for (const item of properties) {
      const rawName = item.name || item.propertyName || item.property_name || item['Field Name'] || '';
      const rawLabel = item.label || item.propertyLabel || item.property_label || item['Field Name'] || rawName;
      const rawGroup = item.groupName || item.group_name || item.group || item['HubSpot Groups'] || '';
      const rawType = item.type || item.propertyType || item['HubSpot Field Type'] || 'string';
      const rawFieldType = item.fieldType || item.field_type || item['HubSpot Field Type'] || 'text';

      const cleanName = normalizeIdentifier(rawName);
      const cleanGroup = normalizeIdentifier(rawGroup);

      if (!cleanName || !cleanGroup || !rawLabel) {
        results.push({
          name: rawName || 'unnamed',
          label: rawLabel || 'unnamed',
          groupName: rawGroup || 'unnamed',
          type: rawType,
          fieldType: rawFieldType,
          status: 'failed',
          error: 'Missing property name, groupName, or label.'
        });
        continue;
      }

      if (seenPropertyNames.has(cleanName)) {
        continue; // duplicate row in CSV
      }
      seenPropertyNames.add(cleanName);

      // Check if property with this internal name already exists in HubSpot
      const matchByName = existingByName.get(cleanName);
      if (matchByName) {
        results.push({
          name: cleanName,
          label: rawLabel,
          groupName: cleanGroup,
          type: matchByName.type || rawType,
          fieldType: matchByName.fieldType || rawFieldType,
          status: 'already_exists',
          error: null,
          detail: `Property already exists in HubSpot (name: ${matchByName.name})`
        });
        continue;
      }

      // Check if property with this exact label already exists in HubSpot (HubSpot enforces unique labels)
      const matchByLabel = existingByLabel.get(String(rawLabel).trim().toLowerCase());
      if (matchByLabel) {
        results.push({
          name: cleanName,
          label: rawLabel,
          groupName: cleanGroup,
          type: matchByLabel.type || rawType,
          fieldType: matchByLabel.fieldType || rawFieldType,
          status: 'already_exists',
          error: null,
          detail: `Label already exists in HubSpot (matches ${matchByLabel.name})`
        });
        continue;
      }

      try {
        const res = await this.createProperty(objectTypeId, {
          groupName: cleanGroup,
          name: cleanName,
          label: rawLabel,
          type: rawType,
          fieldType: rawFieldType,
          description: item.description || '',
          options: item.options
        });
        if (res.status === 'created') {
          existingByName.set(cleanName, { name: cleanName, label: rawLabel });
          existingByLabel.set(String(rawLabel).trim().toLowerCase(), { name: cleanName, label: rawLabel });
        }
        results.push({
          name: cleanName,
          label: rawLabel,
          groupName: cleanGroup,
          type: res.property?.type || rawType,
          fieldType: res.property?.fieldType || rawFieldType,
          status: res.status,
          error: null
        });
      } catch (err) {
        results.push({
          name: cleanName,
          label: rawLabel,
          groupName: cleanGroup,
          type: rawType,
          fieldType: rawFieldType,
          status: 'failed',
          error: safeError(err)
        });
      }
    }

    return results;
  }
}
