import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload, RefreshCw, Download, Play, Square, RotateCcw,
  ChevronDown, AlertTriangle, CheckCircle2, XCircle,
  Link2, FileSpreadsheet, Tag, Eye, Settings2, Info,
} from 'lucide-react';
import { request, downloadFile } from '../../hooks/useApi.js';
import { LoadingOverlay } from '../../components/ui/Loader.jsx';
import { StepperBar } from '../../components/ui/StepperBar.jsx';
import { ActivityLog } from '../../components/ui/ActivityLog.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { Badge } from '../../components/ui/Badge.jsx';

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE = '/api/hubspot/associations';
const ep = (s) => `${BASE}/${s}`;
const STEPS = ['Objects & files', 'Match columns', 'Review & validate', 'Run & monitor'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function phaseBadge(phase) {
  const m = {
    idle: 'neutral', running: 'info', complete: 'success',
    failed: 'error', cancelled: 'warning', dry_run: 'info',
  };
  return m[phase] ?? 'neutral';
}

function phaseLabel(phase) {
  const m = {
    idle: 'Idle', running: 'Running', complete: 'Complete',
    failed: 'Failed', cancelled: 'Cancelled', dry_run: 'Dry run',
  };
  return m[phase] ?? phase;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          {icon && <span className="text-[#ff7a59]">{icon}</span>}
          <span className="text-[13px] font-semibold text-slate-700">{title}</span>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
      {children}{required && <span className="text-[#ff7a59] ml-0.5">*</span>}
    </label>
  );
}

function SelectBox({ value, onChange, disabled, children, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 focus:border-[#ff7a59] disabled:bg-slate-50 disabled:text-slate-400 pr-8"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = 'primary', size = 'md', icon, loading }) {
  const base = 'inline-flex items-center gap-1.5 font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'text-[11.5px] px-3 py-1.5', md: 'text-[12.5px] px-4 py-2', lg: 'text-[13px] px-5 py-2.5' };
  const variants = {
    primary: 'bg-[#ff7a59] hover:bg-[#e56b4c] text-white focus:ring-[#ff7a59]',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 focus:ring-slate-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-300',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]}`}
    >
      {loading ? <RefreshCw size={13} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}

function FileUploadZone({ side, workbook, onUpload, busy }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    await onUpload(side, fd);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer
        ${dragging ? 'border-[#ff7a59] bg-orange-50' : 'border-slate-200 hover:border-[#ff7a59]/50 hover:bg-slate-50'}
        ${busy ? 'opacity-60 pointer-events-none' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => ref.current?.click()}
    >
      <input ref={ref} type="file" accept=".xlsx,.xls,.csv" className="hidden"
        onChange={(e) => handleFile(e.target.files[0])} />
      {workbook ? (
        <div className="flex flex-col items-center gap-1">
          <FileSpreadsheet size={22} className="text-[#ff7a59]" />
          <p className="text-[12.5px] font-semibold text-slate-700 mt-1 truncate max-w-full">{workbook.filename}</p>
          <p className="text-[11.5px] text-slate-400">{workbook.rows?.toLocaleString()} rows · {workbook.columns?.length} columns</p>
          <span className="text-[11px] text-[#ff7a59] mt-1">Click to replace</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <Upload size={22} className="text-slate-300" />
          <p className="text-[12.5px] text-slate-500 mt-1">Drag & drop or click to upload</p>
          <p className="text-[11px] text-slate-400">.xlsx, .xls, .csv</p>
        </div>
      )}
    </div>
  );
}

function SheetPicker({ side, workbook, onSheetChange, busy }) {
  if (!workbook?.sheets?.length) return null;
  return (
    <div className="mt-3">
      <FieldLabel>Sheet</FieldLabel>
      <SelectBox
        value={workbook.sheet ?? ''}
        onChange={(v) => onSheetChange(side, v)}
        disabled={busy}
        placeholder="Select sheet…"
      >
        {workbook.sheets.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </SelectBox>
    </div>
  );
}

function PreviewTable({ data, caption }) {
  if (!data?.columns?.length && !data?.rows?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden text-[12px]">
      {caption && <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11.5px] font-semibold text-slate-600">{caption}</div>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {(data.columns ?? []).map((c, i) => (
                <th key={i} className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500 whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.rows ?? []).map((row, ri) => (
              <tr key={ri} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                {(Array.isArray(row) ? row : Object.values(row)).map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5 text-slate-700 whitespace-nowrap">{String(cell ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Step 0: Objects & Files ──────────────────────────────────────────────────
function Step0({
  state, objects, onPickObject, onUpload, onSheetChange,
  onFetchLabels, onToggleLabel, busy,
}) {
  const { sides, labels, selectedLabels } = state;

  const renderSide = (side) => {
    const s = sides[side];
    const title = side === 'left' ? 'Source Object (Left)' : 'Target Object (Right)';
    return (
      <div className="flex flex-col gap-4">
        <SectionCard title={title} icon={<Link2 size={15} />}>
          <FieldLabel required>Object type</FieldLabel>
          <SelectBox
            value={s?.object?.objectTypeId ?? ''}
            onChange={(v) => onPickObject(side, v)}
            disabled={busy}
            placeholder="Select object type…"
          >
            {objects.map((o) => (
              <option key={o.objectTypeId} value={o.objectTypeId}>{o.label}</option>
            ))}
          </SelectBox>

          <div className="mt-4">
            <FieldLabel required>Workbook file</FieldLabel>
            <FileUploadZone
              side={side}
              workbook={s?.workbook}
              onUpload={onUpload}
              busy={busy}
            />
            <SheetPicker
              side={side}
              workbook={s?.workbook}
              onSheetChange={onSheetChange}
              busy={busy}
            />
          </div>
        </SectionCard>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSide('left')}
        {renderSide('right')}
      </div>

      {/* Association Labels */}
      <SectionCard title="Association Labels" icon={<Tag size={15} />}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12.5px] text-slate-500">
            Select which association label types to migrate.
          </p>
          <Btn
            onClick={onFetchLabels}
            disabled={busy || !sides.left?.object || !sides.right?.object}
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={12} />}
            loading={busy}
          >
            Get association labels
          </Btn>
        </div>

        {labels.length === 0 ? (
          <div className="text-[12px] text-slate-400 italic py-2">
            Select both objects above, then click "Get association labels".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {labels.map((lbl) => {
              const checked = selectedLabels.includes(lbl.key ?? lbl.name ?? lbl);
              const key = lbl.key ?? lbl.name ?? lbl;
              const display = lbl.label ?? lbl.name ?? lbl;
              return (
                <label
                  key={key}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-[12.5px]
                    ${checked ? 'border-[#ff7a59]/40 bg-orange-50 text-slate-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleLabel(key)}
                    className="accent-[#ff7a59] w-3.5 h-3.5 shrink-0"
                  />
                  <span className="truncate">{display}</span>
                  {lbl.category && (
                    <span className="ml-auto text-[10.5px] text-slate-400 shrink-0">{lbl.category}</span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Step 1: Match Columns ────────────────────────────────────────────────────
function Step1({ state, onPickColumn, busy }) {
  const { sides, columns } = state;
  const leftCols = sides.left?.workbook?.columns ?? [];
  const rightCols = sides.right?.workbook?.columns ?? [];

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Match ID Columns" icon={<Settings2 size={15} />}>
        <p className="text-[12.5px] text-slate-500 mb-5">
          Select the column in each workbook that contains the HubSpot record ID.
          These columns will be used to identify and link records during migration.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FieldLabel required>
              Left workbook ID column
              {sides.left?.workbook?.filename && (
                <span className="font-normal text-slate-400 ml-1">({sides.left.workbook.filename})</span>
              )}
            </FieldLabel>
            {leftCols.length === 0 ? (
              <p className="text-[12px] text-slate-400 italic">No workbook uploaded for left side.</p>
            ) : (
              <SelectBox
                value={columns.left ?? ''}
                onChange={(v) => onPickColumn('left', v)}
                disabled={busy}
                placeholder="Select column…"
              >
                {leftCols.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </SelectBox>
            )}
          </div>
          <div>
            <FieldLabel required>
              Right workbook ID column
              {sides.right?.workbook?.filename && (
                <span className="font-normal text-slate-400 ml-1">({sides.right.workbook.filename})</span>
              )}
            </FieldLabel>
            {rightCols.length === 0 ? (
              <p className="text-[12px] text-slate-400 italic">No workbook uploaded for right side.</p>
            ) : (
              <SelectBox
                value={columns.right ?? ''}
                onChange={(v) => onPickColumn('right', v)}
                disabled={busy}
                placeholder="Select column…"
              >
                {rightCols.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </SelectBox>
            )}
          </div>
        </div>

        {/* Preview snippets */}
        {columns.left && leftCols.length > 0 && (
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-[12px] font-semibold text-slate-500">Column preview</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <div className="text-[11px] font-semibold text-slate-500 mb-1">Left · {columns.left}</div>
                <div className="flex flex-col gap-0.5">
                  {(sides.left?.workbook?.columns?.find((c) => c.name === columns.left)?.sample ?? []).slice(0, 5).map((v, i) => (
                    <span key={i} className="text-[11.5px] text-slate-600 font-mono">{String(v)}</span>
                  ))}
                </div>
              </div>
              {columns.right && (
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">Right · {columns.right}</div>
                  <div className="flex flex-col gap-0.5">
                    {(sides.right?.workbook?.columns?.find((c) => c.name === columns.right)?.sample ?? []).slice(0, 5).map((v, i) => (
                      <span key={i} className="text-[11.5px] text-slate-600 font-mono">{String(v)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Step 2: Review & Validate ────────────────────────────────────────────────
function Step2({ state, onRunPreflight, busy }) {
  const { validation } = state;

  const StatBox = ({ label, value, color }) => (
    <div className={`rounded-xl border p-4 text-center ${color}`}>
      <div className="text-2xl font-bold">{value?.toLocaleString() ?? '—'}</div>
      <div className="text-[11.5px] mt-1 opacity-70">{label}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-slate-700">Preflight Validation</h3>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Validate the data before running the migration.
          </p>
        </div>
        <Btn
          onClick={onRunPreflight}
          disabled={busy}
          variant="primary"
          icon={<Play size={13} />}
          loading={busy}
        >
          Run preflight
        </Btn>
      </div>

      {!validation && !busy && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center">
          <Eye size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-[13px] text-slate-500">Click "Run preflight" to validate your data.</p>
        </div>
      )}

      {busy && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center">
          <RefreshCw size={28} className="mx-auto text-[#ff7a59] animate-spin mb-3" />
          <p className="text-[13px] text-slate-600">Running preflight validation…</p>
        </div>
      )}

      {validation && !busy && (
        <div className="flex flex-col gap-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox label="Source records" value={validation.sourceRecords} color="border-slate-200 text-slate-700" />
            <StatBox label="Target records" value={validation.targetRecords} color="border-slate-200 text-slate-700" />
            <StatBox label="Pairs to create" value={validation.pairs} color="border-emerald-100 text-emerald-700" />
            <StatBox label="Pairs to remove" value={validation.remove} color="border-red-100 text-red-700" />
          </div>

          {/* Issues */}
          {validation.issues?.length > 0 && (
            <SectionCard title="Issues" icon={<AlertTriangle size={15} />}>
              <div className="flex flex-col gap-2">
                {validation.issues.map((issue, i) => (
                  <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl text-[12px]
                    ${issue.level === 'error' ? 'bg-red-50 border border-red-100 text-red-800' : 'bg-amber-50 border border-amber-100 text-amber-800'}`}>
                    {issue.level === 'error'
                      ? <XCircle size={14} className="mt-0.5 shrink-0" />
                      : <AlertTriangle size={14} className="mt-0.5 shrink-0" />}
                    <span>{issue.message ?? String(issue)}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {validation.issues?.length === 0 && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12.5px]">
              <CheckCircle2 size={16} className="shrink-0" />
              No issues found — data looks clean.
            </div>
          )}

          {/* Pair preview */}
          {validation.pairPreview && (
            <SectionCard title="Pair preview (sample)" icon={<Eye size={15} />}>
              <PreviewTable data={validation.pairPreview} />
            </SectionCard>
          )}

          {/* Remove preview */}
          {validation.removePreview && (
            <SectionCard title="Pairs to remove (sample)" icon={<Eye size={15} />}>
              <PreviewTable data={validation.removePreview} />
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Run & Monitor ────────────────────────────────────────────────────
function Step3({ state, onRun, onCancel, onDownloadReport, onDownloadBackup, onRestore, busy }) {
  const { status, validation, backup } = state;
  const [dryRun, setDryRun] = useState(true);
  const [confirmRun, setConfirmRun] = useState('');
  const [restoreConfirm, setRestoreConfirm] = useState('');
  const [restoring, setRestoring] = useState(false);

  const canRunReal = confirmRun.trim().toUpperCase() === 'RUN FOR REAL';
  const isRunning = status?.running;

  const handleRun = () => {
    onRun({
      dryRun,
      confirmation: dryRun ? undefined : confirmRun,
      validationId: validation?.validationId,
    });
    setConfirmRun('');
  };

  const handleRestore = async () => {
    if (restoreConfirm.trim().toUpperCase() !== 'RESTORE BACKUP') return;
    setRestoring(true);
    try {
      await onRestore(restoreConfirm);
    } finally {
      setRestoring(false);
      setRestoreConfirm('');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Mode selector */}
      {!isRunning && (
        <SectionCard title="Run mode" icon={<Settings2 size={15} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition
              ${dryRun ? 'border-[#ff7a59]/40 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" name="runMode" checked={dryRun} onChange={() => setDryRun(true)} className="mt-0.5 accent-[#ff7a59]" />
              <div>
                <div className="text-[13px] font-semibold text-slate-700">Dry run</div>
                <div className="text-[12px] text-slate-500 mt-0.5">Simulate the migration without making any changes in HubSpot.</div>
              </div>
            </label>
            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition
              ${!dryRun ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" name="runMode" checked={!dryRun} onChange={() => setDryRun(false)} className="mt-0.5 accent-red-500" />
              <div>
                <div className="text-[13px] font-semibold text-slate-700">Run for real</div>
                <div className="text-[12px] text-slate-500 mt-0.5">Apply association changes to HubSpot. This cannot be undone without a restore.</div>
              </div>
            </label>
          </div>

          {!dryRun && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-[12.5px] text-red-700 font-semibold mb-2 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Type <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded">RUN FOR REAL</span> to confirm
              </p>
              <input
                type="text"
                value={confirmRun}
                onChange={(e) => setConfirmRun(e.target.value)}
                placeholder="RUN FOR REAL"
                className="w-full border border-red-200 rounded-xl px-3.5 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 bg-white"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-4">
            <Btn
              onClick={handleRun}
              disabled={busy || (!dryRun && !canRunReal)}
              variant={dryRun ? 'secondary' : 'danger'}
              icon={<Play size={13} />}
              loading={busy && !isRunning}
            >
              {dryRun ? 'Start dry run' : 'Run for real'}
            </Btn>
          </div>
        </SectionCard>
      )}

      {/* Progress & control */}
      {status && status.phase !== 'idle' && (
        <SectionCard title="Job status" icon={<RefreshCw size={15} className={isRunning ? 'animate-spin' : ''} />}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant={phaseBadge(status.phase)}>{phaseLabel(status.phase)}</Badge>
              {status.dryRun && <Badge variant="neutral">Dry run</Badge>}
            </div>
            <div className="flex items-center gap-2">
              {isRunning && (
                <Btn onClick={onCancel} variant="secondary" size="sm" icon={<Square size={12} />}>
                  Cancel
                </Btn>
              )}
              {(status.phase === 'complete' || status.phase === 'failed') && (
                <Btn onClick={onDownloadReport} variant="secondary" size="sm" icon={<Download size={12} />}>
                  Download report
                </Btn>
              )}
            </div>
          </div>

          {typeof status.progress === 'number' && (
            <div className="mb-3">
              <div className="flex justify-between text-[11.5px] text-slate-500 mb-1">
                <span>{status.message ?? 'Processing…'}</span>
                <span>{status.progress}%</span>
              </div>
              <ProgressBar value={status.progress} />
            </div>
          )}

          {status.stats && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {Object.entries(status.stats).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                  <div className="text-[15px] font-bold text-slate-700">{typeof v === 'number' ? v.toLocaleString() : v}</div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5 capitalize">{k.replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* Activity log */}
      <SectionCard title="Activity log" icon={<Info size={15} />}>
        <ActivityLog
          logs={status?.logs ?? []}
          emptyText="No activity yet. Start a run to see live progress."
        />
      </SectionCard>

      {/* Backup card */}
      {backup && (
        <SectionCard title="Backup" icon={<RotateCcw size={15} />}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-[12.5px] font-semibold text-slate-700">Association backup</div>
                <div className="text-[11.5px] text-slate-400 mt-0.5">
                  {backup.recordCount?.toLocaleString() ?? '—'} records · {backup.createdAt ? new Date(backup.createdAt).toLocaleString() : 'unknown date'}
                </div>
              </div>
              <Btn onClick={onDownloadBackup} variant="secondary" size="sm" icon={<Download size={12} />}>
                Download JSON
              </Btn>
            </div>

            {/* Restore */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
              <p className="text-[12.5px] text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
                <RotateCcw size={13} /> Restore backup
              </p>
              <p className="text-[11.5px] text-amber-700 mb-2">
                This will restore associations from the backup file. Type <span className="font-mono bg-amber-100 px-1 rounded">RESTORE BACKUP</span> to confirm.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={restoreConfirm}
                  onChange={(e) => setRestoreConfirm(e.target.value)}
                  placeholder="RESTORE BACKUP"
                  className="flex-1 border border-amber-200 rounded-xl px-3 py-2 text-[12.5px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
                />
                <Btn
                  onClick={handleRestore}
                  disabled={restoreConfirm.trim().toUpperCase() !== 'RESTORE BACKUP' || restoring}
                  variant="secondary"
                  size="sm"
                  loading={restoring}
                  icon={<RotateCcw size={12} />}
                >
                  Restore
                </Btn>
              </div>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AssociationMigration({ onShowToast }) {
  const pollRef = useRef(null);

  const [state, setState] = useState({
    step: 0,
    busy: false,
    loaded: false,
    objects: [],
    sides: { left: null, right: null },
    labels: [],
    selectedLabels: [],
    columns: { left: '', right: '' },
    validation: null,
    backup: null,
    dirty: false,
    status: { running: false, phase: 'idle', logs: [] },
  });

  // ── Merge server state into local state ─────────────────────────────────────
  const mergeServerState = useCallback((serverState, extra = {}) => {
    if (!serverState) return;
    setState((prev) => ({
      ...prev,
      sides: serverState.sides ?? prev.sides,
      labels: serverState.labels ?? prev.labels,
      selectedLabels: serverState.selectedLabels ?? prev.selectedLabels,
      columns: serverState.columns ?? prev.columns,
      validation: serverState.validation ?? prev.validation,
      backup: serverState.backup ?? prev.backup,
      status: serverState.status ?? prev.status,
      ...extra,
    }));
  }, []);

  // ── Load initial state ───────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [serverState, objectsRes] = await Promise.all([
          request(ep('state'), 'GET'),
          request('/api/hubspot/objects', 'GET'),
        ]);
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loaded: true,
          objects: objectsRes?.objects ?? [],
          sides: serverState?.sides ?? prev.sides,
          labels: serverState?.labels ?? [],
          selectedLabels: serverState?.selectedLabels ?? [],
          columns: serverState?.columns ?? prev.columns,
          validation: serverState?.validation ?? null,
          backup: serverState?.backup ?? null,
          status: serverState?.status ?? prev.status,
        }));
      } catch (err) {
        if (!cancelled) {
          onShowToast?.('Failed to load state: ' + (err?.message ?? 'Unknown error'), 'error');
          setState((prev) => ({ ...prev, loaded: true }));
        }
      }
    })();
    return () => { cancelled = true; };
  }, [mergeServerState, onShowToast]);

  // ── Polling when job is running ──────────────────────────────────────────────
  useEffect(() => {
    if (state.status?.running) {
      pollRef.current = setInterval(async () => {
        try {
          const jobStatus = await request(ep('status'), 'GET');
          setState((prev) => ({
            ...prev,
            status: jobStatus ?? prev.status,
          }));
          if (!jobStatus?.running) {
            clearInterval(pollRef.current);
          }
        } catch {
          // silent
        }
      }, 2000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [state.status?.running]);

  // ── API helpers ──────────────────────────────────────────────────────────────
  const withBusy = useCallback(async (fn, errorMsg) => {
    setState((prev) => ({ ...prev, busy: true }));
    try {
      await fn();
    } catch (err) {
      onShowToast?.(errorMsg + ': ' + (err?.message ?? 'Unknown error'), 'error');
    } finally {
      setState((prev) => ({ ...prev, busy: false }));
    }
  }, [onShowToast]);

  const handlePickObject = useCallback((side, objectTypeId) => {
    withBusy(async () => {
      const serverState = await request(ep(`object/${side}`), 'PUT', { objectTypeId });
      mergeServerState(serverState);
    }, `Failed to set ${side} object`);
  }, [withBusy, mergeServerState]);

  const handleUpload = useCallback((side, formData) => {
    withBusy(async () => {
      const serverState = await request(ep(`workbook/${side}`), 'POST', formData);
      mergeServerState(serverState);
    }, `Failed to upload ${side} workbook`);
  }, [withBusy, mergeServerState]);

  const handleSheetChange = useCallback((side, sheet) => {
    withBusy(async () => {
      const serverState = await request(ep(`sheet/${side}`), 'POST', { sheet });
      mergeServerState(serverState);
    }, `Failed to set ${side} sheet`);
  }, [withBusy, mergeServerState]);

  const handleFetchLabels = useCallback(() => {
    withBusy(async () => {
      const serverState = await request(ep('labels'), 'POST');
      mergeServerState(serverState);
    }, 'Failed to fetch association labels');
  }, [withBusy, mergeServerState]);

  const handleToggleLabel = useCallback((key) => {
    setState((prev) => {
      const sel = prev.selectedLabels.includes(key)
        ? prev.selectedLabels.filter((k) => k !== key)
        : [...prev.selectedLabels, key];
      // fire-and-forget persist
      request(ep('labels'), 'PUT', { keys: sel }).catch(() => {});
      return { ...prev, selectedLabels: sel };
    });
  }, []);

  const handlePickColumn = useCallback((side, colName) => {
    setState((prev) => {
      const cols = { ...prev.columns, [side]: colName };
      request(ep('columns'), 'PUT', { left: cols.left, right: cols.right }).catch(() => {});
      return { ...prev, columns: cols };
    });
  }, []);

  const handleRunPreflight = useCallback(() => {
    withBusy(async () => {
      const serverState = await request(ep('preflight'), 'POST');
      mergeServerState(serverState);
      if (serverState?.validation?.issues?.length === 0) {
        onShowToast?.('Preflight passed — no issues found.', 'success');
      }
    }, 'Preflight failed');
  }, [withBusy, mergeServerState, onShowToast]);

  const handleRun = useCallback(({ dryRun, confirmation, validationId }) => {
    withBusy(async () => {
      const jobStatus = await request(ep('run'), 'POST', { dryRun, confirmation, validationId });
      setState((prev) => ({ ...prev, status: jobStatus ?? prev.status }));
    }, 'Failed to start run');
  }, [withBusy]);

  const handleCancel = useCallback(() => {
    withBusy(async () => {
      const jobStatus = await request(ep('cancel'), 'POST');
      setState((prev) => ({ ...prev, status: jobStatus ?? prev.status }));
      onShowToast?.('Job cancelled.', 'warning');
    }, 'Failed to cancel job');
  }, [withBusy, onShowToast]);

  const handleDownloadReport = useCallback(() => {
    downloadFile(ep('report'), 'association-migration-report.json');
  }, []);

  const handleDownloadBackup = useCallback(() => {
    downloadFile(ep('backup'), 'association-backup.json');
  }, []);

  const handleRestore = useCallback(async (confirmation) => {
    const jobStatus = await request(ep('restore'), 'POST', { confirmation });
    setState((prev) => ({ ...prev, status: jobStatus ?? prev.status }));
    onShowToast?.('Restore initiated.', 'success');
  }, [onShowToast]);

  // ── Stepper logic ────────────────────────────────────────────────────────────
  const canAdvance = useCallback((step) => {
    const { sides, columns, validation } = state;
    if (step === 0) {
      return !!(sides.left?.object && sides.right?.object && sides.left?.workbook && sides.right?.workbook);
    }
    if (step === 1) {
      return !!(columns.left && columns.right);
    }
    if (step === 2) {
      return !!validation;
    }
    return true;
  }, [state]);

  const handleStepSelect = useCallback((step) => {
    if (step <= state.step || canAdvance(step - 1)) {
      setState((prev) => ({ ...prev, step }));
    }
  }, [state.step, canAdvance]);

  const handleNext = () => setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, STEPS.length - 1) }));
  const handleBack = () => setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }));

  // ── Render ───────────────────────────────────────────────────────────────────
  const { step, busy, loaded, objects, status } = state;

  if (!loaded) {
    return <LoadingOverlay show title="Loading…" sub="Fetching association migration state" />;
  }

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <Step0
            state={state}
            objects={objects}
            onPickObject={handlePickObject}
            onUpload={handleUpload}
            onSheetChange={handleSheetChange}
            onFetchLabels={handleFetchLabels}
            onToggleLabel={handleToggleLabel}
            busy={busy}
          />
        );
      case 1:
        return <Step1 state={state} onPickColumn={handlePickColumn} busy={busy} />;
      case 2:
        return <Step2 state={state} onRunPreflight={handleRunPreflight} busy={busy} />;
      case 3:
        return (
          <Step3
            state={state}
            onRun={handleRun}
            onCancel={handleCancel}
            onDownloadReport={handleDownloadReport}
            onDownloadBackup={handleDownloadBackup}
            onRestore={handleRestore}
            busy={busy}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LoadingOverlay show={busy && !state.status?.running} title="Working…" sub="Please wait" />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff7a59]/10 flex items-center justify-center">
              <Link2 size={18} className="text-[#ff7a59]" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-slate-800">Association Migration</h1>
              <p className="text-[12px] text-slate-500">Migrate HubSpot object associations in bulk</p>
            </div>
          </div>
          {status && status.phase !== 'idle' && (
            <Badge variant={phaseBadge(status.phase)}>{phaseLabel(status.phase)}</Badge>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Stepper */}
        <StepperBar
          steps={STEPS}
          current={step}
          onSelect={handleStepSelect}
          canAdvance={canAdvance}
        />

        {/* Step content */}
        {stepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Btn
            onClick={handleBack}
            disabled={step === 0 || busy}
            variant="secondary"
          >
            ← Back
          </Btn>
          {step < STEPS.length - 1 && (
            <Btn
              onClick={handleNext}
              disabled={!canAdvance(step) || busy}
              variant="primary"
            >
              Next →
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssociationMigration;
