/**
 * add-zero-option-to-dropdowns.mjs
 *
 * Fetches all contact enumeration (dropdown / radio / checkbox) properties from
 * the HubSpot portal and adds an option with value = "0" and label = "0" to
 * every property that doesn't already have it.
 *
 * Uses: HubSpot Properties API v2026-09
 * Auth: HUBSPOT_PRIVATE_APP_TOKEN from .env
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Load .env ────────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '..', '.env');
const envText = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envText.split('\n')
    .filter(line => line.trim() && !line.trim().startsWith('#'))
    .map(line => { const eq = line.indexOf('='); return [line.slice(0, eq).trim(), line.slice(eq + 1).trim()]; })
);

const TOKEN  = env.HUBSPOT_PRIVATE_APP_TOKEN;
const PORTAL = env.HUBSPOT_PORTAL_ID;

if (!TOKEN) { console.error('❌  HUBSPOT_PRIVATE_APP_TOKEN not found in .env'); process.exit(1); }
console.log(`\n🔑  Portal: ${PORTAL || 'unknown'}`);
console.log(`🔑  Token:  ${TOKEN.slice(0, 20)}…\n`);

// ── HubSpot fetch helper ──────────────────────────────────────────────────────
const BASE = 'https://api.hubapi.com';
async function hs(path, opts = {}) {
  const url  = `${BASE}${path}`;
  const res  = await fetch(url, {
    method: opts.method || 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    let msg;
    try { msg = JSON.parse(text)?.message || text; } catch { msg = text; }
    throw Object.assign(new Error(msg), { status: res.status });
  }
  return text ? JSON.parse(text) : null;
}

// ── Fetch all contact properties (paginated) ──────────────────────────────────
async function fetchAllContactProperties() {
  const props = [];
  let after   = undefined;
  do {
    const qs  = after ? `?after=${encodeURIComponent(after)}` : '';
    const res = await hs(`/crm/properties/2026-09/contacts${qs}`);
    for (const p of (res.results || [])) props.push(p);
    after = res.paging?.next?.after;
  } while (after);
  return props;
}

// ── Main ─────────────────────────────────────────────────────────────────────
const FIELD_TYPES = new Set(['select', 'radio', 'checkbox', 'booleancheckbox']);
const NEW_OPTION  = { label: '0', value: '0', displayOrder: -1, hidden: false };

console.log('📥  Fetching all Contact properties…');
const allProps = await fetchAllContactProperties();

// Keep only enumeration field types that accept options
const dropdowns = allProps.filter(p =>
  p.type === 'enumeration' && FIELD_TYPES.has(p.fieldType) && !p.calculated && !p.externalOptions
);

console.log(`✅  Found ${allProps.length} total properties, ${dropdowns.length} dropdown / radio / checkbox.\n`);

let skipped = 0, updated = 0, failed  = 0;
const failures = [];

for (const prop of dropdowns) {
  const existingValues = new Set((prop.options || []).map(o => String(o.value)));
  if (existingValues.has('0')) {
    skipped++;
    process.stdout.write(`  ⏭  Skipping "${prop.name}" — already has value=0\n`);
    continue;
  }

  // Build updated options list (append new option)
  const updatedOptions = [
    ...(prop.options || []).map(o => ({
      label:        o.label,
      value:        o.value,
      displayOrder: o.displayOrder,
      hidden:       o.hidden ?? false,
    })),
    NEW_OPTION,
  ];

  try {
    await hs(`/crm/properties/2026-09/contacts/${encodeURIComponent(prop.name)}`, {
      method: 'PATCH',
      body: { options: updatedOptions },
    });
    updated++;
    process.stdout.write(`  ✅  Updated "${prop.name}" (${prop.label}) — added option 0\n`);
  } catch (err) {
    failed++;
    const msg = err.message || String(err);
    failures.push({ name: prop.name, label: prop.label, error: msg });
    process.stdout.write(`  ❌  Failed  "${prop.name}" — ${msg}\n`);
  }

  // Rate limit: ~8 requests/sec to stay under HubSpot's 10/sec private app limit
  await new Promise(r => setTimeout(r, 130));
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n────────────────────────────────────────────────');
console.log(`📊  Summary`);
console.log(`    Dropdown properties found : ${dropdowns.length}`);
console.log(`    ✅  Updated               : ${updated}`);
console.log(`    ⏭  Skipped (already has 0): ${skipped}`);
console.log(`    ❌  Failed                : ${failed}`);

if (failures.length) {
  console.log('\n⚠️  Failures:');
  for (const f of failures) console.log(`  • ${f.name} (${f.label}): ${f.error}`);
}
console.log('\n✅  Done.\n');
