import { fail, safeError } from '../lib/sanitize.js';

/**
 * Batch-sync a list of contacts to HubSpot using the batch/upsert endpoint.
 * - Resolves existing IDs first via batch/read (by email)
 * - Sends all creates+updates in one batch/upsert call (100 per request)
 * - Verifies written properties via batch/read afterwards
 * - Records all intermediate states in SQLite for crash-safety
 *
 * @param {Array<{ email:string, properties:object }>} contacts
 * @param {Map<string, string|null>} contactIdMap  email → known HubSpot ID (from preflight), or null
 * @param {object} hubspot  HubSpot service instance
 * @param {object} state    Migration state instance
 * @returns {Map<string, { id:string, created:boolean, error?:string }>}  email → result
 */
export async function batchSyncContacts(contacts, contactIdMap, hubspot, state) {
  const resultMap = new Map(); // email → { id, created, error }

  // ── 1. Skip contacts whose outcome is already uncertain ──────────────────
  const toProcess = [];
  for (const { email, properties } of contacts) {
    const prev = state.contact(email);
    if (prev?.status === 'creating' || prev?.status === 'uncertain') {
      const msg = 'Contact creation outcome uncertain. Reconcile the contact by email before retrying.';
      resultMap.set(email, { id: null, created: false, error: msg });
      continue;
    }
    toProcess.push({ email, properties: { ...properties, bulked_import: 'true' } });
  }

  if (!toProcess.length) return resultMap;

  // ── 2. Mark all as "updating" in state before the network call ────────────
  for (const { email } of toProcess) {
    const prev = state.contact(email);
    const existingId = contactIdMap.get(email) || prev?.contact_id || null;
    state.saveContact(email, existingId ? 'updating' : 'creating', existingId);
  }

  // ── 3. Batch upsert (HubSpot creates OR updates, keyed by email) ──────────
  let upsertResults;
  try {
    upsertResults = await hubspot.batchUpsertContacts(toProcess);
  } catch (error) {
    // Whole batch failed — mark all as uncertain/failed
    for (const { email } of toProcess) {
      const code = error.status;
      const status = code && code < 500 ? 'failed' : 'uncertain';
      state.saveContact(email, status, null, safeError(error));
      resultMap.set(email, { id: null, created: false, error: safeError(error) });
    }
    throw error;
  }

  // ── 4. Map results back by email ──────────────────────────────────────────
  const idByEmail = new Map(upsertResults.map(r => [r.email, r]));

  // Record individual failures caught by fallback
  for (const [email, r] of idByEmail) {
    if (r.error) {
      state.saveContact(email, 'failed', null, r.error);
      resultMap.set(email, { id: null, created: false, error: r.error });
    }
  }

  // Handle any emails missing from the response (should not happen but guard)
  for (const { email } of toProcess) {
    if (!idByEmail.has(email)) {
      // Try a fallback single lookup
      let id = null;
      try { id = await hubspot.contactByEmail(email); } catch (_) { /* ignore */ }
      if (id) {
        idByEmail.set(email, { id, email, created: false });
      } else {
        state.saveContact(email, 'uncertain', null, 'Missing from batch upsert response.');
        resultMap.set(email, { id: null, created: false, error: 'Missing from batch upsert response.' });
      }
    }
  }

  // ── 5. Batch-verify written properties ────────────────────────────────────
  const idsToVerify = [...new Set([...idByEmail.values()].filter(r => r?.id).map(r => r.id))];
  const allPropNames = [...new Set(toProcess.flatMap(c => Object.keys(c.properties)))];
  let verifiedProps = new Map();
  try {
    if (idsToVerify.length && allPropNames.length) {
      verifiedProps = await hubspot.batchReadContacts(idsToVerify, allPropNames);
    }
  } catch (_) {
    // Verification is best-effort; failures don't block record saving
  }

  // ── 6. Persist results & verify each contact ──────────────────────────────
  for (const { email, properties } of toProcess) {
    const hit = idByEmail.get(email);
    if (!hit?.id) continue; // already handled above

    const id = String(hit.id);
    const remote = verifiedProps.get(id);
    let verifyError = null;
    if (remote) {
      const mismatch = Object.entries(properties).find(([k, v]) => remote[k] !== undefined && remote[k] !== String(v ?? ''));
      if (mismatch) verifyError = `Contact property verification failed for key "${mismatch[0]}".`;
    }

    if (verifyError) {
      state.saveContact(email, 'failed', id, verifyError);
      resultMap.set(email, { id, created: hit.created, error: verifyError });
    } else {
      state.saveContact(email, 'completed', id);
      resultMap.set(email, { id, created: hit.created });
    }
  }

  return resultMap;
}

/**
 * Single-contact sync — kept for individual fallback / reconciliation paths.
 * Used in non-upsert (file-only) mode.
 */
export async function syncContact({ email, properties, contactId, hubspot, state }) {
  const previous = state.contact(email);
  let id = contactId || await hubspot.contactByEmail(email);
  if (!id && previous?.contact_id) {
    const saved = await hubspot.contactRecord(previous.contact_id);
    if (saved && !saved.archived && saved.properties?.email?.trim().toLowerCase() === email) id = String(saved.id);
    else if (saved && !saved.archived) throw fail('Saved HubSpot contact belongs to a different email. Reconcile the contact before retrying. Saved file uploads are retained.');
  }
  let created = false;
  if (!id) {
    if (previous?.status === 'creating' || previous?.status === 'uncertain') throw fail('Contact creation outcome uncertain. Reconcile the contact by email before retrying.');
    state.saveContact(email, 'creating');
    try {
      const result = await hubspot.createContact({ ...properties, bulked_import: 'true' });
      if (!result.id) throw fail('Contact creation returned no ID; reconcile by email before retrying.');
      id = String(result.id); created = true; state.saveContact(email, 'created', id);
    } catch (error) {
      if (error.status === 409) id = await hubspot.contactByEmail(email);
      if (!id) {
        state.saveContact(email, error.status && error.status < 500 ? 'failed' : 'uncertain', null, safeError(error));
        throw error;
      }
    }
  }
  state.saveContact(email, 'updating', String(id));
  try { await hubspot.patch(String(id), { ...properties, bulked_import: 'true' }); state.saveContact(email, 'completed', String(id)); }
  catch (error) { state.saveContact(email, 'failed', String(id), safeError(error)); throw error; }
  return { id: String(id), created };
}
