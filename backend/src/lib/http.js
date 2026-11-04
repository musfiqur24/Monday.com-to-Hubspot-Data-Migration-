import { fail } from './sanitize.js';
import { retry } from './retry.js';
export async function jsonRequest(url, { limiter, onThrottle, attempts = 5, timeout = 60000, signal, ...options } = {}) {
  return retry(async () => {
    await limiter?.take();
    let response;
    try {
      const reqSignal = signal || AbortSignal.timeout(timeout);
      response = await fetch(url, { ...options, redirect: 'error', signal: reqSignal });
    } catch (networkError) {
      networkError.retryable = true;
      throw networkError;
    }
    if (!response.ok) {
      let errorDetail = '';
      try {
        const bodyText = await response.text();
        try {
          const bodyJson = JSON.parse(bodyText);
          errorDetail = bodyJson.message || bodyJson.error || bodyText.slice(0, 300);
        } catch {
          errorDetail = bodyText.slice(0, 300);
        }
      } catch {
        await response.body?.cancel();
      }
      const service = new URL(url).hostname === 'api.monday.com' ? 'Monday' : 'HubSpot';
      if (errorDetail) console.error(`[internal] ${service} API error (HTTP ${response.status}):`, errorDetail);
      const error = fail(`${service} API request failed (HTTP ${response.status}).${response.status === 401 ? ` Check the ${service === 'Monday' ? 'MONDAY_API_TOKEN' : 'HUBSPOT_PRIVATE_APP_TOKEN'} value in .env and restart the app.` : ''}`);
      Object.assign(error, { status: response.status, retryable: response.status === 429 || response.status >= 500, retryAfter: response.headers.get('retry-after'), errorDetail }); throw error;
    }
    if (response.status === 204) return null;
    return response.json();
  }, { onThrottle, attempts });
}
