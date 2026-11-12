import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  RefreshCw, Download, FileText, Search, ChevronLeft, ChevronRight,
  Activity, Trash2, AlertTriangle, CheckSquare, X,
} from 'lucide-react';
import { request, downloadFile } from '../hooks/useApi.js';
import { LoadingOverlay } from '../components/ui/Loader.jsx';
import { Badge } from '../components/ui/Badge.jsx';

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString([], {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return dateStr; }
}

/**
 * Shorten long filenames for display while keeping full name in title tooltip.
 * hubspot-data-migrate-{uuid}.csv  →  hs-migrate-{first8}…csv
 * contacts-YYYY-MM-DDThh-mm-ss-mssZ.csv  →  contacts YYYY-MM-DD hh:mm
 * migration-YYYY-MM-DDThh-mm-ss-mssZ.csv →  migration YYYY-MM-DD hh:mm
 */
function shortenFilename(filename) {
  const hsMatch = filename.match(/^hubspot-data-migrate-([0-9a-f-]{8})[0-9a-f-]+\.csv$/i);
  if (hsMatch) return `hs-migrate-${hsMatch[1]}…csv`;

  const tsMatch = filename.match(/^(contacts|migration)-(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-[\d-]+Z?\.csv$/i);
  if (tsMatch) return `${tsMatch[1]} ${tsMatch[2]} ${tsMatch[3]}:${tsMatch[4]}`;

  if (filename.length > 36) return `${filename.slice(0, 16)}…${filename.slice(-10)}`;
  return filename;
}

/* ─── Confirmation Modal Component ────────────────────────────────────────── */

function ConfirmModal({ open, title, message, subMessage, confirmText, loading, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
            <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">{message}</p>
            {subMessage && (
              <p className="text-[12px] text-slate-500 mt-2.5 bg-slate-50 rounded-lg p-2.5 border border-slate-100 font-mono break-all">
                {subMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            {confirmText || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Metric Card Component ────────────────────────────────────────────────── */

function MetricCard({ label, value, sub, iconText, iconClass }) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-1.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className={`text-base font-bold ${iconClass}`}>{iconText}</span>
      </div>
      <strong className="text-[1.9rem] font-black text-slate-900 leading-none">
        {(value ?? 0).toLocaleString()}
      </strong>
      <small className="text-[11px] text-slate-400">{sub}</small>
    </article>
  );
}

function MonIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <g transform="translate(1.5, 5.5)">
        <path d="M2.62 12.627a2.63 2.63 0 0 1-2.292-1.33A2.54 2.54 0 0 1 .4 8.679l4.72-7.412A2.63 2.63 0 0 1 7.45.001a2.63 2.63 0 0 1 2.255 1.39 2.54 2.54 0 0 1-.142 2.614l-4.717 7.412a2.63 2.63 0 0 1-2.226 1.21" fill="#FF3D57" />
        <path d="M10.716 12.627A2.62 2.62 0 0 1 8.428 11.3 2.54 2.54 0 0 1 8.5 8.689l4.711-7.395A2.63 2.63 0 0 1 15.543.001c.96.021 1.83.558 2.27 1.398.437.84.373 1.847-.17 2.626l-4.71 7.395a2.63 2.63 0 0 1-2.217 1.207" fill="#FFCC00" />
        <circle cx="18.631" cy="10.31" r="2.379" fill="#00CA72" />
      </g>
    </svg>
  );
}

function HsIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#ff7a59" aria-hidden="true">
      <path d="M18.894 8.016V5.17a2.25 2.25 0 0 0 1.341-2.057v-.063A2.25 2.25 0 0 0 17.985.8h-.063a2.25 2.25 0 0 0-2.25 2.25v.063c0 .878.508 1.637 1.24 2.003v2.9A6.29 6.29 0 0 0 13.9 9.38L6.02 3.29A2.5 2.5 0 1 0 4.4 4.747l7.76 6.022a6.262 6.262 0 0 0-1.077 3.53c0 1.38.442 2.656 1.19 3.693l-2.404 2.405a2.015 2.015 0 0 0-.61-.097 2.05 2.05 0 1 0 2.05 2.05 2.01 2.01 0 0 0-.097-.61l2.385-2.385a6.286 6.286 0 1 0 4.807-11.34zm-.99 9.544a3.255 3.255 0 1 1 3.255-3.255 3.259 3.259 0 0 1-3.254 3.255z" />
    </svg>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export function MigrationHistory({ onShowToast }) {
  const [data, setData]                 = useState(null);
  const [loading, setLoading]           = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [search, setSearch]             = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [sortBy, setSortBy]             = useState('newest');
  const [currentPage, setCurrentPage]   = useState(1);
  const [showEvents, setShowEvents]     = useState(false);
  const [selected, setSelected]         = useState(new Set()); // set of filenames
  const pageSize = 15;

  const headerCheckboxRef = useRef(null);

  // Confirmation Modal state
  const [modalState, setModalState] = useState({
    open: false,
    title: '',
    message: '',
    subMessage: '',
    confirmText: 'Delete',
    onConfirm: null,
  });

  const closeModal = () => setModalState(prev => ({ ...prev, open: false }));

  /* fetch ------------------------------------------------------------------ */
  const fetchHistory = useCallback(async ({ notify = false } = {}) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await request('/api/history');
      setData(res);
      setSelected(new Set());
      if (notify) onShowToast?.('Migration history refreshed.', 'success');
    } catch (err) {
      onShowToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [loading, onShowToast]);

  useEffect(() => { fetchHistory(); }, []); // eslint-disable-line

  /* download --------------------------------------------------------------- */
  const handleDownload = async (filename) => {
    try {
      await downloadFile(`/api/history/download?file=${encodeURIComponent(filename)}`, filename);
      onShowToast?.(`Downloaded ${shortenFilename(filename)}`, 'success');
    } catch (err) {
      onShowToast?.(err.message, 'error');
    }
  };

  /* delete single ---------------------------------------------------------- */
  const executeDeleteSingle = async (filename) => {
    setDeleting(true);
    try {
      await request(`/api/history/delete?file=${encodeURIComponent(filename)}`, { method: 'DELETE' });
      onShowToast?.(`Deleted ${shortenFilename(filename)}`, 'success');
      setData(prev => ({
        ...prev,
        runs: prev.runs.filter(r => r.filename !== filename),
        summary: { ...prev.summary, totalRuns: Math.max(0, (prev.summary.totalRuns || 1) - 1) },
      }));
      setSelected(prev => {
        const next = new Set(prev);
        next.delete(filename);
        return next;
      });
      closeModal();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const promptDeleteSingle = (filename) => {
    setModalState({
      open: true,
      title: 'Delete Report File',
      message: `Are you sure you want to delete "${shortenFilename(filename)}"?`,
      subMessage: `Full filename: ${filename}\nThis action cannot be undone and will permanently remove this file from disk.`,
      confirmText: 'Delete File',
      onConfirm: () => executeDeleteSingle(filename),
    });
  };

  /* bulk delete ------------------------------------------------------------ */
  const executeDeleteMany = async () => {
    if (selected.size === 0) return;
    setDeleting(true);
    try {
      const filenames = Array.from(selected);
      const res = await request('/api/history/delete-many', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames }),
      });
      onShowToast?.(`Successfully deleted ${res.deleted} file(s)${res.failed ? `, ${res.failed} failed` : ''}`, res.failed ? 'warning' : 'success');
      setData(prev => ({
        ...prev,
        runs: prev.runs.filter(r => !filenames.includes(r.filename)),
        summary: { ...prev.summary, totalRuns: Math.max(0, (prev.summary.totalRuns || filenames.length) - res.deleted) },
      }));
      setSelected(new Set());
      closeModal();
    } catch (err) {
      onShowToast?.(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const promptDeleteMany = () => {
    if (selected.size === 0) return;
    setModalState({
      open: true,
      title: `Delete ${selected.size} Selected Files`,
      message: `Are you sure you want to permanently delete all ${selected.size} selected report file(s)?`,
      subMessage: 'This action cannot be undone. All selected CSV reports will be permanently deleted from the server disk.',
      confirmText: `Delete ${selected.size} Files`,
      onConfirm: () => executeDeleteMany(),
    });
  };

  /* filter / sort ---------------------------------------------------------- */
  const filteredRuns = useMemo(() => {
    if (!data?.runs) return [];
    let list = data.runs;

    if (moduleFilter !== 'all') list = list.filter(r => r.module === moduleFilter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r =>
        r.filename.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.module.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'size')   return (b.size || 0) - (a.size || 0);
      return 0;
    });
  }, [data?.runs, moduleFilter, search, sortBy]);

  const totalPages   = Math.ceil(filteredRuns.length / pageSize) || 1;
  const paginatedRuns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRuns.slice(start, start + pageSize);
  }, [filteredRuns, currentPage]);

  const summary = data?.summary || {};

  /* selection helpers ------------------------------------------------------ */
  const isAllFilteredSelected = filteredRuns.length > 0 && filteredRuns.every(r => selected.has(r.filename));
  const isPartiallySelected = selected.size > 0 && !isAllFilteredSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isPartiallySelected;
    }
  }, [isPartiallySelected]);

  const handleToggleOne = (filename) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(filename) ? s.delete(filename) : s.add(filename);
      return s;
    });
  };

  // Toggle selection for all filtered records
  const handleToggleAllFiltered = () => {
    if (isAllFilteredSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredRuns.map(r => r.filename)));
    }
  };

  const handleSelectAllRecords = () => {
    setSelected(new Set(filteredRuns.map(r => r.filename)));
  };

  /* ─── render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="py-6 px-6 w-full">
      <LoadingOverlay show={loading && !data} title="Loading migration history…" sub="Please wait" />

      {/* Confirmation Modal */}
      <ConfirmModal
        open={modalState.open}
        title={modalState.title}
        message={modalState.message}
        subMessage={modalState.subMessage}
        confirmText={modalState.confirmText}
        loading={deleting}
        onConfirm={modalState.onConfirm}
        onCancel={closeModal}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-slate-400 mb-1 uppercase">Your Migration Workspace</div>
          <h1 className="text-[2rem] font-black text-slate-900 leading-tight">
            Migration history<span className="text-[#ff7a59]">.</span>
          </h1>
          <p className="text-slate-500 mt-0.5 text-[13px]">Every past migration run, exported report and verified batch record.</p>
        </div>
        <button
          type="button"
          onClick={() => fetchHistory({ notify: true })}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <MetricCard label="Total runs"          value={summary.totalRuns}    sub="Archived reports"            iconText="📁" iconClass="text-orange-400" />
        <MetricCard label="Contacts processed"  value={summary.totalContacts} sub="Created or updated"         iconText="◎"  iconClass="text-violet-400" />
        <MetricCard label="Files transferred"   value={summary.totalFiles}   sub="Uploaded & verified"         iconText="▪"  iconClass="text-blue-400"   />
        <MetricCard label="Needs attention"     value={summary.failedItems}  sub="Uncertain or failed items"   iconText="!"  iconClass="text-amber-500"  />
      </div>

      {/* Filter Bar */}
      <article className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 mb-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all',                   label: 'All Modules' },
              { id: 'Monday to HubSpot',     label: 'Monday → HubSpot' },
              { id: 'HubSpot Data Migrate',  label: 'HubSpot Data Migrate' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setModuleFilter(tab.id); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border-0 ${
                  moduleFilter === tab.id
                    ? 'bg-[#fff0eb] text-[#df6d50]'
                    : 'text-slate-600 hover:bg-slate-50 bg-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search…"
                className="w-48 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 bg-white"
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none bg-white text-slate-700 cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="size">Largest file</option>
            </select>

            <button
              type="button"
              onClick={() => setShowEvents(!showEvents)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                showEvents ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3 h-3" />
              {showEvents ? 'Hide Audit' : 'Audit Events'}
            </button>
          </div>
        </div>
      </article>

      {/* Bulk Action Bar — shown when items are selected */}
      {selected.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
            <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{selected.size}</strong> of <strong>{filteredRuns.length}</strong> record{filteredRuns.length > 1 ? 's' : ''} selected
            </span>
            {selected.size < filteredRuns.length && (
              <button
                type="button"
                onClick={handleSelectAllRecords}
                className="ml-2 text-xs font-bold text-[#df6d50] hover:underline cursor-pointer bg-transparent border-0"
              >
                Select all {filteredRuns.length} records
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 text-xs rounded-lg border border-amber-200 bg-white text-amber-800 hover:bg-amber-100/50 cursor-pointer font-medium transition"
            >
              Clear selection
            </button>
            <button
              type="button"
              onClick={promptDeleteMany}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer font-semibold transition shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete {selected.size} file{selected.size > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Runs Table */}
      <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs mb-5">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-[14px]">Historical Migration Runs</h2>
            <p className="text-[11px] text-slate-400">{filteredRuns.length} completed run reports</p>
          </div>
          <div className="flex items-center gap-2">
            {selected.size === 0 && filteredRuns.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllRecords}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer px-2.5 py-1 rounded-md hover:bg-slate-100"
              >
                Select all ({filteredRuns.length})
              </button>
            )}
            <Badge variant="neutral">{filteredRuns.length} files</Badge>
          </div>
        </div>

        {/* Fixed-layout table — no horizontal scroll */}
        <table className="w-full table-fixed text-[12.5px]">
          <colgroup>
            <col className="w-9" />       {/* checkbox */}
            <col className="w-[26%]" />   {/* filename */}
            <col className="w-[22%]" />   {/* module */}
            <col className="w-[16%]" />   {/* report type */}
            <col className="w-[18%]" />   {/* date */}
            <col className="w-[8%]" />    {/* size */}
            <col className="w-[10%]" />   {/* actions */}
          </colgroup>
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2.5 text-center">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={isAllFilteredSelected}
                  onChange={handleToggleAllFiltered}
                  className="w-3.5 h-3.5 accent-[#ff7a59] cursor-pointer"
                  title={isAllFilteredSelected ? 'Deselect all records' : 'Select all records'}
                />
              </th>
              <th className="px-3 py-2.5 text-left text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide">File Name</th>
              <th className="px-3 py-2.5 text-left text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide">Module</th>
              <th className="px-3 py-2.5 text-left text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide">Type</th>
              <th className="px-3 py-2.5 text-left text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
              <th className="px-3 py-2.5 text-left text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide">Size</th>
              <th className="px-3 py-2.5 text-right text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRuns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400 italic text-[13px]">
                  No migration runs match your criteria.
                </td>
              </tr>
            ) : (
              paginatedRuns.map(run => {
                const isMonday = run.module.includes('Monday');
                const isChecked = selected.has(run.filename);
                return (
                  <tr
                    key={run.filename}
                    className={`hover:bg-slate-50/70 transition ${isChecked ? 'bg-orange-50/40' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleOne(run.filename)}
                        className="w-3.5 h-3.5 accent-[#ff7a59] cursor-pointer"
                      />
                    </td>

                    {/* Filename */}
                    <td className="px-3 py-3 font-medium text-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText className="w-3 h-3" />
                        </span>
                        <span
                          className="font-mono text-[11.5px] truncate"
                          title={run.filename}
                        >
                          {shortenFilename(run.filename)}
                        </span>
                      </div>
                    </td>

                    {/* Module */}
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-700 font-medium truncate">
                        {isMonday ? <MonIcon /> : <HsIcon />}
                        <span className="truncate">{run.module}</span>
                      </span>
                    </td>

                    {/* Report Type */}
                    <td className="px-3 py-3">
                      <Badge variant={run.type.includes('Contact') ? 'brand' : run.type.includes('Asset') ? 'info' : 'neutral'}>
                        {run.type}
                      </Badge>
                    </td>

                    {/* Date */}
                    <td className="px-3 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(run.createdAt)}
                    </td>

                    {/* Size */}
                    <td className="px-3 py-3 text-slate-600 font-mono text-[11px]">
                      {formatBytes(run.size)}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownload(run.filename)}
                          title="Download CSV"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs"
                        >
                          <Download className="w-3 h-3 text-slate-500" />
                          CSV
                        </button>
                        <button
                          type="button"
                          onClick={() => promptDeleteSingle(run.filename)}
                          disabled={deleting}
                          title="Delete file"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-red-200 bg-white text-[11px] font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </article>

      {/* Audit Events (collapsible) */}
      {showEvents && (
        <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-800 text-[14px]">Recent Database Execution Events</h2>
              <p className="text-[11px] text-slate-400">Latest 50 state machine events recorded in SQLite</p>
            </div>
            <Badge variant="success">Active Audit Log</Badge>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-[11.5px]">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr>
                  {['ID', 'Target Email', 'Column', 'Step / Outcome', 'Timestamp'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {(data?.recentEvents ?? []).map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-400">#{ev.id}</td>
                    <td className="px-4 py-2 font-medium text-slate-800 max-w-[180px] truncate">{ev.row_email || '—'}</td>
                    <td className="px-4 py-2 text-slate-600">{ev.column_name || '—'}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ev.step === 'completed' ? 'bg-emerald-50 text-emerald-700'
                        : ev.step === 'failed'  ? 'bg-red-50 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                      }`}>{ev.step}</span>
                    </td>
                    <td className="px-4 py-2 text-slate-400 whitespace-nowrap">{formatDate(ev.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </div>
  );
}
