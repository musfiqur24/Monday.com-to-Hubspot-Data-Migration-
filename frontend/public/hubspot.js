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
      <div class="notice" data-hs="notice" role="status" hidden></div>
      <section data-hs-panel="0"><div class="hs-grid"><article class="card"><div class="card-heading"><div><h2>Choose workbook</h2><p>Upload a HubSpot export or another CSV / Excel workbook.</p></div><span class="pill neutral">CSV / XLSX</span></div><div class="card-body"><label class="hs-upload"><span class="hs-upload-symbol"></span><strong>Select your workbook</strong><small>CSV or XLSX · up to 50 MB</small><input type="file" data-hs="file" accept=".csv,.xlsx" aria-label="${title} workbook"></label><p data-hs="selected" class="muted">No file selected</p><button type="button" class="button secondary" data-hs="upload">Use selected file</button><div data-hs="workbook" class="hs-workbook" hidden></div><label data-hs="sheet-wrap" class="hs-sheet" hidden>Worksheet<select data-hs="sheet"></select></label></div></article>
      <article class="card"><div class="card-heading"><div><h2>Destination object</h2><p data-hs="portal-meta">Objects are fetched from your connected HubSpot portal.</p></div><button type="button" class="button secondary" data-hs="refresh-objects" aria-label="Refresh portal objects">Refresh</button></div><div class="card-body hs-fields"><label>Object<select data-hs="object">${objects}</select></label><p data-hs="object-meta" class="muted">Select the destination object first, then upload your workbook.</p><p class="info-note">Record IDs must belong to the destination account. Source-account IDs cannot be used to match destination records.</p><p data-hs="credentials" class="muted"></p></div></article></div></section>
      <section data-hs-panel="1" hidden><article class="card"><div class="card-heading"><div><h2>Match records</h2><p>Choose how to find an existing record or create a missing one.</p></div><button type="button" class="button secondary" data-hs="properties">Load HubSpot properties</button></div><div class="card-body field-grid"><label>Identifier column<select data-hs="identifier"></select></label><label>Match using<select data-hs="id-property"><option value="hs_object_id">Record ID · update existing only</option></select></label></div><p class="hs-help">Contact email or a property with unique values supports create/update. Blank cells do not erase existing values.</p></article>
      <article class="card"><div class="card-heading"><div><h2>Column mapping</h2><p>Map each source column to a writable HubSpot property.</p></div><span class="pill neutral" data-hs="mapped">0 mapped</span></div><div class="hs-table-wrap"><table class="mapping-table"><thead><tr><th>Workbook column</th><th>Sample values</th><th>HubSpot property</th></tr></thead><tbody data-hs="mappings"></tbody></table></div><div class="card-body"><button type="button" class="button secondary" data-hs="save">Save mappings</button></div></article>
      ${association?`<article class="card"><div class="card-heading"><div><h2>Associations</h2><p>Connect each imported record to existing destination records. Separate multiple IDs with semicolons.</p></div><button type="button" class="button secondary" data-hs="add-association">Add association</button></div><div class="card-body" data-hs="associations"></div></article>`:''}</section>
      <section data-hs-panel="2" hidden><article class="card"><div class="card-heading"><div><h2>Review & validate</h2><p>Check mappings, property values, record matches and associations.</p></div><button type="button" class="button primary" data-hs="validate">Run validation</button></div><div class="card-body"><div data-hs="plan" class="hs-plan"></div><div data-hs="review" class="hs-review">Run validation to check your import. Nothing is written to HubSpot.</div></div></article></section>
      <section data-hs-panel="3" hidden><div class="hs-grid"><article class="card"><div class="card-heading"><div><h2>Run & monitor</h2><p>Preview first, then run the real migration.</p></div><span class="pill neutral" data-hs="phase">Ready</span></div><div class="card-body hs-fields"><label>Run mode<select data-hs="run-mode"><option value="dry">Dry preview · no HubSpot changes</option><option value="real">Real migration</option></select></label><div data-hs="confirm-wrap" class="confirmation-box" hidden><p>Mapped values may be replaced. This writes to the destination HubSpot account.</p><label>Type RUN FOR REAL<input data-hs="confirmation" placeholder="RUN FOR REAL" autocomplete="off"></label></div><div class="run-controls-row"><button type="button" class="button primary" data-hs="run">Run dry preview</button><button type="button" class="button danger" data-hs="cancel" hidden>Stop run</button></div><p data-hs="run-hint" class="muted">Validate the current mappings before starting a real migration.</p><progress data-hs="progress" value="0" max="100"></progress><div class="hs-run-counts" data-hs="counts">No run started</div><a class="button secondary" data-hs="report" href="/api/hubspot/${mode}/report" hidden>Download results</a></div></article><article class="card"><div class="card-heading"><div><h2>Live activity</h2><p>Row results and migration progress</p></div></div><div data-hs="logs" class="activity-log hs-logs" role="log" aria-live="polite"><div class="empty-state">Start a preview or migration to see activity.</div></div></article></div></section>
      <footer class="hs-footer"><button type="button" class="button plain" data-hs="back">&#8592; Back</button><span class="muted" data-hs="hint">Choose a workbook to get started.</span><button type="button" class="button primary" data-hs="next">Map columns &#8594;</button></footer>`;
    const $=key=>host.querySelector(`[data-hs="${key}"]`);
    const state={mode,host,$,step:0,workbook:null,objects:[],selectedObject:null,properties:[],mapping:{},identifierColumn:'',idProperty:'hs_object_id',associations:association?[{objectType:'',column:'',typeId:null}]:[],review:null,dirty:false,busy:false,job:{running:false},loaded:false};
    flows.set(mode,state);
    const endpoint=suffix=>`/api/hubspot/${mode}/${suffix}`;
    const notice=(text,error=false)=>{$('notice').hidden=true;window.UI.toast(text,error?'error':'success');};
    const workflow=window.UI.progress({label:`${title} progress`,onSelect:step=>navigate(step)});
    $('workflow').replaceWith(workflow.root);
    const type=()=>state.selectedObject?.objectTypeId||'';
    function invalidate() {state.review=null;state.dirty=true;controls();}
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
      $('next').textContent=state.step===0?'Map columns →':state.step===1?'Review & validate →':'Run & monitor →';
      $('hint').textContent=state.dirty?'Mappings have unsaved changes.':state.workbook?`${state.workbook.rows.toLocaleString()} workbook rows`:'Choose a workbook to get started.';
      const real=$('run-mode').value==='real';
      $('confirm-wrap').hidden=!real;$('run').textContent=real?'Run migration':'Run dry preview';
      $('run').disabled=busy||!state.workbook||!state.selectedObject||(real&&(!state.review||state.review.issueCount>0||state.dirty||$('confirmation').value!=='RUN FOR REAL'));
      $('run-hint').textContent=real?'Requires a successful validation of the current mappings.':'Dry previews validate records without writing to HubSpot.';
      workflow.update(state.step,{disabled:Boolean(busy),canAdvance:Boolean(state.workbook&&state.selectedObject)});
      window.UI.decorate(host);
    }
    async function action(fn) {
      if(state.busy||state.job.running)return;state.busy=true;notice('');controls();
      try {await fn();} catch(error){notice(error.message,true);} finally {state.busy=false;controls();}
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
      await action(async()=>{
        if(step>0&&(!state.workbook||!state.selectedObject))throw new Error('Select a portal object and upload a workbook first.');
        if(state.step===1&&state.dirty)await save();
        if(step>0&&!state.properties.length)await loadProperties(Object.keys(state.mapping).length===0);
        go(step);
      });
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
      const writable=state.properties.filter(property=>!property.calculated&&!property.modificationMetadata?.readOnlyValue&&!property.externalOptions&&property.name!=='hs_object_id');
      for(const column of state.workbook?.columns||[]) {
        const row=el('tr'), source=el('td',column.name), sample=el('td',column.samples.filter(Boolean).join(' · ')||'—'), target=el('td'),select=el('select');
        sample.className='hs-sample';select.setAttribute('aria-label',`HubSpot property for ${column.name}`);
        options(select,writable.map(property=>[property.name,`${property.label} (${property.name})`]),state.mapping[column.name],'Ignore column');
        select.addEventListener('change',()=>{state.mapping[column.name]=select.value;invalidate();mappedCount();});
        target.append(select);row.append(source,sample,target);$('mappings').append(row);
      }
      const ids=[['hs_object_id','Record ID · update existing only'],...state.properties.filter(property=>property.hasUniqueValue||(type()==='0-1'&&property.name==='email')).map(property=>[property.name,`${property.label} · create/update`])];
      if(!ids.some(([name])=>name===state.idProperty))state.idProperty='hs_object_id';
      options($('id-property'),ids,state.idProperty);mappedCount();
    }
    function mappedCount() {$('mapped').textContent=`${Object.values(state.mapping).filter(Boolean).length} mapped`;}
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
      if(!state.review)$('review').textContent='Run validation to check your current settings. Nothing is written to HubSpot.';
    }
    function renderReview(review) {
      $('review').replaceChildren();
      const message=el('p',review.issueCount?`${review.issueCount} validation issue(s). Fix them before running.`:'Validation passed. Ready for a dry preview or real migration.',review.issueCount?'hs-error-text':'hs-success-text');
      $('review').append(message);
      $('review').append(el('p',`${review.records} records · ${review.existing} existing · ${review.creating} to create · ${review.associations} associations`));
      if(review.issues.length){const list=el('ul');for(const issue of review.issues)list.append(el('li',`${issue.row?'Row '+issue.row+': ':''}${issue.message}`));$('review').append(list);}
    }
    function renderJob(job) {
      const prior=state.job;
      state.job=job;
      $('phase').textContent=job.phase.replaceAll('_',' ');
      $('progress').value=job.total?Math.round(job.completed/job.total*100):0;
      $('counts').textContent=`${job.completed||0} / ${job.total||0} processed · ${job.succeeded||0} ${job.dryRun?'previewed':'succeeded'} · ${job.skipped||0} reused · ${job.failed||0} failed`;
      $('logs').replaceChildren();
      for(const entry of job.logs||[]){const line=el('div',undefined,'log-entry');line.append(el('time',new Date(entry.timestamp).toLocaleTimeString()),el('span',entry.message));$('logs').append(line);}
      if(!job.logs?.length)$('logs').append(el('div','Start a preview or migration to see activity.','empty-state'));
      $('report').hidden=!job.report;
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
      if(!/\.(csv|xlsx)$/i.test(file.name)||file.size>50*1024**2)throw new Error('Choose a CSV or XLSX workbook up to 50 MB.');
      const form=new FormData();form.append('file',file);
      const result=await request(endpoint('workbook'),'POST',form);state.workbook=result.workbook;state.mapping={};state.identifierColumn='';state.idProperty='hs_object_id';invalidate();renderWorkbook();notice('Workbook ready. Continue to map columns.');
      try{await loadProperties(true);}catch(error){notice(`Workbook uploaded. ${error.message}`,true);}
    });
    $('sheet').onchange=()=>action(async()=>{const result=await request(endpoint('sheet'),'POST',{sheet:$('sheet').value});state.workbook=result.workbook;state.mapping={};state.identifierColumn='';invalidate();renderWorkbook();await loadProperties(true);});
    $('object').onchange=()=>action(async()=>{
      const chosen=$('object').value;if(!chosen){state.selectedObject=null;selectedMeta();invalidate();return;}
      const result=await request(endpoint('object'),'PUT',{objectTypeId:chosen});state.selectedObject=result.selectedObject;
      state.properties=[];state.mapping={};state.identifierColumn='';state.idProperty='hs_object_id';state.associations.forEach(link=>{link.typeId=null;link.labels=null;});
      $('identifier').value='';invalidate();selectedMeta();renderMappings();renderAssociations();
      if(state.workbook)await loadProperties(true);
    });
    $('refresh-objects').onclick=()=>action(()=>loadCatalogue(true));
    $('identifier').onchange=()=>{state.identifierColumn=$('identifier').value;invalidate();};
    $('id-property').onchange=()=>{state.idProperty=$('id-property').value;invalidate();};
    $('properties').onclick=()=>action(()=>loadProperties(Object.keys(state.mapping).length===0));
    $('save').onclick=()=>action(async()=>{await save();notice('Mappings saved.');});
    if(association)$('add-association').onclick=()=>{state.associations.push({objectType:'',column:'',typeId:null});invalidate();renderAssociations();controls();};
    $('validate').onclick=()=>action(async()=>{await save();state.review=await request(endpoint('preflight'),'POST',{});renderReview(state.review);notice(state.review.issueCount?'Validation found issues. Review the results before running.':'Validation passed. Your import is ready.',Boolean(state.review.issueCount));});
    $('back').onclick=()=>go(Math.max(0,state.step-1));
    $('next').onclick=()=>navigate(Math.min(3,state.step+1));
    $('run-mode').onchange=controls;$('confirmation').oninput=controls;
    $('run').onclick=()=>action(async()=>{
      if(state.dirty)await save();
      const job=await request(endpoint('run'),'POST',{dryRun:$('run-mode').value!=='real',confirmation:$('confirmation').value});
      $('confirmation').value='';renderJob(job);
    });
    $('cancel').onclick=async()=>{try{renderJob(await request(endpoint('cancel'),'POST',{}));}catch(error){notice(error.message,true);}};
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
