import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
export const root = process.cwd();
export const mappingSchema = z
  .object({
    emailColumn: z.string().min(1),
    nameColumn: z.string().min(1),
    sheet: z.string().min(1).default("Combined"),
    contactMode: z.enum(["existing_only", "upsert"]).default("existing_only"),
    propertyMappings: z
      .array(
        z.object({
          excel: z.string().min(1),
          hubspotProperty: z
            .string()
            .regex(/^[a-z][a-z0-9_]*$/)
            .or(z.literal("")),
          createIfMissing: z.boolean().default(false),
          type: z.enum(["string", "number", "date", "bool"]).default("string"),
          fieldType: z
            .enum(["text", "textarea", "number", "date", "booleancheckbox"])
            .default("textarea"),
          label: z.string().optional(),
          valueMap: z.record(z.string()).default({}),
        }),
      )
      .default([]),
    noteSetFirst: z.boolean().default(true),
    numberedFallback: z.enum(["note", "fail"]).default("note"),
    columns: z
      .array(
        z.object({
          excel: z.string().min(1),
          hubspotProperty: z.string().regex(/^[a-z][a-z0-9_]*$/),
          multiFileStrategy: z.enum([
            "same_property",
            "numbered",
            "note",
            "first_only",
          ]),
        }),
      )
      .min(1),
  })
  .superRefine((v, ctx) => {
    if (new Set(v.columns.map((c) => c.excel)).size !== v.columns.length)
      ctx.addIssue({ code: "custom", message: "Duplicate Excel file columns" });
    const targets = [
      ...v.columns,
      ...v.propertyMappings.filter((p) => p.hubspotProperty),
    ].map((c) => c.hubspotProperty);
    if (new Set(targets).size !== targets.length)
      ctx.addIssue({ code: "custom", message: "Duplicate properties" });
    if (
      v.propertyMappings.some(
        (p) =>
          p.hubspotProperty &&
          (p.excel === v.emailColumn ||
            p.hubspotProperty === "email" ||
            v.columns.some((c) => c.excel === p.excel)),
      )
    )
      ctx.addIssue({
        code: "custom",
        message: "Email and file columns have dedicated mappings",
      });
  });
const positive = (name, fallback, max) =>
  z.coerce
    .number()
    .int()
    .positive()
    .max(max)
    .parse(process.env[name] || fallback);
export function settings() {
  return {
    mondayToken: process.env.MONDAY_API_TOKEN,
    mondayVersion: process.env.MONDAY_API_VERSION || "2026-07",
    hubspotToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN,
    hubspotPortalId: process.env.HUBSPOT_PORTAL_ID?.trim(),
    baseFolder: process.env.HUBSPOT_BASE_FOLDER || "/Monday Migration",
    port: positive("PORT", 3000, 65535),
    concurrency: positive("CONCURRENCY", 3, 20),
    maxBytes: positive("MAX_FILE_MB", 50, 500) * 1024 ** 2,
    timeout: positive("DOWNLOAD_TIMEOUT_MS", 120000, 3600000),
  };
}
export function readMapping() {
  return mappingSchema.parse(
    JSON.parse(fs.readFileSync(path.join(root, "config/mapping.json"), "utf8")),
  );
}
export function writeMapping(value) {
  const mapping = mappingSchema.parse(value);
  fs.writeFileSync(
    path.join(root, "config/mapping.json.tmp"),
    JSON.stringify(mapping, null, 2),
  );
  fs.renameSync(
    path.join(root, "config/mapping.json.tmp"),
    path.join(root, "config/mapping.json"),
  );
  return mapping;
}
export function prepareDirectories() {
  for (const dir of ["data", "tmp", "state", "reports"])
    fs.mkdirSync(path.join(root, dir), { recursive: true, mode: 0o700 });
}
