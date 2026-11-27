/**
 * convert-dropdowns-to-text.mjs
 *
 * For every property in COLUMN_LABELS (matched by label against contact properties),
 * this script:
 *   1. Fetches the property definition (to preserve name, groupName, description)
 *   2. Deletes the property
 *   3. Recreates it as type=string / fieldType=text (single-line text)
 *
 * Run: node scripts/convert-dropdowns-to-text.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Load .env ─────────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(__dir, '..', '.env'), 'utf8');
const env = Object.fromEntries(
  envText.split('\n')
    .filter(l => l.trim() && !l.trim().startsWith('#'))
    .map(l => { const eq = l.indexOf('='); return [l.slice(0, eq).trim(), l.slice(eq + 1).trim()]; })
);
const TOKEN = env.HUBSPOT_PRIVATE_APP_TOKEN;
if (!TOKEN) { console.error('❌  HUBSPOT_PRIVATE_APP_TOKEN not set'); process.exit(1); }
console.log(`\n🔑  Portal: ${env.HUBSPOT_PORTAL_ID || 'unknown'}`);
console.log(`🔑  Token:  ${TOKEN.slice(0, 20)}…\n`);

// ── HubSpot API helper ────────────────────────────────────────────────────────
const BASE = 'https://api.hubapi.com';
async function hs(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || 'GET',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: opts.body != null ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 204) return null;
  const text = await res.text();
  if (!res.ok) {
    let msg; try { msg = JSON.parse(text)?.message || text; } catch { msg = text; }
    throw Object.assign(new Error(msg), { status: res.status });
  }
  return text ? JSON.parse(text) : null;
}

// ── Target column labels (from validation errors) ─────────────────────────────
const COLUMN_LABELS = [
  'Lead Stage',
  'Last Lead Source',
  'Last Medium',
  'Last Content',
  'First Lead Source',
  'TCP Member Status',
  'Referred by Company',
  'Last Campaign',
  'Referred by Contact',
  'First Campaign',
  'First Medium',
  'First Content',
  'MAIN LEAD SOURCE TRACKING',
  'Partner Campaigns',
  'First Term',
  'Last Term',
  'Main Objection',
  'Mailing Country',
  'Lead Time Zone',
  'Do you have experience as an accountant, CPA, bookkeeper, or tax professional?',
  'The main reason I want to offer CFO Advisory services is...',
  'How ready are you to start offering CFO Advisory services?',
  'If our program turns out to be a great fit, are you currently in a position to make a financial investment in yourself (and your skills) to offer a high-value advisory service?',
  'Contact Lifecycle Status',
  'First Referrer',
  'Funding Stage',
  'The Business of Advisory Requested CPE',
  'Advisory Services in 2025 CPE',
  'The 192K Training CPE',
  'Become a CFO Requested CPE?',
  'Featured Training 2 CPE?',
  'Payment Status',
  'Scalable and Sellable Firm CPE?',
  'Membership Drive Jan 2025 CPE',
  'Featured Training CPE?',
  'Earn More in 2025 by Adding CFO Services CPE?',
  'Initial Sales Call Record',
  'Advisory Blueprint Requested CPE?',
  'FAtE Requested CPE?',
  'Lead Temperature',
  'Quality of Lead',
  'Appointment Setter Results',
  'Advisory Services in Your Accounting Business CPE',
  'Partner Lead Stage',
  'Jan 2026 Membership Drive CPE?',
  'The CFO Directory Record',
  'Featured Training 3 CPE?',
  'Last Referrer',
];

// ── Fetch all contact properties (paginated) ──────────────────────────────────
async function fetchAllProps() {
  const all = []; let after;
  do {
    const res = await hs(`/crm/properties/2026-09/contacts${after ? `?after=${encodeURIComponent(after)}` : ''}`);
    all.push(...(res.results || []));
    after = res.paging?.next?.after;
  } while (after);
  return all;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const wait = ms => new Promise(r => setTimeout(r, ms));

console.log('📥  Fetching all contact properties…');
const allProps = await fetchAllProps();
console.log(`✅  Fetched ${allProps.length} properties.\n`);

// Build label → property map (case-insensitive)
const byLabel = new Map(allProps.map(p => [p.label.trim().toLowerCase(), p]));
const byName  = new Map(allProps.map(p => [p.name.trim().toLowerCase(), p]));

let converted = 0, skipped = 0, failed = 0;
const failures = [];
const notFound = [];

for (const colLabel of COLUMN_LABELS) {
  const key = colLabel.trim().toLowerCase();
  const prop = byLabel.get(key) || byName.get(key);

  if (!prop) {
    console.log(`  ⚠️  Not found: "${colLabel}"`);
    notFound.push(colLabel);
    continue;
  }

  // Already a text property — nothing to do
  if (prop.type === 'string' && prop.fieldType === 'text') {
    console.log(`  ⏭  Already text: "${prop.name}" (${prop.label})`);
    skipped++;
    continue;
  }

  console.log(`  🔄  Converting "${prop.name}" (${prop.label}) [${prop.type}/${prop.fieldType}] → string/text…`);

  try {
    // 1. Delete
    await hs(`/crm/properties/2026-09/contacts/${encodeURIComponent(prop.name)}`, { method: 'DELETE' });
    await wait(400); // small pause after delete

    // 2. Recreate as single-line text
    await hs('/crm/properties/2026-09/contacts', {
      method: 'POST',
      body: {
        name:        prop.name,
        label:       prop.label,
        type:        'string',
        fieldType:   'text',
        groupName:   prop.groupName || 'contactinformation',
        description: prop.description || '',
      },
    });

    console.log(`  ✅  Done: "${prop.name}"`);
    converted++;
  } catch (err) {
    const msg = err.message || String(err);
    console.log(`  ❌  Failed "${prop.name}": ${msg}`);
    failures.push({ name: prop.name, label: prop.label, error: msg });
    failed++;
  }

  await wait(300); // rate-limit buffer
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n────────────────────────────────────────────────');
console.log('📊  Summary');
console.log(`    Target properties          : ${COLUMN_LABELS.length}`);
console.log(`    ✅  Converted to text      : ${converted}`);
console.log(`    ⏭  Already text (skipped) : ${skipped}`);
console.log(`    ⚠️   Not found in portal   : ${notFound.length}`);
console.log(`    ❌  Failed                 : ${failed}`);

if (notFound.length) {
  console.log('\n⚠️  Labels not found in portal:');
  for (const l of notFound) console.log(`  • "${l}"`);
}
if (failures.length) {
  console.log('\n❌  Failures:');
  for (const f of failures) console.log(`  • ${f.name} (${f.label}): ${f.error}`);
}
console.log('\n✅  Done.\n');
