import ExcelJS from 'exceljs';
import path from 'node:path';
import { fail } from '../lib/sanitize.js';

export async function readHubspotWorkbook(file, extension = path.extname(file), sheetName) {
  const book = new ExcelJS.Workbook();
  try {
    if (extension === '.csv') await book.csv.readFile(file);
    else if (extension === '.xlsx') await book.xlsx.readFile(file);
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
