import { openAsBlob } from "node:fs";
import { jsonRequest } from "../lib/http.js";
import { TokenBucket } from "../lib/rateLimiter.js";
import { fail, safeError } from "../lib/sanitize.js";

// HubSpot batch limits
const BATCH_UPSERT_MAX = 100; // batch/upsert contacts
const BATCH_READ_MAX = 100; // batch/read contacts
const BATCH_SEARCH_MAX = 100; // search contacts per page
const BATCH_PROP_MAX = 100; // batch/create properties
const BATCH_NOTE_MAX = 100; // batch/create notes

function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export class HubSpot {
  constructor(config, throttle = () => {}) {
    this.config = config;
    this.throttle = throttle;
    // Standard limiter: 10 req/s burst cap
    this.limiter = new TokenBucket(10, 10);
    // Search is limited to 4 req/s in HubSpot
    this.searchLimiter = new TokenBucket(1, 4);
  }

  /* ─── low-level ─────────────────────────────────────────────────────────── */
  async request(
    route,
    { method = "GET", body, attempts, multipart = false, timeout } = {},
  ) {
    return jsonRequest(`https://api.hubapi.com${route}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.config.hubspotToken}`,
        ...(multipart ? {} : { "Content-Type": "application/json" }),
      },
      body: body == null ? undefined : multipart ? body : JSON.stringify(body),
      limiter: this.limiter,
      onThrottle: this.throttle,
      attempts,
      timeout,
    });
  }

  /* ─── diagnostics ────────────────────────────────────────────────────────── */
  async check() {
    return this.request("/crm/v3/objects/contacts?limit=1&properties=email");
  }

  /* ─── properties ─────────────────────────────────────────────────────────── */
  async properties() {
    const all = [];
    let after;
    do {
      const url =
        "/crm/v3/properties/contacts" + (after ? `?after=${encodeURIComponent(after)}` : "");
      const res = await this.request(url);
      all.push(...(res.results || []));
      after = res.paging?.next?.after;
    } while (after);
    return all;
  }
  async property(name) {
    try {
      return await this.request(
        `/crm/v3/properties/contacts/${encodeURIComponent(name)}`,
      );
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  /**
   * Batch-create up to 100 properties per call.
   * Reconciles 409s (property already exists with same type/fieldType) so
   * duplicate-safe on retry.
   * @param {Array} propertyDefs - array of property definition objects
   * @returns {Array} created/reconciled property objects
   */
  async batchCreateProperties(propertyDefs) {
    const results = [];
    for (const slice of chunks(propertyDefs, BATCH_PROP_MAX)) {
      let res;
      try {
        res = await this.request("/crm/v3/properties/contacts/batch/create", {
          method: "POST",
          attempts: 1,
          body: { inputs: slice },
        });
        results.push(...(res.results || []));
      } catch (error) {
        // If any definition already exists fall back to individual creates so
        // we can reconcile each one independently.
        if (error.status === 207 || error.status === 409) {
          for (const def of slice) results.push(await this.createProperty(def));
        } else {
          throw error;
        }
      }
    }
    return results;
  }

  /** Single property create with lost-response reconciliation (kept for fallback). */
  async createProperty(property) {
    try {
      return await this.request("/crm/v3/properties/contacts", {
        method: "POST",
        attempts: 1,
        body: property,
      });
    } catch (error) {
      const existing = await this.property(property.name);
      if (
        existing &&
        existing.type === property.type &&
        existing.fieldType === property.fieldType
      )
        return existing;
      throw error;
    }
  }

  /* ─── contacts – single (kept for reconciliation / fallback paths) ──────── */
  /** Search a single contact by email. Returns HubSpot ID string or null. */
  async contact(email) {
    await this.searchLimiter.take();
    const result = await this.request("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: {
        filterGroups: [
          {
            filters: [{ propertyName: "email", operator: "EQ", value: email }],
          },
        ],
        properties: ["email"],
        limit: 2,
      },
    });
    if (result.total > 1)
      throw fail("More than one HubSpot contact matches this email.");
    return result.results[0]?.id || null;
  }

  async contactByEmail(email) {
    try {
      return (
        await this.request(
          `/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email&properties=email`,
        )
      ).id;
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async contactRecord(id, archived = false) {
    try {
      return await this.request(
        `/crm/v3/objects/contacts/${encodeURIComponent(id)}?properties=email${archived ? "&archived=true" : ""}`,
      );
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async createContact(properties) {
    return this.request("/crm/v3/objects/contacts", {
      method: "POST",
      attempts: 1,
      body: { properties },
    });
  }

  async patch(contact, properties) {
    await this.request(
      `/crm/v3/objects/contacts/${encodeURIComponent(contact)}`,
      { method: "PATCH", body: { properties } },
    );
    const result = await this.request(
      `/crm/v3/objects/contacts/${encodeURIComponent(contact)}?properties=${encodeURIComponent(Object.keys(properties).join(","))}`,
    );
    if (
      Object.entries(properties).some(
        ([key, value]) => result.properties[key] !== value,
      )
    )
      throw fail("Contact property verification failed.");
  }

  /* ─── contacts – BATCH ───────────────────────────────────────────────────── */

  /**
   * Resolve a list of emails → { email → id|null } using batch/read.
   * Splits into chunks of BATCH_READ_MAX. Emails with no match map to null.
   * @param {string[]} emails
   * @returns {Map<string, string|null>}
   */
  async batchLookupContacts(emails) {
    const map = new Map(emails.map((e) => [e.toLowerCase().trim(), null]));
    for (const slice of chunks([...map.keys()], BATCH_READ_MAX)) {
      try {
        const res = await this.request("/crm/v3/objects/contacts/batch/read", {
          method: "POST",
          body: {
            idProperty: "email",
            inputs: slice.map((e) => ({ id: e })),
            properties: ["email"],
          },
        });
        for (const c of res.results || []) {
          const e = c.properties?.email?.toLowerCase().trim();
          if (e && map.has(e)) map.set(e, String(c.id));
        }
      } catch (error) {
        // 404 means none of the batch existed — that's fine, leave nulls.
        if (error.status !== 404) throw error;
      }
    }
    return map;
  }

  /**
   * Batch upsert contacts (create-or-update) keyed by email.
   * Sends up to 100 per request. Returns array of result objects
   * { id, email, created }.
   * @param {Array<{ email:string, properties:object }>} inputs
   * @returns {Array<{ id:string, email:string, created:boolean }>}
   */
  async batchUpsertContacts(inputs) {
    const results = [];
    for (const slice of chunks(inputs, BATCH_UPSERT_MAX)) {
      try {
        const res = await this.request("/crm/v3/objects/contacts/batch/upsert", {
          method: "POST",
          body: {
            inputs: slice.map(({ email, properties }) => ({
              idProperty: "email",
              id: email,
              properties: { email, ...properties },
            })),
          },
        });
        for (const c of res.results || []) {
          const email = c.properties?.email?.toLowerCase().trim();
          results.push({
            id: String(c.id),
            email,
            created: c.createdAt === c.updatedAt,
          });
        }
      } catch (error) {
        // If a batch fails (e.g. 400 Bad Request due to an invalid property in one row),
        // fallback to individual upserts so 1 invalid row doesn't fail the other 99 contacts!
        if (error.status && error.status < 500 && slice.length > 1) {
          for (const item of slice) {
            try {
              const singleRes = await this.request("/crm/v3/objects/contacts/batch/upsert", {
                method: "POST",
                body: {
                  inputs: [{
                    idProperty: "email",
                    id: item.email,
                    properties: { email: item.email, ...item.properties },
                  }],
                },
              });
              const c = singleRes.results?.[0];
              if (c) {
                const email = c.properties?.email?.toLowerCase().trim();
                results.push({
                  id: String(c.id),
                  email,
                  created: c.createdAt === c.updatedAt,
                });
              }
            } catch (singleErr) {
              results.push({
                id: null,
                email: item.email,
                error: safeError(singleErr),
              });
            }
          }
        } else {
          throw error;
        }
      }
    }
    return results;
  }

  /**
   * Batch update contacts by HubSpot ID.
   * Sends up to 100 per request.
   * @param {Array<{ id: string, properties: object }>} inputs
   * @returns {Array<{ id: string }>}
   */
  async batchUpdateContacts(inputs) {
    const results = [];
    for (const slice of chunks(inputs, BATCH_UPSERT_MAX)) {
      try {
        const res = await this.request("/crm/v3/objects/contacts/batch/update", {
          method: "POST",
          body: {
            inputs: slice.map(({ id, properties }) => ({
              id: String(id),
              properties,
            })),
          },
        });
        for (const c of res.results || []) {
          results.push({ id: String(c.id) });
        }
      } catch (error) {
        // Fallback to individual updates if batch has an invalid ID or single failure
        if (error.status && error.status < 500 && slice.length > 1) {
          for (const item of slice) {
            try {
              const singleRes = await this.request("/crm/v3/objects/contacts/batch/update", {
                method: "POST",
                body: {
                  inputs: [{
                    id: String(item.id),
                    properties: item.properties,
                  }],
                },
              });
              const c = singleRes.results?.[0];
              if (c) results.push({ id: String(c.id) });
            } catch (_) {
              // individual contact update failure is best-effort fallback
            }
          }
        } else {
          throw error;
        }
      }
    }
    return results;
  }

  /**
   * Batch-read contacts by HubSpot ID to verify properties after upsert.
   * @param {string[]} ids
   * @param {string[]} propertyNames
   * @returns {Map<string, object>} id → properties map
   */
  async batchReadContacts(ids, propertyNames) {
    const map = new Map();
    for (const slice of chunks(ids, BATCH_READ_MAX)) {
      const res = await this.request("/crm/v3/objects/contacts/batch/read", {
        method: "POST",
        body: {
          inputs: slice.map((id) => ({ id })),
          properties: propertyNames,
        },
      });
      for (const c of res.results || []) map.set(String(c.id), c.properties);
    }
    return map;
  }

  /* ─── files ──────────────────────────────────────────────────────────────── */
  async upload(file, filename, folderPath, maxAttempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const form = new FormData();
        form.append("file", await openAsBlob(file.path), filename);
        form.append("fileName", filename);
        form.append("folderPath", folderPath);
        form.append(
          "options",
          JSON.stringify({
            access: "PRIVATE",
            overwrite: false,
            duplicationValidationStrategy: "NONE",
            duplicationValidationScope: "EXACT_FOLDER",
          }),
        );
        return await this.request("/files/v3/files", {
          method: "POST",
          body: form,
          multipart: true,
          attempts: 1,
          timeout: this.config.timeout || 600000,
        });
      } catch (error) {
        lastError = error;
        const retryable =
          error?.retryable ||
          error?.status === 429 ||
          (error?.status >= 500 && error?.status <= 599);
        if (!retryable || attempt === maxAttempts) throw error;
        await new Promise((r) => setTimeout(r, attempt * 3000));
      }
    }
    throw lastError;
  }

  async file(id) {
    return this.request(`/files/v3/files/${encodeURIComponent(id)}`);
  }
  async signedFile(id) {
    return this.request(`/files/v3/files/${encodeURIComponent(id)}/signed-url`);
  }

  /* ─── notes ──────────────────────────────────────────────────────────────── */

  /** Create a single note (kept for single-contact fallback). */
  async note(contact, ids, marker) {
    return this.request("/crm/v3/objects/notes", {
      method: "POST",
      attempts: 1,
      body: {
        properties: {
          hs_timestamp: new Date().toISOString(),
          hs_note_body: `Monday migration attachment group ${marker}`,
          hs_attachment_ids: ids.join(";"),
        },
        associations: [
          {
            to: { id: contact },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 202,
              },
            ],
          },
        ],
      },
    });
  }

  /**
   * Batch create notes. Each item: { contactId, ids, marker }.
   * Returns array of { noteId, contactId, marker }.
   * @param {Array<{ contactId:string, ids:string[], marker:string }>} inputs
   */
  async batchCreateNotes(inputs) {
    const results = [];
    for (const slice of chunks(inputs, BATCH_NOTE_MAX)) {
      const res = await this.request("/crm/v3/objects/notes/batch/create", {
        method: "POST",
        attempts: 1,
        body: {
          inputs: slice.map(({ contactId, ids, marker }) => ({
            properties: {
              hs_timestamp: new Date().toISOString(),
              hs_note_body: `Monday migration attachment group ${marker}`,
              hs_attachment_ids: ids.join(";"),
            },
            associations: [
              {
                to: { id: contactId },
                types: [
                  {
                    associationCategory: "HUBSPOT_DEFINED",
                    associationTypeId: 202,
                  },
                ],
              },
            ],
          })),
        },
      });
      for (let i = 0; i < slice.length; i++) {
        const c = (res.results || [])[i];
        if (!c?.id)
          throw fail(
            "Batch note creation: one or more notes returned no ID. Reconcile before retrying.",
          );
        results.push({
          noteId: String(c.id),
          contactId: slice[i].contactId,
          marker: slice[i].marker,
        });
      }
    }
    return results;
  }

  /** Batch read notes to verify attachment IDs and associations. */
  async batchReadNotes(ids) {
    const map = new Map();
    for (const slice of chunks(ids, BATCH_READ_MAX)) {
      const res = await this.request("/crm/v3/objects/notes/batch/read", {
        method: "POST",
        body: {
          inputs: slice.map((id) => ({ id })),
          properties: ["hs_attachment_ids"],
          associations: ["contacts"],
        },
      });
      for (const n of res.results || []) map.set(String(n.id), n);
    }
    return map;
  }

  async verifyNote(id, contact, ids) {
    const note = await this.request(
      `/crm/v3/objects/notes/${encodeURIComponent(id)}?properties=hs_attachment_ids&associations=contacts`,
    );
    if (
      note.properties.hs_attachment_ids !== ids.join(";") ||
      !note.associations?.contacts?.results?.some(
        (r) => String(r.id) === String(contact),
      )
    )
      throw fail("Note attachment or contact association verification failed.");
  }
}
