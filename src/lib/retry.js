export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export function retryDelay(attempt, retryAfter, now = Date.now(), random = Math.random) {
  const seconds = Number(retryAfter);
  const header = retryAfter == null ? 0 : Number.isFinite(seconds) ? seconds * 1000 : Math.max(0, Date.parse(retryAfter) - now) || 0;
  return Math.max(header, Math.min(30000, 500 * 2 ** attempt) + random() * 250);
}
export function isRetryable(error) {
  if (error?.retryable) return true;
  if (error?.status === 429 || (error?.status >= 500 && error?.status <= 599)) return true;
  const code = error?.cause?.code || error?.code;
  if ([
    'ECONNRESET',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'EPIPE',
    'EAI_AGAIN',
    'ENOTFOUND',
    'UND_ERR_SOCKET',
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_HEADERS_TIMEOUT',
    'UND_ERR_BODY_TIMEOUT',
    'UND_ERR_INFO'
  ].includes(code)) {
    return true;
  }
  if (['TimeoutError', 'AbortError'].includes(error?.name)) return true;
  if (error instanceof TypeError && error.message === 'fetch failed') return true;
  return false;
}
export async function retry(fn, { attempts = 5, wait = sleep, onThrottle = () => {} } = {}) {
  for (let i = 0; ; i++) {
    try { return await fn(); } catch (error) {
      if (!isRetryable(error) || i >= attempts - 1) throw error;
      if (error.status === 429) onThrottle();
      await wait(retryDelay(i, error.retryAfter));
    }
  }
}
