import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Searchable HubSpot property dropdown — renders a floating panel.
 * Props:
 *   value          — current property name (or '')
 *   properties     — array of { name, label, type, fieldType, modificationMetadata, calculated, externalOptions }
 *   onChange       — (name) => void
 *   filterFile     — if true, show only file-eligible properties
 *   disabled       — bool
 *   placeholder    — string
 *   allowCreate    — bool (enable typing a new property name)
 */
export function PropertyPicker({
  value = '',
  properties = [],
  onChange,
  filterFile = false,
  disabled = false,
  placeholder = 'Choose a HubSpot property…',
  allowCreate = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const eligible = properties.filter((p) => {
    if (p.calculated || p.modificationMetadata?.readOnlyValue || p.externalOptions) return false;
    if (filterFile) return true;
    return p.fieldType !== 'file';
  });

  const q = search.trim().toLowerCase();
  const matches = q
    ? eligible.filter((p) => (p.name && p.name.toLowerCase().includes(q)) || (p.label && p.label.toLowerCase().includes(q)))
    : eligible;

  const sorted = [...matches].sort((a, b) => {
    if (a.name === value) return -1;
    if (b.name === value) return 1;
    return (a.label || a.name).localeCompare(b.label || b.name);
  });

  const selectedProp = eligible.find((p) => p.name === value);

  const close = useCallback(() => {
    setOpen(false);
    setSearch('');
  }, []);

  const select = useCallback((name) => {
    onChange(name);
    close();
  }, [onChange, close]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target) && !triggerRef.current?.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
  }, [open]);

  // Keyboard close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open) close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  const customName = allowCreate && q && !eligible.some((p) => p.name === q)
    ? q.replace(/[^a-z0-9_]/g, '_')
    : null;

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-[13px] text-left transition
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' : 'cursor-pointer bg-white border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30'}
          ${value ? 'text-slate-800' : 'text-slate-400'}
        `}
      >
        <span className="flex-1 min-w-0">
          {value ? (
            <span className="flex items-center gap-2 min-w-0">
              <span className="font-medium truncate">{selectedProp ? (selectedProp.label || selectedProp.name) : value}</span>
              {selectedProp?.type && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono shrink-0">{selectedProp.type}</span>
              )}
            </span>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </span>
        {value && !disabled && (
          <span
            className="shrink-0 text-slate-400 hover:text-slate-700 leading-none text-base"
            onClick={(e) => { e.stopPropagation(); select(''); }}
            title="Clear"
          >×</span>
        )}
        <span className="text-slate-400 shrink-0">▾</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute left-0 top-full mt-1 z-[9999] w-full min-w-[320px] max-w-[480px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          role="listbox"
        >
          {/* Search */}
          <div className="px-3 pt-2.5 pb-1.5 border-b border-slate-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties (name or label)…"
              className="w-full px-3 py-1.5 text-[12.5px] rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
              autoComplete="off"
            />
          </div>
          <div className="px-3 py-1 text-[11px] text-slate-400">
            {q ? `${matches.length} matching` : `${eligible.length} properties available`}
          </div>

          {/* Options */}
          <div className="max-h-72 overflow-y-auto pb-1">
            {/* Unmap option */}
            <button
              type="button"
              onClick={() => select('')}
              className={`w-full flex items-center px-3 py-2 text-[12.5px] text-left hover:bg-slate-50 transition ${!value ? 'font-semibold text-slate-700' : 'text-slate-400'}`}
            >
              — Ignore column (leave unmapped) —
            </button>

            {sorted.map((p) => {
              const sel = p.name === value;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => select(p.name)}
                  aria-selected={sel}
                  className={`w-full flex flex-col px-3 py-2 text-left hover:bg-slate-50 transition ${sel ? 'bg-orange-50' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`font-medium text-[12.5px] ${sel ? 'text-[#df6d50]' : 'text-slate-800'}`}>{p.label || p.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">{p.fieldType === 'file' ? 'FILE' : p.type}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{p.name}</span>
                </button>
              );
            })}

            {customName && (
              <button
                type="button"
                onClick={() => { onChange(customName); close(); }}
                className="w-full flex flex-col px-3 py-2 text-left hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium text-[12.5px] text-emerald-700">+ Use "{customName}"</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 font-mono">NEW</span>
                </span>
                <span className="text-[11px] text-slate-400">Create property on HubSpot</span>
              </button>
            )}

            {!sorted.length && !customName && (
              <div className="px-3 py-4 text-[12.5px] text-slate-400 italic text-center">
                {q ? 'No matching properties found.' : 'No HubSpot properties loaded.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

