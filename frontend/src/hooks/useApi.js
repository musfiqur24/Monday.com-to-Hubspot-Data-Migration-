/**
 * useApi — lightweight wrapper around fetch for JSON API calls.
 * Returns a bound `request(url, method, body)` fn.
 */
export async function request(url, method = 'GET', body) {
  const opts = { method, headers: {} };
  if (body instanceof FormData) {
    opts.body = body;
  } else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); msg = j.error || j.message || msg; } catch { /* */ }
    throw new Error(msg);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res;
}

export async function downloadFile(url, fallbackFilename) {
  const res = await fetch(url);
  if (!res.ok) {
    let msg = `Download failed (HTTP ${res.status})`;
    try { const j = await res.json(); msg = j.error || msg; } catch { /* */ }
    throw new Error(msg);
  }
  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match ? match[1] : fallbackFilename;
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(href), 10000);
}

