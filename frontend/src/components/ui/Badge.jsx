import React from 'react';

/** Pill/badge variants: neutral | success | warning | error | info */
export function Badge({ children, variant = 'neutral', className = '' }) {
  const colors = {
    neutral: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    brand: 'bg-orange-50 text-orange-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${colors[variant] ?? colors.neutral} ${className}`}>
      {children}
    </span>
  );
}

