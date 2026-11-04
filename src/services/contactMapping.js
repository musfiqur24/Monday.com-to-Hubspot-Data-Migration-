import path from "node:path";
import { fail } from "../lib/sanitize.js";
export const normalize = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
export function writable(property) {
  return (
    property &&
    !property.archived &&
    !property.modificationMetadata?.readOnlyValue &&
    !property.calculated &&
    !property.externalOptions
  );
}
export function suggestMappings(columns, properties, mapping) {
  const used = new Set(mapping.columns.map((c) => c.hubspotProperty));
  const stem = (s) => String(s || "").replace(/s$/, "");
  const existing = new Map(
    (mapping.propertyMappings || []).map((p) => [normalize(p.excel), p]),
  );
  const existingStemmed = new Map(
    (mapping.propertyMappings || []).map((p) => [
      stem(normalize(p.excel)),
      p,
    ]),
  );
  return columns
    .filter(
      (excel) =>
        excel !== mapping.emailColumn &&
        !mapping.columns.some((c) => normalize(c.excel) === normalize(excel)),
    )
    .map((excel) => {
      const normExcel = normalize(excel);
      const matchedExisting =
        existing.get(normExcel) || existingStemmed.get(stem(normExcel));
      if (matchedExisting) {
        used.add(matchedExisting.hubspotProperty);
        return { ...matchedExisting, excel };
      }
      const matches = properties.filter((p) => {
        if (!writable(p) || p.fieldType === "file" || used.has(p.name))
          return false;
        if (["bulked_import", "import_source_file", "migration_batch", "migration"].includes(p.name))
          return false;
        const normName = normalize(p.name);
        const normLabel = normalize(p.label);
        if (
          normName === normExcel ||
          stem(normName) === stem(normExcel) ||
          (!p.name.startsWith("hs_") &&
            (normLabel === normExcel || stem(normLabel) === stem(normExcel)))
        ) {
          return true;
        }
        const aliases = PROPERTY_ALIASES[p.name] || [];
        if (
          aliases.some(
            (a) =>
              normalize(a) === normExcel || stem(normalize(a)) === stem(normExcel),
          )
        )
          return true;
        return false;
      });
      const target = matches.length === 1 ? matches[0] : null;
      if (target) used.add(target.name);
      return {
        excel,
        hubspotProperty: target?.name || "",
        createIfMissing: false,
        type: "string",
        fieldType: "textarea",
        label: excel,
      };
    });
}
export function validationMessage(issues) {
  const groups = new Map();
  for (const issue of issues) {
    const key = `${issue.column}: ${issue.error}`;
    groups.set(key, (groups.get(key) || 0) + 1);
  }
  return `Preflight found ${issues.length} validation issues. ${[...groups].map(([message, count]) => `${message} (${count} rows)`).join(" | ")}`;
}
const PROPERTY_ALIASES = {
  prescribed_injection_frequency_per_week: [
    "injection_frequency_per_week_recommended",
    "current_injection_frequency_per_week",
  ],
  injection_frequency_per_week_recommended: [
    "prescribed_injection_frequency_per_week",
    "current_injection_frequency_per_week",
  ],
  have_a_referral: ["referral"],
  referral: ["have_a_referral"],
  irn: ["line_number"],
  line_number: ["irn"],
  primary_medication: ["prescribed_medication"],
  prescribed_medication: ["primary_medication"],
  important_profile_notes_: ["important_profile_notes"],
  important_profile_notes: ["important_profile_notes_"],
  current_medical_condition: ["current_medical_conditions"],
  current_medical_conditions: ["current_medical_condition"],
  bulked_import: ["imported_from_monday", "migrated_from_monday"],
};

export function isPlaceholderOrEmpty(val) {
  if (val === null || val === undefined) return true;
  const s = String(val).trim();
  if (!s) return true;
  return /^(not\s*provided|not_provided|not-provided|n\/?a|nil|null|-+|unknown)$/i.test(
    s,
  );
}

export function convertValue(raw, property, valueMap = {}) {
  const original = String(raw ?? "").trim();
  if (!original) return undefined;

  const key = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");
  const translation = Object.entries(valueMap).find(
    ([from]) => key(from) === key(original),
  );

  // If mapped by user, check mapped value; otherwise check original
  if (translation) {
    const mappedVal = translation[1].trim();
    if (!mappedVal || isPlaceholderOrEmpty(mappedVal)) return undefined;
  } else if (isPlaceholderOrEmpty(original)) {
    return undefined; // Any "Not provided", "N/A", "-", etc. becomes null
  }

  const value = translation ? translation[1].trim() : original;
  if (!value) return undefined;

  if (property.type === "string") return value;
  if (property.type === "number") {
    // Clean numbers: remove commas, comparison/bullet symbols, fix double-dot typos like "31..9" -> "31.9"
    let cleaned = value
      .replace(/,/g, "")
      .replace(/[<>=*#]/g, "")
      .replace(/\.\.+/g, ".")
      .trim();
    // If a range is entered like "13.5–21" or "13.5-21", use the first number
    const rangeMatch = cleaned.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*[–—-]/);
    if (rangeMatch) cleaned = rangeMatch[1];
    if (!cleaned) return undefined;
    if (
      !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(cleaned) ||
      !Number.isFinite(Number(cleaned))
    )
      throw fail("Expected a number.");
    return String(Number(cleaned));
  }
  if (property.type === "bool") {
    if (/^(true|yes|1|y)$/i.test(value)) return "true";
    if (/^(false|no|0|n)$/i.test(value)) return "false";
    throw fail("Expected yes/no or true/false.");
  }
  if (property.type === "date" || property.type === "datetime") {
    // Support Excel serial dates (e.g. 27569, 46211), ISO YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD
    let iso = null;
    let cleanVal = String(value || "");
    // Fix common typos where year has a leading zero like 0976 -> 1976 or 0983 -> 1983
    cleanVal = cleanVal.replace(/^0([7-9]\d{2})/, "1$1").replace(/([/-])0([7-9]\d{2})$/, "$11$2");

    if (/^\d{1,6}(?:\.\d+)?$/.test(cleanVal)) {
      const num = Number(cleanVal);
      if (num >= 1 && num <= 100000) {
        const utcDays = Math.floor(num - 25569);
        const ms = utcDays * 86400 * 1000;
        const d = new Date(ms);
        if (Number.isFinite(d.getTime())) iso = d.toISOString();
      }
    }
    if (!iso) {
      if (/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(cleanVal)) {
        const time = Date.parse(cleanVal);
        if (Number.isFinite(time)) iso = new Date(time).toISOString();
      } else if (/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/.test(cleanVal)) {
        const [, d, m, y] = cleanVal.match(
          /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/,
        );
        const isoStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        const time = Date.parse(isoStr);
        if (Number.isFinite(time)) iso = new Date(time).toISOString();
      } else {
        const time = Date.parse(cleanVal);
        if (Number.isFinite(time)) iso = new Date(time).toISOString();
      }
    }
    if (!iso)
      throw fail("Invalid date format. Expected YYYY-MM-DD or DD/MM/YYYY.");

    // Check year range: HubSpot rejects dates outside supported epoch ranges (e.g. < 1900)
    const parsedYear = new Date(iso).getUTCFullYear();
    if (parsedYear < 1900 || parsedYear > 2100) {
      return undefined; // Omit invalid date property to prevent whole contact upsert failure
    }

    return property.type === "date" ? iso.slice(0, 10) : iso;
  }
  if (property.type === "enumeration") {
    const options = (property.options || []).filter((o) => !o.hidden);
    const parts =
      property.fieldType === "checkbox"
        ? value.split(";").map((v) => v.trim())
        : [value];
    return parts
      .map((part) => {
        const exact = options.find((o) => o.value === part);
        const matches = exact
          ? [exact]
          : options.filter((o) => o.label.toLowerCase() === part.toLowerCase());
        if (matches.length === 1) return matches[0].value;
        const valMatch = options.filter(
          (o) => o.value.toLowerCase() === part.toLowerCase(),
        );
        if (valMatch.length === 1) return valMatch[0].value;
        throw fail("Value does not match an available dropdown option.");
      })
      .join(";");
  }
  throw fail("Unsupported property type.");
}
export async function planContactData(workbook, mapping, hubspot, sourceFilename = null) {
  const norm = normalize;
  const stem = (s) => String(s || "").replace(/s$/, "");
  const findCol = (cols, name) =>
    cols.find(
      (c) =>
        c === name ||
        c.toLowerCase() === name.toLowerCase() ||
        norm(c) === norm(name) ||
        stem(norm(c)) === stem(norm(name)),
    );

  const missingReview = workbook.columns.filter(
    (c) =>
      c !== mapping.emailColumn &&
      !mapping.columns.some((f) => findCol([f.excel], c)) &&
      !(mapping.propertyMappings || []).some((p) => findCol([p.excel], c)),
  );
  if (missingReview.length)
    throw fail(
      "Load all contact properties and review the mappings for every Excel column before running contact creation.",
    );
  const properties = await hubspot.properties();
  const byName = new Map(properties.map((p) => [p.name, p]));
  const creates = [],
    issues = [],
    payloads = new Map();
  const resolvedTargets = new Map();

  for (const item of mapping.propertyMappings || []) {
    if (!item.hubspotProperty) continue;
    let property = byName.get(item.hubspotProperty);
    if (!property && PROPERTY_ALIASES[item.hubspotProperty]) {
      for (const alias of PROPERTY_ALIASES[item.hubspotProperty]) {
        if (byName.has(alias)) {
          property = byName.get(alias);
          break;
        }
      }
    }
    if (!property) {
      if (!item.createIfMissing)
        throw fail(
          `Property ${item.hubspotProperty} is missing. Review its creation checkbox and type, or choose an existing property.`,
        );
      const fieldType = {
        string: item.fieldType === "text" ? "text" : "textarea",
        number: "number",
        date: "date",
        bool: "booleancheckbox",
      }[item.type];
      property = {
        name: item.hubspotProperty,
        label: item.label || item.excel,
        type: item.type,
        fieldType,
        groupName: "contactinformation",
      };
      creates.push(property);
      byName.set(property.name, property);
    }
    if (!writable(property) || property.fieldType === "file")
      throw fail(
        `Property ${item.hubspotProperty} is not a writable contact data property.`,
      );
    resolvedTargets.set(item.excel, property);
  }
  if (!byName.has("bulked_import")) {
    const prop = {
      name: "bulked_import",
      label: "Bulked Import",
      type: "bool",
      fieldType: "booleancheckbox",
      groupName: "contactinformation",
    };
    creates.push(prop);
    byName.set(prop.name, prop);
  }
  if (!byName.has("import_source_file")) {
    const prop = {
      name: "import_source_file",
      label: "Import Source File",
      type: "string",
      fieldType: "text",
      groupName: "contactinformation",
    };
    creates.push(prop);
    byName.set(prop.name, prop);
  }
  if (!byName.has("migration_batch")) {
    const prop = {
      name: "migration_batch",
      label: "Migration Batch",
      type: "string",
      fieldType: "text",
      groupName: "contactinformation",
    };
    creates.push(prop);
    byName.set(prop.name, prop);
  }
  const batchName = sourceFilename
    ? path.basename(sourceFilename).replace(/\.[^/.]+$/, "")
    : null;
  for (const row of workbook.contacts) {
    const payload = { email: row.email, bulked_import: "true" };
    if (sourceFilename) payload.import_source_file = sourceFilename;
    if (batchName) payload.migration_batch = batchName;
    for (const item of mapping.propertyMappings || []) {
      if (!item.hubspotProperty) continue;
      const targetProp = resolvedTargets.get(item.excel);
      if (!targetProp) continue;
      const cellKey =
        findCol(Object.keys(row.values), item.excel) || item.excel;
      try {
        const value = convertValue(
          row.values[cellKey],
          targetProp,
          item.valueMap,
        );
        if (value !== undefined) payload[targetProp.name] = value;
      } catch (error) {
        issues.push({
          row: row.rowNumber,
          column: item.excel,
          error: error.safeMessage || "Invalid value",
        });
      }
    }
    payloads.set(row.email, payload);
  }
  return {
    creates,
    issues,
    payloads,
    unmapped: workbook.columns.filter(
      (c) =>
        c !== mapping.emailColumn &&
        !mapping.columns.some((f) => findCol([f.excel], c)) &&
        !(mapping.propertyMappings || []).some(
          (p) => findCol([p.excel], c) && p.hubspotProperty,
        ),
    ),
  };
}
