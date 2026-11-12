import React from 'react';
import { Commet } from 'react-loading-indicators';

/**
 * Full-screen loading overlay with frosted-glass effect.
 * Usage: <LoadingOverlay show={true} title="Validating..." sub="Please wait" />
 */
export function LoadingOverlay({ show, title = 'Processing...', sub = 'Please wait, do not close or refresh this tab.' }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto"
      style={{ background: 'rgba(15, 23, 42, 0.12)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 max-w-sm text-center border border-white/60"
        style={{ background: 'rgba(255, 255, 255, 0.78)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <Commet color="#fab202" size="medium" text="" textColor="" />
        <div>
          <div className="font-semibold text-slate-800 text-[15px] mt-2">{title}</div>
          {sub && <div className="text-slate-500 text-[12.5px] mt-1">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline loader (small Commet inside a button/span area).
 */
export function InlineLoader({ color = '#fab202' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Commet color={color} size="small" text="" textColor="" />
    </span>
  );
}

