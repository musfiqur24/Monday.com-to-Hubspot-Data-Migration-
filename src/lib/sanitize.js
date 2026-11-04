export function sanitize(value) {
  let result = String(value).normalize('NFC').replace(/[<>:"/\\|?*\x00-\x1f\x7f]/g, '_').replace(/\s/g, ' ').replace(/^\.+|[. ]+$/g, '').trim().slice(0, 160);
  if (!result || /^(con|prn|aux|nul|com\d|lpt\d)(\.|$)/i.test(result)) result = `_${result || 'file'}`;
  return result;
}
export function safeError(error) {
  // Never expose remote bodies, request headers, signed URLs or local paths.
  if (error?.safeMessage) return error.safeMessage;
  const code = error?.cause?.code || error?.code;
  if (['ETIMEDOUT','UND_ERR_CONNECT_TIMEOUT','UND_ERR_HEADERS_TIMEOUT'].includes(code) || ['TimeoutError','AbortError'].includes(error?.name)) return 'Request timed out. Check connectivity and retry; successful uploads remain saved.';
  if (['ENOTFOUND','EAI_AGAIN'].includes(code)) return 'API hostname could not be resolved. Check your internet connection and DNS, then retry.';
  if (['ECONNRESET','ECONNREFUSED','UND_ERR_SOCKET'].includes(code)) return 'API connection was interrupted or refused. Check connectivity and retry.';
  if (code === 'SQLITE_BUSY') return 'Local migration database is busy. Stop other migration processes and retry.';
  if (code === 'ENOENT') return 'A required local file is missing. Check the workbook selection and restart the app.';
  if (['EACCES','EPERM'].includes(code)) return 'Local file access was denied. Close programs using the workbook or report and check folder permissions.';
  const kind = ['TypeError','RangeError','SyntaxError'].includes(error?.name) ? error.name : 'UnexpectedError';
  return `Operation failed (${kind}). Restart the app and retry preflight. If it repeats, report this code and the preceding activity step.`;
}
export function fail(message) { const error = new Error(message); error.safeMessage = message; return error; }
