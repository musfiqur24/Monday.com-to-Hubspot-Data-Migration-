(() => {
  const steps=['Choose workbook','Map columns','Review & validate','Run & monitor'];
  const names={'data-migrate':'Data Migrate'};
  const objects='<option value="">Select an object from your portal</option>';
  const legacyIds={contacts:'0-1',companies:'0-2',deals:'0-3',tickets:'0-5'};
  let cataloguePromise;
  function fetchCatalogue(refresh=false) {
    if(!cataloguePromise||refresh)cataloguePromise=window.UI.request(`/api/hubspot/objects${refresh?'?refresh=true':''}`).catch(error=>{cataloguePromise=null;throw error;});
    return cataloguePromise;
  }
  const section=document.getElementById('hubspot-module');
  section.className='hubspot-workspace';
  section.replaceChildren();
  const flows=new Map();
  const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
  const request=(url,method='GET',body)=>window.UI.request(url,method,body);

  let hsPicker = null;
  function getHsPropertyPicker() {
    if (hsPicker) return hsPicker;
    const panel = el('div', undefined, 'prop-dropdown-panel');
    panel.id = 'global-hs-prop-picker';
    panel.hidden = true;

    const searchBox = el('div', undefined, 'prop-search-box');
    const searchInput = el('input', undefined, 'prop-search-input');
    searchInput.placeholder = 'Search properties (name or label)...';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('aria-label', 'Search HubSpot properties');
    searchBox.append(el('span', '⌕', 'prop-search-icon'), searchInput);

    const statusBar = el('div', undefined, 'prop-search-status');
    const countBadge = el('span', '', 'prop-count-badge');
    statusBar.append(countBadge);

    const optionsList = el('div', undefined, 'prop-options-list');
    optionsList.setAttribute('role', 'listbox');
    panel.append(searchBox, statusBar, optionsList);
    document.body.append(panel);

    let currentVal = '';
    let currentTrigger = null;
    let currentWritable = [];
    let onSelectCb = null;

    function renderOptions(query = '') {
      const q = query.trim().toLowerCase();
      optionsList.replaceChildren();

      // Unmap / Ignore column option
      const unmapOpt = el('div', undefined, `prop-opt unmap-opt ${!currentVal ? 'selected' : ''}`);
      unmapOpt.setAttribute('tabindex', '0');
      unmapOpt.setAttribute('role', 'option');
      unmapOpt.append(el('span', '— Ignore column (leave unmapped) —', 'prop-opt-label muted'));
      const selectUnmap = () => {
        if (onSelectCb) onSelectCb('');
        close();
      };
      unmapOpt.onclick = selectUnmap;
      unmapOpt.onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); selectUnmap(); }
      };
      optionsList.append(unmapOpt);

      let matches = currentWritable;
      if (q) {
        matches = currentWritable.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.label && p.label.toLowerCase().includes(q))
        );
      }

      countBadge.textContent = q ? `${matches.length} matching` : `${currentWritable.length} properties available`;

      const sorted = [...matches].sort((a, b) => {
        if (a.name === currentVal) return -1;
        if (b.name === currentVal) return 1;
        return (a.label || a.name).localeCompare(b.label || b.name);
      });

      for (const p of sorted) {
        const isSelected = p.name === currentVal;
        const opt = el('div', undefined, `prop-opt ${isSelected ? 'selected' : ''}`);
        opt.setAttribute('tabindex', '0');
        opt.setAttribute('role', 'option');
        if (isSelected) opt.setAttribute('aria-selected', 'true');

        const row1 = el('div', undefined, 'prop-opt-row');
        const label = el('strong', p.label || p.name, 'prop-opt-label');
        const typeBadge = el('span', p.type || 'string', 'prop-opt-type');
        row1.append(label, typeBadge);

        const row2 = el('div', p.name, 'prop-opt-name');
        opt.append(row1, row2);

        const choose = () => {
          if (onSelectCb) onSelectCb(p.name);
          close();
        };
        opt.onclick = choose;
        opt.onkeydown = (e) => {
          if (e.key === 'Enter') { e.preventDefault(); choose(); }
        };
        optionsList.append(opt);
      }

      if (!matches.length && q) {
        optionsList.append(el('div', 'No matching properties found.', 'prop-empty'));
      }
    }

    function open(val, triggerBtn, writable, onSelect) {
      currentVal = val || '';
      currentTrigger = triggerBtn;
      currentWritable = writable || [];
      onSelectCb = onSelect;

      document.querySelectorAll('.prop-select-trigger[aria-expanded=true]').forEach(t => t.setAttribute('aria-expanded', 'false'));
      triggerBtn.setAttribute('aria-expanded', 'true');

      const rect = triggerBtn.getBoundingClientRect();
      const panelWidth = Math.max(320, Math.min(520, Math.max(rect.width, 360)));
      let left = rect.left;
      if (left + panelWidth > window.innerWidth - 16) {
        left = window.innerWidth - panelWidth - 16;
      }
      left = Math.max(12, left);

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUpward = spaceBelow < 280 && spaceAbove > spaceBelow;

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
      currentVal = '';
      currentTrigger = null;
      onSelectCb = null;
    }

    searchInput.oninput = (e) => renderOptions(e.target.value);

    searchInput.onkeydown = (e) => {
      if (e.key === 'Escape') {
        close();
        if (currentTrigger) currentTrigger.focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const opts = optionsList.querySelectorAll('.prop-opt');
        if (opts.length > 1) opts[1].click();
        else if (opts.length === 1) opts[0].click();
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
        if (prev && prev.classList.contains('prop-opt')) prev.focus();
        else searchInput.focus();
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
      if (e.key === 'Escape' && !panel.hidden) close();
    });

    window.addEventListener('scroll', () => {
      if (!panel.hidden) close();
    }, true);

    hsPicker = { open, close };
    return hsPicker;
  }
  for(const [mode,title] of Object.entries(names)) {
    const association=mode==='data-migrate-association';
    const host=el('div');host.hidden=true;section.append(host);
    const menu=document.querySelector(`[data-module="${mode}"]`);
    const subnav=el('div',undefined,'hs-sidebar-steps');subnav.dataset.hsNavGroup=mode;subnav.hidden=true;
    steps.forEach((name,index)=>{const button=el('button');button.type='button';button.dataset.hsNav=mode;button.dataset.hsIndex=String(index);button.append(el('span',String(index+1)),el('strong',name));subnav.append(button);});
    menu.after(subnav);
    host.innerHTML=`<div class="breadcrumb">HubSpot <span>/</span> ${title}</div>
      <div class="page-heading hs-heading"><div><h1>${title}</h1><p>${association?'Import records and connect them to existing destination records.':'Import workbook records into your destination HubSpot account.'}</p></div><span class="step-label" data-hs="step-label">Step 1 of 4</span></div>
      <div data-hs="workflow"></div>
      <div data-hs="busy-banner" class="hs-busy-banner" hidden></div>
      <div class="notice" data-hs="notice" role="status" hidden></div>
      <section data-hs-panel="0"><div class="hs-grid"><article class="card"><div class="card-heading"><div><h2>Destination object</h2><p data-hs="portal-meta">Objects are fetched from your connected HubSpot portal.</p></div><button type="button" class="button secondary" data-hs="refresh-objects" aria-label="Refresh portal objects">Refresh</button></div><div class="card-body hs-fields"><label>Object<select data-hs="object">${objects}</select></label><p data-hs="object-meta" class="muted">Select the destination object first, then upload your workbook.</p><p class="info-note">Record IDs must belong to the destination account. Source-account IDs cannot be used to match destination records.</p><p data-hs="credentials" class="muted"></p></div></article>
      <article class="card"><div class="card-heading"><div><h2>Choose workbook</h2><p>Upload a HubSpot export or another CSV / Excel workbook.</p></div><span class="pill neutral">CSV / XLSX</span></div><div class="card-body"><label class="hs-upload"><span class="hs-upload-symbol"></span><strong>Select your workbook</strong><small>CSV or XLSX · up to 50 MB</small><input type="file" data-hs="file" accept=".csv,.xlsx" aria-label="${title} workbook"></label><p data-hs="selected" class="muted">No file selected</p><button type="button" class="button secondary" data-hs="upload">Use selected file</button><div data-hs="workbook" class="hs-workbook" hidden></div><label data-hs="sheet-wrap" class="hs-sheet" hidden>Worksheet<select data-hs="sheet"></select></label></div></article></div></section>
      <section data-hs-panel="1" hidden><article class="card"><div class="card-heading"><div><h2>Match records</h2><p>Choose how to find an existing record or create a missing one.</p></div><button type="button" class="button secondary" data-hs="properties">Load HubSpot properties</button></div><div class="card-body field-grid"><label>Identifier column<select data-hs="identifier"></select></label><label>Match using<select data-hs="id-property"><option value="hs_object_id">Record ID · update existing only</option></select></label></div><p class="hs-help">Contact email or a property with unique values supports create/update. Blank cells do not erase existing values.</p></article>
      <article class="card"><div class="card-heading"><div><h2>Column mapping</h2><p>Map each source column to a writable HubSpot property.</p></div><span class="pill neutral" data-hs="mapped">0 mapped</span></div><div class="hs-table-wrap"><table class="mapping-table"><thead><tr><th>Workbook column</th><th>Sample values</th><th>HubSpot property</th></tr></thead><tbody data-hs="mappings"></tbody></table></div><div class="card-body"><button type="button" class="button secondary" data-hs="save">Save mappings</button></div></article>
      ${association?`<article class="card"><div class="card-heading"><div><h2>Associations</h2><p>Connect each imported record to existing destination records. Separate multiple IDs with semicolons.</p></div><button type="button" class="button secondary" data-hs="add-association">Add association</button></div><div class="card-body" data-hs="associations"></div></article>`:''}</section>
      <section data-hs-panel="2" hidden><article class="card"><div class="card-heading"><div><h2>Review & validate</h2><p>Check mappings, property values, record matches and associations.</p></div><button type="button" class="button primary" data-hs="validate">Run validation</button></div><div class="card-body"><div data-hs="plan" class="hs-plan"></div><div data-hs="timeline" class="hs-process-timeline" hidden></div><div data-hs="review" class="hs-review">Run validation to check your import. Nothing is written to HubSpot.</div></div></article></section>
      <section data-hs-panel="3" hidden><div class="hs-grid"><article class="card"><div class="card-heading"><div><h2>Run & monitor</h2><p>Preview first, then run the real migration.</p></div><span class="pill neutral" data-hs="phase">Ready</span></div><div class="card-body hs-fields"><div data-hs="run-timeline" class="hs-run-timeline" hidden></div><label>Run mode<select data-hs="run-mode"><option value="dry">Dry preview · no HubSpot changes</option><option value="real">Real migration</option></select></label><div data-hs="confirm-wrap" class="confirmation-box" hidden><p>Mapped values may be replaced. This writes to the destination HubSpot account.</p><label>Type RUN FOR REAL<input data-hs="confirmation" placeholder="RUN FOR REAL" autocomplete="off"></label></div><div class="run-controls-row" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><button type="button" class="button primary" data-hs="run">Run dry preview</button><button type="button" class="button danger" data-hs="cancel" hidden>Stop run</button><button type="button" class="button plain" data-hs="reset" hidden>Reset run state</button></div><p data-hs="run-hint" class="muted">Validate the current mappings before starting a real migration.</p><progress data-hs="progress" value="0" max="100"></progress><div class="hs-run-counts" data-hs="counts">No run started</div><div class="run-reports-row" style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="button secondary" data-hs="report" hidden>Download results (CSV)</button><button type="button" class="button secondary" data-hs="issues-report" hidden>Download validation issues (CSV)</button></div></div></article><article class="card"><div class="card-heading"><div><h2>Live activity</h2><p>Row results and migration progress</p></div></div><div data-hs="logs" class="activity-log hs-logs" role="log" aria-live="polite"><div class="empty-state">Start a preview or migration to see activity.</div></div></article></div></section>
      <footer class="hs-footer"><button type="button" class="button plain" data-hs="back">&#8592; Back</button><span class="muted" data-hs="hint">Choose a workbook to get started.</span><button type="button" class="button primary" data-hs="next">Map columns &#8594;</button></footer>`;
    const $=key=>host.querySelector(`[data-hs="${key}"]`);
    function commetLoader({ color = '#fab202', size = 'medium', text = '', textColor = '' } = {}) {
      const sizeClass = size === 'inline' ? 'size-inline' : size === 'timeline' ? 'size-timeline' : size === 'small' ? 'size-small' : size === 'large' ? 'size-large' : 'size-medium';
      return `<span class="commet-rli-bounding-box ${sizeClass}" style="--commet-phase1-color:${color};" role="status" aria-live="polite" aria-label="Loading"><span class="commet-indicator"><span class="commet-box"><span class="commet-trail trail1"></span><span class="commetball-box"></span></span><span class="commet-box"><span class="commet-trail trail2"></span><span class="commetball-box"></span></span></span>${text ? `<span class="commet-text" style="${textColor ? `color:${textColor};` : ''}">${text}</span>` : ''}</span>`;
    }

    function ensureScreenLoader() {
      let overlay = document.getElementById('hs-screen-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'hs-screen-overlay';
        overlay.className = 'hs-screen-overlay';
        overlay.innerHTML = `
          <div class="hs-screen-overlay-content">
            <div id="hs-screen-overlay-spinner" class="hs-screen-overlay-spinner">
              ${commetLoader({ color: '#fab202', size: 'medium', text: '', textColor: '' })}
            </div>
            <div id="hs-screen-overlay-title" class="hs-screen-overlay-title">Processing...</div>
            <div id="hs-screen-overlay-sub" class="hs-screen-overlay-sub">Please wait, do not close or refresh this tab.</div>
          </div>
        `;
        document.body.appendChild(overlay);
      }
      return overlay;
    }

    function showScreenLoader(title, subtext) {
      const overlay = ensureScreenLoader();
      const titleEl = document.getElementById('hs-screen-overlay-title');
      const subEl = document.getElementById('hs-screen-overlay-sub');
      if (titleEl) titleEl.textContent = title || 'Processing...';
      if (subEl) subEl.textContent = subtext || 'Please wait, do not close or refresh this tab.';
      overlay.classList.add('is-visible');
    }

    function hideScreenLoader() {
      const overlay = document.getElementById('hs-screen-overlay');
      if (overlay) overlay.classList.remove('is-visible');
    }

    const state={mode,host,$,step:0,workbook:null,objects:[],selectedObject:null,properties:[],mapping:{},identifierColumn:'',idProperty:'hs_object_id',associations:association?[{objectType:'',column:'',typeId:null}]:[],review:null,dirty:false,busy:false,job:{running:false},loaded:false};
    flows.set(mode,state);
    const endpoint=suffix=>`/api/hubspot/${mode}/${suffix}`;
    const notice=(text,error=false)=>{$('notice').hidden=true;window.UI.toast(text,error?'error':'success');};
    const workflow=window.UI.progress({label:`${title} progress`,onSelect:step=>navigate(step)});
    $('workflow').replaceWith(workflow.root);
    const type=()=>state.selectedObject?.objectTypeId||'';
    function invalidate() {state.review=null;state.dirty=true;if($('timeline'))$('timeline').hidden=true;controls();}
    function controls() {
      const busy=state.busy||state.job.running;
      host.querySelectorAll('input,select,button').forEach(node=>node.disabled=busy);
      $('cancel').disabled=state.busy||!state.job.running||state.job.cancelRequested;
      $('cancel').hidden=!state.job.running;
      $('back').disabled=busy||state.step===0;
      $('file').disabled=busy||!state.selectedObject;
      $('object').disabled=busy||!state.objects.length;
      $('upload').disabled=busy||!state.selectedObject||!$('file').files.length;
      $('properties').disabled=busy||!state.selectedObject;
      $('next').hidden=state.step===3;
      $('next').disabled=busy||!state.workbook||!state.selectedObject;

      if(state.busy) {
        $('next').innerHTML=`${commetLoader({ color: '#fab202', size: 'inline' })}${state.step===0?'Loading columns…':state.step===1?'Saving & verifying…':'Working…'}`;
      } else {
        $('next').textContent=state.step===0?'Map columns →':state.step===1?'Review & validate →':'Run & monitor →';
      }

      const banner=$('busy-banner');
      if(banner){
        banner.hidden=true;
      }

      if(state.busy&&state.busyLabel){
        $('hint').innerHTML=`${commetLoader({ color: '#fab202', size: 'inline' })}${state.busyLabel}`;
      }else{
        $('hint').textContent=state.dirty?'Mappings have unsaved changes.':state.workbook?`${state.workbook.rows.toLocaleString()} workbook rows`:'Choose a workbook to get started.';
      }

      const real=$('run-mode').value==='real';
      $('confirm-wrap').hidden=!real;$('run').textContent=real?'Run migration':'Run dry preview';
      $('run').disabled=busy||!state.workbook||!state.selectedObject||(real&&(!state.review||state.review.issueCount>0||state.dirty||$('confirmation').value!=='RUN FOR REAL'));
      $('run-hint').textContent=real?'Requires a successful validation of the current mappings.':'Dry previews validate records without writing to HubSpot.';
      workflow.update(state.step,{disabled:Boolean(busy),canAdvance:Boolean(state.workbook&&state.selectedObject)});
      window.UI.decorate(host);
    }
    async function action(fn, busyLabel, busySubtext) {
      if(state.busy||state.job.running)return;
      state.busy=true;
      state.busyLabel=busyLabel||'Processing...';
      notice('');
      showScreenLoader(state.busyLabel, busySubtext);
      controls();
      try {await fn();} catch(error){notice(error.message,true);} finally {state.busy=false;state.busyLabel='';hideScreenLoader();controls();}
    }
    function go(step) {
      if(step>0&&(!state.workbook||!state.selectedObject))return;
      state.step=step;
      host.querySelectorAll('[data-hs-panel]').forEach(panel=>panel.hidden=Number(panel.dataset.hsPanel)!==step);
      document.querySelectorAll(`[data-hs-nav="${mode}"]`).forEach(button=>button.classList.toggle('active',Number(button.dataset.hsIndex)===step));
      $('step-label').textContent=`Step ${step+1} of 4`;
      if(step===2)renderPlan();controls();
    }
    state.go=go;
    async function navigate(step) {
      const busyMsg=step===1
        ?'Loading HubSpot properties & preparing column mappings...'
        :step===2
        ?'Saving mappings & preparing validation review...'
        :'Loading run monitor...';
      await action(async()=>{
        if(step>0&&(!state.workbook||!state.selectedObject))throw new Error('Select a portal object and upload a workbook first.');
        if(state.step===1&&state.dirty)await save();
        if(step>0&&!state.properties.length)await loadProperties(Object.keys(state.mapping).length===0);
        go(step);
      }, busyMsg);
    }
    state.navigate=navigate;
    function options(select,values,current,placeholder) {
      select.replaceChildren();
      if(placeholder) {const option=el('option',placeholder);option.value='';select.append(option);}
      for(const [value,label] of values){const option=el('option',label);option.value=value;select.append(option);}
      select.value=current||'';
    }
    function renderWorkbook() {
      const book=state.workbook;if(!book)return;
      $('workbook').hidden=false;$('workbook').textContent=`${book.filename} · ${book.rows.toLocaleString()} rows · ${book.columns.length} columns`;
      options($('sheet'),book.sheets.map(name=>[name,name]),book.sheet);$('sheet-wrap').hidden=book.sheets.length<2;
      options($('identifier'),book.columns.map(column=>[column.name,column.name]),state.identifierColumn,'Choose identifier column');
      renderMappings();renderAssociations();
    }
    function selectedMeta() {
      $('object-meta').textContent=state.selectedObject?`${state.selectedObject.label} · Object ID ${state.selectedObject.objectTypeId}`:'Select the destination object first, then upload your workbook.';
    }
    async function loadCatalogue(refresh=false) {
      const catalogue=await fetchCatalogue(refresh);
      state.objects=catalogue.objects;state.portalId=catalogue.portalId;
      if(state.selectedObject?.portalId!==catalogue.portalId||!state.objects.some(object=>object.objectTypeId===type()))state.selectedObject=null;
      options($('object'),state.objects.map(object=>[object.objectTypeId,object.label]),type(),'Select an object from your portal');
      $('portal-meta').textContent=`${catalogue.portalName||'HubSpot'} · Portal ${catalogue.portalId}`;
      selectedMeta();renderAssociations();
      if(catalogue.warnings?.length)window.UI.toast(catalogue.warnings.join(' '),'info',{key:`portal-objects:${catalogue.portalId}`});
      return catalogue;
    }
    function renderMappings() {
      $('mappings').replaceChildren();
      if(!state.properties.length && state.busy) {
        const tr=el('tr'), td=el('td');
        td.colSpan=3;
        td.style.textAlign='center';
        td.style.padding='32px 16px';
        td.innerHTML=`<div style="padding:16px 0">${commetLoader({ color: '#fab202', size: 'medium' })}<div style="margin-top:10px;color:#6b8296;font-size:13px">Loading HubSpot properties & preparing column mappings...</div></div>`;
        tr.append(td);
        $('mappings').append(tr);
        return;
      }
      const writable=state.properties.filter(property=>!property.calculated&&!property.modificationMetadata?.readOnlyValue&&!property.externalOptions&&property.name!=='hs_object_id');
      const updateTriggers=new Map(); // columnName → updateTrigger fn, so we can refresh all rows on change

      function refreshDuplicateBadges() {
        // compute which properties are used by more than one column
        const counts=new Map();
        for(const [col,prop] of Object.entries(state.mapping)) if(prop) counts.set(prop,(counts.get(prop)||0)+1);
        for(const [col,fn] of updateTriggers) fn(counts);
      }

      for(const column of state.workbook?.columns||[]) {
        const row=el('tr'), source=el('td',column.name), sample=el('td',column.samples.filter(Boolean).join(' · ')||'—'), target=el('td');
        sample.className='hs-sample';

        const wrap = el('div', undefined, 'prop-select-wrap');
        const trigger = el('button', undefined, 'prop-select-trigger');
        trigger.type = 'button';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', `HubSpot property for ${column.name}`);
        const dupWarning = el('div', undefined, 'prop-dup-warning');
        dupWarning.hidden = true;

        function updateTrigger(dupCounts) {
          trigger.replaceChildren();
          const mappedName = state.mapping[column.name];
          const prop = mappedName ? writable.find(p => p.name === mappedName) : null;

          // duplicate check
          const isDup = mappedName && dupCounts && (dupCounts.get(mappedName)||0) > 1;
          trigger.classList.toggle('prop-trigger-dup', Boolean(isDup));
          if (isDup) {
            dupWarning.textContent = `⚠ "${mappedName}" is already mapped to another column. Each HubSpot property can only be used once.`;
            dupWarning.hidden = false;
          } else {
            dupWarning.hidden = true;
          }

          if (mappedName) {
            trigger.classList.add('has-value');
            const valWrap = el('div', undefined, 'prop-val-wrap');
            const mainLine = el('div', undefined, 'prop-val-main');
            const labelText = prop ? (prop.label || prop.name) : mappedName;
            mainLine.append(el('span', labelText, 'prop-val-label-main'));
            if (prop?.type) {
              mainLine.append(el('span', prop.type, 'prop-val-type'));
            }
            const subLine = el('div', mappedName, 'prop-val-name-sub');
            valWrap.append(mainLine, subLine);

            const clearBtn = el('span', '×', 'prop-clear-btn');
            clearBtn.title = 'Clear mapping (Ignore column)';
            clearBtn.onclick = (e) => {
              e.stopPropagation();
              state.mapping[column.name] = '';
              refreshDuplicateBadges();
              invalidate();
              mappedCount();
            };

            trigger.append(valWrap, clearBtn, el('span', '▾', 'prop-arrow'));
          } else {
            trigger.classList.remove('has-value');
            const placeholder = el('span', 'Ignore column', 'prop-placeholder');
            trigger.append(placeholder, el('span', '▾', 'prop-arrow'));
          }
        }

        updateTriggers.set(column.name, updateTrigger);
        updateTrigger(null);

        trigger.onclick = () => {
          const picker = getHsPropertyPicker();
          picker.open(state.mapping[column.name], trigger, writable, (selectedName) => {
            state.mapping[column.name] = selectedName;
            refreshDuplicateBadges();
            invalidate();
            mappedCount();
          });
        };

        wrap.append(trigger, dupWarning);
        target.append(wrap);
        row.append(source, sample, target);
        $('mappings').append(row);
      }
      // Run initial duplicate check in case mappings were loaded from saved config
      const counts=new Map();
      for(const [col,prop] of Object.entries(state.mapping)) if(prop) counts.set(prop,(counts.get(prop)||0)+1);
      for(const [col,fn] of updateTriggers) fn(counts);

      const ids=[['hs_object_id','Record ID · update existing only'],...state.properties.filter(property=>property.hasUniqueValue||(type()==='0-1'&&property.name==='email')).map(property=>[property.name,`${property.label} · create/update`])];
      if(!ids.some(([name])=>name===state.idProperty))state.idProperty='hs_object_id';
      options($('id-property'),ids,state.idProperty);mappedCount();
    }
    function mappedCount() {
      const vals=Object.values(state.mapping).filter(Boolean);
      const counts=new Map();
      for(const v of vals) counts.set(v,(counts.get(v)||0)+1);
      const dups=[...counts.values()].filter(c=>c>1).length;
      const pill=$('mapped');
      pill.textContent=`${vals.length} mapped${dups?` · ${dups} duplicate${dups>1?'s':''}`:''}`; 
      pill.className=dups?'pill error':'pill neutral';
    }
    async function loadProperties(suggest=false) {
      if(!state.selectedObject)throw new Error('Choose a destination object from the portal first.');
      const properties=await request(`/api/hubspot/properties/${encodeURIComponent(type())}`);
      state.properties=properties;
      if(suggest) {
        state.mapping=Object.fromEntries(state.workbook.columns.map(column=>[column.name,properties.find(property=>!property.modificationMetadata?.readOnlyValue&&!property.calculated&&(normalize(property.name)===normalize(column.name)||normalize(property.label)===normalize(column.name)))?.name||'']));
        const identity=state.workbook.columns.find(column=>/^(recordid|hsobjectid)$/.test(normalize(column.name)))||state.workbook.columns.find(column=>type()==='0-1'&&normalize(column.name)==='email');
        if(identity){state.identifierColumn=identity.name;state.idProperty=normalize(identity.name)==='email'?'email':'hs_object_id';$('identifier').value=identity.name;}
      }
      renderMappings();invalidate();
    }
    function renderAssociations() {
      if(!association)return;$('associations').replaceChildren();
      state.associations.forEach((link,index)=>{
        const row=el('div',undefined,'hs-association-row');
        row.innerHTML=`<label>Related object<select data-link="object">${objects}</select></label><label>Destination record ID column<select data-link="column"></select></label><label>Relationship<select data-link="type"><option value="">Default association</option></select></label><button type="button" class="button secondary" data-link="labels">Load relationships</button><button type="button" class="button plain" data-link="remove" aria-label="Remove association ${index+1}">Remove</button>`;
        const field=name=>row.querySelector(`[data-link="${name}"]`);
        options(field('object'),state.objects.map(object=>[object.objectTypeId,object.label]),legacyIds[link.objectType]||link.objectType,'Select related object');
        options(field('column'),(state.workbook?.columns||[]).map(column=>[column.name,column.name]),link.column,'Choose record ID column');
        const labelOptions=link.labels?.map(label=>[String(label.typeId),label.label||'Default association'])||[];
        if(link.typeId!==null&&!labelOptions.some(([id])=>id===String(link.typeId)))labelOptions.push([String(link.typeId),`Saved relationship ${link.typeId}`]);
        options(field('type'),labelOptions,link.typeId===null?'':String(link.typeId),'Default association');
        field('object').onchange=()=>{link.objectType=field('object').value;link.typeId=null;link.labels=null;invalidate();renderAssociations();};
        field('column').onchange=()=>{link.column=field('column').value;invalidate();};
        field('type').onchange=()=>{link.typeId=field('type').value===''?null:Number(field('type').value);invalidate();};
        field('labels').onclick=()=>action(async()=>{if(!type()||!link.objectType)throw new Error('Select the source and related portal objects first.');link.labels=await request(`/api/hubspot/labels/${encodeURIComponent(type())}/${encodeURIComponent(link.objectType)}`);renderAssociations();});
        field('remove').onclick=()=>{state.associations.splice(index,1);invalidate();renderAssociations();};
        $('associations').append(row);
      });
    }
    function config() {
      return {objectType:type(),identifierColumn:state.identifierColumn,idProperty:state.idProperty,mapping:state.mapping,associations:state.associations.map(({objectType,column,typeId})=>({objectType,column,typeId}))};
    }
    async function save() {
      await request(endpoint('config'),'PUT',config());state.dirty=false;
    }
    function renderPlan() {
      $('plan').replaceChildren();
      for(const [label,value] of [['Workbook',state.workbook?.filename||'—'],['Object',state.selectedObject?`${state.selectedObject.label} (${type()})`:'Not selected'],['Match',`${state.identifierColumn||'Not selected'} → ${state.idProperty}`],['Mapped columns',Object.values(state.mapping).filter(Boolean).length],['Associations',state.associations.length]]) {
        const item=el('div');item.append(el('span',label),el('strong',String(value)));$('plan').append(item);
      }
      if(!state.review){
        $('review').textContent='Run validation to check your current settings. Nothing is written to HubSpot.';
        if($('timeline'))$('timeline').hidden=true;
      }
    }

    const validationStages=[
      {id:'save',label:'1. Save column mappings',subtext:'Persisting current mapping & match configuration'},
      {id:'parse',label:'2. Parse workbook records',subtext:'Loading worksheet records and column headers'},
      {id:'validate',label:'3. Validate data integrity',subtext:'Checking property formats, enums, dates & unique IDs'},
      {id:'remote',label:'4. Check HubSpot schema',subtext:'Verifying CRM destination properties & schema rules'},
      {id:'summary',label:'5. Compile validation report',subtext:'Aggregating record counts and validation issues'}
    ];

    function createValidationTimeline() {
      const container=$('timeline');
      if(!container) return null;
      container.hidden=false;
      container.replaceChildren();

      const header=el('div',undefined,'hs-timeline-header');
      const titleWrap=el('div',undefined,'hs-timeline-title');
      const pulse=el('span',undefined,'hs-timeline-pulse');
      const title=el('span','Validation in progress');
      titleWrap.append(pulse,title);
      const timer=el('span','0.0s elapsed','hs-timeline-timer');
      header.append(titleWrap,timer);

      const items=el('div',undefined,'hs-timeline-items');
      const stageNodes=new Map();

      validationStages.forEach((stage,idx)=>{
        const item=el('div',undefined,'hs-timeline-item pending');
        item.dataset.stage=stage.id;

        const node=el('div',String(idx+1),'hs-timeline-node');
        const content=el('div',undefined,'hs-timeline-content');
        const label=el('div',stage.label,'hs-timeline-label');
        const subtext=el('div',stage.subtext,'hs-timeline-subtext');
        content.append(label,subtext);
        item.append(node,content);
        items.append(item);

        stageNodes.set(stage.id,{item,node,label,subtext,baseSubtext:stage.subtext,index:idx+1});
      });

      container.append(header,items);

      const startMs=Date.now();
      const timerInterval=setInterval(()=>{
        const elapsed=((Date.now()-startMs)/1000).toFixed(1);
        timer.textContent=`${elapsed}s elapsed`;
      },100);

      const checkSvg='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      const errorSvg='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

      let activeStageId='save';

      function setStage(id,status,detail) {
        const stage=stageNodes.get(id);
        if(!stage) return;
        stage.item.className=`hs-timeline-item ${status}`;
        if(status==='active'){
          activeStageId=id;
          stage.node.innerHTML=commetLoader({ color: '#fab202', size: 'timeline' });
          if(detail)stage.subtext.textContent=detail;
        }else if(status==='completed'){
          stage.node.innerHTML=checkSvg;
          if(detail)stage.subtext.textContent=detail;
        }else if(status==='error'){
          stage.node.innerHTML=errorSvg;
          if(detail)stage.subtext.textContent=detail;
        }
      }

      function completeAll(review,elapsedSec) {
        clearInterval(timerInterval);
        timer.textContent=`Completed in ${elapsedSec}s`;
        pulse.className=review.issueCount?'hs-timeline-pulse warning':'hs-timeline-pulse success';
        title.textContent=review.issueCount
          ?`Validation finished · ${review.issueCount.toLocaleString()} issue${review.issueCount>1?'s':''} detected`
          :'Validation passed · Ready for import';

        stageNodes.forEach(stage=>{
          stage.item.className='hs-timeline-item completed';
          stage.node.innerHTML=checkSvg;
        });

        const rowsCount=review.rows||state.workbook?.rows||0;
        const parseStage=stageNodes.get('parse');
        if(parseStage)parseStage.subtext.textContent=`Parsed ${rowsCount.toLocaleString()} workbook records successfully`;

        const valStage=stageNodes.get('validate');
        if(valStage)valStage.subtext.textContent=review.issueCount
          ?`Found ${review.issueCount.toLocaleString()} format or constraint discrepancy items`
          :'All mapped columns and cell formats verified';

        const remoteStage=stageNodes.get('remote');
        if(remoteStage)remoteStage.subtext.textContent=`${(review.existing||0).toLocaleString()} existing records matched · ${(review.creating||0).toLocaleString()} new records to create`;

        const summaryStage=stageNodes.get('summary');
        if(summaryStage)summaryStage.subtext.textContent=review.issueCount
          ?`Validation summary compiled (${(review.records||0).toLocaleString()} records, ${review.issueCount.toLocaleString()} issues)`
          :`Validation passed (${(review.records||0).toLocaleString()} records, 0 issues)`;
      }

      function failActive(errorMsg) {
        clearInterval(timerInterval);
        pulse.className='hs-timeline-pulse error';
        title.textContent='Validation encountered an error';
        timer.textContent='Failed';
        setStage(activeStageId,'error',errorMsg||'An error occurred during this step');
      }

      function autoProgress() {
        const seq=[
          {id:'parse',delay:200,text:`Reading ${state.workbook?.rows?state.workbook.rows.toLocaleString()+' ':''}records from ${state.workbook?.filename||'workbook'}...`},
          {id:'validate',delay:800,text:'Checking cell data types, options, dates and emails...'},
          {id:'remote',delay:1800,text:'Querying HubSpot CRM schema and verifying record identifiers...'},
          {id:'summary',delay:3500,text:'Aggregating record results and building validation report...'}
        ];
        const timeouts=[];
        seq.forEach(step=>{
          const t=setTimeout(()=>{
            validationStages.forEach(s=>{
              if(s.id===step.id){
                setStage(s.id,'active',step.text);
              }else{
                const sIdx=stageNodes.get(s.id)?.index||0;
                const stepIdx=stageNodes.get(step.id)?.index||0;
                if(sIdx<stepIdx&&stageNodes.get(s.id)?.item.classList.contains('active')){
                  setStage(s.id,'completed');
                }
              }
            });
          },step.delay);
          timeouts.push(t);
        });

        return {
          stop:()=>timeouts.forEach(clearTimeout)
        };
      }

      return {setStage,completeAll,failActive,autoProgress};
    }

    function renderRunTimeline(job) {
      const container=$('run-timeline');
      if(!container) return;
      if(!job||job.phase==='idle'){
        container.hidden=true;
        return;
      }
      container.hidden=false;
      const steps=[
        {id:'validate',label:'1. Validation'},
        {id:'process',label:job.dryRun?'2. Preview':'2. Migration'},
        {id:'associations',label:'3. Associations'},
        {id:'finish',label:'4. Summary'}
      ];
      container.replaceChildren();
      steps.forEach(st=>{
        const stepEl=el('div',undefined,'hs-run-step');
        const iconEl=el('span','','hs-run-step-icon');
        const titleEl=el('span',st.label,'hs-run-step-title');

        let status='pending';
        if(job.phase==='validating'){
          if(st.id==='validate')status='active';
        }else if(['previewing','migrating'].includes(job.phase)){
          if(st.id==='validate')status='completed';
          else if(st.id==='process')status='active';
        }else if(job.phase==='blocked'){
          if(st.id==='validate')status='error';
        }else if(['completed','completed_with_errors'].includes(job.phase)){
          if(st.id==='finish'&&job.failed>0)status='error';
          else status='completed';
        }else if(job.phase==='cancelled'){
          if(st.id==='process')status='error';
        }else if(job.phase==='interrupted'||job.phase==='failed'){
          if(st.id==='validate'||st.id==='process')status='error';
        }

        stepEl.className=`hs-run-step ${status}`;
        if(status==='active')iconEl.innerHTML=commetLoader({ color: '#fab202', size: 'timeline' });
        else if(status==='completed')iconEl.innerHTML='✓';
        else if(status==='error')iconEl.innerHTML='✕';
        else iconEl.textContent='○';

        stepEl.append(iconEl,titleEl);
        container.append(stepEl);
      });
    }

    async function downloadFile(url, fallbackFilename) {
      const response = await fetch(url);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Download failed (HTTP ${response.status}).`);
      }
      const disposition = response.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : fallbackFilename;
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(href), 10000);
    }
    function renderReview(review) {
      $('review').replaceChildren();
      const message=el('p',review.issueCount?`${review.issueCount} validation issue(s). Fix them before running.`:'Validation passed. Ready for a dry preview or real migration.',review.issueCount?'hs-error-text':'hs-success-text');
      $('review').append(message);
      $('review').append(el('p',`${review.records} records · ${review.existing} existing · ${review.creating} to create · ${review.associations} associations`));
      if(review.issueCount){
        const bar=el('div',undefined,'hs-issues-download-bar');
        const btn=el('button',undefined,'button secondary');
        btn.type='button';
        btn.innerHTML=`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:-2px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download all ${review.issueCount.toLocaleString()} validation issues (CSV)`;
        btn.onclick=()=>action(async()=>{
          btn.textContent='Preparing CSV…';btn.disabled=true;
          try {
            await downloadFile(endpoint('issues-report'),`validation-issues.csv`);
          } finally {
            btn.innerHTML=`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:-2px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download all ${review.issueCount.toLocaleString()} validation issues (CSV)`;
            btn.disabled=false;
          }
        });
        bar.append(btn);
        if(review.issueCount>review.issues.length){
          bar.append(el('span',`Showing first ${review.issues.length} issues below. Download the CSV to review all ${review.issueCount.toLocaleString()} issues.`,'hs-issues-truncation-note'));
        }
        $('review').append(bar);
      }
      if(review.issues.length){const list=el('ul');for(const issue of review.issues)list.append(el('li',`${issue.row?'Row '+issue.row+': ':''}${issue.message}`));$('review').append(list);}
    }
    function renderJob(job) {
      const prior=state.job;
      state.job=job;
      if(job.review) state.review=job.review;
      $('phase').textContent=job.phase.replaceAll('_',' ');
      $('progress').value=job.total?Math.round(job.completed/job.total*100):0;
      $('counts').textContent=`${job.completed||0} / ${job.total||0} processed · ${job.succeeded||0} ${job.dryRun?'previewed':'succeeded'} · ${job.skipped||0} reused · ${job.failed||0} failed`;
      renderRunTimeline(job);
      $('logs').replaceChildren();
      for(const entry of job.logs||[]){const line=el('div',undefined,'log-entry');line.append(el('time',new Date(entry.timestamp).toLocaleTimeString()),el('span',entry.message));$('logs').append(line);}
      if(!job.logs?.length)$('logs').append(el('div','Start a preview or migration to see activity.','empty-state'));
      if($('report')) $('report').hidden=!job.report;
      if($('issues-report')) $('issues-report').hidden=!(job.phase==='blocked'||(job.review&&job.review.issueCount>0));
      if($('reset')) $('reset').hidden=job.running||job.phase==='idle';
      if(job.phase==='blocked'&&job.review)renderReview(job.review);
      if(job.error&&job.error!==state.lastJobError)notice(job.error,true);
      state.lastJobError=job.error;
      if(prior.running&&!job.running&&job.phase==='completed')notice(job.dryRun?'Dry preview complete. No HubSpot changes were made.':'Migration completed. Your report is ready.');
      if(prior.running&&!job.running&&job.phase==='completed_with_errors')notice('Migration finished with errors. Download the report to review failed records.',true);
      if(prior.running&&!job.running&&job.phase==='cancelled')window.UI.toast('Migration stopped. Saved records can be resumed.','info');
      controls();
    }
    state.load=()=>action(async()=>{
      const result=await request(endpoint('state'));state.loaded=true;
      state.workbook=result.workbook;
      state.selectedObject=result.selectedObject;
      $('credentials').textContent=result.credentialsConfigured?'Portal credentials are configured.':'Configure HUBSPOT_PORTAL_ID and HUBSPOT_PRIVATE_APP_TOKEN in .env, then restart.';
      if(result.credentialsConfigured)await loadCatalogue();
      if(result.config){
        const config=result.config;
        Object.assign(state,{mapping:config.mapping,identifierColumn:config.identifierColumn,idProperty:config.idProperty,associations:config.associations,dirty:false});
      }
      renderWorkbook();renderJob(result.status);
      if(state.workbook&&state.selectedObject&&result.credentialsConfigured){try {await loadProperties(!result.config);if(result.config)state.dirty=false;}catch(error){notice(error.message,true);}}
      if(result.status.running||result.status.phase!=='idle')go(3);else go(0);
    });
    $('file').onchange=()=>{$('selected').textContent=$('file').files[0]?.name||'No file selected';controls();};
    $('upload').onclick=()=>action(async()=>{
      const file=$('file').files[0];if(!file)return;
      if(!/\.(csv|xlsx)$/i.test(file.name)||file.size>500*1024**2)throw new Error('Choose a CSV or XLSX workbook up to 500 MB.');
      const form=new FormData();form.append('file',file);
      const result=await request(endpoint('workbook'),'POST',form);state.workbook=result.workbook;state.mapping={};state.identifierColumn='';state.idProperty='hs_object_id';invalidate();renderWorkbook();notice('Workbook ready. Continue to map columns.');
      try{await loadProperties(true);}catch(error){notice(`Workbook uploaded. ${error.message}`,true);}
    }, 'Uploading workbook & analyzing columns...');
    $('sheet').onchange=()=>action(async()=>{const result=await request(endpoint('sheet'),'POST',{sheet:$('sheet').value});state.workbook=result.workbook;state.mapping={};state.identifierColumn='';invalidate();renderWorkbook();await loadProperties(true);}, 'Switching worksheet & analyzing columns...');
    $('object').onchange=()=>action(async()=>{
      const chosen=$('object').value;if(!chosen){state.selectedObject=null;selectedMeta();invalidate();return;}
      const result=await request(endpoint('object'),'PUT',{objectTypeId:chosen});state.selectedObject=result.selectedObject;
      state.properties=[];state.mapping={};state.identifierColumn='';state.idProperty='hs_object_id';state.associations.forEach(link=>{link.typeId=null;link.labels=null;});
      $('identifier').value='';invalidate();selectedMeta();renderMappings();renderAssociations();
      if(state.workbook)await loadProperties(true);
    }, 'Updating destination object & loading portal schema...');
    $('refresh-objects').onclick=()=>action(()=>loadCatalogue(true), 'Refreshing objects from connected HubSpot portal...');
    $('identifier').onchange=()=>{state.identifierColumn=$('identifier').value;invalidate();};
    $('id-property').onchange=()=>{state.idProperty=$('id-property').value;invalidate();};
    $('properties').onclick=()=>action(()=>loadProperties(Object.keys(state.mapping).length===0), 'Fetching properties from HubSpot portal...');
    $('save').onclick=()=>action(async()=>{await save();notice('Mappings saved.');}, 'Saving column mappings...');
    if(association)$('add-association').onclick=()=>{state.associations.push({objectType:'',column:'',typeId:null});invalidate();renderAssociations();controls();};
    $('validate').onclick=()=>action(async()=>{
      const btn=$('validate');
      const origText=btn.innerHTML;
      btn.innerHTML=`${commetLoader({ color: '#fab202', size: 'inline' })}Validating…`;
      btn.disabled=true;
      const timeline=createValidationTimeline();
      timeline.setStage('save','active','Saving mappings and match configuration...');
      $('review').replaceChildren(el('p','Validation is analyzing your records. Follow progress in the timeline above.','muted'));

      try {
        await save();
        timeline.setStage('save','completed','Mappings and match settings saved');
        timeline.setStage('parse','active',`Loading worksheet records from ${state.workbook?.filename||'workbook'}...`);

        const progress=timeline.autoProgress();
        const startTime=Date.now();

        state.review=await request(endpoint('preflight'),'POST',{});
        const elapsedSec=((Date.now()-startTime)/1000).toFixed(1);
        progress.stop();

        timeline.completeAll(state.review,elapsedSec);
        renderReview(state.review);
        notice(state.review.issueCount?'Validation found issues. Review the results below.':'Validation passed. Your import is ready.',Boolean(state.review.issueCount));
      } catch(error) {
        timeline.failActive(error.message);
        throw error;
      } finally {
        btn.innerHTML=origText;
        controls();
      }
    }, 'Validating workbook records...', 'Verifying data integrity, property mappings & CRM schema');
    $('back').onclick=()=>go(Math.max(0,state.step-1));
    $('next').onclick=()=>navigate(Math.min(3,state.step+1));
    $('run-mode').onchange=controls;$('confirmation').oninput=controls;
    $('run').onclick=()=>action(async()=>{
      if(state.dirty)await save();
      const job=await request(endpoint('run'),'POST',{dryRun:$('run-mode').value!=='real',confirmation:$('confirmation').value});
      $('confirmation').value='';renderJob(job);
    }, $('run-mode').value==='real'?'Starting migration...':'Starting dry preview...', 'Initializing HubSpot 2026-09 batch engine');
    $('cancel').onclick=async()=>{try{renderJob(await request(endpoint('cancel'),'POST',{}));}catch(error){notice(error.message,true);}};
    if($('reset')){
      $('reset').onclick=()=>action(async()=>{
        const job=await request(endpoint('reset'),'POST',{});
        renderJob(job);
        notice('Run state reset to ready.');
      }, 'Resetting run state...');
    }
    if($('report')){
      $('report').removeAttribute('href');
      $('report').onclick=(e)=>{e.preventDefault();action(async()=>{
        const btn=$('report');
        const orig=btn.textContent;btn.textContent='Preparing CSV…';btn.disabled=true;
        try{await downloadFile(endpoint('report'),`hubspot-results-${mode}.csv`);}
        finally{btn.textContent=orig;btn.disabled=false;}
      });};
    }
    if($('issues-report')){
      $('issues-report').removeAttribute('href');
      $('issues-report').onclick=(e)=>{e.preventDefault();action(async()=>{
        const btn=$('issues-report');
        const orig=btn.textContent;btn.textContent='Preparing CSV…';btn.disabled=true;
        try{await downloadFile(endpoint('issues-report'),'validation-issues.csv');}
        finally{btn.textContent=orig;btn.disabled=false;}
      });};
    }
    state.poll=async()=>{if(state.busy)return;try{renderJob(await request(endpoint('status')));}catch(error){notice(error.message,true);}};
    go(0);
  }
  function normalize(value){return String(value).toLowerCase().replace(/[^a-z0-9]/g,'');}
  window.showHubspotFlow=(mode,step)=>{
    for(const [key,state] of flows)state.host.hidden=key!==mode;
    const state=flows.get(mode);if(!state)return;
    if(!state.loaded)state.load().then(()=>{if(step!==undefined)state.navigate(step);});else if(step!==undefined)state.navigate(step);
  };
  setInterval(()=>{for(const state of flows.values())if(state.loaded&&(state.job.running||(!section.hidden&&!state.host.hidden)))state.poll();},2000);
})();
