import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  FolderPlus, Settings2, Upload, RefreshCw, CheckCircle2, AlertTriangle, XCircle,
  Download, Plus, Table, Layers, FileSpreadsheet, ArrowRight, ChevronDown, Check, Filter, Sparkles
} from 'lucide-react';
import { request } from '../../hooks/useApi.js';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function slugify(text, maxLen = 50) {
  let slug = String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
  // HubSpot requirement: Property names must contain only lowercase letters, numbers, and underscores.
  // Must start with a letter!
  if (!slug || !/^[a-z]/.test(slug)) {
    slug = 'p_' + slug.replace(/^_+/, '');
  }
  if (maxLen && slug.length > maxLen) slug = slug.slice(0, maxLen).replace(/_+$/, '');
  return slug;
}

function safeStr(h) {
  return String(h ?? '');
}

function mapHubspotFieldType(rawType) {
  const str = String(rawType || '').toLowerCase().trim();
  if (str.includes('multi-line') || str.includes('multiline') || str.includes('textarea'))
    return { type: 'string', fieldType: 'textarea', optionKey: 'string:textarea' };
  if (str.includes('file'))
    return { type: 'string', fieldType: 'file', optionKey: 'string:file' };
  if (str.includes('single checkbox') || str.includes('boolean') || str.includes('bool') || str.includes('yes/no'))
    return { type: 'bool', fieldType: 'booleancheckbox', optionKey: 'bool:booleancheckbox' };
  if (str.includes('multiple checkboxes') || str.includes('checkboxes'))
    return { type: 'enumeration', fieldType: 'checkbox', optionKey: 'enumeration:checkbox' };
  if (str.includes('dropdown') || str.includes('select') || str.includes('enumeration') || str.includes('association') || str.includes('workflow') || str.includes('radio'))
    return { type: 'enumeration', fieldType: 'select', optionKey: 'enumeration:select' };
  if (str.includes('date and time') || str.includes('datetime'))
    return { type: 'datetime', fieldType: 'date', optionKey: 'datetime:date' };
  if (str.includes('date'))
    return { type: 'date', fieldType: 'date', optionKey: 'date:date' };
  if (str.includes('number') || str.includes('currency') || str.includes('calculation') || str.includes('rollup') || str.includes('score'))
    return { type: 'number', fieldType: 'number', optionKey: 'number:number' };
  return { type: 'string', fieldType: 'text', optionKey: 'string:text' };
}

const FIELD_TYPE_SELECT_OPTIONS = [
  { key: 'string:text', label: 'Single-line text', type: 'string', fieldType: 'text' },
  { key: 'string:textarea', label: 'Multi-line text', type: 'string', fieldType: 'textarea' },
  { key: 'number:number', label: 'Number', type: 'number', fieldType: 'number' },
  { key: 'date:date', label: 'Date picker', type: 'date', fieldType: 'date' },
  { key: 'datetime:date', label: 'Date and time', type: 'datetime', fieldType: 'date' },
  { key: 'bool:booleancheckbox', label: 'Single checkbox (Yes/No)', type: 'bool', fieldType: 'booleancheckbox' },
  { key: 'enumeration:select', label: 'Dropdown select', type: 'enumeration', fieldType: 'select' },
  { key: 'enumeration:checkbox', label: 'Multiple checkboxes', type: 'enumeration', fieldType: 'checkbox' },
  { key: 'string:file', label: 'File', type: 'string', fieldType: 'file' },
];

const PROPERTY_TYPES = [
  { type: 'string',      label: 'String',                                     fieldTypes: ['text', 'textarea', 'file'] },
  { type: 'number',      label: 'Number',                                     fieldTypes: ['number'] },
  { type: 'date',        label: 'Date',                                       fieldTypes: ['date'] },
  { type: 'datetime',    label: 'Date and Time',                              fieldTypes: ['date'] },
  { type: 'enumeration', label: 'Dropdown / Select / Checkbox (Enumeration)', fieldTypes: ['select', 'checkbox', 'radio', 'booleancheckbox'] },
  { type: 'bool',        label: 'Boolean (Yes/No)',                           fieldTypes: ['booleancheckbox'] },
];

/* ─── tab bar ─────────────────────────────────────────────────────────────── */
function TabBar({ active, onChange }) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
      <button
        type="button"
        onClick={() => onChange('groups')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
          active === 'groups'
            ? 'bg-white text-[#df6d50] shadow-xs cursor-default'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Object Group Creation
      </button>
      <button
        type="button"
        onClick={() => onChange('properties')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
          active === 'properties'
            ? 'bg-white text-[#df6d50] shadow-xs cursor-default'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Property Creation Group Wise
      </button>
    </div>
  );
}

/* ─── Object Group Creation tab ───────────────────────────────────────────── */
function GroupsTab({ onShowToast, onSwitchTab, sharedState }) {
  const { objects, selectedObject, setSelectedObject, portalMeta, loadingObjects, loadObjects } = sharedState;

  const [existingGroups, setExistingGroups] = useState([]);
  const [loadingGroups, setLoadingGroups]   = useState(false);
  const [showExisting, setShowExisting]     = useState(false);
  const [mode, setMode]                     = useState('csv');
  const [manualForm, setManualForm]         = useState({ name: '', label: '', displayOrder: -1, autoName: true });
  const [creatingSingle, setCreatingSingle] = useState(false);
  const fileRef                             = useRef(null);
  const [fileData, setFileData]             = useState(null);
  const [parsing, setParsing]               = useState(false);
  const [columnMap, setColumnMap]           = useState({ name: '', label: '', displayOrder: '' });
  const [creatingBatch, setCreatingBatch]   = useState(false);
  const [batchResults, setBatchResults]     = useState(null);

  const loadGroups = useCallback(async (objType) => {
    if (!objType) return;
    setLoadingGroups(true);
    try {
      const res = await request(`/api/hubspot/schema/groups/${encodeURIComponent(objType)}`);
      setExistingGroups(res.groups || []);
    } catch (err) {
      onShowToast?.('Failed to fetch existing groups: ' + err.message, 'error');
    } finally {
      setLoadingGroups(false);
    }
  }, [onShowToast]);

  useEffect(() => { if (selectedObject) loadGroups(selectedObject); }, [selectedObject, loadGroups]);

  const handleManualLabelChange = (val) =>
    setManualForm((p) => ({ ...p, label: val, name: p.autoName ? slugify(val) : p.name }));

  const handleCreateSingle = async (e) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.label.trim()) {
      onShowToast?.('Both internal name and label are required.', 'error'); return;
    }
    setCreatingSingle(true);
    try {
      const res = await request(`/api/hubspot/schema/groups/${encodeURIComponent(selectedObject)}`, 'POST', {
        name: manualForm.name, label: manualForm.label, displayOrder: manualForm.displayOrder
      });
      if (res.status === 'already_exists') {
        onShowToast?.(`Group "${manualForm.label}" already exists in HubSpot.`, 'info');
      } else {
        onShowToast?.(`Group "${manualForm.label}" created successfully!`, 'success');
        setManualForm({ name: '', label: '', displayOrder: -1, autoName: true });
      }
      loadGroups(selectedObject);
    } catch (err) { onShowToast?.(err.message, 'error'); }
    finally { setCreatingSingle(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true); setBatchResults(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await request('/api/hubspot/schema/parse', 'POST', fd);
      setFileData(res);
      const headers = res.headers || [];
      const findHeader = (patterns) => headers.find((h) => patterns.some((p) => {
        const clean = safeStr(h).toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === p || clean.includes(p);
      })) || '';
      const groupCol = findHeader(['hubspotgroups','hubspotgroup','groupname','propertygroup','groups','group']);
      const nameCol  = groupCol || findHeader(['name','internalname','id','groupid']);
      const labelCol = groupCol || findHeader(['label','grouplabel','title','displayname','name']);
      const orderCol = findHeader(['displayorder','order','sortorder','display_order']);
      setColumnMap({ name: nameCol || (headers[0] ?? ''), label: labelCol || (headers[1] ?? headers[0] ?? ''), displayOrder: orderCol || '' });
      onShowToast?.(`Loaded ${res.filename} (${res.totalRows} rows).`, 'success');
    } catch (err) {
      onShowToast?.('Failed to parse file: ' + err.message, 'error'); setFileData(null);
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const uniqueGroups = useMemo(() => {
    if (!fileData?.rows?.length || !columnMap.label) return [];
    const seen = new Set(), list = [];
    for (const r of fileData.rows) {
      const rawLabel = safeStr(r[columnMap.label]).trim();
      if (!rawLabel) continue;
      const rawName  = columnMap.name && r[columnMap.name] ? r[columnMap.name] : rawLabel;
      const cleanName = slugify(rawName || rawLabel);
      if (cleanName && !seen.has(cleanName)) {
        seen.add(cleanName);
        list.push({ name: cleanName, label: rawLabel, displayOrder: columnMap.displayOrder && r[columnMap.displayOrder] ? Number(r[columnMap.displayOrder]) : -1 });
      }
    }
    return list;
  }, [fileData, columnMap]);

  const handleDownloadSampleCsv = () => {
    const blob = new Blob([
      'HubSpot Groups\r\nContact Information\r\nAutomations And Tags\r\nSystem Information\r\nLead Information\r\nInitial Sales Call\r\nMarketing Tracking\r\nLive Lead Magnets'
    ], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sample_object_groups.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateBatch = async () => {
    if (!uniqueGroups.length) { onShowToast?.('No valid groups found in file.', 'error'); return; }
    setCreatingBatch(true); setBatchResults(null);
    try {
      const res = await request(`/api/hubspot/schema/groups/${encodeURIComponent(selectedObject)}/batch`, 'POST', { groups: uniqueGroups });
      setBatchResults(res.results || []);
      const cr = (res.results||[]).filter(r=>r.status==='created').length;
      const ex = (res.results||[]).filter(r=>r.status==='already_exists').length;
      const fa = (res.results||[]).filter(r=>r.status==='failed').length;
      onShowToast?.(`Batch finished: ${cr} created, ${ex} already exist, ${fa} failed.`, fa ? 'warning' : 'success');
      loadGroups(selectedObject);
    } catch (err) { onShowToast?.('Batch creation failed: ' + err.message, 'error'); }
    finally { setCreatingBatch(false); }
  };

  const selectedObjLabel = objects.find(o => o.objectTypeId === selectedObject)?.label || 'Contacts';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff7a59] flex items-center justify-center">
          <FolderPlus size={18} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Object Group Creation</h2>
          <p className="text-xs text-slate-500 mt-0.5">Create custom property groups on HubSpot objects using the Properties API (2026-09).</p>
        </div>
      </div>

      {/* Object Selector */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">1. Select Destination Object</h3>
            <p className="text-xs text-slate-400 mt-0.5">Choose the HubSpot CRM object where property groups will be created.</p>
          </div>
          {portalMeta && <span className="text-[11.5px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium self-start sm:self-auto">{portalMeta}</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <div className="relative">
              <select
                value={selectedObject}
                onChange={e => setSelectedObject(e.target.value)}
                disabled={loadingObjects || creatingBatch || creatingSingle}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 focus:border-[#ff7a59] transition cursor-pointer disabled:opacity-50 pr-10"
              >
                {objects.map(obj => <option key={obj.objectTypeId} value={obj.objectTypeId}>{obj.label} ({obj.objectTypeId})</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => loadObjects(true)} disabled={loadingObjects}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50">
              <RefreshCw size={12} className={loadingObjects ? 'animate-spin' : ''} /> Refresh Objects
            </button>
            <button type="button" onClick={() => setShowExisting(!showExisting)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-200 text-[#df6d50] rounded-xl text-xs font-semibold hover:bg-orange-100 transition cursor-pointer">
              <Layers size={12} /> {showExisting ? 'Hide' : `View Groups (${existingGroups.length})`}
            </button>
          </div>
        </div>
        {showExisting && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Existing Groups for {selectedObjLabel} ({existingGroups.length})</span>
              <button type="button" onClick={() => loadGroups(selectedObject)} disabled={loadingGroups}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer">
                <RefreshCw size={10} className={loadingGroups ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50 divide-y divide-slate-100 text-xs">
              {existingGroups.length === 0
                ? <div className="p-3 text-slate-400 text-center italic">No custom groups found for this object.</div>
                : existingGroups.map(g => (
                  <div key={g.name} className="p-2.5 flex items-center justify-between">
                    <div><span className="font-semibold text-slate-700">{g.label}</span><span className="ml-2 font-mono text-[11px] text-slate-400">({g.name})</span></div>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">order: {g.displayOrder}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </section>

      {/* Mode selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[['csv', FileSpreadsheet, 'Upload CSV File (Batch)'], ['manual', Plus, 'Single Group Creation']].map(([m, Icon, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${mode === m ? 'bg-[#fff0eb] text-[#df6d50] border border-orange-200' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Icon size={15} /><span>{label}</span>
          </button>
        ))}
      </div>

      {/* CSV mode */}
      {mode === 'csv' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Upload CSV / XLSX for {selectedObjLabel} Groups</h3>
              <p className="text-xs text-slate-400 mt-0.5">Auto-detects <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">HubSpot Groups</code> column and deduplicates rows.</p>
            </div>
            <button type="button" onClick={handleDownloadSampleCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs">
              <Download size={13} className="text-[#ff7a59]" /> Download Sample CSV
            </button>
          </div>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-[#ff7a59]/60 hover:bg-orange-50/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition group">
            <input ref={fileRef} type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-orange-100 flex items-center justify-center text-slate-400 group-hover:text-[#ff7a59] transition">
              {parsing ? <RefreshCw size={22} className="animate-spin text-[#ff7a59]" /> : <Upload size={22} />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">{fileData ? fileData.filename : 'Click or drag & drop CSV / XLSX to upload'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{fileData ? `${fileData.totalRows} rows · ${uniqueGroups.length} unique groups detected` : 'Reads "HubSpot Groups" column or a dedicated groups list'}</p>
            </div>
          </div>
          {fileData && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Table size={14} className="text-[#ff7a59]" /> Detected Columns &amp; Group Extraction</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200"><Filter size={11} /> {uniqueGroups.length} Unique Groups from {fileData.totalRows} Rows</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: 'label', title: 'Group Column (Label / Name)', hint: 'e.g. "HubSpot Groups"', required: true },
                  { key: 'name',  title: 'Internal Name (name)',        hint: 'Auto-slugified lowercase alphanumeric' },
                  { key: 'displayOrder', title: 'Display Order (optional)', hint: 'Sort priority (integer, default -1)' },
                ].map(({ key, title, hint, required }) => (
                  <label key={key} className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                    <span>{title} {required && <span className="text-rose-500">*</span>}</span>
                    <select value={columnMap[key]} onChange={e => setColumnMap(p => ({ ...p, [key]: e.target.value }))}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30">
                      <option value="">-- Choose column {key === 'name' ? '(Auto-generate from Label)' : ''} --</option>
                      {fileData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-[10px] font-normal text-slate-400">{hint}</span>
                  </label>
                ))}
              </div>
              {/* Preview table */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 mb-2 block">Extracted Unique Groups ({uniqueGroups.length} ready to create):</span>
                <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white text-xs max-h-60 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold text-[11px] sticky top-0">
                      <tr><th className="p-2.5">#</th><th className="p-2.5">Group Label</th><th className="p-2.5">Auto-generated Internal Name</th><th className="p-2.5">Display Order</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {uniqueGroups.slice(0,15).map((g,i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-2.5 text-slate-400 font-mono text-[10px]">{i+1}</td>
                          <td className="p-2.5 font-semibold text-slate-800">{g.label}</td>
                          <td className="p-2.5 font-mono text-[11px] text-[#df6d50]">{g.name}</td>
                          <td className="p-2.5 text-slate-500 font-mono text-[11px]">{g.displayOrder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {uniqueGroups.length > 15 && <p className="text-[10.5px] text-slate-400 mt-1 italic">Showing first 15 of {uniqueGroups.length} unique groups. All {uniqueGroups.length} will be created.</p>}
              </div>
              <div className="flex items-center justify-end gap-3 mt-2">
                <button type="button" onClick={() => setFileData(null)} disabled={creatingBatch}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer">Clear File</button>
                <button type="button" onClick={handleCreateBatch} disabled={creatingBatch || !uniqueGroups.length}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a59] hover:bg-[#e56b4c] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50">
                  {creatingBatch ? <><RefreshCw size={13} className="animate-spin" /> Creating {uniqueGroups.length} Groups...</> : <><FolderPlus size={14} /> Create {uniqueGroups.length} Unique Groups in {selectedObjLabel}</>}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Manual mode */}
      {mode === 'manual' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-2xl">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Create a Single Property Group</h3>
          <p className="text-xs text-slate-400 mb-5">Directly call <code className="font-mono text-slate-600">POST /crm/properties/2026-09/{selectedObject}/groups</code>.</p>
          <form onSubmit={handleCreateSingle} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Group Label <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="e.g. Customer Overview" value={manualForm.label}
                onChange={e => handleManualLabelChange(e.target.value)} required
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Internal Name (name) <span className="text-rose-500">*</span></label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={manualForm.autoName} onChange={e => setManualForm(p => ({ ...p, autoName: e.target.checked }))} className="rounded text-[#ff7a59]" />
                  Auto-generate from label
                </label>
              </div>
              <input type="text" placeholder="e.g. customer_overview" value={manualForm.name}
                onChange={e => setManualForm(p => ({ ...p, name: slugify(e.target.value), autoName: false }))} required
                className="w-full font-mono text-xs border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30" />
              <span className="text-[10px] text-slate-400 mt-1 block">Must be unique, lowercase, alphanumeric and underscores only.</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order (optional)</label>
              <input type="number" placeholder="-1" value={manualForm.displayOrder}
                onChange={e => setManualForm(p => ({ ...p, displayOrder: Number(e.target.value) }))}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30" />
            </div>
            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={creatingSingle || !manualForm.name || !manualForm.label}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a59] hover:bg-[#e56b4c] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50">
                {creatingSingle ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={14} />} Create Group
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Batch results */}
      {batchResults && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Batch Creation Results</h3>
              <p className="text-xs text-slate-400 mt-0.5">Summary of property groups processed in HubSpot.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">{batchResults.filter(r=>r.status==='created').length} Created</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">{batchResults.filter(r=>r.status==='already_exists').length} Already Existed</span>
              {batchResults.some(r=>r.status==='failed') && <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">{batchResults.filter(r=>r.status==='failed').length} Failed</span>}
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 font-semibold text-slate-600">
                <tr><th className="p-3">Internal Name</th><th className="p-3">Label</th><th className="p-3">Status</th><th className="p-3">Details</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchResults.map((item,idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-medium text-slate-800">{item.name}</td>
                    <td className="p-3 text-slate-700 font-medium">{item.label}</td>
                    <td className="p-3">
                      {item.status==='created'
                        ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"><CheckCircle2 size={12} /> Created</span>
                        : item.status==='already_exists'
                        ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"><AlertTriangle size={12} /> Already Exists</span>
                        : <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200"><XCircle size={12} /> Failed</span>}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">{item.error ? <span className="text-rose-600">{item.error}</span> : item.status==='already_exists' ? 'Already present in portal' : 'Success'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-orange-50/50 border border-orange-200/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="text-emerald-500" size={16} />
              <span className="text-xs text-slate-700 font-medium">Groups are ready. Now create properties inside these groups.</span>
            </div>
            <button type="button" onClick={() => onSwitchTab('properties')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#df6d50] hover:underline cursor-pointer">
              Continue to Property Creation <ArrowRight size={13} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/* ─── Property Creation tab ───────────────────────────────────────────────── */
function PropertiesTab({ onShowToast, sharedState }) {
  const { objects, selectedObject, setSelectedObject, portalMeta, loadingObjects, loadObjects } = sharedState;

  const [groups, setGroups]               = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [existingProperties, setExistingProperties] = useState([]);
  const [loadingProperties, setLoadingProperties]   = useState(false);

  const [mode, setMode]                   = useState('csv');
  const [manualForm, setManualForm]       = useState({ groupName: '', customGroupName: '', name: '', label: '', type: 'string', fieldType: 'text', description: '', options: '', autoName: true });
  const [creatingSingle, setCreatingSingle] = useState(false);

  // CSV Batch state
  const fileRef                             = useRef(null);
  const [fileData, setFileData]             = useState(null);
  const [parsing, setParsing]               = useState(false);
  const [columnMap, setColumnMap]           = useState({ groupName:'', name:'', label:'', type:'', fieldType:'', description:'', options:'' });
  const [fixedGroup, setFixedGroup]         = useState('');
  const [autoCreateGroups, setAutoCreateGroups] = useState(true);

  // Interactive row type overrides & search
  const [rowOverrides, setRowOverrides]     = useState({}); // { [rowIdx]: { type, fieldType, key } }
  const [previewSearch, setPreviewSearch]   = useState('');
  const [filterView, setFilterView]         = useState('all'); // 'all' | 'new' | 'existing'

  const [creatingBatch, setCreatingBatch]   = useState(false);
  const [batchResults, setBatchResults]     = useState(null);

  const loadGroups = useCallback(async (objType) => {
    if (!objType) return;
    setLoadingGroups(true);
    try {
      const res = await request(`/api/hubspot/schema/groups/${encodeURIComponent(objType)}`);
      setGroups(res.groups || []);
      if (res.groups?.length && !manualForm.groupName) setManualForm(p => ({ ...p, groupName: res.groups[0].name }));
    } catch (err) { onShowToast?.('Failed to load groups: ' + err.message, 'error'); }
    finally { setLoadingGroups(false); }
  }, [onShowToast, manualForm.groupName]);

  const loadExistingProperties = useCallback(async (objType) => {
    if (!objType) return;
    setLoadingProperties(true);
    try {
      const res = await request(`/api/hubspot/schema/properties/${encodeURIComponent(objType)}`);
      setExistingProperties(res.properties || []);
    } catch {
      // Non-blocking
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  useEffect(() => {
    if (selectedObject) {
      loadGroups(selectedObject);
      loadExistingProperties(selectedObject);
    }
  }, [selectedObject, loadGroups, loadExistingProperties]);

  // Index existing properties by name and by label for instant O(1) checks
  const existingPropNames = useMemo(() => {
    const s = new Set();
    for (const p of existingProperties) {
      if (p.name) s.add(p.name.toLowerCase());
    }
    return s;
  }, [existingProperties]);

  const existingPropLabels = useMemo(() => {
    const s = new Set();
    for (const p of existingProperties) {
      if (p.label) s.add(String(p.label).trim().toLowerCase());
    }
    return s;
  }, [existingProperties]);

  const handleManualLabelChange = (val) =>
    setManualForm(p => ({ ...p, label: val, name: p.autoName ? slugify(val) : p.name }));

  const handleTypeChange = (newType) => {
    const cfg = PROPERTY_TYPES.find(t => t.type === newType);
    setManualForm(p => ({ ...p, type: newType, fieldType: cfg ? cfg.fieldTypes[0] : 'text' }));
  };

  const handleCreateSingle = async (e) => {
    e.preventDefault();
    const targetGroup = manualForm.groupName === '__new__' ? slugify(manualForm.customGroupName) : manualForm.groupName;
    if (!targetGroup) { onShowToast?.('Please choose or enter a property group name.', 'error'); return; }
    if (!manualForm.name.trim() || !manualForm.label.trim()) { onShowToast?.('Property name and label are required.', 'error'); return; }
    setCreatingSingle(true);
    try {
      if (manualForm.groupName === '__new__') {
        await request(`/api/hubspot/schema/groups/${encodeURIComponent(selectedObject)}`, 'POST', { name: targetGroup, label: manualForm.customGroupName || targetGroup });
      }
      const res = await request(`/api/hubspot/schema/properties/${encodeURIComponent(selectedObject)}`, 'POST', {
        groupName: targetGroup, name: manualForm.name, label: manualForm.label,
        type: manualForm.type, fieldType: manualForm.fieldType, description: manualForm.description, options: manualForm.options
      });
      if (res.status === 'already_exists') {
        onShowToast?.(`Property "${manualForm.label}" already exists in HubSpot.`, 'info');
      } else {
        onShowToast?.(`Property "${manualForm.label}" created in group "${targetGroup}"!`, 'success');
        setManualForm(p => ({ ...p, name:'', label:'', description:'', options:'', customGroupName:'', autoName:true }));
      }
      loadGroups(selectedObject);
      loadExistingProperties(selectedObject);
    } catch (err) { onShowToast?.(err.message, 'error'); }
    finally { setCreatingSingle(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true); setBatchResults(null); setRowOverrides({});
    const fd = new FormData(); fd.append('file', file);
    try {
      const res = await request('/api/hubspot/schema/parse', 'POST', fd);
      setFileData(res);
      const headers = res.headers || [];
      const findHeader = (patterns) => headers.find(h => patterns.some(p => {
        const clean = safeStr(h).toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === p || clean.includes(p);
      })) || '';
      const groupCol     = findHeader(['hubspotgroups','hubspotgroup','propertygroup','groupname','group','groups']);
      const nameCol      = findHeader(['fieldname','propertyname','internalname','name','field']);
      const labelCol     = findHeader(['fieldname','propertylabel','label','title','displayname','name']);
      const fieldTypeCol = findHeader(['hubspotfieldtype','fieldtype','controltype','widget','type','propertytype']);
      const descCol      = findHeader(['description','desc','helptext','help_text']);
      const optCol       = findHeader(['options','choices','values','dropdownvalues']);
      setColumnMap({ groupName: groupCol||'', name: nameCol||(headers[0]??''), label: labelCol||(headers[0]??''), type: fieldTypeCol||'', fieldType: fieldTypeCol||'', description: descCol||'', options: optCol||'' });
      onShowToast?.(`Loaded ${res.filename} (${res.totalRows} rows).`, 'success');
    } catch (err) { onShowToast?.('Failed to parse file: ' + err.message, 'error'); setFileData(null); }
    finally { setParsing(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const handleDownloadSampleCsv = () => {
    const blob = new Blob([
      'Field Name,HubSpot Field Type,HubSpot Groups\r\nFavorite Food,Single-line text,Contact Information\r\nCustomer Status,Dropdown select,Contact Information\r\nAccount Balance,Number (currency),System Information\r\nContract Start Date,Date picker,Lead Information\r\nAuto Renew Enabled,Single checkbox,Lead Information\r\nSpecial Instructions,Multi-line text,Lead Information'
    ], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sample_properties.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Change individual row field type
  const handleRowTypeChange = (idx, selectedKey) => {
    const opt = FIELD_TYPE_SELECT_OPTIONS.find(o => o.key === selectedKey);
    if (opt) {
      setRowOverrides(prev => ({
        ...prev,
        [idx]: { type: opt.type, fieldType: opt.fieldType, key: opt.key }
      }));
    }
  };

  // Compute annotated rows
  const annotatedRows = useMemo(() => {
    if (!fileData?.rows?.length) return [];
    return fileData.rows.map((row, idx) => {
      const rawGroup = fixedGroup || (columnMap.groupName ? row[columnMap.groupName] : 'custom_properties');
      const gName    = slugify(rawGroup);
      const rawLabel = safeStr(row[columnMap.label]).trim();
      const rawName  = columnMap.name && row[columnMap.name] ? row[columnMap.name] : rawLabel;
      const pName    = slugify(rawName, 50);

      const rawTypeVal = columnMap.fieldType ? row[columnMap.fieldType] : columnMap.type ? row[columnMap.type] : 'Single-line text';
      const autoMapped = mapHubspotFieldType(rawTypeVal);
      const override   = rowOverrides[idx];

      const resolvedType      = override?.type || autoMapped.type;
      const resolvedFieldType = override?.fieldType || autoMapped.fieldType;
      const resolvedKey       = override?.key || autoMapped.optionKey || 'string:text';

      const isExistingName  = Boolean(pName && existingPropNames.has(pName.toLowerCase()));
      const isExistingLabel = Boolean(rawLabel && existingPropLabels.has(rawLabel.toLowerCase()));
      const isAlreadyInPortal = isExistingName || isExistingLabel;

      return {
        idx,
        rawGroup,
        gName,
        rawLabel,
        rawName,
        pName,
        rawTypeVal,
        autoMapped,
        resolvedType,
        resolvedFieldType,
        resolvedKey,
        isExistingName,
        isExistingLabel,
        isAlreadyInPortal,
        rawRow: row
      };
    });
  }, [fileData, columnMap, fixedGroup, rowOverrides, existingPropNames, existingPropLabels]);

  // Filtered rows for the preview table
  const filteredRows = useMemo(() => {
    let list = annotatedRows;
    if (filterView === 'new') {
      list = list.filter(r => !r.isAlreadyInPortal);
    } else if (filterView === 'existing') {
      list = list.filter(r => r.isAlreadyInPortal);
    }
    if (previewSearch.trim()) {
      const q = previewSearch.toLowerCase().trim();
      list = list.filter(r =>
        r.rawLabel.toLowerCase().includes(q) ||
        r.pName.toLowerCase().includes(q) ||
        String(r.rawGroup).toLowerCase().includes(q)
      );
    }
    return list;
  }, [annotatedRows, filterView, previewSearch]);

  const totalRowCount = annotatedRows.length;
  const existingCount = useMemo(() => annotatedRows.filter(r => r.isAlreadyInPortal).length, [annotatedRows]);
  const newCount      = totalRowCount - existingCount;

  const handleCreateBatch = async () => {
    if (!annotatedRows.length) return;
    if (!columnMap.label) { onShowToast?.('Please map the Property Name / Label column.', 'error'); return; }
    if (!columnMap.groupName && !fixedGroup) { onShowToast?.('Please map a Group Name column or select a fixed group.', 'error'); return; }

    setCreatingBatch(true); setBatchResults(null);
    const payload = annotatedRows.map(r => {
      const pDesc = columnMap.description && r.rawRow[columnMap.description] ? safeStr(r.rawRow[columnMap.description]).trim() : '';
      const pOpts = columnMap.options     && r.rawRow[columnMap.options]     ? safeStr(r.rawRow[columnMap.options]).trim()     : '';
      return {
        groupName: r.gName,
        groupLabel: r.rawGroup,
        name: r.pName,
        label: r.rawLabel,
        type: r.resolvedType,
        fieldType: r.resolvedFieldType,
        description: pDesc,
        options: pOpts
      };
    }).filter(p => p.name && p.label && p.groupName);

    try {
      const res = await request(`/api/hubspot/schema/properties/${encodeURIComponent(selectedObject)}/batch`, 'POST', {
        properties: payload,
        createMissingGroups: autoCreateGroups
      });
      setBatchResults(res.results || []);
      const cr = (res.results||[]).filter(r=>r.status==='created').length;
      const ex = (res.results||[]).filter(r=>r.status==='already_exists').length;
      const fa = (res.results||[]).filter(r=>r.status==='failed').length;
      onShowToast?.(`Batch finished: ${cr} created, ${ex} already in portal (skipped), ${fa} failed.`, fa ? 'warning' : 'success');
      loadGroups(selectedObject);
      loadExistingProperties(selectedObject);
    } catch (err) { onShowToast?.('Batch property creation failed: ' + err.message, 'error'); }
    finally { setCreatingBatch(false); }
  };

  const selectedObjLabel   = objects.find(o => o.objectTypeId === selectedObject)?.label || 'Contacts';
  const currentTypeConfig  = PROPERTY_TYPES.find(t => t.type === manualForm.type) || PROPERTY_TYPES[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff7a59] flex items-center justify-center">
          <Settings2 size={18} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Property Creation Group Wise</h2>
          <p className="text-xs text-slate-500 mt-0.5">Create CRM properties inside groups via the Properties API (2026-09).</p>
        </div>
      </div>

      {/* Object Selector */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">1. Select Destination Object</h3>
            <p className="text-xs text-slate-400 mt-0.5">Choose which HubSpot CRM object you want to create properties for.</p>
          </div>
          {portalMeta && <span className="text-[11.5px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium self-start sm:self-auto">{portalMeta}</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <div className="relative">
              <select value={selectedObject} onChange={e => setSelectedObject(e.target.value)}
                disabled={loadingObjects || creatingBatch || creatingSingle}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 focus:border-[#ff7a59] transition cursor-pointer disabled:opacity-50 pr-10">
                {objects.map(obj => <option key={obj.objectTypeId} value={obj.objectTypeId}>{obj.label} ({obj.objectTypeId})</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { loadObjects(true); loadGroups(selectedObject); loadExistingProperties(selectedObject); }} disabled={loadingObjects || loadingGroups || loadingProperties}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50">
              <RefreshCw size={12} className={loadingObjects || loadingGroups || loadingProperties ? 'animate-spin' : ''} /> Refresh Schema
            </button>
            <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg">
              {groups.length} groups · {existingProperties.length} existing properties
            </span>
          </div>
        </div>
      </section>

      {/* Mode selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[['csv', FileSpreadsheet, 'Upload CSV File (Batch Properties)'], ['manual', Plus, 'Single Property Creation']].map(([m, Icon, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${mode === m ? 'bg-[#fff0eb] text-[#df6d50] border border-orange-200' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Icon size={15} /><span>{label}</span>
          </button>
        ))}
      </div>

      {/* CSV mode */}
      {mode === 'csv' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Upload CSV / XLSX for {selectedObjLabel} Properties</h3>
              <p className="text-xs text-slate-400 mt-0.5">Auto-detects <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">Field Name</code>, <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">HubSpot Field Type</code>, and <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">HubSpot Groups</code>.</p>
            </div>
            <button type="button" onClick={handleDownloadSampleCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs">
              <Download size={13} className="text-[#ff7a59]" /> Download Sample Properties CSV
            </button>
          </div>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-[#ff7a59]/60 hover:bg-orange-50/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition group">
            <input ref={fileRef} type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-orange-100 flex items-center justify-center text-slate-400 group-hover:text-[#ff7a59] transition">
              {parsing ? <RefreshCw size={22} className="animate-spin text-[#ff7a59]" /> : <Upload size={22} />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">{fileData ? fileData.filename : 'Click or drag & drop properties CSV / XLSX to upload'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{fileData ? `${fileData.totalRows} property rows detected · Click to replace` : 'Works with your "Field Name, HubSpot Field Type, HubSpot Groups" file'}</p>
            </div>
          </div>

          {fileData && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Table size={14} className="text-[#ff7a59]" /> Detected Column Mappings</span>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer p-1.5 bg-orange-50 border border-orange-200 rounded-xl">
                  <input type="checkbox" checked={autoCreateGroups} onChange={e => setAutoCreateGroups(e.target.checked)} className="rounded text-[#ff7a59] focus:ring-[#ff7a59]" />
                  <span>Create group first if it doesn't exist</span>
                </label>
              </div>

              {/* Group assignment */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Group Source</label>
                  <div className="flex items-center gap-3">
                    {[false, true].map(isFixed => (
                      <label key={String(isFixed)} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input type="radio" name="groupMode" checked={Boolean(fixedGroup) === isFixed}
                          onChange={() => setFixedGroup(isFixed ? (groups[0]?.name || 'custom_properties') : '')}
                          className="text-[#ff7a59] focus:ring-[#ff7a59]" />
                        <span>{isFixed ? 'Assign all to a single group' : 'From CSV column (row by row)'}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:w-64">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">{fixedGroup ? 'Choose Single Group:' : <>CSV Group Column <span className="text-rose-500">*</span></>}</label>
                  {fixedGroup ? (
                    <select value={fixedGroup} onChange={e => setFixedGroup(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#ff7a59]/30">
                      {groups.map(g => <option key={g.name} value={g.name}>{g.label} ({g.name})</option>)}
                    </select>
                  ) : (
                    <select value={columnMap.groupName} onChange={e => setColumnMap(p => ({ ...p, groupName: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#ff7a59]/30">
                      <option value="">-- Choose column --</option>
                      {fileData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Column mapping grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key:'label',     title:'Field Name / Label',   hint:'e.g. "Field Name"', required: true },
                  { key:'name',      title:'Internal Name (name)', hint:'Auto-slugified lowercase alphanumeric' },
                  { key:'fieldType', title:'Field Type column',    hint:'e.g. "HubSpot Field Type" (auto-translated)' },
                ].map(({ key, title, hint, required }) => (
                  <label key={key} className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                    <span>{title} {required && <span className="text-rose-500">*</span>}</span>
                    <select value={columnMap[key]}
                      onChange={e => setColumnMap(p => key === 'fieldType' ? { ...p, fieldType: e.target.value, type: e.target.value } : { ...p, [key]: e.target.value, ...(key === 'label' && p.name === p.label ? { name: e.target.value } : {}) })}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#ff7a59]/30">
                      <option value="">-- Choose column {key === 'name' ? '(Auto-generate)' : ''} --</option>
                      {fileData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-[10px] font-normal text-slate-400">{hint}</span>
                  </label>
                ))}
              </div>

              {/* All Rows Preview Table with Field Type Dropdowns & Portal Status Check */}
              <div className="mt-2 flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-700">
                      All Properties ({totalRowCount})
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {newCount} New to create
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {existingCount} Already in portal (will skip)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View filter */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setFilterView('all')}
                        className={`px-2 py-1 rounded-md font-medium transition cursor-pointer ${filterView === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
                      >
                        All ({totalRowCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterView('new')}
                        className={`px-2 py-1 rounded-md font-medium transition cursor-pointer ${filterView === 'new' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
                      >
                        New only ({newCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterView('existing')}
                        className={`px-2 py-1 rounded-md font-medium transition cursor-pointer ${filterView === 'existing' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-500'}`}
                      >
                        In portal ({existingCount})
                      </button>
                    </div>

                    {/* Search filter */}
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={previewSearch}
                      onChange={e => setPreviewSearch(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white w-40 sm:w-48 focus:outline-none focus:ring-1 focus:ring-[#ff7a59]"
                    />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white text-xs max-h-[440px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-xs border-b border-slate-200 text-slate-600 font-semibold text-[11px] z-10">
                      <tr>
                        <th className="p-2.5 w-12">#</th>
                        <th className="p-2.5">HubSpot Group</th>
                        <th className="p-2.5">Field Name (Label)</th>
                        <th className="p-2.5">Internal Name</th>
                        <th className="p-2.5 min-w-[220px]">Field Type (Changeable)</th>
                        <th className="p-2.5">Portal Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredRows.map((r) => (
                        <tr key={r.idx} className={`hover:bg-slate-50/70 transition ${r.isAlreadyInPortal ? 'bg-slate-50/30' : ''}`}>
                          <td className="p-2.5 text-slate-400 font-mono text-[10px]">{r.idx + 1}</td>
                          <td className="p-2.5 font-medium text-slate-800">
                            {r.rawGroup || <span className="text-slate-300 italic">empty</span>}
                          </td>
                          <td className="p-2.5 font-medium text-slate-800">
                            {r.rawLabel || <span className="text-slate-300 italic">empty</span>}
                          </td>
                          <td className="p-2.5 font-mono text-[11px] text-[#df6d50]">
                            {r.pName || <span className="text-slate-300 italic">empty</span>}
                          </td>
                          <td className="p-2.5">
                            <select
                              value={r.resolvedKey}
                              onChange={e => handleRowTypeChange(r.idx, e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 transition cursor-pointer"
                            >
                              {FIELD_TYPE_SELECT_OPTIONS.map(opt => (
                                <option key={opt.key} value={opt.key}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2.5 whitespace-nowrap">
                            {r.isAlreadyInPortal ? (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                In Portal (will skip)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                ✓ Ready to create
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredRows.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-6 text-center text-slate-400 italic">
                            No properties match the selected filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Showing {filteredRows.length} of {totalRowCount} rows</span>
                  <span>Properties marked "In Portal" will not be recreated</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setFileData(null); setRowOverrides({}); }}
                  disabled={creatingBatch}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Clear File
                </button>
                <button
                  type="button"
                  onClick={handleCreateBatch}
                  disabled={creatingBatch || !columnMap.label || (!columnMap.groupName && !fixedGroup)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a59] hover:bg-[#e56b4c] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {creatingBatch ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Processing {totalRowCount} Properties...
                    </>
                  ) : (
                    <>
                      <Settings2 size={14} />
                      Create {newCount} Properties ({existingCount} already exist) in {selectedObjLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Manual mode */}
      {mode === 'manual' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-2xl">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Create a Single Property</h3>
          <p className="text-xs text-slate-400 mb-5">Call <code className="font-mono text-slate-600">POST /crm/properties/2026-09/{selectedObject}</code>.</p>
          <form onSubmit={handleCreateSingle} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Group (groupName) <span className="text-rose-500">*</span></label>
              <select value={manualForm.groupName} onChange={e => setManualForm(p => ({ ...p, groupName: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30">
                {groups.map(g => <option key={g.name} value={g.name}>{g.label} ({g.name})</option>)}
                <option value="__new__">+ Create a new group...</option>
              </select>
              {manualForm.groupName === '__new__' && (
                <div className="mt-2 p-3 bg-orange-50/50 border border-orange-200 rounded-xl flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-700">New Group Details</span>
                  <input type="text" placeholder="New Group Label, e.g. Contract Details" value={manualForm.customGroupName}
                    onChange={e => setManualForm(p => ({ ...p, customGroupName: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#ff7a59]/30" required />
                  <span className="text-[10px] text-slate-400">Internal name: <code className="font-mono text-slate-600">{slugify(manualForm.customGroupName) || '...'}</code></span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Label <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="e.g. Favorite Food" value={manualForm.label} onChange={e => handleManualLabelChange(e.target.value)} required
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Internal Name (name) <span className="text-rose-500">*</span></label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={manualForm.autoName} onChange={e => setManualForm(p => ({ ...p, autoName: e.target.checked }))} className="rounded text-[#ff7a59]" />
                  Auto-generate from label
                </label>
              </div>
              <input type="text" placeholder="e.g. favorite_food" value={manualForm.name}
                onChange={e => setManualForm(p => ({ ...p, name: slugify(e.target.value), autoName: false }))} required
                className="w-full font-mono text-xs border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type <span className="text-rose-500">*</span></label>
                <select value={manualForm.type} onChange={e => handleTypeChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30">
                  {PROPERTY_TYPES.map(t => <option key={t.type} value={t.type}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field Type <span className="text-rose-500">*</span></label>
                <select value={manualForm.fieldType} onChange={e => setManualForm(p => ({ ...p, fieldType: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30">
                  {currentTypeConfig.fieldTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description (optional)</label>
              <input type="text" placeholder="Short description of this property" value={manualForm.description}
                onChange={e => setManualForm(p => ({ ...p, description: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30" />
            </div>
            {(manualForm.type === 'enumeration') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Options (comma-separated)</label>
                <input type="text" placeholder="Option A, Option B, Option C" value={manualForm.options}
                  onChange={e => setManualForm(p => ({ ...p, options: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30" />
                <span className="text-[10px] text-slate-400 mt-1 block">These become the selectable choices in HubSpot.</span>
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={creatingSingle || !manualForm.name || !manualForm.label}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a59] hover:bg-[#e56b4c] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50">
                {creatingSingle ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={14} />} Create Property
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Batch results */}
      {batchResults && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Batch Creation Results</h3>
              <p className="text-xs text-slate-400 mt-0.5">Summary of properties processed in HubSpot.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">{batchResults.filter(r=>r.status==='created').length} Created</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg">{batchResults.filter(r=>r.status==='already_exists').length} Skipped (In Portal)</span>
              {batchResults.some(r=>r.status==='failed') && <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">{batchResults.filter(r=>r.status==='failed').length} Failed</span>}
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 font-semibold text-slate-600">
                <tr><th className="p-3">Group</th><th className="p-3">Property Name</th><th className="p-3">Label</th><th className="p-3">Status</th><th className="p-3">Details</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchResults.map((item,idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-[11px] text-slate-500">{item.groupName}</td>
                    <td className="p-3 font-mono font-medium text-slate-800">{item.name}</td>
                    <td className="p-3 text-slate-700 font-medium">{item.label}</td>
                    <td className="p-3">
                      {item.status==='created'
                        ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"><CheckCircle2 size={12} /> Created</span>
                        : item.status==='already_exists'
                        ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200"><AlertTriangle size={12} /> Skipped</span>
                        : <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200"><XCircle size={12} /> Failed</span>}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{item.detail || (item.error ? <span className="text-rose-600">{item.error}</span> : item.status==='already_exists' ? 'Already in portal' : 'Success')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

/* ─── Root SchemaManager component ───────────────────────────────────────── */
export function SchemaManager({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('groups');

  // Shared portal/object state — lifted so both tabs share it without re-fetching
  const [objects, setObjects]           = useState([]);
  const [selectedObject, setSelectedObject] = useState('0-1');
  const [portalMeta, setPortalMeta]     = useState('');
  const [loadingObjects, setLoadingObjects] = useState(false);

  const loadObjects = useCallback(async (refresh = false) => {
    setLoadingObjects(true);
    try {
      const cat = await request(`/api/hubspot/objects${refresh ? '?refresh=true' : ''}`);
      setObjects(cat.objects || []);
      setPortalMeta(`${cat.portalName ?? 'HubSpot'} · Portal ${cat.portalId}`);
      if (!selectedObject && cat.objects?.length) setSelectedObject(cat.objects[0].objectTypeId);
    } catch (err) {
      onShowToast?.('Failed to load portal objects: ' + err.message, 'error');
    } finally {
      setLoadingObjects(false);
    }
  }, [selectedObject, onShowToast]);

  useEffect(() => { loadObjects(); }, [loadObjects]);

  const sharedState = { objects, selectedObject, setSelectedObject, portalMeta, loadingObjects, loadObjects };

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Page header + tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Object Group &amp; Property Creation</h1>
          <p className="text-xs text-slate-500 mt-1">Manage HubSpot CRM schema — create property groups and properties via the Properties API (2026-09).</p>
        </div>
        <TabBar active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Active tab content */}
      {activeTab === 'groups'
        ? <GroupsTab    onShowToast={onShowToast} onSwitchTab={setActiveTab} sharedState={sharedState} />
        : <PropertiesTab onShowToast={onShowToast} sharedState={sharedState} />}
    </div>
  );
}
