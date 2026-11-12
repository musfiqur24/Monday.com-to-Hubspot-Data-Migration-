import { useEffect, useRef, useState } from 'react';

/**
 * useSSE — subscribes to a Server-Sent Events endpoint.
 * @param {string|null} url  — SSE URL, or null to skip
 * @param {function}    onMessage — called with parsed JSON on each message
 * @returns {{ isConnected: boolean }}
 */
export function useSSE(url, onMessage) {
  const [isConnected, setIsConnected] = useState(false);
  const es = useRef(null);
  const onMsgRef = useRef(onMessage);
  useEffect(() => { onMsgRef.current = onMessage; }, [onMessage]);

  useEffect(() => {
    if (!url) return;
    function connect() {
      const source = new EventSource(url);
      es.current = source;
      source.onopen = () => setIsConnected(true);
      source.onerror = () => setIsConnected(false);
      source.onmessage = (e) => {
        try { onMsgRef.current(JSON.parse(e.data)); } catch { /* */ }
      };
    }
    connect();
    return () => { es.current?.close(); };
  }, [url]);

  return { isConnected };
}

