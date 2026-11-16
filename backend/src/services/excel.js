import ExcelJS from "exceljs";
import JSZip from "jszip";
import fs from "node:fs/promises";
import { fail } from "../lib/sanitize.js";
export function parseUrls(cell) {
  if (!String(cell || "").trim()) return [];
  return String(cell)
    .trim()
    .split(/,\s*(?=https?:\/\/)/i)
    .map((raw) => {
      let url;
      try {
        url = new URL(raw.trim());
      } catch {
        throw fail("Invalid file URL in workbook.");
      }
      if (
        url.protocol !== "https:" ||
        !url.hostname.endsWith(".monday.com") ||
        url.username ||
        url.password ||
        url.port
      )
        throw fail("Source URL must use HTTPS on a monday.com subdomain.");
      const assetId = url.pathname.match(/\/resources\/(\d+)\//)?.[1];
      if (!assetId)
        throw fail("Source URL has no /resources/{assetId}/ segment.");
      let filename;
      try {
        const rawName = url.pathname.split("/").pop() || "file";
        filename = decodeURIComponent(
          rawName.replace(/%(?![0-9a-fA-F]{2})/g, "%25"),
        );
      } catch {
        filename = url.pathname.split("/").pop() || "file";
      }
      return { url: url.href, assetId, filename };
    });
}
function text(cell) {
  const v = cell.value;
  return (
    v?.hyperlink ||
    (v?.richText ? v.richText.map((t) => t.text).join("") : cell.text)
  );
}
export function parseFileCell(cell) {
  const value = cell.value;
  const displayed = String(
    value?.richText
      ? value.richText.map((t) => t.text).join("")
      : (value?.text ?? cell.text ?? ""),
  ).trim();
  // Excel stores one clickable target even when the displayed cell contains a
  // comma-separated list of many file URLs. The complete displayed list wins.
  return parseUrls(
    /^https?:\/\//i.test(displayed) ? displayed : value?.hyperlink || displayed,
  );
}
export async function readExcel(file, mapping) {
  const book = new ExcelJS.Workbook();
  let loaded = false;

  // 1. Sniff magic bytes: ZIP archive (PK\x03\x04) = XLSX, otherwise plain text = CSV
  let isZip = false;
  try {
    const headerBuf = Buffer.alloc(4);
    const fd = await fs.open(file, "r");
    await fd.read(headerBuf, 0, 4, 0);
    await fd.close();
    isZip = headerBuf[0] === 0x50 && headerBuf[1] === 0x4B && headerBuf[2] === 0x03 && headerBuf[3] === 0x04;
  } catch {
    isZip = !file.toLowerCase().endsWith(".csv");
  }

  // 2. Load based on detected format (with XML namespace auto-healing for Monday.com OpenXML exports)
  if (isZip) {
    try {
      await book.xlsx.readFile(file);
      loaded = true;
    } catch (xlsxErr) {
      try {
        const raw = await fs.readFile(file);
        const zip = await JSZip.loadAsync(raw);
        let modified = false;
        for (const filename of Object.keys(zip.files)) {
          if (filename.endsWith(".xml")) {
            let content = await zip.file(filename).async("string");
            if (content.includes("<x:") || content.includes("xmlns:x=")) {
              content = content
                .replace(/<\/?x:/g, (m) => (m.startsWith("</") ? "</" : "<"))
                .replace(/xmlns:x=/g, "xmlns=");
              zip.file(filename, content);
              modified = true;
            }
          }
        }
        if (modified) {
          const fixedBuffer = await zip.generateAsync({ type: "nodebuffer" });
          await book.xlsx.load(fixedBuffer);
          loaded = true;
        }
      } catch (healErr) {}
    }
  }

  // 3. If not ZIP or XLSX failed, try CSV (with auto delimiter detection: comma, semicolon, tab)
  if (!loaded) {
    try {
      let delimiter = ",";
      try {
        const snippetBuf = Buffer.alloc(2048);
        const fd = await fs.open(file, "r");
        const { bytesRead } = await fd.read(snippetBuf, 0, 2048, 0);
        await fd.close();
        const snippet = snippetBuf.subarray(0, bytesRead).toString("utf8").split(/\r?\n/)[0] || "";
        const commas = (snippet.match(/,/g) || []).length;
        const semis = (snippet.match(/;/g) || []).length;
        const tabs = (snippet.match(/\t/g) || []).length;
        if (semis > commas && semis > tabs) delimiter = ";";
        else if (tabs > commas && tabs > semis) delimiter = "\t";
      } catch {}

      await book.csv.readFile(file, { parserOptions: { delimiter } });
      loaded = true;
    } catch (csvErr) {
      if (!isZip) {
        try {
          await book.xlsx.readFile(file);
          loaded = true;
        } catch {}
      }
    }
  }

  if (!loaded) {
    console.error("[internal] Workbook read failed for:", file);
    throw fail(
      "Could not read the file. Make sure the file is a valid .xlsx or .csv file, is not open in Excel, and was not corrupted during upload. Close Excel, save the file, and try again.",
    );
  }
  const availableSheets = book.worksheets.map((w) => w.name);
  const sheet =
    (mapping?.sheet && book.getWorksheet(mapping.sheet)) ||
    (mapping?.sheet &&
      book.worksheets.find(
        (w) => w.name.toLowerCase() === mapping.sheet.toLowerCase(),
      )) ||
    book.worksheets[0];
  if (!sheet) throw fail(`Required worksheet is missing: ${mapping?.sheet || 'first worksheet'}`);

  const targetEmail = (mapping.emailColumn || "Email").trim().toLowerCase();
  const targetName = (mapping.nameColumn || "Name").trim().toLowerCase();

  // Dynamically detect header row within the first 30 rows
  let headerRowIndex = 1;
  for (let r = 1; r <= Math.min(30, sheet.rowCount); r++) {
    const row = sheet.getRow(r);
    let hasEmail = false,
      hasName = false;
    row.eachCell((cell) => {
      const val = String(cell.value ?? cell.text ?? "")
        .trim()
        .toLowerCase();
      if (val === targetEmail || val === "email") hasEmail = true;
      if (val === targetName || val === "name") hasName = true;
    });
    if (hasEmail && hasName) {
      headerRowIndex = r;
      break;
    }
  }

  const columns = [];
  sheet
    .getRow(headerRowIndex)
    .eachCell({ includeEmpty: true }, (cell, index) => {
      columns[index - 1] = String(cell.value ?? cell.text ?? "").trim();
    });

  const norm = (n) =>
    String(n || "")
      .toLowerCase()
      .replace(/[\s_\/-]/g, "");
  const findColIndex = (name) => {
    if (!name) return -1;
    const exact = columns.indexOf(name);
    if (exact !== -1) return exact;
    const lower = columns.findIndex(
      (c) => c.toLowerCase() === name.toLowerCase(),
    );
    if (lower !== -1) return lower;
    return columns.findIndex((c) => norm(c) === norm(name));
  };

  for (const name of [
    mapping.emailColumn,
    mapping.nameColumn,
    ...mapping.columns.map((c) => c.excel),
  ]) {
    if (findColIndex(name) === -1)
      throw fail(`Missing or duplicate workbook column: ${name}`);
  }
  for (const item of mapping.propertyMappings || []) {
    if (item.hubspotProperty && findColIndex(item.excel) === -1)
      throw fail(`Missing workbook column: ${item.excel}`);
  }

  const emailColIndex = findColIndex(mapping.emailColumn);
  const nameColIndex = findColIndex(mapping.nameColumn);
  const groups = new Map(),
    issues = [],
    contacts = new Map();

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowIndex) return;

    // Skip repeated header rows (e.g. from Monday board section exports)
    const checkEmail = String(row.getCell(emailColIndex + 1).value ?? "")
      .trim()
      .toLowerCase();
    const checkName = String(row.getCell(nameColIndex + 1).value ?? "")
      .trim()
      .toLowerCase();
    if (checkEmail === targetEmail && checkName === targetName) return;

    // Skip Monday group section header rows and summary/empty rows without email
    if (!checkEmail) {
      let filledCount = 0;
      row.eachCell((c) => {
        if (String(c.value ?? "").trim()) filledCount++;
      });
      if (filledCount <= 2) return;
    }

    const get = (name) => {
      const idx = findColIndex(name);
      return idx !== -1 ? text(row.getCell(idx + 1)) : "";
    };

    const email = String(get(mapping.emailColumn) || "")
      .trim()
      .toLowerCase();
    if (mapping.contactMode === "upsert") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        issues.push({
          row: rowNumber,
          column: mapping.emailColumn,
          error:
            "Missing or invalid email; cannot create a contact without its match key.",
        });
        return;
      }
      const values = {};
      for (const name of columns) {
        const idx = findColIndex(name);
        const cell = row.getCell(idx + 1);
        values[name] =
          cell.value instanceof Date
            ? cell.value.toISOString()
            : String(get(name) || "").trim();
      }
      const prior = contacts.get(email);
      if (prior) {
        for (const item of mapping.propertyMappings || []) {
          const excelKey = columns[findColIndex(item.excel)] || item.excel;
          if (
            item.hubspotProperty &&
            prior.values[excelKey] &&
            values[excelKey] &&
            prior.values[excelKey] !== values[excelKey]
          ) {
            issues.push({
              row: rowNumber,
              column: item.excel,
              error: "Conflicting values for duplicate email rows.",
            });
          } else if (!prior.values[excelKey]) {
            prior.values[excelKey] = values[excelKey];
          }
        }
      } else {
        contacts.set(email, { email, rowNumber, values });
      }
    }

    for (const column of mapping.columns) {
      const value = get(column.excel);
      if (!String(value || "").trim()) continue;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        issues.push({
          row: rowNumber,
          column: column.excel,
          error: "Invalid or missing email",
        });
        continue;
      }
      try {
        const key = JSON.stringify([email, column.excel]);
        const group = groups.get(key) || {
          email,
          name: get(mapping.nameColumn),
          column,
          files: [],
        };
        const idx = findColIndex(column.excel);
        const cell = row.getCell(idx + 1);
        for (const fileItem of parseFileCell(cell)) {
          if (!group.files.some((f) => f.assetId === fileItem.assetId))
            group.files.push(fileItem);
        }
        groups.set(key, group);
      } catch (error) {
        issues.push({
          row: rowNumber,
          column: column.excel,
          error: error.safeMessage || "Invalid file cell",
        });
      }
    }
  });

  return {
    sheetName: sheet.name,
    availableSheets,
    columns,
    rows: Math.max(0, sheet.rowCount - headerRowIndex),
    groups: [...groups.values()],
    contacts: [...contacts.values()],
    issues,
  };
}
