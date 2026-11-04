import { parseArgs } from 'node:util';
import path from 'node:path';
import { runtime } from './services/runtime.js';
import { readMapping } from './config.js';
import { safeError } from './lib/sanitize.js';
let rt;
try {
  const { values } = parseArgs({ options: { 'dry-run': { type: 'boolean' }, 'run-for-real': { type: 'boolean' }, 'retry-failed': { type: 'boolean' }, preflight: { type: 'boolean' }, file: { type: 'string' } } });
  if (values['dry-run'] && values['run-for-real']) throw new Error('Conflicting run flags');
  rt = runtime(); rt.migration.on('activity', entry => console.log(`[${entry.timestamp}] ${entry.level.toUpperCase()} ${entry.message}`));
  const file = values.file ? path.resolve(values.file) : rt.file;
  if (!file) throw new Error('No input file specified. Provide --file <path_to_csv_or_xlsx>.');
  const result = values.preflight ? await rt.migration.preflight(file, readMapping()) : await rt.migration.run(file, readMapping(), { dryRun: !values['run-for-real'], retryFailed: Boolean(values['retry-failed']) });
  console.log(JSON.stringify(result, null, 2)); if (result.summary?.failed || result.summary?.contactResults?.failed) process.exitCode = 1;
} catch (error) { console.error(safeError(error)); process.exitCode = 1; }
finally { rt?.state.close(); }
