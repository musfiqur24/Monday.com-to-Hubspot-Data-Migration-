import ExcelJS from 'exceljs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fail } from '../lib/sanitize.js';

function parseFastCsv(text) {
  // Strip UTF-8 BOM if present
  let start = 0;
  if (text.charCodeAt(0) === 0xFEFF) start = 1;

  const rawRows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const len = text.length;

  for (let i = start; i < len; i++) {
    const code = text.charCodeAt(i);
    if (inQuotes) {
      if (code === 34) { // "
        if (i + 1 < len && text.charCodeAt(i + 1) === 34) {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += text[i];
      }
    } else {
      if (code === 34) {
        inQuotes = true;
      } else if (code === 44) { // ,
        row.push(field);
        field = '';
      } else if (code === 13) { // \r
        if (i + 1 < len && text.charCodeAt(i + 1) === 10) i++;
        row.push(field);
        rawRows.push(row);
        row = [];
        field = '';
      } else if (code === 10) { // \n
        row.push(field);
        rawRows.push(row);
        row = [];
        field = '';
      } else {
        field += text[i];
      }
    }
  }
  if (field || row.length) {
    row.push(field);
    rawRows.push(row);
  }
  return rawRows;
}

export async function readHubspotWorkbook(file, extension = path.extname(file), sheetName) {
  if (extension.toLowerCase() === '.csv') {
    let content;
    try {
      content = await fs.readFile(file, 'utf8');
    } catch {
      throw fail('The CSV file could not be read. Close any programs locking the file.');
    }
    const rawRows = parseFastCsv(content);
    if (!rawRows.length) throw fail('The CSV file is empty.');
    if (rawRows.length > 100001) throw fail('Maximum workbook size is 100,000 rows.');

    const headerRow = rawRows[0];
    const columns = [], seen = new Set();
    for (let c = 0; c < headerRow.length; c++) {
      const name = headerRow[c].trim();
      if (!name || seen.has(name.toLowerCase())) throw fail('The first row needs a unique, non-empty header for every column.');
      seen.add(name.toLowerCase());
      columns.push(name);
    }
    if (!columns.length) throw fail('No column headers found.');
    if (columns.length > 500) throw fail('Maximum column count is 500 columns.');

    const rows = [];
    for (let r = 1; r < rawRows.length; r++) {
      const line = rawRows[r];
      const values = Object.create(null);
      let hasData = false;
      for (let c = 0; c < columns.length; c++) {
        const val = (line[c] !== undefined ? line[c] : '').trim();
        values[columns[c]] = val;
        if (val) hasData = true;
      }
      if (hasData) {
        rows.push({ number: r + 1, values });
      }
    }
    if (!rows.length) throw fail('No data rows found.');
    const summary = {
      sheets: ['Sheet1'],
      sheet: 'Sheet1',
      rows: rows.length,
      columns: columns.map(name => ({
        name,
        samples: rows.slice(0, 3).map(row => (row.values[name] || '').slice(0, 160))
      }))
    };
    return { columns, rows, summary };
  }

  const book = new ExcelJS.Workbook();
  try {
    if (extension === '.xlsx') await book.xlsx.readFile(file);
    else throw new Error();
  } catch { throw fail('The file could not be read. Choose a valid CSV or XLSX workbook.'); }
  const sheet = sheetName ? book.getWorksheet(sheetName) : book.worksheets[0];
  if (!sheet) throw fail('Select a worksheet in this workbook.');
  if (sheet.rowCount > 100001 || sheet.columnCount > 500) throw fail('Maximum workbook size is 100,000 rows and 500 columns.');
  const columns = [], seen = new Set();
  for (let index = 1; index <= sheet.columnCount; index++) {
    const name = sheet.getRow(1).getCell(index).text.trim();
    if (!name || seen.has(name.toLowerCase())) throw fail('The first row needs a unique, non-empty header for every column.');
    seen.add(name.toLowerCase()); columns.push(name);
  }
  if (!columns.length) throw fail('No column headers found.');
  const rows = [];
  sheet.eachRow((row, number) => {
    if (number === 1) return;
    const values = Object.create(null);
    columns.forEach((name,index) => {
      const cell = row.getCell(index + 1);
      values[name] = cell.value instanceof Date ? cell.value.toISOString() : cell.text.trim();
    });
    if (Object.values(values).some(Boolean)) rows.push({number,values});
  });
  if (!rows.length) throw fail('No data rows found.');
  const summary = {sheets:book.worksheets.map(sheet=>sheet.name),sheet:sheet.name,rows:rows.length,
    columns:columns.map(name=>({name,samples:rows.slice(0,3).map(row=>row.values[name].slice(0,160))}))};
  return {columns,rows,summary};
}
