import React from 'react';

/** Progress bar; value 0–100 */
export function ProgressBar({ value = 0, className = '' }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-full bg-[#ff7a59] rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

