const $ = id => document.getElementById(id);
const node = (tag, className, text) => { const element = document.createElement(tag); if (className) element.className = className; if (text !== undefined) element.textContent = text; return element; };
const titles = [
  ['Choose your Monday workbook','Start with your Excel export. Bring the contact details and actual files into HubSpot.'],
  ['Map columns to contact properties','Choose where each column belongs. Every linked file will be uploaded and kept together.'],
  ['Review your migration','Check your data, see which contacts will be created or updated, and resolve any issues.'],
  ['Run your migration','Follow every step from Monday downloads to verified HubSpot contact records.']
];
const strategies = { same_property:'All files in this property', numbered:'Separate numbered properties', note:'Attach all files to a Note', first_only:'First file only (skip the rest)' };
let config, items = [], properties = [], sourceColumns = [], previews = {}, workbook, savedProgress, columnCoverage = [];
let currentStep = 0, filter = 'all', dirty = false, localBusy = false, connected = false, state = {}, preflight = null, preflightFresh = false;
let logs = [], lastLogId = 0, selectedFile = null, requestKind = null, initialStatus = true, validationInvalidated = false;
function notify(message, type = 'info') { $('notice').hidden = true; window.UI.toast(message,type); }
const mondayWorkflow = window.UI.progress({onSelect:step=>go(step),label:'Monday to HubSpot progress'});
$('notice').before(mondayWorkflow.root);
function badge(text, type = 'neutral') { return node('span',`pill ${type}`,text); }
function statCards(target, cards) {
  $(target).replaceChildren(...cards.map(([label,value,description]) => {
    const card = node('div','stat'); card.append(node('span','stat-label',label),node('strong','',String(value ?? '—')),node('small','',description)); return card;
  }));
}
async function api(url, method = 'GET', body) {
  return window.UI.request(url,method,body);
}
function activity(message, level = 'info', timestamp = new Date().toISOString()) {
  logs.push({message,level,timestamp}); logs = logs.slice(-150); renderLogs();
}
function renderLogs() {
  if (!logs.length) { $('log').replaceChildren(node('div','empty-state','No activity yet. Start with preflight or a dry preview.')); return; }
  const nearBottom = $('log').scrollHeight - $('log').scrollTop - $('log').clientHeight < 90;
  $('log').replaceChildren(...logs.map(entry => {
    const row = node('div',`log-entry ${entry.level}`), time = node('time','',new Date(entry.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    time.dateTime = entry.timestamp; row.append(time,node('i','log-dot'),node('span','',entry.message)); return row;
  }));
  if (nearBottom) $('log').scrollTop = $('log').scrollHeight;
}
async function action(fn) {
  if (localBusy || state.running) return;
  localBusy = true; notify(''); updateControls();
  try { await fn(); } catch(error) { notify(error.message,'error'); if(logs.at(-1)?.message!==error.message)activity(error.message,'error'); }
  finally { localBusy = false; requestKind = null; renderReview(); updateControls(); }
}
function go(step) {
  currentStep = Math.max(0,Math.min(3,step)); sessionStorage.setItem('trt-migration-step',String(currentStep));
  document.querySelectorAll('[data-panel]').forEach(panel => { panel.hidden = Number(panel.dataset.panel) !== currentStep; });
  document.querySelectorAll('[data-step]').forEach(button => { const index = Number(button.dataset.step); button.classList.toggle('active',index === currentStep); button.classList.toggle('done',index < currentStep); button.setAttribute('aria-current',index === currentStep ? 'step' : 'false'); });
  $('page-title').textContent = titles[currentStep][0]; $('page-description').textContent = titles[currentStep][1]; $('step-label').textContent = `Step ${currentStep+1} of 4`;
  renderReview(); updateControls(); window.scrollTo({top:0,behavior:'smooth'});
}
function markDirty() {
  dirty = true; preflightFresh = false; validationInvalidated = true; $('save-state').textContent = 'Unsaved changes'; $('save-state').classList.add('dirty');
  updateMappingCounts(); updateControls();
}
function getProperty(item) { return properties.find(p => p.name === item.hubspotProperty); }
function itemIssues(item) {
  if (!preflightFresh) return [];
  return (preflight?.issues || []).filter(issue => issue.column === item.excel);
}
function itemStatus(item) {
  if (item.kind === 'email') return ['Identifier','success'];
  if (!item.hubspotProperty) return ['Ignored','neutral'];
  if (itemIssues(item).length) return ['Needs attention','error'];
  const property = getProperty(item);
  if (properties.length && !property && !item.createIfMissing) return ['Not found','warning'];
  if (property && (property.modificationMetadata?.readOnlyValue || property.calculated || property.externalOptions || (item.kind === 'file' && property.fieldType !== 'file') || (item.kind !== 'file' && property.fieldType === 'file'))) return ['Check type','warning'];
  return item.createIfMissing && !property ? ['Create property','warning'] : ['Mapped','success'];
}
function updateMappingCounts() {
  const mapped = items.filter(item => item.hubspotProperty || item.kind === 'email').length;
  const counts = {all:items.length,mapped,ignored:items.length-mapped,files:items.filter(i=>i.kind==='file').length,issues:items.filter(i=>['error','warning'].includes(itemStatus(i)[1])).length};
  for (const [key,value] of Object.entries(counts)) $(`count-${key}`).textContent = value;
  $('mapping-counts').textContent = `${mapped} mapped · ${counts.ignored} ignored · ${counts.files} file columns`;
  $('mapping-banner').className = `info-banner ${counts.ignored ? 'warning' : ''}`;
  $('mapping-banner').textContent = counts.ignored ? `${counts.ignored} columns are ignored and won't be imported. Review them with the Ignored filter. Source is excluded as requested. All URLs in mapped file columns are included.` : 'All columns have destinations. Multiple files are kept together using your selected file strategy.';
  document.querySelectorAll('#mapping-rows tr').forEach(tr => {
    const item = items[Number(tr.dataset.index)], status = itemStatus(item), property = getProperty(item);
    tr.querySelector('.status-cell').replaceChildren(badge(...status));
    const caption = item.kind === 'email'
      ? 'Required match key · trimmed and lowercased'
      : item.excel === 'Source'
      ? 'Excluded from this migration'
      : !item.hubspotProperty
      ? 'This column will not be imported'
      : item.createIfMissing
      ? 'New property will be created on HubSpot'
      : (property?.description || '');
    tr.querySelector('.property-caption').textContent = caption;
    tr.classList.toggle('has-error',status[1] === 'error');
  });
  applyFilter();
}
function applyFilter() {
  const search = $('mapping-search').value.trim().toLowerCase(); let shown = 0;
  document.querySelectorAll('#mapping-rows tr').forEach(tr => {
    const item = items[Number(tr.dataset.index)], mapped = Boolean(item.hubspotProperty || item.kind === 'email'), property = getProperty(item);
    const statusMatch = filter === 'all' || (filter === 'mapped' && mapped) || (filter === 'ignored' && !mapped) || (filter === 'files' && item.kind === 'file') || (filter === 'issues' && ['error','warning'].includes(itemStatus(item)[1]));
    tr.hidden = !(statusMatch && `${item.excel} ${item.hubspotProperty} ${property?.label || ''}`.toLowerCase().includes(search)); if (!tr.hidden) shown++;
  });
  $('mapping-empty').hidden = shown > 0;
  document.querySelectorAll('[data-filter]').forEach(button=>button.classList.toggle('selected',button.dataset.filter===filter));
}
function selectOptions(values, selected, change) {
  const select = document.createElement('select'); for (const [value,label] of Object.entries(values)) { const option = node('option','',label); option.value = value; select.append(option); } select.value = selected; select.onchange = () => change(select.value); return select;
}
function translationRow(container, from = '', to = '') {
  const row = node('div','translation'), source = document.createElement('input'), target = document.createElement('input');
  source.value = from; source.placeholder = 'From'; source.setAttribute('aria-label','Source value'); target.value = to; target.placeholder = 'To'; target.setAttribute('aria-label','HubSpot value');
  row.append(source,node('span','','→'),target); container.append(row); return row;
}
let globalPropertyPicker = null;

function getGlobalPropertyPicker() {
  if (globalPropertyPicker) return globalPropertyPicker;

  const panel = node('div', 'prop-dropdown-panel');
  panel.id = 'global-prop-picker';
  panel.hidden = true;

  const searchBox = node('div', 'prop-search-box');
  const searchInput = node('input', 'prop-search-input');
  searchInput.placeholder = 'Search HubSpot properties (by name or label)...';
  searchInput.autocomplete = 'off';
  searchInput.setAttribute('aria-label', 'Search HubSpot properties');
  searchBox.append(node('span', 'prop-search-icon', '⌕'), searchInput);

  const statusBar = node('div', 'prop-search-status');
  const countBadge = node('span', 'prop-count-badge', '');
  statusBar.append(countBadge);

  const optionsList = node('div', 'prop-options-list');
  optionsList.setAttribute('role', 'listbox');
  panel.append(searchBox, statusBar, optionsList);
  document.body.append(panel);

  let currentItem = null;
  let currentTrigger = null;

  function getEligibleProperties(item) {
    if (item.kind === 'file') {
      return properties.filter(p => !p.modificationMetadata?.readOnlyValue && !p.calculated && !p.externalOptions);
    }
    return properties.filter(p => !p.modificationMetadata?.readOnlyValue && !p.calculated && !p.externalOptions && p.fieldType !== 'file');
  }

  function renderOptions(query = '') {
    if (!currentItem) return;
    const q = query.trim().toLowerCase();
    optionsList.replaceChildren();

    // Option 1: Unmapped / Ignore option
    const unmapOpt = node('div', `prop-opt unmap-opt ${!currentItem.hubspotProperty ? 'selected' : ''}`);
    unmapOpt.setAttribute('tabindex', '0');
    unmapOpt.setAttribute('role', 'option');
    unmapOpt.append(node('span', 'prop-opt-label muted', '— Leave unmapped (ignored) —'));
    const selectUnmap = () => {
      currentItem.hubspotProperty = '';
      close();
      markDirty();
      renderMappings();
    };
    unmapOpt.onclick = selectUnmap;
    unmapOpt.onkeydown = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); selectUnmap(); }
    };
    optionsList.append(unmapOpt);

    const eligible = getEligibleProperties(currentItem);
    let matches = eligible;
    if (q) {
      matches = eligible.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.label && p.label.toLowerCase().includes(q)));
    }

    countBadge.textContent = q ? `${matches.length} matching` : `${eligible.length} properties available`;

    matches.sort((a, b) => {
      if (a.name === currentItem.hubspotProperty) return -1;
      if (b.name === currentItem.hubspotProperty) return 1;
      if (currentItem.kind === 'file') {
        const aFile = a.fieldType === 'file' ? 1 : 0;
        const bFile = b.fieldType === 'file' ? 1 : 0;
        if (aFile !== bFile) return bFile - aFile;
      }
      return (a.label || a.name).localeCompare(b.label || b.name);
    });

    for (const p of matches) {
      const isSelected = p.name === currentItem.hubspotProperty;
      const opt = node('div', `prop-opt ${isSelected ? 'selected' : ''}`);
      opt.setAttribute('tabindex', '0');
      opt.setAttribute('role', 'option');
      if (isSelected) opt.setAttribute('aria-selected', 'true');

      const row1 = node('div', 'prop-opt-row');
      row1.append(
        node('strong', 'prop-opt-label', p.label || p.name),
        node('span', `prop-opt-type ${p.fieldType === 'file' ? 'file' : ''}`.trim(), p.fieldType === 'file' ? 'FILE' : p.type)
      );
      const row2 = node('div', 'prop-opt-name', p.name);
      opt.append(row1, row2);

      const selectOpt = () => {
        currentItem.hubspotProperty = p.name;
        close();
        markDirty();
        renderMappings();
      };
      opt.onclick = selectOpt;
      opt.onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); selectOpt(); }
      };
      optionsList.append(opt);
    }

    if (q && !eligible.some(p => p.name.toLowerCase() === q)) {
      const safeCustom = q.replace(/[^a-z0-9_]/g, '_');
      const customOpt = node('div', 'prop-opt custom-opt');
      customOpt.setAttribute('tabindex', '0');
      customOpt.setAttribute('role', 'option');
      const r1 = node('div', 'prop-opt-row');
      r1.append(
        node('strong', 'prop-opt-label', `+ Use "${safeCustom}"`),
        node('span', 'prop-opt-type new', 'NEW')
      );
      customOpt.append(r1, node('div', 'prop-opt-name', 'Create property on HubSpot'));
      const selectCustom = () => {
        currentItem.hubspotProperty = safeCustom;
        currentItem.createIfMissing = true;
        close();
        markDirty();
        renderMappings();
      };
      customOpt.onclick = selectCustom;
      customOpt.onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); selectCustom(); }
      };
      optionsList.append(customOpt);
    }

    if (!matches.length && !q) {
      optionsList.append(node('div', 'prop-empty', 'No HubSpot properties loaded. Click "Refresh HubSpot properties" above.'));
    }
  }

  function open(item, triggerBtn) {
    currentItem = item;
    currentTrigger = triggerBtn;

    document.querySelectorAll('.prop-select-trigger[aria-expanded=true]').forEach(t => t.setAttribute('aria-expanded', 'false'));
    triggerBtn.setAttribute('aria-expanded', 'true');

    // Position panel fixed in viewport
    const rect = triggerBtn.getBoundingClientRect();
    const panelWidth = Math.max(380, Math.min(500, Math.max(rect.width, 380)));
    let left = rect.left;
    if (left + panelWidth > window.innerWidth - 16) {
      left = window.innerWidth - panelWidth - 16;
    }
    left = Math.max(12, left);

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < 300 && spaceAbove > spaceBelow;

    panel.style.left = `${left}px`;
    panel.style.width = `${panelWidth}px`;

    if (openUpward) {
      panel.style.top = 'auto';
      panel.style.bottom = `${Math.max(10, window.innerHeight - rect.top + 6)}px`;
      panel.style.maxHeight = `${Math.min(360, Math.max(180, spaceAbove - 24))}px`;
    } else {
      panel.style.top = `${rect.bottom + 6}px`;
      panel.style.bottom = 'auto';
      panel.style.maxHeight = `${Math.min(360, Math.max(180, spaceBelow - 24))}px`;
    }

    panel.hidden = false;
    searchInput.value = '';
    renderOptions('');
    setTimeout(() => searchInput.focus(), 30);
  }

  function close() {
    panel.hidden = true;
    if (currentTrigger) {
      currentTrigger.setAttribute('aria-expanded', 'false');
    }
    currentItem = null;
    currentTrigger = null;
  }

  searchInput.oninput = (e) => {
    renderOptions(e.target.value);
  };

  searchInput.onkeydown = (e) => {
    if (e.key === 'Escape') {
      close();
      if (currentTrigger) currentTrigger.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opts = optionsList.querySelectorAll('.prop-opt');
      if (opts.length > 1) {
        opts[1].click();
      } else if (opts.length === 1) {
        opts[0].click();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = optionsList.querySelector('.prop-opt');
      if (first) first.focus();
    }
  };

  optionsList.onkeydown = (e) => {
    const active = document.activeElement;
    if (!active || !active.classList.contains('prop-opt')) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = active.nextElementSibling;
      if (next && next.classList.contains('prop-opt')) next.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = active.previousElementSibling;
      if (prev && prev.classList.contains('prop-opt')) {
        prev.focus();
      } else {
        searchInput.focus();
      }
    } else if (e.key === 'Escape') {
      close();
      if (currentTrigger) currentTrigger.focus();
    }
  };

  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && !e.target.closest('.prop-select-trigger')) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      close();
    }
  });

  window.addEventListener('scroll', () => {
    if (!panel.hidden) close();
  }, true);

  globalPropertyPicker = {
    open,
    close,
    isOpenFor: (btn) => !panel.hidden && currentTrigger === btn
  };

  return globalPropertyPicker;
}

function renderSearchablePropertyPicker(item, destCell) {
  if (item.kind === 'email') {
    const locked = node('div', 'prop-locked');
    locked.append(node('strong', 'prop-locked-name', 'email'), node('span', 'prop-locked-badge', 'MATCH KEY'));
    destCell.append(locked);
    return;
  }
  if (item.excel === 'Source') {
    const locked = node('div', 'prop-locked muted');
    locked.append(node('strong', 'prop-locked-name', '—'), node('span', 'prop-locked-badge', 'EXCLUDED'));
    destCell.append(locked);
    return;
  }

  const wrap = node('div', 'prop-select-wrap');
  const trigger = node('button', 'prop-select-trigger');
  trigger.type = 'button';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-label', `HubSpot property for ${item.excel}`);

  const prop = getProperty(item);
  if (item.hubspotProperty) {
    trigger.classList.add('has-value');
    const valWrap = node('div', 'prop-val-wrap');
    const mainLine = node('div', 'prop-val-main');
    const typeLabel = prop ? (prop.fieldType === 'file' ? 'FILE' : prop.type) : (item.createIfMissing ? 'NEW' : 'CUSTOM');
    const typeClass = prop ? (prop.fieldType === 'file' ? 'file' : '') : (item.createIfMissing ? 'new' : '');

    const labelText = prop ? (prop.label || prop.name) : item.hubspotProperty;
    mainLine.append(
      node('strong', 'prop-val-label-main', labelText),
      node('span', `prop-val-type ${typeClass}`.trim(), typeLabel)
    );
    const subText = item.createIfMissing
      ? `${item.hubspotProperty} · Will create property`
      : item.hubspotProperty;
    const subLine = node('div', 'prop-val-name-sub', subText);
    valWrap.append(mainLine, subLine);

    const clearBtn = node('span', 'prop-clear-btn', '×');
    clearBtn.title = 'Clear mapping (leave ignored)';
    clearBtn.onclick = (e) => {
      e.stopPropagation();
      item.hubspotProperty = '';
      markDirty();
      renderMappings();
    };

    trigger.append(valWrap, clearBtn, node('span', 'prop-arrow', '▾'));
  } else {
    trigger.classList.remove('has-value');
    trigger.append(
      node('span', 'prop-placeholder', 'Choose a HubSpot property or leave ignored…'),
      node('span', 'prop-arrow', '▾')
    );
  }

  trigger.onclick = () => {
    const picker = getGlobalPropertyPicker();
    if (picker.isOpenFor(trigger)) {
      picker.close();
    } else {
      picker.open(item, trigger);
    }
  };

  wrap.append(trigger);
  destCell.append(wrap);
}

function renderMappings() {
  $('mapping-rows').replaceChildren(...items.map((item,index) => {
    const tr = document.createElement('tr'); tr.dataset.index = index;
    const name = document.createElement('td'); name.append(node('span','column-name',item.excel),node('span','column-kind',item.kind === 'email' ? 'MATCH KEY' : item.kind === 'file' ? 'FILE ATTACHMENTS' : 'CONTACT DETAILS'));
    const sample = node('td','sample'); for (const value of previews[item.excel] || []) sample.append(node('div','',value || '—'));
    const status = node('td','status-cell'), destCell = document.createElement('td');
    renderSearchablePropertyPicker(item, destCell);
    destCell.append(node('small','property-caption'));
    if (item.kind === 'file') { const mode = selectOptions(strategies,item.multiFileStrategy,value=>{item.multiFileStrategy=value;markDirty();}); mode.setAttribute('aria-label',`Multiple files for ${item.excel}`); mode.className = 'file-strategy'; destCell.append(mode); }
    const options = document.createElement('td');
    if (item.kind !== 'email' && item.excel !== 'Source') {
      const details = node('details','row-options'); details.append(node('summary','','Configure'));
      const roleLabel=node('label','','Import this column as');
      const role=selectOptions({contact:'Contact details',file:'File attachments'},item.kind,value=>{item.kind=value;item.multiFileStrategy ||= 'same_property';markDirty();renderMappings();});
      role.setAttribute('aria-label',`Import type for ${item.excel}`);roleLabel.append(role);details.append(roleLabel);
      if (item.kind !== 'file') {
        const label = node('label','checkbox-label'), create = document.createElement('input'); create.type='checkbox'; create.checked=Boolean(item.createIfMissing); create.onchange=()=>{item.createIfMissing=create.checked;markDirty();}; label.append(create,document.createTextNode('Create if missing')); details.append(label);
        const typeLabel=node('label','','New property type'); const type=selectOptions({string:'Text',number:'Number',date:'Date',bool:'Yes / no'},item.type||'string',value=>{item.type=value;markDirty();}); typeLabel.append(type); details.append(typeLabel);
        const translations=node('div','translations'); details.append(node('label','','Value translations'),translations);
        const readTranslations=()=>{const entries=[...translations.children].map(row=>[row.children[0].value.trim(),row.children[2].value.trim()]).filter(([from,to])=>from&&to);item.valueMap=Object.fromEntries(entries);markDirty();};
        for(const [from,to] of Object.entries(item.valueMap||{})) translationRow(translations,from,to);
        translations.addEventListener('input',readTranslations);
        const add=node('button','small-button','+ Add translation'); add.onclick=()=>{translationRow(translations);}; details.append(add);
      } else details.append(node('p','','Every URL is parsed. Existing uploads are reused. Files stay PRIVATE.'));
      const ignore=node('button','ignore-button','Ignore this column'); ignore.onclick=()=>{item.hubspotProperty='';markDirty();renderMappings();}; details.append(ignore); options.append(details);
    } else options.append(node('span','muted',item.kind==='email'?'Required':'Excluded'));
    const issues=itemIssues(item); if(issues.length) destCell.append(node('small','row-error',`${issues[0].error} (${issues.length} rows)`));
    tr.append(name,sample,status,destCell,options);return tr;
  })); updateMappingCounts(); updateControls();
}
function collectMapping() {
  const emailColumn=$('email').value.trim(), fileItems=items.filter(i=>i.kind==='file'&&i.hubspotProperty);
  return {...config,emailColumn,nameColumn:$('name').value.trim(),sheet:$('sheet').value.trim(),contactMode:$('contact-mode').value,noteSetFirst:$('first').checked,numberedFallback:$('fallback').value,
    columns:fileItems.map(i=>({excel:i.excel,hubspotProperty:i.hubspotProperty,multiFileStrategy:i.multiFileStrategy})),
    propertyMappings:items.filter(i=>i.excel!==emailColumn&&!fileItems.includes(i)).map(i=>({excel:i.excel,hubspotProperty:i.excel==='Source'||i.kind==='file'||i.kind==='email'?'':i.hubspotProperty,createIfMissing:Boolean(i.createIfMissing),type:i.type||'string',fieldType:{string:'textarea',number:'number',date:'date',bool:'booleancheckbox'}[i.type||'string'],label:i.label||i.excel,valueMap:i.valueMap||{}}))};
}
async function save() {
  config=await api('/api/config','PUT',collectMapping());dirty=false;$('save-state').textContent='✓ All changes saved';$('save-state').classList.remove('dirty');
}
async function refreshProperties() {
  $('refresh-properties').textContent='Loading properties…';
  try {
    const data=await api('/api/contact-mapping');properties=data.properties;
    for(const id of ['all-properties','file-properties'])$(id).replaceChildren();
    for(const property of properties.filter(p=>!p.modificationMetadata?.readOnlyValue&&!p.calculated&&!p.externalOptions)) {const option=node('option');option.value=property.name;option.label=`${property.label} (${property.type})`;$(property.fieldType==='file'?'file-properties':'all-properties').append(option);}
    renderMappings();
  } finally {$('refresh-properties').textContent='Refresh HubSpot properties';}
}
async function load() {
  const data=await api('/api/config');config=data.mapping;sourceColumns=data.columns;previews=data.previews||{};workbook=data.workbookSummary;savedProgress=data.savedProgress;
  columnCoverage=data.columnCoverage||[];
  for(const [id,value] of Object.entries({email:config.emailColumn,name:config.nameColumn,sheet:config.sheet,'contact-mode':config.contactMode,fallback:config.numberedFallback}))$(id).value=value;
  $('first').checked=config.noteSetFirst;
  const details=new Map((config.propertyMappings||[]).map(i=>[i.excel,i]));
  items=(sourceColumns.length?sourceColumns:[config.emailColumn,...config.propertyMappings.map(i=>i.excel),...config.columns.map(i=>i.excel)]).map(excel=>{
    const file=config.columns.find(c=>c.excel===excel);return excel===config.emailColumn?{excel,kind:'email',hubspotProperty:'email'}:file?{...file,kind:'file'}:{excel,kind:'contact',hubspotProperty:'',type:'string',valueMap:{},...details.get(excel)};
  });
  $('workbook-name').textContent=workbook?.filename||'No workbook loaded';$('workbook-meta').textContent=workbook?`${workbook.rows} data rows · ${workbook.columns} columns · worksheet ${config.sheet}`:data.workbookError||'Choose your Monday export to continue.';
  $('workbook-badge').textContent=workbook?'Ready':'Missing';$('workbook-badge').className=`pill ${workbook?'success':'warning'}`;
  statCards('workbook-stats',[['Contacts in workbook',workbook?.contacts,'Matched using the Email column'],['Linked files',workbook?.files,'Every URL is included'],['Contact columns',workbook?.columns,'Review destinations in the next step'],['Already uploaded',savedProgress?.filesUploaded||0,'Successful files will be reused']]);
  renderMappings();renderReview();renderResults();
  if(!data.credentialsConfigured)notify('Configure MONDAY_API_TOKEN, HUBSPOT_PORTAL_ID and HUBSPOT_PRIVATE_APP_TOKEN in .env, then restart before running Monday migrations.','error');
  else if(data.workbookError)notify(data.workbookError,'error');
  else refreshProperties().catch(error=>notify(`Workbook loaded. Property list could not refresh: ${error.message}`,'error'));
  updateControls();
}
function renderReview() {
  const summary=preflight, fresh=preflightFresh&&summary;
  statCards('review-stats',[['Contacts',fresh?summary.contacts:workbook?.contacts,'Unique email addresses'],['Files',fresh?summary.files:workbook?.files,'All links, including multi-file cells'],['Will be created',fresh?summary.contactsToCreate:'—','No matching active email'],['Will be updated',fresh?summary.contactsToUpdate:'—','Matching contacts in HubSpot']]);
  const status=$('review-status');status.className=`review-status ${fresh?(summary.issues.length?'error':'success'):''}`;
  status.querySelector('h2').textContent=localBusy&&requestKind==='preflight'?'Checking your migration…':!fresh?'Let\'s check your import':summary.issues.length?`${summary.issues.length} issues need attention`:'Your data checks passed';
  status.querySelector('p').textContent=localBusy&&requestKind==='preflight'?'Follow the live activity while accounts, properties and contacts are checked.':!fresh?(dirty?'Mappings have changed. Run preflight again to refresh the results.':'Preflight makes no changes in HubSpot.'):'Review ignored columns and proposed changes, then continue to a dry preview or real run.';
  $('validation-badge').textContent=fresh?(summary.issues.length?'Needs attention':'Passed'):'Not checked';$('validation-badge').className=`pill ${fresh?(summary.issues.length?'error':'success'):'neutral'}`;
  $('validation-subtitle').textContent=fresh?`${summary.rows} rows scanned · ${summary.issues.length} validation issues`:'Run preflight to validate the current mappings.';
  const validation=$('validation-results');validation.replaceChildren();
  if(fresh) {
    const issueGroups=new Map();for(const issue of summary.issues){const key=`${issue.column}: ${issue.error}`;if(!issueGroups.has(key))issueGroups.set(key,{column:issue.column,rows:[]});issueGroups.get(key).rows.push(issue.row);}
    if(!summary.issues.length)for(const [title,description] of [['Accounts connected','Monday and HubSpot credentials passed their access checks.'],['Properties and values valid','Mapped values match their destination property types.'],['Contacts matched','Create and update counts are shown above.']]){const row=node('div','validation-item');const text=node('div');text.append(node('strong','',title),node('p','',description));row.append(node('span','check-symbol','✓'),text);validation.append(row);}
    for(const [message,info] of issueGroups){const row=node('div','validation-item problem'),text=node('div'),fix=node('button','','Review this column →');fix.onclick=()=>{filter='all';$('mapping-search').value=info.column;go(1);applyFilter();};text.append(node('strong','',message),node('p','',`${info.rows.length} affected rows · first rows: ${info.rows.slice(0,6).join(', ')}`),fix);row.append(node('span','check-symbol','!'),text);validation.append(row);}
  } else validation.append(node('div','empty-state','Preflight results will appear here. You can follow the current operation in Run & monitor.'));
  const plan=$('import-plan');plan.replaceChildren();const fileModes=[...new Set(items.filter(i=>i.kind==='file'&&i.hubspotProperty).map(i=>strategies[i.multiFileStrategy]))];
  for(const [label,value] of [['Contacts',$('contact-mode').value==='upsert'?'Create missing · update matches':'Attach to existing only'],['Matching key',$('email').value||'Email'],['File handling',fileModes.join(' / ')||'No file columns mapped'],['File visibility','PRIVATE'],['Existing uploads','Reuse successful files'],['New properties',fresh?`${summary.propertiesToCreate?.length||0} proposed`:'Checked during preflight']]) {const line=node('div','plan-line');line.append(node('span','',label),node('strong','',value));plan.append(line);}
  if(fresh)for(const property of summary.propertiesToCreate||[]){const line=node('div','plan-line');line.append(node('span','','Create property'),node('strong','',`${property.name} (${property.type})`));plan.append(line);}
  const ignored=items.filter(i=>i.kind!=='email'&&!i.hubspotProperty).map(i=>i.excel), populated=ignored.filter(c=>columnCoverage.find(r=>r.column===c)?.populatedRows>0);
  $('ignored-heading').textContent=`${ignored.length} ignored columns · ${populated.length} contain data`;
  $('ignored-columns').replaceChildren(...ignored.map(c=>{const rows=columnCoverage.find(r=>r.column===c)?.populatedRows;return node('span','chip',`${c}${rows===undefined?'':` (${rows} populated rows)`}${c==='Source'?' · excluded by request':''}`);}));
}
async function checkPreflight() {
  requestKind='preflight';go(2);renderReview();activity('Preflight requested. Saving mappings and checking your data.');await save();
  preflight=await api('/api/preflight','POST',{});preflightFresh=true;validationInvalidated=false;renderReview();renderMappings();
  notify(preflight.issues.length?`Found ${preflight.issues.length} issues. Review the validation results below.`:'Preflight passed. You can test every link with a dry preview or continue to a real migration.',preflight.issues.length?'error':'success');
}
function realMode() {return document.querySelector('input[name=run-mode]:checked').value==='real';}
function updateControls() {
  const busy=localBusy||state.running;
  document.querySelectorAll('#monday-module input, #monday-module select, #monday-module button').forEach(el=>{
    const permanentlyDisabled=el.classList.contains('destination')&&(el.closest('tr')?.querySelector('.column-kind')?.textContent==='MATCH KEY'||el.getAttribute('aria-label')==='HubSpot property for Source');
    el.disabled=Boolean(busy||permanentlyDisabled);
  });
  $('upload-button').disabled=busy||!selectedFile;
  $('back').disabled=currentStep===0; $('next').hidden=currentStep===3; $('next').disabled=busy||!workbook||(currentStep===2&&(!preflightFresh||Boolean(preflight?.issues.length)));
  $('next').textContent=['Map columns →','Save & review →','Continue to migration →',''][currentStep];
  $('next-hint').textContent=[workbook?'Workbook ready. Next, review your column mappings.':'Choose a workbook to get started.','Ignored columns won\'t be imported. Source stays excluded.',!preflightFresh?'Run preflight to check the current mappings.':preflight?.issues.length?'Resolve the listed validation issues before a real migration.':'Checks passed. No changes have been made in HubSpot.',state.running?'Keep this page open to watch your progress.':'Dry preview is the default. Existing uploads are reused.'][currentStep];
  $('real-confirmation').hidden=!realMode();$('start-run').textContent=state.running?'Migration in progress…':realMode()?'Run migration':'Run dry preview';
  $('start-run').disabled=busy||!workbook||(realMode()&&($('confirmation').value!=='RUN FOR REAL'||!preflightFresh||Boolean(preflight?.issues.length)));
  $('cancel-run').hidden=!state.running;
  $('restart-app').disabled=Boolean(state.running);
  $('run-hint').textContent=realMode()?(!preflightFresh?'Run preflight in Review & validate first.':preflight?.issues.length?'Resolve validation issues before writing to HubSpot.':$('confirmation').value!=='RUN FOR REAL'?'Enter RUN FOR REAL above to enable the migration.':'Ready to create/update contacts and attach every mapped file.'):'Checks every Monday asset without downloading or changing HubSpot.';
  mondayWorkflow.update(currentStep,{disabled:Boolean(busy),canAdvance:Boolean(workbook)});
  window.UI.decorate();
}
async function startRun(forceDry = false) {
  requestKind='run';await save();if(forceDry)document.querySelector('input[value=dry][name=run-mode]').checked=true;
  go(3);const dryRun=forceDry||!realMode();activity(`${dryRun?'Dry preview':'Real migration'} requested.`);
  await api('/api/run','POST',{dryRun,retryFailed:$('retry-failed').checked,confirmation:$('confirmation').value});
  processState(await api('/api/status'));
}
function renderResults() {
  const result=state.summary;
  if(!result){statCards('result-stats',[['Saved contacts',savedProgress?.contactsCompleted||0,'From previous migration runs'],['Saved uploads',savedProgress?.filesUploaded||0,'Will be reused on rerun'],['Needs retry',savedProgress?.contactsFailed||0,'Contacts not yet completed']]);$('result-message').hidden=true;return;}
  const dry=Boolean(state.dryRun),failures=result.failed+(result.contactResults?.failed||0);
  statCards('result-stats',dry?[['Need upload',result.wouldUpload,'New file references'],['Will reuse',result.wouldReuse||0,'Already uploaded'],['Failed checks',result.failed,'Review the report for details']]:[['Files completed',result.completed,'Assigned and verified'],['Contacts saved',(result.contactResults?.created||0)+(result.contactResults?.updated||0),'Created or updated'],['Files failed',result.failed,'Saved uploads are retained']]);
  const message=$('result-message');message.hidden=state.phase!=='complete';message.className=`result-message ${failures?'error':''}`;
  message.textContent=dry?`Dry preview finished. ${result.wouldUpload} files need uploading and ${result.wouldReuse||0} existing uploads can be reused. ${result.failed?'Some checks failed; review the file report.':'No HubSpot data was changed.'}`:failures?`Migration finished with ${result.failed} file failures and ${result.contactResults?.failed||0} contact failures. Review the reports, fix the cause and retry unfinished items.`:`Migration completed. ${result.completed} file assignments verified; ${result.contactResults?.created||0} contacts created and ${result.contactResults?.updated||0} updated.`;
}

// ── ETA formatting helper ──────────────────────────────────────────────────
function fmtEta(seconds) {
  if (seconds == null || seconds < 0) return null;
  if (seconds < 60) return `~${seconds}s remaining`;
  const m = Math.floor(seconds / 60), s = seconds % 60;
  if (m < 60) return `~${m}m ${s > 0 ? s+'s' : ''} remaining`.trim();
  const h = Math.floor(m / 60), rm = m % 60;
  return `~${h}h ${rm > 0 ? rm+'m' : ''} remaining`.trim();
}
function fmtElapsed(startedAt) {
  if (!startedAt) return '';
  const sec = Math.floor((Date.now() - Date.parse(startedAt)) / 1000);
  if (sec < 60) return `${sec}s elapsed`;
  const m = Math.floor(sec / 60), s = sec % 60;
  if (m < 60) return `${m}m ${s > 0 ? s+'s' : ''} elapsed`.trim();
  const h = Math.floor(m / 60), rm = m % 60;
  return `${h}h ${rm > 0 ? rm+'m' : ''} elapsed`.trim();
}

function processState(nextState) {
  const previous=state;
  state=nextState;
  if(state.preflight&&!dirty&&!validationInvalidated){preflight=state.preflight;preflightFresh=true;renderReview();}
  const entries=state.logs||[];if(entries.length&&entries.at(-1).id<lastLogId)lastLogId=0;
  for(const entry of entries.filter(e=>e.id>lastLogId))activity(entry.message,entry.level,entry.timestamp);
  if(entries.length)lastLogId=entries.at(-1).id;
  if(initialStatus&&state.running)go(3);initialStatus=false;
  if(state.error&&state.error!==previous.error)notify(state.error,'error');
  if(previous.running&&!state.running&&state.phase==='complete')notify(state.dryRun?'Dry preview complete. No HubSpot changes were made.':'Migration complete. Your reports are ready.','success');
  renderResults();renderProgress();updateControls();
  $('technical-summary').textContent=JSON.stringify({phase:state.phase,preflight:state.preflight,results:state.summary},null,2);
}

function renderProgress() {
  const labels={idle:'No migration running',preflight:'Checking your data',preflight_complete:'Preflight complete',dry_run:'Checking Monday asset links',migration:'Migrating to HubSpot',complete:state.dryRun?'Dry preview complete':'Migration finished',failed:'Job stopped — needs attention'};

  const isComplete = state.phase === 'complete';

  // ── Overall file progress ────────────────────────────────────────────────
  const rawPercent = state.total ? Math.round(state.completed / state.total * 100) : 0;
  const clampedPercent = Math.min(100, Math.max(0, rawPercent));
  const percent = isComplete ? 100 : clampedPercent;
  const shown = state.running ? Math.min(99, percent) : percent;
  $('phase').textContent = labels[state.phase] || 'Ready';
  $('progress').value = shown;
  $('progress-percent').textContent = `${shown}%`;

  // ── Files counter ────────────────────────────────────────────────────────
  const filesTotal = state.filesTotal || state.total || 0;
  const filesDone  = isComplete ? filesTotal : Math.min(filesTotal, state.completed || 0);
  $('files-counter').textContent = filesTotal ? `${filesDone.toLocaleString()} / ${filesTotal.toLocaleString()} files` : '';

  // ── Contacts counter ─────────────────────────────────────────────────────
  const cTotal = state.contactsTotal || 0;
  const cDone  = isComplete ? cTotal : Math.min(cTotal, state.contactsDone  || 0);
  const rawContactPercent = cTotal ? Math.round(cDone / cTotal * 100) : 0;
  const contactPercent = isComplete ? 100 : Math.min(100, Math.max(0, rawContactPercent));
  $('contacts-counter').textContent = cTotal ? `${cDone.toLocaleString()} / ${cTotal.toLocaleString()} contacts` : '';
  $('contacts-progress').value = isComplete ? 100 : (state.running ? Math.min(99, contactPercent) : contactPercent);
  $('contacts-progress').max = 100;

  // ── Batch counter ────────────────────────────────────────────────────────
  const bTotal = state.batchesTotal || 0;
  const bSent  = state.batchesSent  || 0;
  if (isComplete) {
    $('batch-counter').textContent = bTotal ? `All ${bTotal} ${bTotal === 1 ? 'batch' : 'batches'} completed` : '';
  } else {
    $('batch-counter').textContent = bTotal ? `Batch ${bSent} / ${bTotal} (100 contacts each)` : '';
  }
  $('batch-counter').hidden = !bTotal;

  // ── ETA & elapsed ────────────────────────────────────────────────────────
  const etaText     = state.running ? fmtEta(state.eta) : null;
  const elapsedText = state.startedAt ? fmtElapsed(state.startedAt) : '';
  $('eta-display').textContent  = etaText || '';
  $('eta-display').hidden       = !etaText;
  $('elapsed-display').textContent = elapsedText;
  $('elapsed-display').hidden   = !elapsedText;

  // ── Current operation text ───────────────────────────────────────────────
  const last = state.logs?.at(-1);
  const secSinceLast = state.running && last ? Math.floor((Date.now() - Date.parse(last.timestamp)) / 1000) : 0;
  $('current-operation').textContent = (last?.message || 'Activity will appear as soon as a job starts.') +
    (secSinceLast >= 5 ? ` · ${secSinceLast}s since last update` : '');

  // ── Stage rail ───────────────────────────────────────────────────────────
  const stage = state.phase === 'complete' ? 3
    : state.phase === 'preflight' || state.phase === 'preflight_complete' ? 0
    : /Upserting batch|contacts\b/.test(last?.message || '') || cDone > 0 ? 2
    : state.phase === 'migration' || state.phase === 'dry_run' ? 1 : -1;
  document.querySelectorAll('[data-stage]').forEach(el => {
    el.classList.toggle('active', Number(el.dataset.stage) === stage);
    el.classList.toggle('done',   Number(el.dataset.stage) < stage);
  });

  // ── Titles / badges ──────────────────────────────────────────────────────
  $('run-title').textContent = state.running ? 'Your migration is in progress'
    : state.phase === 'complete' ? (state.dryRun ? 'Your dry preview is ready' : 'Migration finished')
    : state.phase === 'failed'  ? 'Let\'s resolve the issue' : 'Ready when you are';
  $('run-description').textContent = state.running ? 'Follow the current operation and live activity below.'
    : state.phase === 'complete' ? 'Review the results below and download your reports.'
    : 'Choose a preview or run the real migration.';
  $('run-badge').textContent  = state.running ? 'Running' : state.phase === 'complete' ? 'Complete' : state.phase === 'failed' ? 'Needs attention' : 'Ready';
  $('run-badge').className    = `pill ${state.running ? 'file' : state.phase === 'complete' ? 'success' : state.phase === 'failed' ? 'error' : 'neutral'}`;
  $('activity-status').textContent = connected ? (state.running ? 'Live updates · job in progress' : 'Connected · recent activity retained') : 'Reconnecting · checking job status';
}

document.querySelectorAll('[data-step]').forEach(button=>button.onclick=()=>go(Number(button.dataset.step)));
$('back').onclick=()=>go(currentStep-1);
$('next').onclick=()=>action(async()=>{if(currentStep===0){await save();go(1);}else if(currentStep===1)await checkPreflight();else go(3);});
$('preflight').onclick=()=>action(checkPreflight);$('dry-preview').onclick=()=>action(()=>startRun(true));$('start-run').onclick=()=>action(()=>startRun());
$('cancel-run').onclick=()=>action(async()=>{if(!confirm('Stop the current migration? Progress so far is saved.'))return;await api('/api/cancel','POST');notify('Migration cancelled.','error');});
$('restart-app').onclick=()=>{if(!confirm('Restart the app? The page will reconnect automatically.'))return;api('/api/restart','POST').catch(()=>{}).finally(()=>{setTimeout(()=>location.reload(),2000);notify('Restarting… page will reconnect shortly.','info');});};
$('reset-credentials').onclick=()=>action(async()=>{if(!confirm('Rebind saved progress to your current .env credentials?\n\nOnly do this after a token rotation for the same HubSpot portal and Monday account. All upload progress will be preserved.'))return;const r=await api('/api/reset-credentials','POST');notify(r.message||'Credentials rebound. You can now run the migration.','success');});
$('refresh-properties').onclick=()=>action(async()=>{await refreshProperties();notify(`${properties.length} HubSpot properties loaded. Your saved mappings were preserved.`,'success');});
$('save-mappings').onclick=()=>action(async()=>{await save();notify('Mappings saved. Continue to Review & validate to check them.','success');});
$('mapping-search').oninput=applyFilter;document.querySelectorAll('[data-filter]').forEach(button=>button.onclick=()=>{filter=button.dataset.filter;applyFilter();});
for(const id of ['email','name','sheet','contact-mode','fallback','first'])$(id).addEventListener('change',markDirty);
document.querySelectorAll('input[name=run-mode]').forEach(input=>input.onchange=updateControls);$('confirmation').oninput=updateControls;
$('clear-log').onclick=()=>{logs=[];renderLogs();};
function selectFile(file){if(!file)return;const name=file.name.toLowerCase();if(!name.endsWith('.xlsx')&&!name.endsWith('.csv'))return notify('Choose an Excel (.xlsx) workbook or CSV (.csv) file.','error');if(file.size>50*1024**2)return notify('File exceeds the 50 MB upload limit.','error');selectedFile=file;$('selected-file').hidden=false;$('selected-file').textContent=`${file.name} · ${Math.ceil(file.size/1024)} KB`;updateControls();}
$('file-input').onchange=event=>selectFile(event.target.files[0]);
for(const type of ['dragenter','dragover'])$('dropzone').addEventListener(type,event=>{event.preventDefault();if(!state.running)$('dropzone').classList.add('drag-over');});
for(const type of ['dragleave','drop'])$('dropzone').addEventListener(type,event=>{event.preventDefault();$('dropzone').classList.remove('drag-over');if(type==='drop'&&!state.running)selectFile(event.dataTransfer.files[0]);});
$('upload').onsubmit=event=>{event.preventDefault();action(async()=>{if(!selectedFile)return;const form=new FormData();form.append('file',selectedFile);await api('/api/upload','POST',form);selectedFile=null;$('selected-file').hidden=true;$('file-input').value='';preflightFresh=false;await load();notify('File uploaded. Continue to map your columns.','success');});};
const events=new EventSource('/api/progress');events.onopen=()=>{connected=true;$('connection').textContent='Live connection';$('connection').className='connection live';renderProgress();};
events.onerror=()=>{connected=false;$('connection').textContent='Reconnecting';$('connection').className='connection reconnecting';renderProgress();};
events.onmessage=event=>processState(JSON.parse(event.data));
// Re-render elapsed time every second while running
setInterval(()=>{renderProgress();if(!connected)api('/api/status').then(processState).catch(()=>{});},1000);

// Close open property selector dropdowns on outside click or Escape
document.addEventListener('click', (e) => {
  if (!e.target.closest('.prop-select-wrap')) {
    document.querySelectorAll('.prop-dropdown-panel:not([hidden])').forEach(p => p.hidden = true);
    document.querySelectorAll('.prop-select-trigger[aria-expanded=true]').forEach(t => t.setAttribute('aria-expanded', 'false'));
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.prop-dropdown-panel:not([hidden])').forEach(p => p.hidden = true);
    document.querySelectorAll('.prop-select-trigger[aria-expanded=true]').forEach(t => t.setAttribute('aria-expanded', 'false'));
  }
});

(async()=>{try{await load();if(!state.running)go(Number(sessionStorage.getItem('trt-migration-step'))||0);}catch(error){notify(error.message,'error');}finally{updateControls();}})();

