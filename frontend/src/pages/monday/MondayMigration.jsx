import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload, RefreshCw, Download, Play, Square, RotateCcw,
  CheckCircle, AlertTriangle, XCircle, Wifi, WifiOff,
  ChevronDown, ChevronUp, Search, FileText, Users, File,
  Settings, Trash2, Clock
} from 'lucide-react';
import { request, downloadFile } from '../../hooks/useApi.js';
import { useSSE } from '../../hooks/useSSE.js';
import { LoadingOverlay } from '../../components/ui/Loader.jsx';
import { StepperBar } from '../../components/ui/StepperBar.jsx';
import { PropertyPicker } from '../../components/ui/PropertyPicker.jsx';
import { ActivityLog } from '../../components/ui/ActivityLog.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { Badge } from '../../components/ui/Badge.jsx';

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = ['Choose workbook', 'Map columns', 'Review & validate', 'Run & monitor'];

const CONTACT_MODES = [
  { value: 'upsert', label: 'Upsert — create or update contacts' },
  { value: 'attach_only', label: 'Attach only — skip contact upsert' },
];

const NUMBERED_FALLBACKS = [
  { value: 'same_property', label: 'Same property — overwrite each upload' },
  { value: 'numbered', label: 'Numbered — append index suffix' },
  { value: 'note', label: 'Note — attach extra files as notes' },
  { value: 'first_only', label: 'First only — ignore additional files' },
];

const RUN_PHASES = ['preflight', 'files', 'contacts', 'done'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtSeconds(secs) {
  if (!secs || secs <= 0) return null;
  if (secs < 60) return `~${Math.round(secs)}s remaining`;
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  if (secs < 3600) return `~${m}m ${s}s remaining`;
  const h = Math.floor(secs / 3600);
  const rm = Math.floor((secs % 3600) / 60);
  return `~${h}h ${rm}m remaining`;
}

function fmtElapsed(startedAt) {
  if (!startedAt) return null;
  const secs = Math.round((Date.now() - new Date(startedAt).getTime()) / 1000);
  if (secs < 60) return `${secs}s elapsed`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s elapsed`;
}

function phaseBadgeVariant(phase) {
  if (!phase || phase === 'idle') return 'neutral';
  if (phase === 'complete') return 'success';
  if (phase === 'failed') return 'error';
  if (phase === 'dry_run') return 'info';
  return 'warning';
}

function kindBadgeVariant(kind) {
  if (kind === 'email') return 'info';
  if (kind === 'file') return 'warning';
  return 'neutral';
}

function statusBadgeVariant(item) {
  if (!item.hubspotProperty) return 'neutral';
  return 'success';
}

// ─── Stage Rail ───────────────────────────────────────────────────────────────
function StageRail({ phase }) {
  const stages = [
    { id: 'preflight', label: 'Preflight' },
    { id: 'files', label: 'Files' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'done', label: 'Done' },
  ];

  const getStatus = (id) => {
    if (phase === 'idle') return 'pending';
    if (phase === 'failed') {
      const idx = stages.findIndex(s => s.id === id);
      const curIdx = stages.findIndex(s => s.id === phase);
      if (idx < curIdx) return 'done';
      return 'pending';
    }
    if (phase === 'complete') return 'done';
    const order = { preflight: 0, preflight_complete: 1, dry_run: 1, migration: 2, complete: 3 };
    const phaseOrder = order[phase] ?? 0;
    const stageOrder = { preflight: 0, files: 1, contacts: 2, done: 3 };
    const so = stageOrder[id] ?? 0;
    if (so < phaseOrder) return 'done';
    if (so === phaseOrder) return 'active';
    return 'pending';
  };

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {stages.map((s, i) => {
        const st = getStatus(s.id);
        return (
          <React.Fragment key={s.id}>
            <span className={`flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1.5 rounded-full
              ${st === 'done' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : st === 'active' ? 'bg-orange-50 text-[#df6d50] border border-[#ff7a59]/30 animate-pulse'
                : 'bg-slate-100 text-slate-400'}`}>
              {st === 'done' ? '✓' : st === 'active' ? '◉' : '○'}
              {s.label}
            </span>
            {i < stages.length - 1 && (
              <span className="text-slate-200 text-[11px] select-none">→</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color = 'slate' }) {
  const colors = {
    slate: 'bg-slate-50 border-slate-100 text-slate-700',
    orange: 'bg-orange-50 border-orange-100 text-[#df6d50]',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    red: 'bg-red-50 border-red-100 text-red-700',
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color] ?? colors.slate}`}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-4 h-4 opacity-70" />}
        <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">{label}</span>
      </div>
      <div className="text-2xl font-black">{value ?? '—'}</div>
      {sub && <div className="text-[11.5px] opacity-60 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Expandable Row ───────────────────────────────────────────────────────────
function MappingRow({ item, properties, onChange, disabled }) {
  const [open, setOpen] = useState(false);

  const handleItemChange = (key, val) => {
    onChange({ ...item, [key]: val });
  };

  const samples = item.samples?.filter(Boolean) ?? [];

  return (
    <React.Fragment>
      <tr className="hover:bg-slate-50 transition">
        <td className="px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 text-[12.5px]">{item.excel}</span>
            <Badge variant={kindBadgeVariant(item.kind)}>{item.kind}</Badge>
          </div>
        </td>
        <td className="px-5 py-3 text-slate-400 text-[12px] max-w-[180px]">
          {samples.length > 0
            ? <span className="truncate block">{samples.slice(0, 3).join(' · ')}</span>
            : <span className="italic">—</span>}
        </td>
        <td className="px-5 py-3">
          <Badge variant={statusBadgeVariant(item)}>
            {item.hubspotProperty ? 'mapped' : 'ignored'}
          </Badge>
        </td>
        <td className="px-5 py-3 min-w-[260px]">
          {item.kind !== 'email' && (
            <PropertyPicker
              value={item.hubspotProperty ?? ''}
              properties={properties}
              filterFile={item.kind === 'file'}
              onChange={(val) => handleItemChange('hubspotProperty', val)}
              disabled={disabled}
              placeholder="Ignore this column"
              allowCreate
            />
          )}
          {item.kind === 'email' && (
            <span className="text-[12px] text-slate-400 italic">Email column (auto-matched)</span>
          )}
        </td>
        <td className="px-5 py-3">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            disabled={item.kind === 'email'}
            className="flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-700 transition disabled:opacity-30 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            Configure
            {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </td>
      </tr>
      {open && (
        <tr className="bg-slate-50 border-b border-slate-100">
          <td colSpan={5} className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[12.5px]">
              {/* Kind */}
              <label className="flex flex-col gap-1 font-medium text-slate-700">
                Column kind
                <select
                  value={item.kind ?? 'contact'}
                  onChange={(e) => handleItemChange('kind', e.target.value)}
                  disabled={disabled}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                >
                  <option value="contact">Contact</option>
                  <option value="file">File</option>
                </select>
              </label>

              {/* Type */}
              <label className="flex flex-col gap-1 font-medium text-slate-700">
                Field type
                <select
                  value={item.type ?? ''}
                  onChange={(e) => handleItemChange('type', e.target.value)}
                  disabled={disabled}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                >
                  <option value="">Auto detect</option>
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="bool">Boolean</option>
                  <option value="date">Date</option>
                  <option value="datetime">DateTime</option>
                  <option value="enumeration">Enumeration</option>
                </select>
              </label>

              {/* Multi-file strategy (file kind only) */}
              {item.kind === 'file' && (
                <label className="flex flex-col gap-1 font-medium text-slate-700">
                  Multi-file strategy
                  <select
                    value={item.multiFileStrategy ?? 'same_property'}
                    onChange={(e) => handleItemChange('multiFileStrategy', e.target.value)}
                    disabled={disabled}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                  >
                    {NUMBERED_FALLBACKS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              )}

              {/* Create if missing */}
              <label className="flex items-center gap-2 font-medium text-slate-700 mt-5">
                <input
                  type="checkbox"
                  checked={!!item.createIfMissing}
                  onChange={(e) => handleItemChange('createIfMissing', e.target.checked)}
                  disabled={disabled}
                  className="w-4 h-4 accent-[#ff7a59]"
                />
                Create if missing
              </label>
            </div>

            {/* Value map */}
            {item.type === 'enumeration' && (
              <div className="mt-4">
                <div className="text-[12px] font-medium text-slate-600 mb-2">Value translations</div>
                <div className="text-[11.5px] text-slate-400 italic">
                  Enter JSON map, e.g. <code className="bg-slate-100 px-1 rounded">{"{ \"Yes\": \"true\", \"No\": \"false\" }"}</code>
                </div>
                <textarea
                  value={item.valueMap ? JSON.stringify(item.valueMap) : ''}
                  onChange={(e) => {
                    try {
                      handleItemChange('valueMap', JSON.parse(e.target.value));
                    } catch { /* keep raw */ }
                  }}
                  disabled={disabled}
                  rows={2}
                  placeholder="{}"
                  className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50 resize-none"
                />
              </div>
            )}
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MondayMigration({ onShowToast, initialStep = 0, onStepChange }) {
  const [step, setStep] = useState(initialStep);
  const [busy, setBusy] = useState(false);
  const [busyMsg, setBusyMsg] = useState('');
  const [busySub, setBusySub] = useState('');
  const [loaded, setLoaded] = useState(false);

  // ── Step 0 state ─────────────────────────────────────────────────────────
  const [config, setConfig] = useState(null);
  const [workbookSummary, setWorkbookSummary] = useState(null);
  const [credentialsOk, setCredentialsOk] = useState(false);
  const [workbookError, setWorkbookError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Mapping top-level fields
  const [emailColumn, setEmailColumn] = useState('');
  const [nameColumn, setNameColumn] = useState('');
  const [sheet, setSheet] = useState('');
  const [contactMode, setContactMode] = useState('upsert');
  const [numberedFallback, setNumberedFallback] = useState('same_property');
  const [noteSetFirst, setNoteSetFirst] = useState(false);

  // ── Step 1 state ─────────────────────────────────────────────────────────
  const [items, setItems] = useState([]);       // all source columns as item objects
  const [properties, setProperties] = useState([]); // HubSpot contact properties
  const [filterTab, setFilterTab] = useState('all');
  const [search, setSearch] = useState('');
  const [mappingDirty, setMappingDirty] = useState(false);

  // ── Step 2 state ─────────────────────────────────────────────────────────
  const [preflight, setPreflight] = useState(null);
  const [preflighting, setPreflighting] = useState(false);

  // ── Step 3 state ─────────────────────────────────────────────────────────
  const [runMode, setRunMode] = useState('dry');
  const [confirmation, setConfirmation] = useState('');
  const [retryFailed, setRetryFailed] = useState(false);
  const [runState, setRunState] = useState({
    phase: 'idle', running: false, dryRun: false,
    total: 0, completed: 0,
    filesTotal: 0, contactsTotal: 0, contactsDone: 0,
    batchesTotal: 0, batchesSent: 0,
    eta: null, startedAt: null,
    logs: [], summary: null, error: null, preflight: null,
  });
  const [logs, setLogs] = useState([]);
  const runStateRef = useRef(runState);
  runStateRef.current = runState;

  const [elapsed, setElapsed] = useState('');

  const fileRef = useRef(null);
  const toast = useCallback((msg, t = 'info') => onShowToast?.(msg, t), [onShowToast]);

  // ── Action wrapper ────────────────────────────────────────────────────────
  const action = useCallback(async (fn, label = 'Processing...', sub = '') => {
    setBusy(true); setBusyMsg(label); setBusySub(sub);
    try { await fn(); } catch (e) { toast(e.message, 'error'); }
    finally { setBusy(false); setBusyMsg(''); setBusySub(''); }
  }, [toast]);

  // ── Step change ───────────────────────────────────────────────────────────
  const goStep = useCallback((s) => {
    setStep(s);
    onStepChange?.(s);
  }, [onStepChange]);

  // ── Load config ───────────────────────────────────────────────────────────
  const loadConfig = useCallback(async () => {
    const data = await request('/api/config');
    setConfig(data);
    setCredentialsOk(!!data.credentialsConfigured);
    setWorkbookSummary(data.workbookSummary ?? null);
    setWorkbookError(data.workbookError ?? '');

    const m = data.mapping ?? {};
    setEmailColumn(m.emailColumn ?? '');
    setNameColumn(m.nameColumn ?? '');
    setSheet(m.sheet ?? '');
    setContactMode(m.contactMode ?? 'upsert');
    setNumberedFallback(m.numberedFallback ?? 'same_property');
    setNoteSetFirst(!!m.noteSetFirst);

    // Build items array
    const cols = data.columns ?? m.columns ?? [];
    const propMaps = m.propertyMappings ?? [];

    const colItems = cols.map(c => ({
      excel: c.excel ?? c.name ?? c,
      kind: 'file',
      hubspotProperty: c.hubspotProperty ?? '',
      multiFileStrategy: c.multiFileStrategy ?? 'same_property',
      type: c.type ?? '',
      valueMap: c.valueMap ?? {},
      createIfMissing: !!c.createIfMissing,
      label: c.label ?? c.excel ?? '',
      samples: (data.previews ?? {})[c.excel ?? c] ?? [],
    }));

    const propItems = propMaps.map(p => ({
      excel: p.excel,
      kind: p.excel === m.emailColumn ? 'email' : 'contact',
      hubspotProperty: p.hubspotProperty ?? '',
      multiFileStrategy: '',
      type: p.type ?? '',
      fieldType: p.fieldType ?? '',
      valueMap: p.valueMap ?? {},
      createIfMissing: !!p.createIfMissing,
      label: p.label ?? p.excel,
      samples: (data.previews ?? {})[p.excel] ?? [],
    }));

    // Merge: file cols + contact property mappings
    const allItems = [...propItems, ...colItems];

    // Add email column item if not already present
    const hasEmail = allItems.some(i => i.kind === 'email');
    if (!hasEmail && m.emailColumn) {
      allItems.unshift({
        excel: m.emailColumn,
        kind: 'email',
        hubspotProperty: 'email',
        multiFileStrategy: '',
        type: 'string',
        valueMap: {},
        createIfMissing: false,
        label: m.emailColumn,
        samples: (data.previews ?? {})[m.emailColumn] ?? [],
      });
    }

    setItems(allItems);
    return data;
  }, []);

  // ── Load contact properties ───────────────────────────────────────────────
  const loadProperties = useCallback(async () => {
    const data = await request('/api/contact-mapping');
    setProperties(data.properties ?? []);
    return data.properties ?? [];
  }, []);

  // ── Load status on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (loaded) return;
    action(async () => {
      const data = await loadConfig();
      await loadProperties();
      setLoaded(true);

      // restore progress step
      if (data.savedProgress?.step != null) {
        const sp = data.savedProgress.step;
        goStep(sp);
      }

      // Check current status
      try {
        const status = await request('/api/status');
        if (status && status.phase && status.phase !== 'idle') {
          applyRunState(status);
          if (status.running || status.phase === 'complete' || status.phase === 'failed') {
            goStep(3);
          }
        }
      } catch { /* no status yet */ }
    }, 'Loading workspace…', 'Fetching config & HubSpot properties');
  }, []); // eslint-disable-line

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!runState.running || !runState.startedAt) { setElapsed(''); return; }
    const id = setInterval(() => {
      setElapsed(fmtElapsed(runState.startedAt) ?? '');
    }, 1000);
    return () => clearInterval(id);
  }, [runState.running, runState.startedAt]);

  // ── SSE ───────────────────────────────────────────────────────────────────
  const handleSSEMessage = useCallback((msg) => {
    applyRunState(msg);
  }, []);

  const { isConnected } = useSSE('/api/progress', handleSSEMessage);

  function applyRunState(msg) {
    setRunState(prev => ({ ...prev, ...msg }));
    if (msg.logs?.length) {
      setLogs(msg.logs.map(l => ({ ...l, level: l.level ?? 'info' })));
    }
  }

  // ── Build collectMapping ──────────────────────────────────────────────────
  const collectMapping = useCallback(() => {
    const fileItems = items.filter(i => i.kind === 'file');
    const otherItems = items.filter(i => i.kind !== 'file' && i.kind !== 'email');
    return {
      ...(config ?? {}),
      emailColumn,
      nameColumn,
      sheet,
      contactMode,
      noteSetFirst,
      numberedFallback,
      columns: fileItems.map(i => ({
        excel: i.excel,
        hubspotProperty: i.hubspotProperty,
        multiFileStrategy: i.multiFileStrategy,
      })),
      propertyMappings: otherItems.map(i => ({
        excel: i.excel,
        hubspotProperty: i.hubspotProperty,
        createIfMissing: i.createIfMissing,
        type: i.type,
        fieldType: i.fieldType,
        label: i.label,
        valueMap: i.valueMap,
      })),
    };
  }, [config, emailColumn, nameColumn, sheet, contactMode, noteSetFirst, numberedFallback, items]);

  // ── Save mappings ─────────────────────────────────────────────────────────
  const saveMappings = useCallback(async () => {
    await request('/api/config', 'PUT', collectMapping());
    setMappingDirty(false);
    toast('Mappings saved.', 'success');
  }, [collectMapping, toast]);

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = useCallback(async (file) => {
    if (!file) return;
    if (!/\.(csv|xlsx)$/i.test(file.name) || file.size > 100 * 1024 ** 2) {
      toast('Choose a CSV or XLSX file up to 100 MB.', 'error');
      return;
    }
    await action(async () => {
      const form = new FormData();
      form.append('file', file);
      await request('/api/upload', 'POST', form);
      await loadConfig();
      toast('Workbook uploaded successfully.', 'success');
    }, 'Uploading workbook…', 'Parsing columns and building mapping');
  }, [action, loadConfig, toast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  // ── Run preflight ─────────────────────────────────────────────────────────
  const handlePreflight = useCallback(async () => {
    setPreflighting(true);
    setPreflight(null);
    try {
      const result = await request('/api/preflight', 'POST', {});
      setPreflight(result);
      const issueCount = result.issues?.length ?? 0;
      toast(issueCount > 0
        ? `Preflight found ${issueCount} issue(s).`
        : 'Preflight passed. Ready to migrate.',
        issueCount > 0 ? 'error' : 'success');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setPreflighting(false);
    }
  }, [toast]);

  // ── Run ───────────────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    await action(async () => {
      const body = {
        dryRun: runMode === 'dry',
        retryFailed,
        confirmation: runMode === 'real' ? confirmation : undefined,
      };
      const result = await request('/api/run', 'POST', body);
      setConfirmation('');
      applyRunState(result);
    }, runMode === 'real' ? 'Starting migration…' : 'Starting dry run…', 'Initializing Monday → HubSpot pipeline');
  }, [action, runMode, retryFailed, confirmation]);

  const handleCancel = useCallback(async () => {
    try {
      await request('/api/cancel', 'POST', {});
      toast('Cancellation requested.', 'info');
    } catch (e) {
      toast(e.message, 'error');
    }
  }, [toast]);

  // ── Item update ───────────────────────────────────────────────────────────
  const handleItemChange = useCallback((idx, updated) => {
    setItems(prev => prev.map((item, i) => i === idx ? updated : item));
    setMappingDirty(true);
    setPreflight(null);
  }, []);

  // ── Filter tabs ───────────────────────────────────────────────────────────
  const filterCounts = {
    all: items.length,
    mapped: items.filter(i => i.hubspotProperty).length,
    ignored: items.filter(i => !i.hubspotProperty && i.kind !== 'email').length,
    files: items.filter(i => i.kind === 'file').length,
    issues: 0, // could wire to preflight issues
  };

  const filteredItems = items.filter(item => {
    const q = search.toLowerCase();
    if (q && !item.excel.toLowerCase().includes(q)) return false;
    if (filterTab === 'mapped') return !!item.hubspotProperty;
    if (filterTab === 'ignored') return !item.hubspotProperty && item.kind !== 'email';
    if (filterTab === 'files') return item.kind === 'file';
    if (filterTab === 'issues') return false; // placeholder
    return true;
  });

  // ── Preflight issue map ───────────────────────────────────────────────────
  const issuesByColumn = {};
  (preflight?.issues ?? []).forEach(issue => {
    if (issue.column) {
      if (!issuesByColumn[issue.column]) issuesByColumn[issue.column] = [];
      issuesByColumn[issue.column].push(issue);
    }
  });

  // ── Run progress ──────────────────────────────────────────────────────────
  const pct = runState.total
    ? Math.round(((runState.completed ?? 0) / runState.total) * 100)
    : 0;

  const canRun = !busy && !runState.running && !!workbookSummary && credentialsOk
    && (runMode !== 'real' || confirmation === 'RUN FOR REAL');

  // ── Ignored columns (for step 2) ──────────────────────────────────────────
  const ignoredCols = items.filter(i => !i.hubspotProperty && i.kind !== 'email');
  const mappedCols = items.filter(i => !!i.hubspotProperty);
  const newProps = items.filter(i => i.createIfMissing && i.hubspotProperty);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="py-6 px-8 w-full max-w-[1500px]">
      <LoadingOverlay show={busy} title={busyMsg} sub={busySub} />

      <h1 className="text-[1.9rem] font-black text-slate-900 leading-tight mb-1">
        Monday → HubSpot Migration
      </h1>
      <p className="text-slate-500 text-[13px] mb-6">
        Map Monday.com workbook columns to HubSpot contact properties and run your migration.
      </p>

      <StepperBar
        steps={STEPS}
        current={step}
        onSelect={s => goStep(s)}
        canAdvance={!!workbookSummary && credentialsOk}
      />

      {/* ───────── Step 0: Choose workbook ───────── */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          {/* Credentials / connection status */}
          {!credentialsOk && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[13px] text-amber-900">Monday.com credentials not configured</p>
                <p className="text-[12px] text-amber-700 mt-0.5">
                  Set <code className="bg-amber-100 px-1 rounded">MONDAY_API_KEY</code> and{' '}
                  <code className="bg-amber-100 px-1 rounded">HUBSPOT_PRIVATE_APP_TOKEN</code> in your{' '}
                  <code className="bg-amber-100 px-1 rounded">.env</code> file, then restart the server.
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => action(() => request('/api/reset-credentials', 'POST', {}), 'Rebinding credentials…')}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 text-[12.5px] text-amber-800 hover:bg-amber-100 transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Rebind credentials
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Upload card */}
            <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="font-bold text-slate-800 text-[15px]">Workbook</h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">Upload your Monday.com export workbook.</p>
                </div>
                <Badge variant="neutral">CSV / XLSX</Badge>
              </div>
              <div className="px-6 py-4 flex flex-col gap-3">
                {/* Dropzone */}
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition
                    ${isDragOver
                      ? 'border-[#ff7a59] bg-orange-50'
                      : 'border-slate-200 hover:border-[#ff7a59]/40 hover:bg-orange-50/30'}`}
                >
                  <Upload className={`w-8 h-8 ${isDragOver ? 'text-[#ff7a59]' : 'text-slate-300'}`} />
                  <span className="font-semibold text-slate-700 text-[13px]">
                    {isDragOver ? 'Drop to upload' : 'Drag & drop or click to select'}
                  </span>
                  <span className="text-[11.5px] text-slate-400">CSV or XLSX · up to 100 MB</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.xlsx"
                    className="sr-only"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
                  />
                </div>

                {/* Workbook summary */}
                {workbookSummary && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-800">
                    <div className="font-semibold mb-1 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {workbookSummary.filename}
                    </div>
                    <div className="flex gap-3 flex-wrap text-emerald-700">
                      <span>{(workbookSummary.contacts ?? 0).toLocaleString()} contacts</span>
                      <span>·</span>
                      <span>{(workbookSummary.files ?? 0).toLocaleString()} file refs</span>
                      <span>·</span>
                      <span>{(workbookSummary.columns ?? 0).toLocaleString()} columns</span>
                    </div>
                    {workbookSummary.alreadyUploaded && (
                      <p className="text-[11.5px] text-emerald-600 mt-1">Previously uploaded — ready to map.</p>
                    )}
                  </div>
                )}

                {workbookError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-800">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4" />
                      Workbook error
                    </div>
                    {workbookError}
                  </div>
                )}
              </div>
            </article>

            {/* Configuration card */}
            <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-[15px]">Migration settings</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Configure how records are matched and created.</p>
              </div>
              <div className="px-6 py-4 flex flex-col gap-4">
                {/* Contact mode */}
                <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                  Contact mode
                  <select
                    value={contactMode}
                    onChange={e => setContactMode(e.target.value)}
                    disabled={busy}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                  >
                    {CONTACT_MODES.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>

                {/* Sheet */}
                <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                  Sheet name
                  <input
                    type="text"
                    value={sheet}
                    onChange={e => setSheet(e.target.value)}
                    placeholder="Leave blank for first sheet"
                    disabled={busy}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                  />
                </label>

                {/* Email + Name columns */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                    Email column
                    <input
                      type="text"
                      value={emailColumn}
                      onChange={e => setEmailColumn(e.target.value)}
                      placeholder="e.g. Email"
                      disabled={busy}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                    Name column
                    <input
                      type="text"
                      value={nameColumn}
                      onChange={e => setNameColumn(e.target.value)}
                      placeholder="e.g. Full Name"
                      disabled={busy}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                    />
                  </label>
                </div>

                {/* Numbered fallback */}
                <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                  Multi-file fallback
                  <select
                    value={numberedFallback}
                    onChange={e => setNumberedFallback(e.target.value)}
                    disabled={busy}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                  >
                    {NUMBERED_FALLBACKS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>

                {/* Note set first */}
                <label className="flex items-center gap-2 text-[12.5px] font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noteSetFirst}
                    onChange={e => setNoteSetFirst(e.target.checked)}
                    disabled={busy}
                    className="w-4 h-4 accent-[#ff7a59]"
                  />
                  Upload notes before files
                </label>

                {/* App actions */}
                <div className="flex gap-2 flex-wrap pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => action(() => request('/api/restart', 'POST', {}), 'Restarting…')}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restart app
                  </button>
                  <button
                    type="button"
                    onClick={() => action(() => request('/api/reset-credentials', 'POST', {}), 'Rebinding credentials…')}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Rebind credentials
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* ───────── Step 1: Map columns ───────── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          {/* Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-[12.5px]">
              <span className="text-slate-500">
                <strong className="text-slate-800">{filterCounts.mapped}</strong> mapped
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">
                <strong className="text-slate-800">{filterCounts.ignored}</strong> ignored
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">
                <strong className="text-slate-800">{filterCounts.files}</strong> file columns
              </span>
              {mappingDirty && (
                <Badge variant="warning">Unsaved changes</Badge>
              )}
            </div>
            <button
              type="button"
              onClick={() => action(saveMappings, 'Saving mappings…')}
              disabled={busy || !mappingDirty}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer"
            >
              Save mappings
            </button>
          </div>

          {/* Table card */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 flex-wrap gap-3">
              {/* Filter tabs */}
              <div className="flex items-center gap-1">
                {(['all', 'mapped', 'ignored', 'files', 'issues']).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterTab(tab)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition cursor-pointer
                      ${filterTab === tab
                        ? 'bg-[#ff7a59]/10 text-[#df6d50]'
                        : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold
                      ${filterTab === tab ? 'bg-[#ff7a59]/20' : 'bg-slate-100 text-slate-400'}`}>
                      {filterCounts[tab]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search columns…"
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 w-48"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Source column', 'Sample values', 'Status', 'HubSpot property', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-slate-400 italic text-[13px]">
                        No columns match your filter.
                      </td>
                    </tr>
                  )}
                  {filteredItems.map((item) => {
                    const idx = items.findIndex(i => i.excel === item.excel);
                    return (
                      <MappingRow
                        key={item.excel}
                        item={item}
                        properties={properties}
                        onChange={(updated) => handleItemChange(idx, updated)}
                        disabled={busy}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[12px] text-slate-400">
                {filteredItems.length} of {items.length} columns shown
              </p>
              <button
                type="button"
                onClick={() => action(saveMappings, 'Saving mappings…')}
                disabled={busy || !mappingDirty}
                className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
              >
                Save mappings
              </button>
            </div>
          </article>
        </div>
      )}

      {/* ───────── Step 2: Review & validate ───────── */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          {/* Stats cards */}
          {preflight && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Contacts"
                value={(preflight.contacts ?? 0).toLocaleString()}
                icon={Users}
                color="blue"
              />
              <StatCard
                label="Files"
                value={(preflight.files ?? 0).toLocaleString()}
                icon={File}
                color="orange"
              />
              <StatCard
                label="Will be created"
                value={(preflight.contactsToCreate ?? 0).toLocaleString()}
                icon={CheckCircle}
                color="emerald"
              />
              <StatCard
                label="Will be updated"
                value={(preflight.contactsToUpdate ?? 0).toLocaleString()}
                icon={RefreshCw}
                color="slate"
              />
            </div>
          )}

          {/* Preflight card */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800 text-[15px]">Preflight check</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  Validate your mapping before running the migration.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePreflight}
                disabled={busy || preflighting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer"
              >
                {preflighting ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Running preflight…</>
                ) : (
                  <><Play className="w-4 h-4" /> Run preflight</>
                )}
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Validation status */}
              {preflight ? (
                <div className={`p-4 rounded-xl border ${
                  (preflight.issues?.length ?? 0) > 0
                    ? 'bg-red-50 border-red-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {(preflight.issues?.length ?? 0) > 0
                      ? <XCircle className="w-5 h-5 text-red-500" />
                      : <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    <p className={`font-semibold text-[13px] ${
                      (preflight.issues?.length ?? 0) > 0 ? 'text-red-800' : 'text-emerald-800'
                    }`}>
                      {(preflight.issues?.length ?? 0) > 0
                        ? `${preflight.issues.length} issue(s) found — review before migrating`
                        : 'All checks passed — ready to migrate'}
                    </p>
                  </div>
                  {(preflight.issues?.length ?? 0) > 0 && (
                    <ul className="text-[12px] text-red-700 list-disc ml-5 space-y-0.5 mt-2">
                      {preflight.issues.slice(0, 20).map((issue, i) => (
                        <li key={i}>
                          {issue.column && <strong>[{issue.column}]</strong>}
                          {issue.row ? ` row ${issue.row}: ` : ' '}
                          {issue.error}
                        </li>
                      ))}
                      {preflight.issues.length > 20 && (
                        <li>…and {(preflight.issues.length - 20).toLocaleString()} more.</li>
                      )}
                    </ul>
                  )}
                </div>
              ) : (
                !preflighting && (
                  <p className="text-slate-400 italic text-[13px]">
                    Click "Run preflight" to validate your mapping. Nothing is written to HubSpot.
                  </p>
                )
              )}

              {/* Import plan */}
              {preflight && (
                <div>
                  <h3 className="font-semibold text-slate-700 text-[13px] mb-3">Import plan</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[12.5px]">
                    {[
                      ['Contact mode', CONTACT_MODES.find(m => m.value === contactMode)?.label ?? contactMode],
                      ['Matching key', emailColumn || 'Email column'],
                      ['File handling', NUMBERED_FALLBACKS.find(f => f.value === numberedFallback)?.label ?? numberedFallback],
                      ['New properties', newProps.length > 0 ? `${newProps.length} to create` : 'None'],
                      ['Total rows', (preflight.rows ?? 0).toLocaleString()],
                    ].map(([label, value]) => (
                      <div key={label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium mb-0.5">{label}</div>
                        <div className="font-semibold text-slate-800">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New properties to create */}
              {preflight && (preflight.propertiesToCreate?.length ?? 0) > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-700 text-[13px] mb-2">Properties to create</h3>
                  <div className="flex flex-wrap gap-2">
                    {preflight.propertiesToCreate.map(p => (
                      <span key={p} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[12px] font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ignored columns */}
              {ignoredCols.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-700 text-[13px] mb-2">
                    Ignored columns ({ignoredCols.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ignoredCols.map(c => (
                      <span key={c.excel} className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[12px]">
                        {c.excel}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Continue button */}
              {preflight && (preflight.issues?.length ?? 0) === 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => goStep(3)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition cursor-pointer"
                  >
                    Continue to migration →
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>
      )}

      {/* ───────── Step 3: Run & monitor ───────── */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Controls */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800 text-[15px]">Run & monitor</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Preview or run the migration into HubSpot.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <Badge variant={phaseBadgeVariant(runState.phase)}>
                  {runState.phase?.replaceAll('_', ' ') ?? 'idle'}
                </Badge>
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Stage rail */}
              <StageRail phase={runState.phase} />

              {/* Run mode radio */}
              <div>
                <p className="text-[12.5px] font-medium text-slate-700 mb-2">Run mode</p>
                <div className="flex gap-3">
                  {[
                    { value: 'dry', label: 'Dry run', sub: 'No HubSpot changes' },
                    { value: 'real', label: 'Real migration', sub: 'Writes to HubSpot' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex-1 flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition
                        ${runMode === opt.value
                          ? 'border-[#ff7a59] bg-orange-50/60'
                          : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <input
                        type="radio"
                        name="runMode"
                        value={opt.value}
                        checked={runMode === opt.value}
                        onChange={() => setRunMode(opt.value)}
                        disabled={busy || runState.running}
                        className="mt-0.5 accent-[#ff7a59]"
                      />
                      <div>
                        <div className="font-semibold text-[12.5px] text-slate-800">{opt.label}</div>
                        <div className="text-[11.5px] text-slate-400">{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Real confirmation */}
              {runMode === 'real' && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-[12.5px] text-orange-900">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    This will write to your HubSpot portal.
                  </div>
                  <label className="flex flex-col gap-1.5 font-medium">
                    Type <code className="font-mono bg-orange-100 px-1 rounded">RUN FOR REAL</code> to confirm
                    <input
                      value={confirmation}
                      onChange={e => setConfirmation(e.target.value)}
                      placeholder="RUN FOR REAL"
                      autoComplete="off"
                      disabled={busy || runState.running}
                      className="px-3 py-2 rounded-lg border border-orange-200 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                    />
                  </label>
                </div>
              )}

              {/* Retry failed */}
              <label className="flex items-center gap-2 text-[12.5px] font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={retryFailed}
                  onChange={e => setRetryFailed(e.target.checked)}
                  disabled={busy || runState.running}
                  className="w-4 h-4 accent-[#ff7a59]"
                />
                Retry previously failed records
              </label>

              {/* Run / Cancel buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={!canRun}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  {runMode === 'real' ? 'Run migration' : 'Run dry run'}
                </button>
                {runState.running && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition cursor-pointer"
                  >
                    <Square className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <ProgressBar value={pct} />
                <div className="flex items-center justify-between text-[12px] text-slate-500 tabular-nums">
                  <span>{pct}% — {(runState.completed ?? 0).toLocaleString()} / {(runState.total ?? 0).toLocaleString()} records</span>
                  {runState.eta && <span>{fmtSeconds(runState.eta)}</span>}
                </div>
                {(runState.filesTotal > 0 || runState.contactsTotal > 0) && (
                  <div className="flex gap-4 text-[12px] text-slate-400 flex-wrap">
                    <span>
                      <FileText className="w-3.5 h-3.5 inline mr-1" />
                      Files: {(runState.filesTotal ?? 0).toLocaleString()}
                    </span>
                    <span>
                      <Users className="w-3.5 h-3.5 inline mr-1" />
                      Contacts: {(runState.contactsDone ?? 0).toLocaleString()} / {(runState.contactsTotal ?? 0).toLocaleString()}
                    </span>
                    {runState.batchesTotal > 0 && (
                      <span>
                        Batches: {(runState.batchesSent ?? 0).toLocaleString()} / {(runState.batchesTotal ?? 0).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
                {(runState.running || runState.startedAt) && (
                  <div className="flex gap-3 text-[11.5px] text-slate-400">
                    {elapsed && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {elapsed}
                      </span>
                    )}
                    {runState.currentOperation && (
                      <span className="text-slate-500 italic">{runState.currentOperation}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Error */}
              {runState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-800">
                  <div className="font-semibold mb-1 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Run error
                  </div>
                  {runState.error}
                </div>
              )}

              {/* Downloads */}
              <div className="flex gap-3 flex-wrap pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => action(() => downloadFile('/api/report', 'monday-file-report.csv'), 'Preparing CSV…')}
                  disabled={busy || !['complete', 'failed'].includes(runState.phase)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[12.5px] text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  File report
                </button>
                <button
                  type="button"
                  onClick={() => action(() => downloadFile('/api/contact-report', 'monday-contact-report.csv'), 'Preparing CSV…')}
                  disabled={busy || !['complete', 'failed'].includes(runState.phase)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[12.5px] text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Contact report
                </button>
              </div>
            </div>
          </article>

          {/* Activity log */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800 text-[15px]">Activity log</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Live stream from the migration pipeline.</p>
              </div>
              <div className="flex items-center gap-3">
                {/* SSE connection dot */}
                <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                  {isConnected
                    ? <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                    : <WifiOff className="w-3.5 h-3.5 text-slate-300" />}
                  {isConnected ? 'Live' : 'Disconnected'}
                </div>
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  disabled={logs.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-500 hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>
            <div className="px-6 py-4 flex-1 min-h-0">
              <ActivityLog
                logs={logs}
                emptyText="Start a dry run or migration to see live activity."
              />
            </div>
          </article>
        </div>
      )}

      {/* ───────── Footer nav ───────── */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => goStep(Math.max(0, step - 1))}
          disabled={step === 0 || busy}
          className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
        >
          ← Back
        </button>

        <span className="text-[12px] text-slate-400">
          {mappingDirty
            ? 'Mappings have unsaved changes.'
            : workbookSummary
              ? `${(workbookSummary.contacts ?? 0).toLocaleString()} contacts · ${(workbookSummary.columns ?? 0)} columns`
              : 'Upload a workbook to get started.'}
        </span>

        {step < 3 && (
          <button
            type="button"
            onClick={async () => {
              if (step === 1 && mappingDirty) {
                await action(saveMappings, 'Saving mappings…');
              }
              goStep(Math.min(3, step + 1));
            }}
            disabled={busy || (!workbookSummary && step === 0)}
            className="px-4 py-2 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer"
          >
            {step === 0 ? 'Map columns →' : step === 1 ? 'Review & validate →' : 'Run & monitor →'}
          </button>
        )}
      </div>
    </div>
  );
}
