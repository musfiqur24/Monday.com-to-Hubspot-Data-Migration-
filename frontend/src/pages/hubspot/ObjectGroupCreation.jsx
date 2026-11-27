import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  FolderPlus, Upload, RefreshCw, CheckCircle2, AlertTriangle, XCircle,
  Download, Plus, Table, Layers, FileSpreadsheet, ArrowRight, ChevronDown, Check, Filter
} from 'lucide-react';
import { request } from '../../hooks/useApi.js';

function slugify(text, maxLen = 50) {
  let slug = String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^[0-9]/, '_$&');
  if (maxLen && slug.length > maxLen) {
    slug = slug.slice(0, maxLen).replace(/_+$/, '');
  }
  return slug;
}

export function ObjectGroupCreation({ onShowToast, onSwitchTab }) {
  // Portal & object selection
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState('0-1'); // default Contacts
  const [portalMeta, setPortalMeta] = useState('');
  const [loadingObjects, setLoadingObjects] = useState(false);

  // Existing groups
  const [existingGroups, setExistingGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [showExisting, setShowExisting] = useState(false);

  // Active mode: 'csv' or 'manual'
  const [mode, setMode] = useState('csv');

  // Manual single creation form
  const [manualForm, setManualForm] = useState({ name: '', label: '', displayOrder: -1, autoName: true });
  const [creatingSingle, setCreatingSingle] = useState(false);

  // CSV Batch creation
  const fileRef = useRef(null);
  const [fileData, setFileData] = useState(null); // { filename, headers, rows, totalRows }
  const [parsing, setParsing] = useState(false);
  const [columnMap, setColumnMap] = useState({ name: '', label: '', displayOrder: '' });
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  // Load objects
  const loadObjects = useCallback(async (refresh = false) => {
    setLoadingObjects(true);
    try {
      const cat = await request(`/api/hubspot/objects${refresh ? '?refresh=true' : ''}`);
      setObjects(cat.objects || []);
      setPortalMeta(`${cat.portalName ?? 'HubSpot'} · Portal ${cat.portalId}`);
      if (!selectedObject && cat.objects?.length) {
        setSelectedObject(cat.objects[0].objectTypeId);
      }
    } catch (err) {
      onShowToast?.('Failed to load portal objects: ' + err.message, 'error');
    } finally {
      setLoadingObjects(false);
    }
  }, [selectedObject, onShowToast]);

  // Load existing groups for selected object
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

  useEffect(() => {
    loadObjects();
  }, [loadObjects]);

  useEffect(() => {
    if (selectedObject) {
      loadGroups(selectedObject);
    }
  }, [selectedObject, loadGroups]);

  // Handle manual label input with auto slugify
  const handleManualLabelChange = (val) => {
    setManualForm((prev) => ({
      ...prev,
      label: val,
      name: prev.autoName ? slugify(val) : prev.name
    }));
  };

  // Create single group
  const handleCreateSingle = async (e) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.label.trim()) {
      onShowToast?.('Both internal name and label are required.', 'error');
      return;
    }
    setCreatingSingle(true);
    try {
      const res = await request(`/api/hubspot/schema/groups/${encodeURIComponent(selectedObject)}`, 'POST', {
        name: manualForm.name,
        label: manualForm.label,
        displayOrder: manualForm.displayOrder
      });

      if (res.status === 'already_exists') {
        onShowToast?.(`Group "${manualForm.label}" already exists in HubSpot.`, 'info');
      } else {
        onShowToast?.(`Group "${manualForm.label}" created successfully!`, 'success');
        setManualForm({ name: '', label: '', displayOrder: -1, autoName: true });
      }
      loadGroups(selectedObject);
    } catch (err) {
      onShowToast?.(err.message, 'error');
    } finally {
      setCreatingSingle(false);
    }
  };

  // Upload and parse CSV
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setBatchResults(null);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await request('/api/hubspot/schema/parse', 'POST', fd);
      setFileData(res);

      const headers = res.headers || [];
      const findHeader = (patterns) => headers.find((h) => patterns.some((p) => {
        const clean = h.toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === p || clean.includes(p);
      })) || '';

      // Auto-detect group column (e.g. "HubSpot Groups", "Group Name", "Groups")
      const groupCol = findHeader(['hubspotgroups', 'hubspotgroup', 'groupname', 'propertygroup', 'groups', 'group']);
      const nameCol = groupCol || findHeader(['name', 'internalname', 'id', 'groupid']);
      const labelCol = groupCol || findHeader(['label', 'grouplabel', 'title', 'displayname', 'name']);
      const orderCol = findHeader(['displayorder', 'order', 'sortorder', 'display_order']);

      setColumnMap({
        name: nameCol || (headers[0] ?? ''),
        label: labelCol || (headers[1] ?? headers[0] ?? ''),
        displayOrder: orderCol || ''
      });

      onShowToast?.(`Loaded ${res.filename} (${res.totalRows} rows).`, 'success');
    } catch (err) {
      onShowToast?.('Failed to parse file: ' + err.message, 'error');
      setFileData(null);
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  // Deduplicated unique groups computed from uploaded CSV
  const uniqueGroups = useMemo(() => {
    if (!fileData?.rows?.length || !columnMap.label) return [];
    const seen = new Set();
    const list = [];
    for (const r of fileData.rows) {
      const rawLabel = String(r[columnMap.label] || '').trim();
      if (!rawLabel) continue;
      const rawName = columnMap.name && r[columnMap.name] ? r[columnMap.name] : rawLabel;
      const cleanName = slugify(rawName || rawLabel);
      if (cleanName && !seen.has(cleanName)) {
        seen.add(cleanName);
        list.push({
          name: cleanName,
          label: rawLabel,
          displayOrder: columnMap.displayOrder && r[columnMap.displayOrder] ? Number(r[columnMap.displayOrder]) : -1
        });
      }
    }
    return list;
  }, [fileData, columnMap]);

  // Download sample CSV
  const handleDownloadSampleCsv = () => {
    const headers = 'HubSpot Groups\r\n';
    const rows = [
      'Contact Information',
      'Automations And Tags',
      'System Information',
      'Lead Information',
      'Initial Sales Call',
      'Marketing Tracking',
      'Live Lead Magnets'
    ].join('\r\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_object_groups.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run batch creation
  const handleCreateBatch = async () => {
    if (!uniqueGroups.length) {
      onShowToast?.('No valid groups found in file.', 'error');
      return;
    }

    setCreatingBatch(true);
    setBatchResults(null);

    try {
      const res = await request(`/api/hubspot/schema/groups/${encodeURIComponent(selectedObject)}/batch`, 'POST', {
        groups: uniqueGroups
      });
      setBatchResults(res.results || []);

      const createdCount = (res.results || []).filter((r) => r.status === 'created').length;
      const existCount = (res.results || []).filter((r) => r.status === 'already_exists').length;
      const failedCount = (res.results || []).filter((r) => r.status === 'failed').length;

      onShowToast?.(
        `Batch finished: ${createdCount} created, ${existCount} already exist, ${failedCount} failed.`,
        failedCount ? 'warning' : 'success'
      );
      loadGroups(selectedObject);
    } catch (err) {
      onShowToast?.('Batch creation failed: ' + err.message, 'error');
    } finally {
      setCreatingBatch(false);
    }
  };

  const selectedObjLabel = objects.find((o) => o.objectTypeId === selectedObject)?.label || 'Contacts';

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff7a59] flex items-center justify-center font-bold">
              <FolderPlus size={18} />
            </span>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Object Group Creation</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create custom property groups on HubSpot objects using the Properties API (2026-09).
          </p>
        </div>

        {/* Tab switch between Groups and Properties */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#df6d50] shadow-xs cursor-default"
          >
            Object Group Creation
          </button>
          <button
            type="button"
            onClick={() => onSwitchTab?.('property-creation')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            Property Creation Group Wise →
          </button>
        </div>
      </div>

      {/* 1. Destination Object Selector */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">1. Select Destination Object</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose the HubSpot CRM object where property groups will be created.
            </p>
          </div>
          {portalMeta && (
            <span className="text-[11.5px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium self-start sm:self-auto">
              {portalMeta}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <div className="relative">
              <select
                value={selectedObject}
                onChange={(e) => setSelectedObject(e.target.value)}
                disabled={loadingObjects || creatingBatch || creatingSingle}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 focus:border-[#ff7a59] transition cursor-pointer disabled:opacity-50 pr-10"
              >
                {objects.map((obj) => (
                  <option key={obj.objectTypeId} value={obj.objectTypeId}>
                    {obj.label} ({obj.objectTypeId})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadObjects(true)}
              disabled={loadingObjects}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={loadingObjects ? 'animate-spin' : ''} />
              Refresh Objects
            </button>

            <button
              type="button"
              onClick={() => setShowExisting(!showExisting)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-200 text-[#df6d50] rounded-xl text-xs font-semibold hover:bg-orange-100 transition cursor-pointer"
            >
              <Layers size={12} />
              {showExisting ? 'Hide Existing' : `View Groups (${existingGroups.length})`}
            </button>
          </div>
        </div>

        {/* Existing Groups Dropdown List */}
        {showExisting && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Existing Groups for {selectedObjLabel} ({existingGroups.length})
              </span>
              <button
                type="button"
                onClick={() => loadGroups(selectedObject)}
                disabled={loadingGroups}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={10} className={loadingGroups ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50 divide-y divide-slate-100 text-xs">
              {existingGroups.length === 0 ? (
                <div className="p-3 text-slate-400 text-center italic">No custom groups found for this object.</div>
              ) : (
                existingGroups.map((g) => (
                  <div key={g.name} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-700">{g.label}</span>
                      <span className="ml-2 font-mono text-[11px] text-slate-400">({g.name})</span>
                    </div>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                      order: {g.displayOrder}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Choose Creation Mode (CSV Upload vs Single Manual) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setMode('csv')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            mode === 'csv'
              ? 'bg-[#fff0eb] text-[#df6d50] border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet size={15} />
          <span>Upload CSV File (Batch)</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            mode === 'manual'
              ? 'bg-[#fff0eb] text-[#df6d50] border border-orange-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus size={15} />
          <span>Single Group Creation</span>
        </button>
      </div>

      {/* MODE A: CSV File Upload */}
      {mode === 'csv' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Upload CSV / XLSX for {selectedObjLabel} Groups</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically detects group columns such as <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">HubSpot Groups</code> and deduplicates rows into unique groups.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              <Download size={13} className="text-[#ff7a59]" />
              Download Sample CSV
            </button>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-[#ff7a59]/60 hover:bg-orange-50/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition group"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-orange-100 flex items-center justify-center text-slate-400 group-hover:text-[#ff7a59] transition">
              {parsing ? <RefreshCw size={22} className="animate-spin text-[#ff7a59]" /> : <Upload size={22} />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">
                {fileData ? fileData.filename : 'Click or drag & drop CSV file to upload'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {fileData
                  ? `${fileData.totalRows} rows in file · ${uniqueGroups.length} unique groups detected`
                  : 'Accepts your properties file (reads "HubSpot Groups") or a dedicated groups list'}
              </p>
            </div>
          </div>

          {/* Column Mapping Section */}
          {fileData && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Table size={14} className="text-[#ff7a59]" /> Detected Columns &amp; Group Extraction
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  <Filter size={11} /> {uniqueGroups.length} Unique Groups from {fileData.totalRows} Rows
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Group Label / Name column */}
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                  <span>Group Column (Label / Name) <span className="text-rose-500">*</span></span>
                  <select
                    value={columnMap.label}
                    onChange={(e) => {
                      setColumnMap((prev) => ({
                        ...prev,
                        label: e.target.value,
                        name: prev.name === prev.label ? e.target.value : prev.name
                      }));
                    }}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
                  >
                    <option value="">-- Choose column --</option>
                    {fileData.headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="text-[10px] font-normal text-slate-400">e.g. "HubSpot Groups"</span>
                </label>

                {/* Internal Name mapping */}
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                  <span>Internal Name (name)</span>
                  <select
                    value={columnMap.name}
                    onChange={(e) => setColumnMap((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
                  >
                    <option value="">-- Auto-generate from Label --</option>
                    {fileData.headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="text-[10px] font-normal text-slate-400">Auto-slugified to lowercase alphanumeric</span>
                </label>

                {/* Display Order mapping */}
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                  <span>Display Order (optional)</span>
                  <select
                    value={columnMap.displayOrder}
                    onChange={(e) => setColumnMap((prev) => ({ ...prev, displayOrder: e.target.value }))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
                  >
                    <option value="">-- Default (-1) --</option>
                    {fileData.headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span className="text-[10px] font-normal text-slate-400">Sort priority (integer, default -1)</span>
                </label>
              </div>

              {/* Data Preview Table of Deduplicated Unique Groups */}
              <div className="mt-2">
                <span className="text-[11px] font-semibold text-slate-500 mb-2 block">
                  Extracted Unique Groups ({uniqueGroups.length} ready to create):
                </span>
                <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white text-xs max-h-60 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold text-[11px] sticky top-0">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Group Label</th>
                        <th className="p-2.5">Auto-generated Internal Name</th>
                        <th className="p-2.5">Display Order</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {uniqueGroups.slice(0, 15).map((g, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-2.5 text-slate-400 font-mono text-[10px]">{i + 1}</td>
                          <td className="p-2.5 font-semibold text-slate-800">
                            {g.label}
                          </td>
                          <td className="p-2.5 font-mono text-[11px] text-[#df6d50]">
                            {g.name}
                          </td>
                          <td className="p-2.5 text-slate-500 font-mono text-[11px]">
                            {g.displayOrder}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {uniqueGroups.length > 15 && (
                  <p className="text-[10.5px] text-slate-400 mt-1 italic">
                    Showing first 15 of {uniqueGroups.length} unique groups. All {uniqueGroups.length} will be created.
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setFileData(null)}
                  disabled={creatingBatch}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Clear File
                </button>
                <button
                  type="button"
                  onClick={handleCreateBatch}
                  disabled={creatingBatch || !uniqueGroups.length}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a59] hover:bg-[#e56b4c] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {creatingBatch ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Creating {uniqueGroups.length} Groups in HubSpot...
                    </>
                  ) : (
                    <>
                      <FolderPlus size={14} />
                      Create {uniqueGroups.length} Unique Groups in {selectedObjLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* MODE B: Single Group Form */}
      {mode === 'manual' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-2xl">
          <h2 className="text-sm font-bold text-slate-800 mb-1">Create a Single Property Group</h2>
          <p className="text-xs text-slate-400 mb-5">
            Directly call <code className="font-mono text-slate-600">POST /crm/properties/2026-09/{selectedObject}/groups</code>.
          </p>

          <form onSubmit={handleCreateSingle} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Group Label <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Customer Overview"
                value={manualForm.label}
                onChange={(e) => handleManualLabelChange(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Internal Name (name) <span className="text-rose-500">*</span>
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualForm.autoName}
                    onChange={(e) => setManualForm((p) => ({ ...p, autoName: e.target.checked }))}
                    className="rounded text-[#ff7a59] focus:ring-[#ff7a59]"
                  />
                  Auto-generate from label
                </label>
              </div>
              <input
                type="text"
                placeholder="e.g. customer_overview"
                value={manualForm.name}
                onChange={(e) => setManualForm((p) => ({ ...p, name: slugify(e.target.value), autoName: false }))}
                required
                className="w-full font-mono text-xs border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Must be unique, lowercase, alphanumeric, and underscores only.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Order (optional)
              </label>
              <input
                type="number"
                placeholder="-1"
                value={manualForm.displayOrder}
                onChange={(e) => setManualForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Higher numbers appear lower on the record page. Default is -1.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={creatingSingle || !manualForm.name || !manualForm.label}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a59] hover:bg-[#e56b4c] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {creatingSingle ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={14} />}
                Create Group
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 3. Batch Creation Results Table */}
      {batchResults && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Batch Creation Results</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Summary of the property groups processed in HubSpot.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                {batchResults.filter((r) => r.status === 'created').length} Created
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
                {batchResults.filter((r) => r.status === 'already_exists').length} Already Existed
              </span>
              {batchResults.some((r) => r.status === 'failed') && (
                <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                  {batchResults.filter((r) => r.status === 'failed').length} Failed
                </span>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="p-3">Internal Name</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchResults.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-medium text-slate-800">{item.name}</td>
                    <td className="p-3 text-slate-700 font-medium">{item.label}</td>
                    <td className="p-3">
                      {item.status === 'created' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 size={12} /> Created
                        </span>
                      ) : item.status === 'already_exists' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <AlertTriangle size={12} /> Already Exists
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <XCircle size={12} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {item.error ? <span className="text-rose-600">{item.error}</span> : item.status === 'already_exists' ? 'Group is already present in portal' : 'Success'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick jump to Property Creation */}
          <div className="p-4 bg-orange-50/50 border border-orange-200/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="text-emerald-500" size={16} />
              <span className="text-xs text-slate-700 font-medium">
                Groups are ready in HubSpot. Now proceed to create properties inside these groups.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab?.('property-creation')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#df6d50] hover:underline cursor-pointer"
            >
              Continue to Property Creation <ArrowRight size={13} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
