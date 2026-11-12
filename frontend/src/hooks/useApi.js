/**
 * useApi — flexible wrapper around fetch for JSON API calls.
 * Supports both standard options object and positional arguments:
 *   request(url)
 *   request(url, 'POST', data)
 *   request(url, { method: 'DELETE' })
 *   request(url, { method: 'POST', body: JSON.stringify(data) })
 */
export async function request(url, methodOrOptions = 'GET', bodyArg) {
  let opts = { method: 'GET', headers: {} };

  if (typeof methodOrOptions === 'object' && methodOrOptions !== null) {
    // Standard options object
    opts = {
      ...methodOrOptions,
      headers: { ...(methodOrOptions.headers || {}) },
    };
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
  } else {
    // Positional arguments (url, method, body)
    opts.method = typeof methodOrOptions === 'string' ? methodOrOptions.toUpperCase() : 'GET';
    if (bodyArg instanceof FormData) {
      opts.body = bodyArg;
    } else if (bodyArg !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = typeof bodyArg === 'string' ? bodyArg : JSON.stringify(bodyArg);
    }
  }

  const res = await fetch(url, opts);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j.error || j.message || msg;
    } catch { /* ignored */ }
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
    try {
      const j = await res.json();
      msg = j.error || msg;
    } catch { /* ignored */ }
    throw new Error(msg);
  }
  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match ? match[1] : fallbackFilename;
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(href), 10000);
}
