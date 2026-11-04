import { fail } from "../lib/sanitize.js";
export function strategyPlan(column, count, properties, mapping) {
  const base = column.hubspotProperty;
  const valid = (name) => {
    const p = properties.get(name);
    return (
      p?.type === "string" &&
      p.fieldType === "file" &&
      !p.modificationMetadata?.readOnlyValue
    );
  };
  if (!valid(base))
    throw fail(
      `Property ${base} is missing, read-only or is not a file property.`,
    );
  let strategy = column.multiFileStrategy;
  const names = Array.from({ length: count }, (_, i) =>
    i ? `${base}_${i + 1}` : base,
  );
  const missing = strategy === "numbered" ? names.filter((n) => !valid(n)) : [];
  if (missing.length) {
    if (mapping.numberedFallback !== "note")
      throw fail(
        `Missing or invalid numbered properties: ${missing.join(", ")}`,
      );
    strategy = "note";
  }
  return {
    strategy,
    names,
    fallback: missing,
    patchFirst: strategy !== "note" || mapping.noteSetFirst,
  };
}
