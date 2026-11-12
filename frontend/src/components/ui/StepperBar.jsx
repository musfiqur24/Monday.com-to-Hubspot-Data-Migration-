import React from 'react';

/**
 * Horizontal stepper bar shown atop HubSpot module pages.
 * steps: array of string labels
 * current: 0-based active index
 * onSelect: (index) => void
 * canAdvance: bool — whether clicking ahead is allowed
 */
export function StepperBar({ steps, current, onSelect, canAdvance = false }) {
  const pct = ((current) / (steps.length - 1)) * 100;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-slate-400 font-semibold tracking-wide">Step {current + 1} of {steps.length}</span>
        <span className="text-[11px] text-slate-400">{Math.round(pct)}%</span>
      </div>
      {/* progress rail */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-[#ff7a59] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* step labels */}
      <div className="flex items-start">
        {steps.map((label, idx) => {
          const done = idx < current;
          const active = idx === current;
          const clickable = done || (canAdvance && idx <= current + 1);
          return (
            <React.Fragment key={idx}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onSelect(idx)}
                className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 border-0 bg-transparent p-0 transition
                  ${clickable ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition
                  ${done ? 'bg-[#ff7a59] text-white' : active ? 'border-2 border-[#ff7a59] text-[#ff7a59] bg-white' : 'border-2 border-slate-200 text-slate-400 bg-white'}
                `}>
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : idx + 1}
                </span>
                <span className={`text-[11px] font-medium text-center leading-tight truncate max-w-full px-1
                  ${active ? 'text-[#df6d50] font-semibold' : done ? 'text-slate-600' : 'text-slate-400'}
                `}>{label}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-px bg-slate-200 mt-3.5 max-w-[40px]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

