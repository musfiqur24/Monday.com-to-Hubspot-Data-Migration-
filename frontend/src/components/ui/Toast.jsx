import React from 'react';

export function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[100000] flex flex-col gap-2.5 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-[13px] font-medium border transition-all
            ${t.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              'bg-white border-slate-200 text-slate-700'}
          `}
        >
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => onRemove(t.id)}
            className="text-slate-400 hover:text-slate-700 leading-none shrink-0 ml-1 border-0 bg-transparent cursor-pointer text-lg"
            aria-label="Dismiss"
          >×</button>
        </div>
      ))}
    </div>
  );
}

