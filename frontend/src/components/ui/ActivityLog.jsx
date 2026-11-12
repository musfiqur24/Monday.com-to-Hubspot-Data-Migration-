import React, { useEffect, useRef } from 'react';

export function ActivityLog({ logs = [], emptyText = 'No activity yet.' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <div
      ref={ref}
      className="h-72 overflow-y-auto font-mono text-[11.5px] flex flex-col gap-0.5 pr-1"
      role="log"
      aria-live="polite"
    >
      {logs.length === 0 ? (
        <div className="text-slate-400 italic p-3">{emptyText}</div>
      ) : (
        logs.map((entry, i) => (
          <div
            key={i}
            className={`flex gap-2 py-0.5 items-start border-b border-slate-50 last:border-0
              ${entry.level === 'error' ? 'text-red-600' : entry.level === 'warn' ? 'text-amber-600' : entry.level === 'success' ? 'text-emerald-700' : 'text-slate-600'}
            `}
          >
            <time className="shrink-0 text-slate-400 tabular-nums">
              {new Date(entry.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </time>
            <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 bg-current opacity-60" />
            <span className="break-words">{entry.message}</span>
          </div>
        ))
      )}
    </div>
  );
}

