import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, RefreshCw, Download, Play, Square, RotateCcw } from 'lucide-react';
import { request, downloadFile } from '../../hooks/useApi.js';
import { LoadingOverlay } from '../../components/ui/Loader.jsx';
import { StepperBar } from '../../components/ui/StepperBar.jsx';
import { PropertyPicker } from '../../components/ui/PropertyPicker.jsx';
import { ActivityLog } from '../../components/ui/ActivityLog.jsx';
import { ProgressBar } from '../../components/ui/ProgressBar.jsx';
import { Badge } from '../../components/ui/Badge.jsx';

const MODE = 'data-migrate';
const ep = (suffix) => `/api/hubspot/${MODE}/${suffix}`;
const STEPS = ['Choose workbook', 'Map columns', 'Review & validate', 'Run & monitor'];
const normalize = (v) => String(v).toLowerCase().replace(/[^a-z0-9]/g, '');

function planBadge(variant) {
  const map = { neutral: 'neutral', success: 'success', warning: 'warning', error: 'error', blocked: 'error', completed: 'success', completed_with_errors: 'warning', cancelled: 'warning', idle: 'neutral', previewing: 'info', migrating: 'info', validating: 'info' };
  return map[variant] ?? 'neutral';
}

// ─── Validation Timeline ─────────────────────────────────────────────────────
const STAGES = [
  { id: 'save', label: '1. Save column mappings', sub: 'Persisting current mapping & match configuration' },
  { id: 'parse', label: '2. Parse workbook records', sub: 'Loading worksheet records and column headers' },
  { id: 'validate', label: '3. Validate data integrity', sub: 'Checking property formats, enums, dates & unique IDs' },
  { id: 'remote', label: '4. Check HubSpot schema', sub: 'Verifying CRM destination properties & schema rules' },
  { id: 'summary', label: '5. Compile validation report', sub: 'Aggregating record counts and validation issues' },
];

function ValidationTimeline({ stages }) {
  // stages: Map id -> { status: 'pending'|'active'|'completed'|'error', detail }
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
      <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
          <span className={`w-2 h-2 rounded-full inline-block ${stages.get('summary')?.status === 'completed' ? 'bg-emerald-500' : stages.get('summary')?.status === 'error' ? 'bg-red-500' : 'bg-[#ff7a59] animate-pulse'}`} />
          {stages.get('summary')?.status === 'completed' ? 'Validation complete' : stages.get('summary')?.status === 'error' ? 'Validation error' : 'Validation in progress'}
        </div>
        <span className="text-[11px] text-slate-400 font-mono">{stages.get('_elapsed') ?? ''}</span>
      </div>
      <div className="divide-y divide-slate-100">
        {STAGES.map((s, idx) => {
          const st = stages.get(s.id) ?? { status: 'pending' };
          return (
            <div key={s.id} className={`flex items-start gap-4 px-5 py-3 transition
              ${st.status === 'active' ? 'bg-orange-50' : st.status === 'completed' ? 'bg-emerald-50/40' : st.status === 'error' ? 'bg-red-50' : ''}
            `}>
              <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 transition
                ${st.status === 'completed' ? 'bg-emerald-500 text-white' : st.status === 'error' ? 'bg-red-500 text-white' : st.status === 'active' ? 'bg-[#ff7a59] text-white animate-pulse' : 'bg-slate-200 text-slate-500'}
              `}>
                {st.status === 'completed' ? '✓' : st.status === 'error' ? '✕' : idx + 1}
              </span>
              <div>
                <div className={`text-[12.5px] font-semibold ${st.status === 'active' ? 'text-[#df6d50]' : st.status === 'completed' ? 'text-emerald-800' : st.status === 'error' ? 'text-red-800' : 'text-slate-500'}`}>{s.label}</div>
                <div className="text-[11.5px] text-slate-400 mt-0.5">{st.detail ?? s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Run Timeline ─────────────────────────────────────────────────────────────
const RUN_STAGES = [
  { id: 'validate', label: '1. Validation' },
  { id: 'process', label: '2. Migration' },
  { id: 'associations', label: '3. Associations' },
  { id: 'finish', label: '4. Summary' },
];

function RunTimeline({ job }) {
  if (!job || job.phase === 'idle') return null;
  const getStatus = (id) => {
    const p = job.phase;
    if (p === 'validating') return id === 'validate' ? 'active' : 'pending';
    if (p === 'previewing' || p === 'migrating') return id === 'validate' ? 'done' : id === 'process' ? 'active' : 'pending';
    if (p === 'blocked') return id === 'validate' ? 'error' : 'pending';
    if (p === 'completed' || p === 'completed_with_errors') return id === 'finish' && job.failed > 0 ? 'error' : 'done';
    if (p === 'cancelled') return id === 'process' ? 'error' : id === 'validate' ? 'done' : 'pending';
    if (p === 'failed' || p === 'interrupted') return id === 'validate' || id === 'process' ? 'error' : 'pending';
    return 'pending';
  };
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {RUN_STAGES.map((s) => {
        const st = getStatus(s.id);
        return (
          <span key={s.id} className={`flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1.5 rounded-full
            ${st === 'done' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : st === 'active' ? 'bg-orange-50 text-[#df6d50] border border-[#ff7a59]/30 animate-pulse' : st === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-400'}
          `}>
            {st === 'done' ? '✓' : st === 'error' ? '✕' : st === 'active' ? '◉' : '○'}
            {s.label}
          </span>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function DataMigrate({ onShowToast }) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [busyMsg, setBusyMsg] = useState('');
  const [busySub, setBusySub] = useState('');

  // Step 1 state
  const [objects, setObjects] = useState([]);
  const [portalMeta, setPortalMeta] = useState('');
  const [credentials, setCredentials] = useState('');
  const [selectedObject, setSelectedObject] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  // Step 2 state
  const [properties, setProperties] = useState([]);
  const [mapping, setMapping] = useState({});
  const [identifierColumn, setIdentifierColumn] = useState('');
  const [idProperty, setIdProperty] = useState('hs_object_id');
  const [associations, setAssociations] = useState([]);
  const [dirty, setDirty] = useState(false);

  // Step 3 state
  const [review, setReview] = useState(null);
  const [valStages, setValStages] = useState(new Map());
  const [validating, setValidating] = useState(false);

  // Step 4 state
  const [runMode, setRunMode] = useState('dry');
  const [confirmation, setConfirmation] = useState('');
  const [job, setJob] = useState({ phase: 'idle', running: false });
  const [logs, setLogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fileRef = useRef(null);
  const jobRef = useRef(job);
  jobRef.current = job;

  const type = () => selectedObject?.objectTypeId ?? '';

  const toast = useCallback((msg, t = 'info') => onShowToast?.(msg, t), [onShowToast]);

  const action = useCallback(async (fn, label = 'Processing...', sub = '') => {
    if (busy || jobRef.current.running) return;
    setBusy(true); setBusyMsg(label); setBusySub(sub);
    try { await fn(); } catch (e) { toast(e.message, 'error'); }
    finally { setBusy(false); setBusyMsg(''); setBusySub(''); }
  }, [busy, toast]);

  const invalidate = () => { setReview(null); setDirty(true); setValStages(new Map()); };

  // ── Load catalogue ─────────────────────────────────────────────────────────
  const loadCatalogue = useCallback(async (refresh = false) => {
    const cat = await request(`/api/hubspot/objects${refresh ? '?refresh=true' : ''}`);
    setObjects(cat.objects);
    setPortalMeta(`${cat.portalName ?? 'HubSpot'} · Portal ${cat.portalId}`);
    if (cat.warnings?.length) toast(cat.warnings.join(' '), 'info');
    return cat;
  }, [toast]);

  // ── Load properties ────────────────────────────────────────────────────────
  const loadProperties = useCallback(async (suggest = false) => {
    if (!selectedObject) throw new Error('Choose a destination object from the portal first.');
    const props = await request(`/api/hubspot/properties/${encodeURIComponent(selectedObject.objectTypeId)}`);
    setProperties(props);
    if (suggest && workbook) {
      const autoMap = Object.fromEntries(
        workbook.columns.map((col) => [
          col.name,
          props.find((p) =>
            !p.modificationMetadata?.readOnlyValue && !p.calculated &&
            (normalize(p.name) === normalize(col.name) || normalize(p.label) === normalize(col.name))
          )?.name ?? ''
        ])
      );
      setMapping(autoMap);
      const identity = workbook.columns.find((c) => /^(recordid|hsobjectid)$/.test(normalize(c.name))) ??
        workbook.columns.find((c) => selectedObject.objectTypeId === '0-1' && normalize(c.name) === 'email');
      if (identity) {
        setIdentifierColumn(identity.name);
        setIdProperty(normalize(identity.name) === 'email' ? 'email' : 'hs_object_id');
      }
    }
    return props;
  }, [selectedObject, workbook]);

  // ── Save config ────────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    await request(ep('config'), 'PUT', {
      objectType: type(),
      identifierColumn,
      idProperty,
      mapping,
      associations: associations.map(({ objectType, column, typeId }) => ({ objectType, column, typeId })),
    });
    setDirty(false);
  }, [identifierColumn, idProperty, mapping, associations, selectedObject]);

  // ── Load state on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (loaded) return;
    action(async () => {
      const result = await request(ep('state'));
      setLoaded(true);
      setWorkbook(result.workbook);
      setSelectedObject(result.selectedObject);
      setCredentials(result.credentialsConfigured ? 'Portal credentials are configured.' : 'Configure HUBSPOT_PORTAL_ID and HUBSPOT_PRIVATE_APP_TOKEN in .env, then restart.');
      if (result.credentialsConfigured) await loadCatalogue();
      if (result.config) {
        const c = result.config;
        setMapping(c.mapping ?? {});
        setIdentifierColumn(c.identifierColumn ?? '');
        setIdProperty(c.idProperty ?? 'hs_object_id');
        setAssociations(c.associations ?? []);
        setDirty(false);
      }
      if (result.status) applyJob(result.status);
      if (result.workbook && result.selectedObject && result.credentialsConfigured) {
        try { await loadProperties(!result.config); if (result.config) setDirty(false); }
        catch (e) { toast(e.message, 'error'); }
      }
      if (result.status?.running || (result.status?.phase && result.status.phase !== 'idle')) setStep(3);
    }, 'Loading workspace…');
  }, []); // eslint-disable-line

  function applyJob(j) {
    setJob(j);
    if (j.review) setReview(j.review);
    if (j.logs?.length) setLogs(j.logs.map((e) => ({ ...e, level: e.level ?? 'info' })));
  }

  // ── Poll when running ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(async () => {
      if (!jobRef.current.running) return;
      try { applyJob(await request(ep('status'))); } catch { /* */ }
    }, 2000);
    return () => clearInterval(id);
  }, [loaded]);

  // ── Navigate between steps ─────────────────────────────────────────────────
  const navigate = useCallback(async (target) => {
    await action(async () => {
      if (target > 0 && (!workbook || !selectedObject)) throw new Error('Select a portal object and upload a workbook first.');
      if (step === 1 && dirty) await save();
      if (target > 0 && !properties.length) await loadProperties(Object.keys(mapping).length === 0);
      setStep(target);
    }, target === 1 ? 'Loading HubSpot properties & preparing column mappings...' :
        target === 2 ? 'Saving mappings & preparing validation review...' : 'Loading run monitor...');
  }, [step, workbook, selectedObject, dirty, properties, mapping, save, loadProperties, action]);

  // ── Object change ──────────────────────────────────────────────────────────
  const handleObjectChange = useCallback(async (objectTypeId) => {
    await action(async () => {
      if (!objectTypeId) { setSelectedObject(null); invalidate(); return; }
      const result = await request(ep('object'), 'PUT', { objectTypeId });
      setSelectedObject(result.selectedObject);
      setProperties([]); setMapping({}); setIdentifierColumn(''); setIdProperty('hs_object_id');
      setAssociations((a) => a.map((link) => ({ ...link, typeId: null, labels: null })));
      invalidate();
      if (workbook) await loadProperties(true);
    }, 'Updating destination object & loading portal schema...');
  }, [workbook, loadProperties, action]);

  // ── Upload workbook ────────────────────────────────────────────────────────
  const handleUpload = useCallback(async () => {
    await action(async () => {
      const file = fileRef.current?.files[0];
      if (!file) return;
      if (!/\.(csv|xlsx)$/i.test(file.name) || file.size > 50 * 1024 ** 2) throw new Error('Choose a CSV or XLSX workbook up to 50 MB.');
      const form = new FormData(); form.append('file', file);
      const result = await request(ep('workbook'), 'POST', form);
      setWorkbook(result.workbook); setMapping({}); setIdentifierColumn(''); setIdProperty('hs_object_id');
      invalidate();
      toast('Workbook ready. Continue to map columns.', 'success');
      try { await loadProperties(true); } catch (e) { toast(`Workbook uploaded. ${e.message}`, 'error'); }
    }, 'Uploading workbook & analyzing columns...');
  }, [loadProperties, toast, action]);

  // ── Validate ───────────────────────────────────────────────────────────────
  const handleValidate = useCallback(async () => {
    setValidating(true);
    setValStages(new Map([['save', { status: 'active', detail: 'Saving mappings and match configuration...' }]]));
    const startMs = Date.now();
    try {
      await save();
      const newStages = new Map([
        ['save', { status: 'completed', detail: 'Mappings and match settings saved' }],
        ['parse', { status: 'active', detail: `Loading worksheet records from ${workbook?.filename ?? 'workbook'}...` }],
      ]);
      setValStages(newStages);
      // auto-progress
      const timers = [
        { id: 'validate', delay: 800, detail: 'Checking cell data types, options, dates and emails...' },
        { id: 'remote', delay: 1800, detail: 'Querying HubSpot CRM schema and verifying record identifiers...' },
        { id: 'summary', delay: 3500, detail: 'Aggregating record results and building validation report...' },
      ].map(({ id, delay, detail }) =>
        setTimeout(() => setValStages((prev) => {
          const m = new Map(prev);
          m.set(id, { status: 'active', detail });
          return m;
        }), delay)
      );
      const result = await request(ep('preflight'), 'POST', {});
      timers.forEach(clearTimeout);
      const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
      setReview(result);
      setValStages(new Map([
        ['save', { status: 'completed' }],
        ['parse', { status: 'completed', detail: `Parsed ${(result.rows ?? workbook?.rows ?? 0).toLocaleString()} workbook records successfully` }],
        ['validate', { status: 'completed', detail: result.issueCount ? `Found ${result.issueCount.toLocaleString()} format or constraint items` : 'All mapped columns and cell formats verified' }],
        ['remote', { status: 'completed', detail: `${(result.existing ?? 0).toLocaleString()} existing matched · ${(result.creating ?? 0).toLocaleString()} to create` }],
        ['summary', { status: 'completed', detail: `Completed in ${elapsed}s` }],
        ['_elapsed', `Completed in ${elapsed}s`],
      ]));
      toast(result.issueCount ? 'Validation found issues. Review the results below.' : 'Validation passed. Your import is ready.', Boolean(result.issueCount) ? 'error' : 'success');
    } catch (e) {
      setValStages((prev) => {
        const m = new Map(prev);
        // mark active stage as error
        for (const [k, v] of m) if (v.status === 'active') m.set(k, { status: 'error', detail: e.message });
        return m;
      });
      toast(e.message, 'error');
    } finally {
      setValidating(false);
    }
  }, [save, workbook, toast]);

  // ── Run ────────────────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    await action(async () => {
      if (dirty) await save();
      const j = await request(ep('run'), 'POST', { dryRun: runMode !== 'real', confirmation });
      setConfirmation('');
      applyJob(j);
    }, runMode === 'real' ? 'Starting migration...' : 'Starting dry preview...', 'Initializing HubSpot 2026-09 batch engine');
  }, [dirty, save, runMode, confirmation, action]);

  const handleCancel = useCallback(async () => {
    try { applyJob(await request(ep('cancel'), 'POST', {})); } catch (e) { toast(e.message, 'error'); }
  }, [toast]);

  const handleReset = useCallback(async () => {
    await action(async () => {
      applyJob(await request(ep('reset'), 'POST', {}));
      toast('Run state reset to ready.', 'success');
    }, 'Resetting run state...');
  }, [action, toast]);

  const writable = properties.filter((p) => !p.calculated && !p.modificationMetadata?.readOnlyValue && !p.externalOptions && p.name !== 'hs_object_id');
  const mappedCount = Object.values(mapping).filter(Boolean).length;
  const dups = (() => {
    const counts = new Map();
    for (const v of Object.values(mapping)) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
    return [...counts.values()].filter((c) => c > 1).length;
  })();

  const jobPct = job.total ? Math.round((job.completed / job.total) * 100) : 0;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="py-6 px-8 max-w-5xl">
      <LoadingOverlay show={busy} title={busyMsg} sub={busySub} />

      <h1 className="text-[1.9rem] font-black text-slate-900 leading-tight mb-1">Data Migrate</h1>
      <p className="text-slate-500 text-[13px] mb-6">Import workbook records into your destination HubSpot account.</p>

      <StepperBar steps={STEPS} current={step} onSelect={navigate} canAdvance={Boolean(workbook && selectedObject)} />

      {/* ─── Step 0: Choose workbook ─── */}
      {step === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Destination object */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800 text-[15px]">Destination object</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">{portalMeta || 'Objects are fetched from your connected HubSpot portal.'}</p>
              </div>
              <button type="button" onClick={() => action(() => loadCatalogue(true), 'Refreshing objects...')} disabled={busy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12.5px] text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50">
                <RefreshCw className="w-3.5 h-3.5" />Refresh
              </button>
            </div>
            <div className="px-6 py-4 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                Object
                <select
                  value={selectedObject?.objectTypeId ?? ''}
                  onChange={(e) => handleObjectChange(e.target.value)}
                  disabled={busy || !objects.length}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50"
                >
                  <option value="">Select an object from your portal</option>
                  {objects.map((o) => <option key={o.objectTypeId} value={o.objectTypeId}>{o.label}</option>)}
                </select>
              </label>
              {selectedObject && (
                <p className="text-[12px] text-slate-500">{selectedObject.label} · Object ID {selectedObject.objectTypeId}</p>
              )}
              <p className="text-[11.5px] text-slate-400 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                Record IDs must belong to the destination account. Source-account IDs cannot be used to match destination records.
              </p>
              {credentials && <p className="text-[11.5px] text-slate-400">{credentials}</p>}
            </div>
          </article>

          {/* Choose workbook */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800 text-[15px]">Choose workbook</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Upload a HubSpot export or another CSV / Excel workbook.</p>
              </div>
              <Badge variant="neutral">CSV / XLSX</Badge>
            </div>
            <div className="px-6 py-4 flex flex-col gap-3">
              <label className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#ff7a59]/40 hover:bg-orange-50/30 transition">
                <Upload className="w-8 h-8 text-slate-300" />
                <span className="font-semibold text-slate-700 text-[13px]">Select your workbook</span>
                <span className="text-[11.5px] text-slate-400">CSV or XLSX · up to 50 MB</span>
                <input ref={fileRef} type="file" accept=".csv,.xlsx" className="sr-only"
                  onChange={(e) => setSelectedFileName(e.target.files[0]?.name ?? '')} />
              </label>
              {selectedFileName && <p className="text-[12px] text-slate-600 font-medium">{selectedFileName}</p>}
              <button type="button" onClick={handleUpload} disabled={busy || !selectedObject || !selectedFileName}
                className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer">
                Use selected file
              </button>
              {workbook && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-800 font-medium">
                  {workbook.filename} · {workbook.rows.toLocaleString()} rows · {workbook.columns.length} columns
                </div>
              )}
            </div>
          </article>
        </div>
      )}

      {/* ─── Step 1: Map columns ─── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          {/* Match records */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800 text-[15px]">Match records</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Choose how to find an existing record or create a missing one.</p>
              </div>
              <button type="button" onClick={() => action(() => loadProperties(Object.keys(mapping).length === 0), 'Fetching properties from HubSpot portal...')}
                disabled={busy || !selectedObject}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[12.5px] text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50">
                Load HubSpot properties
              </button>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                Identifier column
                <select value={identifierColumn} onChange={(e) => { setIdentifierColumn(e.target.value); invalidate(); }}
                  disabled={busy} className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50">
                  <option value="">Choose identifier column</option>
                  {workbook?.columns.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                Match using
                <select value={idProperty} onChange={(e) => { setIdProperty(e.target.value); invalidate(); }}
                  disabled={busy} className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50">
                  <option value="hs_object_id">Record ID · update existing only</option>
                  {properties.filter((p) => p.hasUniqueValue || (type() === '0-1' && p.name === 'email')).map((p) => (
                    <option key={p.name} value={p.name}>{p.label} · create/update</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="px-6 pb-4 text-[12px] text-slate-400">Contact email or a property with unique values supports create/update. Blank cells do not erase existing values.</p>
          </article>

          {/* Column mapping */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800 text-[15px]">Column mapping</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Map each source column to a writable HubSpot property.</p>
              </div>
              <Badge variant={dups ? 'error' : 'neutral'}>
                {mappedCount} mapped{dups ? ` · ${dups} duplicate${dups > 1 ? 's' : ''}` : ''}
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Workbook column', 'Sample values', 'HubSpot property'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(workbook?.columns ?? []).map((col) => {
                    const val = mapping[col.name] ?? '';
                    const dup = val && (Object.values(mapping).filter((v) => v === val).length > 1);
                    return (
                      <tr key={col.name} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800 whitespace-nowrap">{col.name}</td>
                        <td className="px-5 py-3 text-slate-400 max-w-[200px] truncate">{col.samples?.filter(Boolean).join(' · ') || '—'}</td>
                        <td className="px-5 py-3 min-w-[260px]">
                          <PropertyPicker
                            value={val}
                            properties={writable}
                            onChange={(name) => { setMapping((m) => ({ ...m, [col.name]: name })); invalidate(); }}
                            disabled={busy}
                            allowCreate
                          />
                          {dup && <p className="text-[11px] text-amber-600 mt-1">⚠ "{val}" mapped to multiple columns.</p>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100">
              <button type="button" onClick={() => action(async () => { await save(); toast('Mappings saved.', 'success'); }, 'Saving column mappings...')}
                disabled={busy}
                className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50">
                Save mappings
              </button>
            </div>
          </article>
        </div>
      )}

      {/* ─── Step 2: Review & validate ─── */}
      {step === 2 && (
        <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-800 text-[15px]">Review & validate</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Check mappings, property values, record matches and associations.</p>
            </div>
            <button type="button"
              onClick={handleValidate}
              disabled={busy || validating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer">
              {validating ? '⟳ Validating...' : 'Run validation'}
            </button>
          </div>
          <div className="px-6 py-5">
            {/* Plan */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-[12.5px]">
              {[
                ['Workbook', workbook?.filename ?? '—'],
                ['Object', selectedObject ? `${selectedObject.label} (${type()})` : 'Not selected'],
                ['Match', `${identifierColumn || 'Not selected'} → ${idProperty}`],
                ['Mapped columns', mappedCount],
              ].map(([label, value]) => (
                <div key={label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium mb-1">{label}</div>
                  <div className="font-semibold text-slate-800 truncate">{String(value)}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            {valStages.size > 0 && <ValidationTimeline stages={valStages} />}

            {/* Results */}
            {review ? (
              <div className={`p-4 rounded-xl border ${review.issueCount ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'} mb-4`}>
                <p className={`font-semibold text-[13px] ${review.issueCount ? 'text-red-800' : 'text-emerald-800'}`}>
                  {review.issueCount ? `${review.issueCount} validation issue(s). Fix them before running.` : 'Validation passed. Ready for a dry preview or real migration.'}
                </p>
                <p className="text-[12px] text-slate-600 mt-1">
                  {review.records} records · {review.existing} existing · {review.creating} to create · {review.associations ?? 0} associations
                </p>
                {review.issueCount > 0 && (
                  <button type="button"
                    onClick={() => action(() => downloadFile(ep('issues-report'), 'validation-issues.csv'), 'Preparing CSV…')}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-[12.5px] text-slate-700 hover:bg-slate-50 transition cursor-pointer">
                    <Download className="w-4 h-4" />
                    Download all {review.issueCount.toLocaleString()} validation issues (CSV)
                  </button>
                )}
                {review.issues?.length > 0 && (
                  <ul className="mt-3 text-[12px] text-red-700 list-disc ml-4 space-y-0.5">
                    {review.issues.slice(0, 20).map((issue, i) => (
                      <li key={i}>{issue.row ? `Row ${issue.row}: ` : ''}{issue.message}</li>
                    ))}
                    {review.issues.length > 20 && <li>…and {(review.issueCount - 20).toLocaleString()} more. Download CSV.</li>}
                  </ul>
                )}
              </div>
            ) : (
              !validating && <p className="text-slate-400 italic text-[13px]">Run validation to check your current settings. Nothing is written to HubSpot.</p>
            )}
          </div>
        </article>
      )}

      {/* ─── Step 3: Run & monitor ─── */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Controls */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-800 text-[15px]">Run & monitor</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Preview first, then run the real migration.</p>
              </div>
              <Badge variant={planBadge(job.phase)}>{job.phase?.replaceAll('_', ' ') ?? 'Ready'}</Badge>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <RunTimeline job={job} />

              {/* Run mode */}
              <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700">
                Run mode
                <select value={runMode} onChange={(e) => setRunMode(e.target.value)} disabled={busy || job.running}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50">
                  <option value="dry">Dry preview · no HubSpot changes</option>
                  <option value="real">Real migration</option>
                </select>
              </label>

              {runMode === 'real' && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-[12.5px] text-orange-900">
                  <p className="font-semibold mb-2">Mapped values may be replaced. This writes to the destination HubSpot account.</p>
                  <label className="flex flex-col gap-1.5 font-medium">
                    Type RUN FOR REAL
                    <input value={confirmation} onChange={(e) => setConfirmation(e.target.value)}
                      placeholder="RUN FOR REAL" autoComplete="off"
                      className="px-3 py-2 rounded-lg border border-orange-200 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </label>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <button type="button" onClick={handleRun} disabled={busy || job.running || !workbook || !selectedObject || (runMode === 'real' && (!review || review.issueCount > 0 || dirty || confirmation !== 'RUN FOR REAL'))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer">
                  <Play className="w-4 h-4" />{runMode === 'real' ? 'Run migration' : 'Run dry preview'}
                </button>
                {job.running && (
                  <button type="button" onClick={handleCancel} disabled={job.cancelRequested}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition disabled:opacity-50 cursor-pointer">
                    <Square className="w-4 h-4" />Stop run
                  </button>
                )}
                {!job.running && job.phase !== 'idle' && (
                  <button type="button" onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                    <RotateCcw className="w-4 h-4" />Reset run state
                  </button>
                )}
              </div>

              <p className="text-[11.5px] text-slate-400">
                {runMode === 'real' ? 'Requires a successful validation of the current mappings.' : 'Dry previews validate records without writing to HubSpot.'}
              </p>

              <ProgressBar value={jobPct} />
              <p className="text-[12px] text-slate-500 tabular-nums">
                {job.completed ?? 0} / {job.total ?? 0} processed · {job.succeeded ?? 0} {job.dryRun ? 'previewed' : 'succeeded'} · {job.skipped ?? 0} reused · {job.failed ?? 0} failed
              </p>

              {/* Downloads */}
              <div className="flex gap-3 flex-wrap">
                {job.report && (
                  <button type="button" onClick={() => action(() => downloadFile(ep('report'), `hubspot-results-${MODE}.csv`), 'Preparing CSV…')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[12.5px] text-slate-700 hover:bg-slate-50 transition cursor-pointer">
                    <Download className="w-4 h-4" />Download results (CSV)
                  </button>
                )}
                {(job.phase === 'blocked' || (job.review && job.review.issueCount > 0)) && (
                  <button type="button" onClick={() => action(() => downloadFile(ep('issues-report'), 'validation-issues.csv'), 'Preparing CSV…')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[12.5px] text-slate-700 hover:bg-slate-50 transition cursor-pointer">
                    <Download className="w-4 h-4" />Download validation issues (CSV)
                  </button>
                )}
              </div>
            </div>
          </article>

          {/* Live activity */}
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-[15px]">Live activity</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Row results and migration progress</p>
            </div>
            <div className="px-6 py-4">
              <ActivityLog
                logs={logs}
                emptyText="Start a preview or migration to see activity."
              />
            </div>
          </article>
        </div>
      )}

      {/* Footer nav */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
        <button type="button" onClick={() => navigate(Math.max(0, step - 1))} disabled={step === 0 || busy}
          className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer">
          ← Back
        </button>
        <span className="text-[12px] text-slate-400">
          {dirty ? 'Mappings have unsaved changes.' : workbook ? `${workbook.rows.toLocaleString()} workbook rows` : 'Choose a workbook to get started.'}
        </span>
        {step < 3 && (
          <button type="button" onClick={() => navigate(Math.min(3, step + 1))} disabled={busy || !workbook || !selectedObject}
            className="px-4 py-2 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer">
            {step === 0 ? 'Map columns →' : step === 1 ? 'Review & validate →' : 'Run & monitor →'}
          </button>
        )}
      </div>
    </div>
  );
}

