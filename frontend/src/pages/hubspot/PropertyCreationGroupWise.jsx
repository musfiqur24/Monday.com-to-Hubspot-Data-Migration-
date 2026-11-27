import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Settings2, Upload, RefreshCw, CheckCircle2, AlertTriangle, XCircle,
  Download, Plus, Table, Layers, FileSpreadsheet, ChevronDown, Check, Sparkles
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

export function mapHubspotFieldType(rawType) {
  const str = String(rawType || '').toLowerCase().trim();
  if (str.includes('multi-line') || str.includes('multiline') || str.includes('textarea')) {
    return { type: 'string', fieldType: 'textarea' };
  }
  if (str.includes('file')) {
    return { type: 'string', fieldType: 'file' };
  }
  if (str.includes('single-line') || str.includes('text') || str.includes('phone') || str.includes('email') || str.includes('url') || str.includes('timezone')) {
    return { type: 'string', fieldType: 'text' };
  }
  if (str.includes('multiple checkboxes') || str.includes('checkboxes')) {
    return { type: 'enumeration', fieldType: 'checkbox' };
  }
  if (str.includes('single checkbox') || str.includes('boolean')) {
    return { type: 'bool', fieldType: 'booleancheckbox' };
  }
  if (str.includes('dropdown') || str.includes('select') || str.includes('enumeration') || str.includes('association') || str.includes('workflow')) {
    return { type: 'enumeration', fieldType: 'select' };
  }
  if (str.includes('date and time') || str.includes('datetime')) {
    return { type: 'datetime', fieldType: 'date' };
  }
  if (str.includes('date')) {
    return { type: 'date', fieldType: 'date' };
  }
  if (str.includes('number') || str.includes('currency') || str.includes('calculation') || str.includes('rollup') || str.includes('score')) {
    return { type: 'number', fieldType: 'number' };
  }
  return { type: 'string', fieldType: 'text' };
}

const PROPERTY_TYPES = [
  { type: 'string', label: 'String', fieldTypes: ['text', 'textarea', 'file'] },
  { type: 'number', label: 'Number', fieldTypes: ['number'] },
  { type: 'date', label: 'Date', fieldTypes: ['date'] },
  { type: 'datetime', label: 'Date and Time', fieldTypes: ['date'] },
  { type: 'enumeration', label: 'Dropdown / Select / Checkbox (Enumeration)', fieldTypes: ['select', 'checkbox', 'radio', 'booleancheckbox'] },
  { type: 'bool', label: 'Boolean (Yes/No)', fieldTypes: ['booleancheckbox'] },
];

export function PropertyCreationGroupWise({ onShowToast, onSwitchTab }) {
  // Portal & object selection
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState('0-1');
  const [portalMeta, setPortalMeta] = useState('');
  const [loadingObjects, setLoadingObjects] = useState(false);

  // Available groups for this object
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Mode: 'csv' or 'manual'
  const [mode, setMode] = useState('csv');

  // Manual single property form
  const [manualForm, setManualForm] = useState({
    groupName: '',
    customGroupName: '',
    name: '',
    label: '',
    type: 'string',
    fieldType: 'text',
    description: '',
    options: '',
    autoName: true
  });
  const [creatingSingle, setCreatingSingle] = useState(false);

  // CSV Batch creation
  const fileRef = useRef(null);
  const [fileData, setFileData] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [columnMap, setColumnMap] = useState({
    groupName: '',
    name: '',
    label: '',
    type: '',
    fieldType: '',
    description: '',
    options: ''
  });
  const [fixedGroup, setFixedGroup] = useState(''); // If user wants to assign all CSV properties to one group
  const [autoCreateGroups, setAutoCreateGroups] = useState(true);
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

  // Load groups for selected object
  const loadGroups = useCallback(async (objType) => {
    if (!objType) return;
    setLoadingGroups(true);
    try {
      const res = await request(`/api/hubspot/schema/groups/${encodeURIComponent(objType)}`);
      setGroups(res.groups || []);
      if (res.groups?.length && !manualForm.groupName) {
        setManualForm((p) => ({ ...p, groupName: res.groups[0].name }));
      }
    } catch (err) {
      onShowToast?.('Failed to load groups: ' + err.message, 'error');
    } finally {
      setLoadingGroups(false);
    }
  }, [onShowToast, manualForm.groupName]);

  useEffect(() => {
    loadObjects();
  }, [loadObjects]);

  useEffect(() => {
    if (selectedObject) {
      loadGroups(selectedObject);
    }
  }, [selectedObject, loadGroups]);

  // Handle manual label change with slugify
  const handleManualLabelChange = (val) => {
    setManualForm((prev) => ({
      ...prev,
      label: val,
      name: prev.autoName ? slugify(val) : prev.name
    }));
  };

  // Handle type change in manual form to set valid default fieldType
  const handleTypeChange = (newType) => {
    const config = PROPERTY_TYPES.find((t) => t.type === newType);
    setManualForm((prev) => ({
      ...prev,
      type: newType,
      fieldType: config ? config.fieldTypes[0] : 'text'
    }));
  };

  // Single property creation
  const handleCreateSingle = async (e) => {
    e.preventDefault();
    const targetGroup = manualForm.groupName === '__new__' ? slugify(manualForm.customGroupName) : manualForm.groupName;

    if (!targetGroup) {
      onShowToast?.('Please choose or enter a property group name.', 'error');
      return;
    }
    if (!manualForm.name.trim() || !manualForm.label.trim()) {
      onShowToast?.('Property name and label are required.', 'error');
      return;
    }

    setCreatingSingle(true);
    try {
      // If user typed a new group name, create the group first!
      if (manualForm.groupName === '__new__') {
        await request(`/api/hubspot/schema/groups/${encodeURIComponent(selectedObject)}`, 'POST', {
          name: targetGroup,
          label: manualForm.customGroupName || targetGroup
        });
      }

      const res = await request(`/api/hubspot/schema/properties/${encodeURIComponent(selectedObject)}`, 'POST', {
        groupName: targetGroup,
        name: manualForm.name,
        label: manualForm.label,
        type: manualForm.type,
        fieldType: manualForm.fieldType,
        description: manualForm.description,
        options: manualForm.options
      });

      if (res.status === 'already_exists') {
        onShowToast?.(`Property "${manualForm.label}" already exists in HubSpot.`, 'info');
      } else {
        onShowToast?.(`Property "${manualForm.label}" created successfully in group "${targetGroup}"!`, 'success');
        setManualForm((prev) => ({
          ...prev,
          name: '',
          label: '',
          description: '',
          options: '',
          customGroupName: '',
          autoName: true
        }));
      }
      loadGroups(selectedObject);
    } catch (err) {
      onShowToast?.(err.message, 'error');
    } finally {
      setCreatingSingle(false);
    }
  };

  // Handle CSV file upload
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

      // Auto-detect columns based on sample file headers:
      // "Field Name", "HubSpot Field Type", "HubSpot Groups"
      const groupCol = findHeader(['hubspotgroups', 'hubspotgroup', 'propertygroup', 'groupname', 'group', 'groups']);
      const nameCol = findHeader(['fieldname', 'propertyname', 'internalname', 'name', 'field']);
      const labelCol = findHeader(['fieldname', 'propertylabel', 'label', 'title', 'displayname', 'name']);
      const fieldTypeCol = findHeader(['hubspotfieldtype', 'fieldtype', 'controltype', 'widget', 'type', 'propertytype']);
      const typeCol = fieldTypeCol; // Can share column, mapHubspotFieldType derives both
      const descCol = findHeader(['description', 'desc', 'helptext', 'help_text']);
      const optCol = findHeader(['options', 'choices', 'values', 'dropdownvalues']);

      setColumnMap({
        groupName: groupCol || '',
        name: nameCol || (headers[0] ?? ''),
        label: labelCol || (headers[0] ?? ''),
        type: typeCol || '',
        fieldType: fieldTypeCol || '',
        description: descCol || '',
        options: optCol || ''
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

  // Download sample CSV
  const handleDownloadSampleCsv = () => {
    const headers = 'Field Name,HubSpot Field Type,HubSpot Groups\r\n';
    const rows = [
      'Favorite Food,Single-line text,Contact Information',
      'Customer Status,Dropdown select,Contact Information',
      'Account Balance,Number (currency),System Information',
      'Contract Start Date,Date picker,Lead Information',
      'Auto Renew Enabled,Single checkbox,Lead Information',
      'Special Instructions,Multi-line text,Lead Information'
    ].join('\r\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_properties.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run batch property creation
  const handleCreateBatch = async () => {
    if (!fileData?.rows?.length) return;
    if (!columnMap.label) {
      onShowToast?.('Please map the Property Name / Label column.', 'error');
      return;
    }
    if (!columnMap.groupName && !fixedGroup) {
      onShowToast?.('Please map a Group Name column or select a fixed group for all rows.', 'error');
      return;
    }

    setCreatingBatch(true);
    setBatchResults(null);

    const propertiesPayload = fileData.rows.map((row) => {
      const rawGroup = fixedGroup || (columnMap.groupName ? row[columnMap.groupName] : 'custom_properties');
      const gName = slugify(rawGroup);
      const rawLabel = String(row[columnMap.label] || '').trim();
      const rawName = columnMap.name && row[columnMap.name] ? row[columnMap.name] : rawLabel;
      const pName = slugify(rawName, 50);

      // Translate human field type into HubSpot API type & fieldType
      const rawTypeVal = columnMap.fieldType ? row[columnMap.fieldType] : columnMap.type ? row[columnMap.type] : 'Single-line text';
      const mapped = mapHubspotFieldType(rawTypeVal);

      const pDesc = columnMap.description && row[columnMap.description] ? String(row[columnMap.description]).trim() : '';
      const pOptions = columnMap.options && row[columnMap.options] ? String(row[columnMap.options]).trim() : '';

      return {
        groupName: gName,
        groupLabel: rawGroup,
        name: pName,
        label: rawLabel,
        type: mapped.type,
        fieldType: mapped.fieldType,
        description: pDesc,
        options: pOptions
      };
    }).filter((p) => p.name && p.label && p.groupName);

    try {
      const res = await request(`/api/hubspot/schema/properties/${encodeURIComponent(selectedObject)}/batch`, 'POST', {
        properties: propertiesPayload,
        createMissingGroups: autoCreateGroups
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
      onShowToast?.('Batch property creation failed: ' + err.message, 'error');
    } finally {
      setCreatingBatch(false);
    }
  };

  const selectedObjLabel = objects.find((o) => o.objectTypeId === selectedObject)?.label || 'Contacts';
  const currentTypeConfig = PROPERTY_TYPES.find((t) => t.type === manualForm.type) || PROPERTY_TYPES[0];

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff7a59] flex items-center justify-center font-bold">
              <Settings2 size={18} />
            </span>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Property Creation Group Wise</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create CRM properties inside groups on HubSpot objects via the Properties API (2026-09).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onSwitchTab?.('object-group-creation')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            ← Object Group Creation
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#df6d50] shadow-xs cursor-default"
          >
            Property Creation Group Wise
          </button>
        </div>
      </div>

      {/* 1. Destination Object Selector */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">1. Select Destination Object</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose which HubSpot CRM object you want to create properties for.
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
              onClick={() => { loadObjects(true); loadGroups(selectedObject); }}
              disabled={loadingObjects || loadingGroups}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={loadingObjects || loadingGroups ? 'animate-spin' : ''} />
              Refresh Schema
            </button>
            <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg">
              {groups.length} groups loaded
            </span>
          </div>
        </div>
      </section>

      {/* 2. Choose Mode (CSV Upload vs Single Property) */}
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
          <span>Upload CSV File (Batch Properties)</span>
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
          <span>Single Property Creation</span>
        </button>
      </div>

      {/* MODE A: CSV File Upload */}
      {mode === 'csv' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Upload CSV / XLSX for {selectedObjLabel} Properties</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Auto-detects <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">Field Name</code>, <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">HubSpot Field Type</code>, and <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">HubSpot Groups</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              <Download size={13} className="text-[#ff7a59]" />
              Download Sample Properties CSV
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
                {fileData ? fileData.filename : 'Click or drag & drop properties CSV file to upload'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {fileData
                  ? `${fileData.totalRows} property rows detected · Click to replace file`
                  : 'Works with your "Field Name, HubSpot Field Type, HubSpot Groups" file'}
              </p>
            </div>
          </div>

          {/* Mapping & Settings */}
          {fileData && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Table size={14} className="text-[#ff7a59]" /> Detected Column Mappings
                </span>
                {/* Auto-create group rule */}
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer p-1.5 bg-orange-50 border border-orange-200 rounded-xl">
                  <input
                    type="checkbox"
                    checked={autoCreateGroups}
                    onChange={(e) => setAutoCreateGroups(e.target.checked)}
                    className="rounded text-[#ff7a59] focus:ring-[#ff7a59]"
                  />
                  <span>Create group first if it doesn't exist</span>
                </label>
              </div>

              {/* Group Assignment: from CSV or fixed */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Group Source
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="groupMode"
                        checked={!fixedGroup}
                        onChange={() => setFixedGroup('')}
                        className="text-[#ff7a59] focus:ring-[#ff7a59]"
                      />
                      <span>From CSV column (row by row)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="groupMode"
                        checked={Boolean(fixedGroup)}
                        onChange={() => setFixedGroup(groups[0]?.name || 'custom_properties')}
                        className="text-[#ff7a59] focus:ring-[#ff7a59]"
                      />
                      <span>Assign all properties to a single group</span>
                    </label>
                  </div>
                </div>

                {fixedGroup ? (
                  <div className="sm:w-64">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Choose Single Group:
                    </label>
                    <select
                      value={fixedGroup}
                      onChange={(e) => setFixedGroup(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#ff7a59]/30"
                    >
                      {groups.map((g) => (
                        <option key={g.name} value={g.name}>{g.label} ({g.name})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="sm:w-64">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      CSV Group Column <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={columnMap.groupName}
                      onChange={(e) => setColumnMap((p) => ({ ...p, groupName: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#ff7a59]/30"
                    >
                      <option value="">-- Choose column --</option>
                      {fileData.headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Column mapping grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Property Label */}
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                  <span>Field Name / Label <span className="text-rose-500">*</span></span>
                  <select
                    value={columnMap.label}
                    onChange={(e) => setColumnMap((p) => ({ ...p, label: e.target.value, name: p.name === p.label ? e.target.value : p.name }))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#ff7a59]/30"
                  >
                    <option value="">-- Choose column --</option>
                    {fileData.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-[10px] font-normal text-slate-400">e.g. "Field Name"</span>
                </label>

                {/* Property Name (internal) */}
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                  <span>Internal Name (name)</span>
                  <select
                    value={columnMap.name}
                    onChange={(e) => setColumnMap((p) => ({ ...p, name: e.target.value }))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#ff7a59]/30"
                  >
                    <option value="">-- Auto-generate from Field Name --</option>
                    {fileData.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-[10px] font-normal text-slate-400">Auto-slugified lowercase alphanumeric</span>
                </label>

                {/* Field Type column */}
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
                  <span>Field Type column</span>
                  <select
                    value={columnMap.fieldType}
                    onChange={(e) => setColumnMap((p) => ({ ...p, fieldType: e.target.value, type: e.target.value }))}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#ff7a59]/30"
                  >
                    <option value="">-- Choose column (e.g. HubSpot Field Type) --</option>
                    {fileData.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-[10px] font-normal text-slate-400">e.g. "HubSpot Field Type" (auto-translated)</span>
                </label>
              </div>

              {/* Data Preview Table */}
              <div className="mt-2">
                <span className="text-[11px] font-semibold text-slate-500 mb-2 block">
                  Preview first 5 rows with detected HubSpot API types:
                </span>
                <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">HubSpot Group</th>
                        <th className="p-2.5">Field Name (Label)</th>
                        <th className="p-2.5">Auto Internal Name</th>
                        <th className="p-2.5">Detected API Type &amp; Field</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {fileData.rows.slice(0, 5).map((row, i) => {
                        const rawType = columnMap.fieldType ? row[columnMap.fieldType] : 'Single-line text';
                        const mapped = mapHubspotFieldType(rawType);
                        const rawLabel = row[columnMap.label];
                        return (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-2.5 text-slate-400 font-mono text-[10px]">{i + 1}</td>
                            <td className="p-2.5 font-medium text-slate-800">
                              {fixedGroup || row[columnMap.groupName] || <span className="text-slate-300 italic">empty</span>}
                            </td>
                            <td className="p-2.5 font-medium">
                              {rawLabel || <span className="text-slate-300 italic">empty</span>}
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-[#df6d50]">
                              {slugify(row[columnMap.name] || rawLabel, 50) || <span className="text-slate-300 italic">empty</span>}
                            </td>
                            <td className="p-2.5">
                              <span className="inline-flex items-center gap-1 font-mono text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {mapped.type} / {mapped.fieldType}
                              </span>
                              <span className="text-[10px] text-slate-400 ml-1.5">
                                ({rawType})
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
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
                  disabled={creatingBatch || !columnMap.label || (!columnMap.groupName && !fixedGroup)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a59] hover:bg-[#e56b4c] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {creatingBatch ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Creating Properties in HubSpot...
                    </>
                  ) : (
                    <>
                      <Settings2 size={14} />
                      Create {fileData.totalRows} Properties in {selectedObjLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* MODE B: Single Property Form */}
      {mode === 'manual' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-2xl">
          <h2 className="text-sm font-bold text-slate-800 mb-1">Create a Single Property</h2>
          <p className="text-xs text-slate-400 mb-5">
            Call <code className="font-mono text-slate-600">POST /crm/properties/2026-09/{selectedObject}</code>.
          </p>

          <form onSubmit={handleCreateSingle} className="flex flex-col gap-4">
            {/* Group selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Group (groupName) <span className="text-rose-500">*</span>
              </label>
              <select
                value={manualForm.groupName}
                onChange={(e) => setManualForm((p) => ({ ...p, groupName: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
              >
                {groups.map((g) => (
                  <option key={g.name} value={g.name}>{g.label} ({g.name})</option>
                ))}
                <option value="__new__">+ Create a new group...</option>
              </select>

              {manualForm.groupName === '__new__' && (
                <div className="mt-2 p-3 bg-orange-50/50 border border-orange-200 rounded-xl flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-700">New Group Details</span>
                  <input
                    type="text"
                    placeholder="New Group Label, e.g. Contract Details"
                    value={manualForm.customGroupName}
                    onChange={(e) => setManualForm((p) => ({ ...p, customGroupName: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#ff7a59]/30"
                    required
                  />
                  <span className="text-[10px] text-slate-400">
                    Internal name: <code className="font-mono text-slate-600">{slugify(manualForm.customGroupName) || '...'}</code>
                  </span>
                </div>
              )}
            </div>

            {/* Label */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Label <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Favorite Food"
                value={manualForm.label}
                onChange={(e) => handleManualLabelChange(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
              />
            </div>

            {/* Internal name */}
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
                placeholder="e.g. favorite_food"
                value={manualForm.name}
                onChange={(e) => setManualForm((p) => ({ ...p, name: slugify(e.target.value), autoName: false }))}
                required
                className="w-full font-mono text-xs border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
              />
            </div>

            {/* Type & Field Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={manualForm.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={manualForm.fieldType}
                  onChange={(e) => setManualForm((p) => ({ ...p, fieldType: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
                >
                  {currentTypeConfig.fieldTypes.map((ft) => (
                    <option key={ft} value={ft}>{ft}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options if enumeration */}
            {(manualForm.type === 'enumeration' || ['select', 'checkbox', 'radio'].includes(manualForm.fieldType)) && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dropdown / Choice Options
                </label>
                <input
                  type="text"
                  placeholder="Option 1; Option 2; Option 3 (defaults to Option 1 if blank)"
                  value={manualForm.options}
                  onChange={(e) => setManualForm((p) => ({ ...p, options: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Separate values with semicolons or commas.
                </span>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Optional help text shown in HubSpot"
                value={manualForm.description}
                onChange={(e) => setManualForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={creatingSingle || !manualForm.name || !manualForm.label}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7a59] hover:bg-[#e56b4c] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {creatingSingle ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={14} />}
                Create Property
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 3. Batch Results Table */}
      {batchResults && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Batch Creation Results</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Summary of the properties processed on {selectedObjLabel}.
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
                  <th className="p-3">Group</th>
                  <th className="p-3">Internal Name</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchResults.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium text-slate-700">{item.groupName}</td>
                    <td className="p-3 font-mono font-medium text-slate-800">{item.name}</td>
                    <td className="p-3 text-slate-700 font-medium">{item.label}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{item.type} / {item.fieldType}</td>
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
                      {item.error ? <span className="text-rose-600">{item.error}</span> : item.status === 'already_exists' ? 'Property is already present in portal' : 'Success'}
                    </td>
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
