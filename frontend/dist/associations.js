(() => {
  const module='data-migrate-association',steps=['Objects & files','Match columns','Review & validate','Run & monitor'];
  const host=document.createElement('div');host.hidden=true;host.className='association-workspace';document.getElementById('hubspot-module').append(host);
  const sideCard=(side,title)=>`<article class="card"><div class="card-heading"><div><h2>${title}</h2><p>Select an existing portal object and its exported file.</p></div></div><div class="card-body hs-fields"><label>Object<select data-a="${side}-object"><option value="">Select portal object</option></select></label><small data-a="${side}-meta" class="muted"></small><label class="hs-upload"><span data-icon="FileUp"></span><strong>Upload this object’s file</strong><small>CSV / XLSX · up to 50 MB</small><input type="file" data-a="${side}-file" accept=".csv,.xlsx" aria-label="${title} file"></label><button type="button" class="button secondary" data-a="${side}-upload">Use selected file</button><div class="hs-workbook" data-a="${side}-workbook" hidden></div><label data-a="${side}-sheet-wrap" hidden>Worksheet<select data-a="${side}-sheet"></select></label></div></article>`;
  host.innerHTML=`<div class="breadcrumb">HubSpot <span>/</span> Association Migration</div><div class="page-heading hs-heading"><div><h1>Association Migration</h1><p>Replace relationships between existing records. Record properties stay unchanged.</p></div><button type="button" class="button secondary" data-a="refresh">Refresh objects</button></div><div data-a="progress"></div>
    <section data-a-panel="0"><div class="association-file-grid">${sideCard('left','Source object')}${sideCard('right','Target object')}</div><article class="card"><div class="card-heading"><div><h2>Association labels</h2><p>Labels follow the source → target direction.</p></div><button type="button" class="button secondary" data-a="labels">Get association labels</button></div><div class="card-body association-labels" data-a="label-options"><p class="muted">Select both objects, then fetch their association labels.</p></div></article></section>
    <section data-a-panel="1" hidden><article class="card"><div class="card-heading"><div><h2>Choose record-ID columns</h2><p>Row 2 matches row 2, row 3 matches row 3, and so on. Rows are never shifted to fill gaps.</p></div></div><div class="card-body association-file-grid"><label>Source record ID column<select data-a="left-column"></select></label><label>Target record ID column<select data-a="right-column"></select></label></div><div class="card-body association-example"><strong>One to one, one to many, many to one and many to many</strong><p>IDs are split on commas or <code>|</code>. Every source ID in a row is linked to every target ID in the matching row.</p><div><code>101 | 102</code><span>→</span><code>201, 202</code><span>= 4 associations</span></div><p>Choose destination HubSpot record IDs. Blank, missing, invalid or unmatched rows block the run.</p></div></article></section>
    <section data-a-panel="2" hidden><article class="card"><div class="card-heading"><div><h2>Review replacement</h2><p>Verify every record and preview exactly what will be removed and created.</p></div><button type="button" class="button primary" data-a="validate">Validate records & associations</button></div><div class="card-body"><div data-a="review" class="hs-review">Run validation to inspect the replacement scope.</div></div></article></section>
    <section data-a-panel="3" hidden><div class="association-file-grid"><article class="card"><div class="card-heading"><div><h2>Run association replacement</h2><p>First remove existing relationships, then create the planned relationships.</p></div><span class="pill neutral" data-a="phase">Ready</span></div><div class="card-body hs-fields"><label>Run mode<select data-a="mode"><option value="dry">Dry preview · no HubSpot changes</option><option value="real">Replace associations for real</option></select></label><div class="confirmation-box" data-a="confirmation-wrap" hidden><strong>Existing relationships will be replaced</strong><p>All relationships from the uploaded source IDs to this target object type will be removed, including links to target IDs absent from the target file. Unlisted source records and other object types are outside this scope.</p><label>Type RUN FOR REAL<input data-a="confirmation" placeholder="RUN FOR REAL" autocomplete="off"></label></div><div class="run-controls-row"><button type="button" class="button primary" data-a="run">Run dry preview</button><button type="button" class="button danger" data-a="cancel" hidden>Stop run</button></div><progress data-a="run-progress" max="100" value="0"></progress><div data-a="counts" class="muted">No association run started.</div><a class="button secondary" data-a="report" href="/api/hubspot/associations/report" hidden>Download replacement report</a></div></article><article class="card"><div class="card-heading"><div><h2>Live activity</h2><p>Validation, removal, creation and verification</p></div></div><div data-a="logs" class="activity-log hs-logs" role="log" aria-live="polite"></div></article></div><article class="card" data-a="backup-card" hidden><div class="card-heading"><div><h2>Original association backup</h2><p data-a="backup-scope"></p></div><a class="button secondary" href="/api/hubspot/associations/backup">Download backup JSON</a></div><div class="card-body hs-fields"><p class="muted">If a run stops after removals, retry the replacement or restore the original relationships from the saved backup.</p><label>Type RESTORE BACKUP to replace current relationships with this snapshot<input data-a="restore-confirmation" placeholder="RESTORE BACKUP" autocomplete="off"></label><button type="button" class="button secondary" data-a="restore">Restore original associations</button></div></article></section>
    <footer class="hs-footer"><button type="button" class="button plain" data-a="back">Back</button><span class="muted" data-a="hint">Select two portal objects and upload their files.</span><button type="button" class="button primary" data-a="next">Match columns →</button></footer>`;
  const $=name=>host.querySelector(`[data-a="${name}"]`),node=(tag,text)=>{const item=document.createElement(tag);if(text!==undefined)item.textContent=text;return item;};
  const state={step:0,busy:false,loaded:false,objects:[],sides:{left:null,right:null},labels:[],selectedLabels:[],columns:{left:'',right:''},validation:null,status:{running:false,phase:'idle',logs:[]},backup:null,dirty:false};
  const request=(suffix,method='GET',body)=>window.UI.request(`/api/hubspot/associations/${suffix}`,method,body);
  const progress=window.UI.progress({steps,label:'Association replacement progress',onSelect:step=>navigate(step)});$('progress').replaceWith(progress.root);
  const menu=document.querySelector(`[data-module="${module}"]`),subnav=node('div');subnav.className='hs-sidebar-steps';subnav.dataset.hsNavGroup=module;subnav.hidden=true;
  steps.forEach((name,index)=>{const button=node('button');button.type='button';button.dataset.hsNav=module;button.dataset.hsIndex=String(index);button.append(node('span',String(index+1)),node('strong',name));subnav.append(button);});menu.after(subnav);
  function ready(){return ['left','right'].every(side=>state.sides[side]?.workbook)&&state.selectedLabels.length>0;}
  function decorate(){
    const icons={refresh:'RefreshCw',labels:'Link2',validate:'ShieldCheck',run:'Play',cancel:'Square',report:'Download',restore:'RotateCcw','left-upload':'FileUp','right-upload':'FileUp'};
    for(const [key,icon]of Object.entries(icons)){const button=$(key);if(!button.querySelector('svg'))button.prepend(window.UI.icon(icon,16));}
    host.querySelectorAll('[data-icon]').forEach(mark=>{if(!mark.querySelector('svg'))mark.append(window.UI.icon(mark.dataset.icon,24));});
  }
  function controls(){
    const busy=state.busy||state.status.running;
    host.querySelectorAll('input,select,button').forEach(item=>item.disabled=busy);
    for(const side of ['left','right']){$(`${side}-object`).disabled=busy||!state.objects.length;$(`${side}-file`).disabled=busy||!state.sides[side]?.object;$(`${side}-upload`).disabled=busy||!state.sides[side]?.object||!$(`${side}-file`).files.length;}
    $('labels').disabled=busy||!state.sides.left?.object||!state.sides.right?.object;
    $('cancel').hidden=!state.status.running;$('cancel').disabled=!state.status.running||state.status.cancelRequested;
    $('back').disabled=busy||state.step===0;$('next').hidden=state.step===3;$('next').disabled=busy||!ready()||(state.step===1&&(!state.columns.left||!state.columns.right))||(state.step===2&&!state.validation);
    $('next').textContent=['Match columns →','Review & validate →','Run & monitor →',''][state.step];
    $('hint').textContent=state.sides.left?.object&&state.sides.right?.object?`${state.sides.left.object.label} → ${state.sides.right.object.label} · Row-position matching`:'Select two portal objects and upload their files.';
    const real=$('mode').value==='real';$('confirmation-wrap').hidden=!real;$('run').textContent=real?'Replace associations':'Run dry preview';
    $('run').disabled=busy||!ready()||!state.columns.left||!state.columns.right||(real&&(!state.validation||state.dirty||$('confirmation').value!=='RUN FOR REAL'));
    $('restore').disabled=busy||!state.backup||$('restore-confirmation').value!=='RESTORE BACKUP';
    progress.update(state.step,{disabled:Boolean(busy),canAdvance:Boolean(ready())});decorate();
  }
  async function action(fn){if(state.busy||state.status.running)return;state.busy=true;controls();try{await fn();}catch(error){window.UI.toast(error.message,'error');}finally{state.busy=false;controls();}}
  function options(select,values,current,placeholder){select.replaceChildren();const blank=node('option',placeholder);blank.value='';select.append(blank);for(const [id,name]of values){const option=node('option',name);option.value=id;select.append(option);}select.value=current||'';}
  function renderReview(){
    const container=$('review');container.replaceChildren();const review=state.validation?.summary||state.review;
    if(!review){container.textContent='Validate to check all records and preview the associations to replace.';return;}
    container.append(node('strong',review.issueCount?`${review.issueCount} issue(s) block this replacement.`:'Validation passed.'),node('p',`${review.sourceRecords} source records · ${review.targetRecords} target records · ${review.cardinality}`));
    const scope=node('div');scope.className='association-scope';scope.append(node('strong',`${review.remove} existing relationships to remove → ${review.pairs} associations to create`),node('p',review.scope+'. This includes existing links to targets absent from the uploaded target file. Other source records are unaffected.'));container.append(scope);
    container.append(node('p','Selected labels: '+review.labels.map(label=>`${label.label} (${label.typeId})`).join(', ')));
    if(review.issues?.length){const list=node('ul');review.issues.forEach(issue=>list.append(node('li',`${issue.row?'Row '+issue.row+': ':''}${issue.message}`)));container.append(list);}
    for(const [title,rows]of [['Planned associations · first 20',review.pairPreview||[]],['Existing associations to remove · first 20',review.removePreview||[]]]){
      if(!rows.length)continue;const details=node('details'),summary=node('summary',title),table=node('table');table.className='dash-table';const head=node('tr');head.append(node('th','Source record ID'),node('th','Target record ID'));table.append(head);rows.forEach(pair=>{const tr=node('tr');tr.append(node('td',pair.from),node('td',pair.to));table.append(tr);});details.append(summary,table);container.append(details);
    }
  }
  function job(status){
    const prior=state.status;state.status=status;
    $('phase').textContent=status.phase.replaceAll('_',' ');$('counts').textContent=status.dryRun?`${status.totalRemove||0} relationships to remove · ${status.totalCreate||0} associations to create · preview only`:`${status.removed||0} / ${status.totalRemove||0} removed · ${status.created||0} / ${status.totalCreate||0} created`;
    const total=(status.totalRemove||0)+(status.totalCreate||0);$('run-progress').value=status.phase==='completed'||status.phase==='restored'?100:total?((status.removed||0)+(status.created||0))/total*100:0;
    $('logs').replaceChildren();for(const entry of status.logs||[]){const line=node('div');line.className='log-entry';line.append(node('time',new Date(entry.timestamp).toLocaleTimeString()),node('span',entry.message));$('logs').append(line);}
    if(!status.logs?.length)$('logs').append(node('p','No association run started.'));
    $('report').hidden=!status.report;if(status.backup)state.backup=status;
    $('backup-card').hidden=!state.backup;
    if(state.backup)$('backup-scope').textContent=`${state.backup.review?.sourceObject||'Source'} → ${state.backup.review?.targetObject||'Target'} · ${state.backup.review?.sourceRecords||0} source records · ${state.backup.totalRemove||0} original relationships`;
    if(status.review&&status.id!==state.lastReviewJob){state.review=status.review;state.lastReviewJob=status.id;}
    if(status.validationId&&status.review&&status.id!==state.consumedValidationJob){state.validation={id:status.validationId,summary:status.review};state.consumedValidationJob=status.id;}
    if(status.error&&status.error!==state.lastError)window.UI.toast(status.error,'error');state.lastError=status.error;
    if(prior.running&&!status.running&&['completed','restored'].includes(status.phase))window.UI.toast(status.dryRun?'Dry preview completed. No associations changed.':status.phase==='restored'?'Original associations restored.':'Associations replaced and verified.','success');
    renderReview();controls();
  }
  function apply(data){
    state.sides=data.sides;state.labels=data.labels;state.selectedLabels=data.selectedLabels;state.validation=data.validation;state.backup=data.backup;
    state.review=data.validation?.summary||null;state.lastReviewJob=data.status.id;state.consumedValidationJob=data.status.id;
    state.columns=data.columns||{left:'',right:''};state.dirty=!data.columns;
    for(const side of ['left','right']){
      const item=state.sides[side];options($(`${side}-object`),state.objects.map(object=>[object.objectTypeId,object.label]),item?.object.objectTypeId,'Select portal object');
      $(`${side}-meta`).textContent=item?.object?`Object ID ${item.object.objectTypeId} · Portal ${item.object.portalId}`:'';
      const book=item?.workbook;$(`${side}-workbook`).hidden=!book;$(`${side}-workbook`).textContent=book?`${book.filename} · ${book.rows.toLocaleString()} data rows`:'';
      $(`${side}-sheet-wrap`).hidden=!book||book.sheets.length<2;options($(`${side}-sheet`),(book?.sheets||[]).map(name=>[name,name]),book?.sheet,'Select worksheet');
      if(!state.columns[side]&&book){state.columns[side]=book.columns.find(column=>/record.?id|hs_object_id/i.test(column.name))?.name||'';}
      options($(`${side}-column`),(book?.columns||[]).map(column=>[column.name,column.name]),state.columns[side],'Select record-ID column');
    }
    const labels=$('label-options');labels.replaceChildren();
    if(!state.labels.length)labels.append(node('p','Select both objects, then fetch association labels.'));
    for(const label of state.labels){const wrapper=node('label');wrapper.className='association-label';const checkbox=node('input');checkbox.type='checkbox';checkbox.value=label.key;checkbox.checked=state.selectedLabels.includes(label.key);const text=node('span');text.append(node('strong',label.label||'Default (unlabeled)'),node('small',`${label.category} · ID ${label.typeId}`));checkbox.onchange=()=>action(async()=>{const keys=[...labels.querySelectorAll('input:checked')].map(input=>input.value);apply(await request('labels','PUT',{keys}));});wrapper.append(checkbox,text);labels.append(wrapper);}
    job(data.status);
  }
  async function saveColumns(){if(!state.columns.left||!state.columns.right)throw new Error('Choose one record-ID column from each file.');if(state.dirty){const result=await request('columns','PUT',state.columns);state.validation=result.validation;state.dirty=false;}}
  function go(step){state.step=step;host.querySelectorAll('[data-a-panel]').forEach(panel=>panel.hidden=Number(panel.dataset.aPanel)!==step);document.querySelectorAll(`[data-hs-nav="${module}"]`).forEach(button=>button.classList.toggle('active',Number(button.dataset.hsIndex)===step));controls();}
  async function navigate(step){await action(async()=>{if(step>0&&!ready())throw new Error('Select both objects, upload both files and choose at least one association label.');if(step>1)await saveColumns();go(step);});}
  async function load(){await action(async()=>{const [catalogue,data]=await Promise.all([window.UI.request('/api/hubspot/objects'),request('state')]);state.objects=catalogue.objects;state.loaded=true;apply(data);go(data.status.phase==='idle'?0:3);});}
  for(const side of ['left','right']){
    $(`${side}-object`).onchange=()=>action(async()=>{if(!$(`${side}-object`).value)return;const data=await request(`object/${side}`,'PUT',{objectTypeId:$(`${side}-object`).value});$(`${side}-file`).value='';apply(data);});
    $(`${side}-file`).onchange=controls;
    $(`${side}-upload`).onclick=()=>action(async()=>{const file=$(`${side}-file`).files[0];if(!file||file.size>50*1024**2||!(/\.(csv|xlsx)$/i.test(file.name)))throw new Error('Choose a CSV or XLSX file up to 50 MB.');const form=new FormData();form.append('file',file);apply(await request(`workbook/${side}`,'POST',form));window.UI.toast('File uploaded.','success');});
    $(`${side}-sheet`).onchange=()=>action(async()=>apply(await request(`sheet/${side}`,'POST',{sheet:$(`${side}-sheet`).value})));
    $(`${side}-column`).onchange=()=>{state.columns[side]=$(`${side}-column`).value;state.validation=null;state.review=null;state.dirty=true;controls();};
  }
  $('refresh').onclick=()=>action(async()=>{state.objects=(await window.UI.request('/api/hubspot/objects?refresh=true')).objects;apply(await request('state'));});
  $('labels').onclick=()=>action(async()=>{const result=await request('labels','POST',{});apply(result);if(!result.labels.length)window.UI.toast('No association labels are defined for this object pair in the selected direction.','info');});
  $('validate').onclick=()=>action(async()=>{await saveColumns();state.validation=await request('preflight','POST',{});state.review=state.validation.summary;if(state.validation.summary.issueCount){state.validation=null;window.UI.toast('Resolve the validation issues before replacing associations.','error');}else window.UI.toast('All records verified. Review the replacement counts before running.','success');renderReview();});
  $('next').onclick=()=>navigate(Math.min(3,state.step+1));$('back').onclick=()=>navigate(Math.max(0,state.step-1));$('mode').onchange=controls;$('confirmation').oninput=controls;$('restore-confirmation').oninput=controls;
  $('run').onclick=()=>action(async()=>{await saveColumns();const dryRun=$('mode').value!=='real';job(await request('run','POST',{dryRun,confirmation:$('confirmation').value,validationId:state.validation?.id}));$('confirmation').value='';if(!dryRun)state.validation=null;});
  $('cancel').onclick=async()=>{try{job(await request('cancel','POST',{}));}catch(error){window.UI.toast(error.message,'error');}};
  $('restore').onclick=()=>action(async()=>{job(await request('restore','POST',{confirmation:$('restore-confirmation').value}));$('restore-confirmation').value='';state.validation=null;});
  const showImport=window.showHubspotFlow;
  window.showHubspotFlow=(mode,step)=>{showImport(mode,step);host.hidden=mode!==module;if(mode===module){if(!state.loaded)load().then(()=>{if(step!==undefined)navigate(step);});else if(step!==undefined)navigate(step);}};
  setInterval(async()=>{if(!state.loaded||state.busy||(!state.status.running&&host.hidden))return;try{job(await request('status'));}catch(error){window.UI.toast(error.message,'error');}},2000);
  go(0);
})();
