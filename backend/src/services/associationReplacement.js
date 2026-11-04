import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {z} from 'zod';
import {readHubspotWorkbook} from './hubspotWorkbook.js';
import {fail,safeError} from '../lib/sanitize.js';

const enc=encodeURIComponent;
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const chunks=(values,size)=>Array.from({length:Math.ceil(values.length/size)},(_,index)=>values.slice(index*size,(index+1)*size));
const labelKey=label=>`${label.category}:${label.typeId}`;
const columnSchema=z.object({left:z.string().min(1),right:z.string().min(1)}).strict();
export const splitRecordIds=value=>[...new Set(String(value??'').split(/[,|]/).map(id=>id.trim()).filter(Boolean))];
const csv=value=>'"'+String(value??'').replaceAll('"','""')+'"';

export function pairRows(left,right,columns) {
  const issues=[],pairs=new Map(),sourceIds=new Set(),targetIds=new Set();let issueCount=0;
  const issue=(row,message)=>{issueCount++;if(issues.length<100)issues.push({row,message});};
  if(!left.columns.includes(columns.left)||!right.columns.includes(columns.right))throw fail('Select one record-ID column from each file.');
  const byNumber=[new Map(left.rows.map(row=>[row.number,row])),new Map(right.rows.map(row=>[row.number,row]))];
  const numbers=[...new Set([...byNumber[0].keys(),...byNumber[1].keys()])].sort((a,b)=>a-b);
  for(const number of numbers) {
    const a=byNumber[0].get(number),b=byNumber[1].get(number);
    if(!a||!b){issue(number,'This data row is missing from one file. Rows are paired by their original position.');continue;}
    const from=splitRecordIds(a.values[columns.left]),to=splitRecordIds(b.values[columns.right]);
    if(!from.length||!to.length){issue(number,'Both selected ID cells must contain at least one destination record ID.');continue;}
    if([...from,...to].some(id=>!(/^[1-9]\d*$/.test(id)))){issue(number,'Record IDs must be positive integers, separated by commas or |.');continue;}
    from.forEach(id=>sourceIds.add(id));to.forEach(id=>targetIds.add(id));
    for(const source of from)for(const target of to) {
      const key=`${source}:${target}`;
      if(pairs.has(key))pairs.get(key).rows.push(number);else pairs.set(key,{from:source,to:target,rows:[number]});
      if(pairs.size>100000)throw fail('The split cells produce more than 100,000 associations. Split this job into smaller file pairs.');
    }
  }
  const out=new Map(),incoming=new Map();
  for(const pair of pairs.values()){out.set(pair.from,(out.get(pair.from)||0)+1);incoming.set(pair.to,(incoming.get(pair.to)||0)+1);}
  const manyOut=[...out.values()].some(value=>value>1),manyIn=[...incoming.values()].some(value=>value>1);
  return {pairs:[...pairs.values()],sourceIds:[...sourceIds],targetIds:[...targetIds],rows:numbers.length,issueCount,issues,cardinality:manyOut?(manyIn?'Many to many':'One to many'):(manyIn?'Many to one':'One to one')};
}

export class AssociationReplacement {
  constructor(rt) {
    this.rt=rt;this.db=rt.state.db;
    this.db.exec('CREATE TABLE IF NOT EXISTS association_workspace(id INTEGER PRIMARY KEY,data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS association_jobs(id TEXT PRIMARY KEY,data TEXT NOT NULL,snapshot TEXT);');
    const saved=this.db.prepare('SELECT data FROM association_workspace WHERE id=1').get();
    this.workspace=saved?JSON.parse(saved.data):{sides:{left:null,right:null},labels:[],selectedLabels:[],columns:null,validation:null,lastJobId:null,lastReplacementId:null};
    this.job=this.workspace.lastJobId?this.readJob(this.workspace.lastJobId):null;
    if(this.job?.running){this.job.running=false;this.job.phase='interrupted';this.job.error='The server stopped during this run. Review its backup before retrying.';this.persistJob();}
  }
  save(){this.db.prepare('INSERT OR REPLACE INTO association_workspace VALUES(1,?)').run(JSON.stringify(this.workspace));}
  readJob(id){const row=this.db.prepare('SELECT data FROM association_jobs WHERE id=?').get(id);return row?JSON.parse(row.data):null;}
  persistJob(){if(this.job)this.db.prepare('INSERT INTO association_jobs(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(this.job.id,JSON.stringify(this.job));}
  busy(){return Boolean(this.job?.running);}
  assertMutable(){if(this.busy()||this.imports?.busy()||this.rt.migration.status.running)throw fail('A migration started while this request was processing. Try again after it finishes.');}
  status(){return this.job||{running:false,phase:'idle',removed:0,created:0,logs:[]};}
  publicState(){return {sides:Object.fromEntries(['left','right'].map(side=>{const item=this.workspace.sides[side];return [side,item?{object:item.object,workbook:item.summary?{filename:item.filename,...item.summary}:null}:null];})),labels:this.workspace.labels,selectedLabels:this.workspace.selectedLabels,columns:this.workspace.columns,validation:this.workspace.validation,status:this.status(),backup:this.workspace.lastReplacementId?this.readJob(this.workspace.lastReplacementId):null};}
  invalidate(){this.workspace.validation=null;this.save();}
  async object(side,id){
    const object=await this.rt.hubspot.portal.object(id);
    this.assertMutable();
    this.workspace.sides[side]={object};this.workspace.labels=[];this.workspace.selectedLabels=[];this.workspace.columns=null;this.invalidate();
    return this.publicState();
  }
  async workbook(side,file,extension,filename,sheet){
    const current=this.workspace.sides[side];if(!current?.object)throw fail('Select this side’s object before uploading a file.');
    const object=await this.rt.hubspot.portal.object(current.object.objectTypeId);
    if(object.portalId!==current.object.portalId)throw fail('The portal changed. Select both objects again.');
    const parsed=await readHubspotWorkbook(file,extension,sheet);
    this.assertMutable();if(this.workspace.sides[side]!==current)throw fail('This object selection changed during upload. Select its file again.');
    this.workspace.sides[side]={object,file,extension,filename,summary:parsed.summary};this.workspace.columns=null;this.invalidate();
    return this.publicState();
  }
  async objects(){
    const left=this.workspace.sides.left?.object,right=this.workspace.sides.right?.object;
    if(!left||!right)throw fail('Select both portal objects first.');
    const [a,b]=await Promise.all([this.rt.hubspot.portal.object(left.objectTypeId),this.rt.hubspot.portal.object(right.objectTypeId)]);
    if(a.portalId!==left.portalId||b.portalId!==right.portalId)throw fail('The configured portal changed. Select both objects again.');
    return {left:a,right:b};
  }
  async labels(){
    const objects=await this.objects();
    const result=await this.rt.hubspot.request(`/crm/associations/2026-09/${enc(objects.left.objectTypeId)}/${enc(objects.right.objectTypeId)}/labels`);
    this.assertMutable();if(['left','right'].some(side=>this.workspace.sides[side]?.object.objectTypeId!==objects[side].objectTypeId))throw fail('The object pair changed. Fetch association labels again.');
    this.workspace.labels=(result.results||[]).map(label=>({...label,key:labelKey(label)}));
    this.workspace.selectedLabels=this.workspace.selectedLabels.filter(key=>this.workspace.labels.some(label=>label.key===key));this.invalidate();
    return this.publicState();
  }
  selectLabels(keys){
    if(!Array.isArray(keys)||keys.some(key=>typeof key!=='string'||!this.workspace.labels.some(label=>label.key===key)))throw fail('Select from the fetched association labels.');
    this.workspace.selectedLabels=[...new Set(keys)];this.invalidate();return this.publicState();
  }
  columns(input){const parsed=columnSchema.safeParse(input);if(!parsed.success)throw fail('Select an ID column from each file.');this.workspace.columns=parsed.data;this.invalidate();return this.publicState();}
  async readLinks(fromType,toType,id){
    const links=[];let after;
    do{const result=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(fromType)}/${enc(id)}/associations/${enc(toType)}?limit=500${after?`&after=${enc(after)}`:''}`);links.push(...(result.results||[]).map(item=>({from:id,to:String(item.toObjectId),types:(item.associationTypes||[]).map(type=>({associationCategory:type.category,associationTypeId:type.typeId}))})));after=result.paging?.next?.after;}while(after);
    return links;
  }
  async verifyIds(type,ids){
    const missing=[];
    for(const batch of chunks(ids,100)){
      const result=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(type)}/batch/read`,{method:'POST',body:{inputs:batch.map(id=>({id})),properties:['hs_object_id']}});
      const found=new Set((result.results||[]).filter(row=>!row.archived).map(row=>String(row.id)));
      missing.push(...batch.filter(id=>!found.has(id)));
    }
    return missing;
  }
  async plan(){
    const objects=await this.objects(),sides=this.workspace.sides,columns=this.workspace.columns;
    if(!sides.left?.file||!sides.right?.file||!columns)throw fail('Upload both files and choose both record-ID columns.');
    const fresh=await this.rt.hubspot.request(`/crm/associations/2026-09/${enc(objects.left.objectTypeId)}/${enc(objects.right.objectTypeId)}/labels`);
    const labels=this.workspace.selectedLabels.map(key=>(fresh.results||[]).find(label=>labelKey(label)===key));
    if(!labels.length||labels.some(label=>!label))throw fail('Selected association labels are unavailable. Fetch labels again and select the current labels.');
    const [left,right]=await Promise.all(['left','right'].map(side=>readHubspotWorkbook(sides[side].file,sides[side].extension,sides[side].summary.sheet)));
    const pairing=pairRows(left,right,columns),issues=[...pairing.issues];let issueCount=pairing.issueCount;
    const issue=message=>{issueCount++;if(issues.length<100)issues.push({row:null,message});};
    const limits=await this.rt.hubspot.request(`/crm/associations/2026-09/definitions/configurations/${enc(objects.left.objectTypeId)}/${enc(objects.right.objectTypeId)}`);
    const applicable=new Set([...labels,...(fresh.results||[]).filter(label=>label.label===null)].map(labelKey));
    const perSource=new Map();for(const pair of pairing.pairs)perSource.set(pair.from,(perSource.get(pair.from)||0)+1);
    for(const limit of limits.results||[]){
      if(!applicable.has(labelKey(limit)))continue;
      const values=[limit.userEnforcedMaxToObjectIds,limit.maxToObjectIds].filter(value=>Number.isFinite(value)&&value>=0);
      if(!values.length)continue;const maximum=Math.min(...values);
      for(const [id,count]of perSource)if(count>maximum)issue(`Source record ${id} would have ${count} targets, exceeding the ${maximum}-target limit for ${limit.label||'the default association'}.`);
    }
    if(!pairing.pairs.length)issue('No associations could be built from the selected columns.');
    if(!issueCount){for(const [side,ids]of [['left',pairing.sourceIds],['right',pairing.targetIds]]){
      const missing=await this.verifyIds(objects[side].objectTypeId,ids);
      for(const id of missing)issue(`${side==='left'?'Source':'Target'} record ID ${id} was not found in the destination portal.`);
    }}
    const existing=[];
    if(!issueCount)for(const id of pairing.sourceIds)existing.push(...await this.readLinks(objects.left.objectTypeId,objects.right.objectTypeId,id));
    const types=labels.map(label=>({associationCategory:label.category,associationTypeId:label.typeId}));
    const sortLinks=values=>values.map(link=>({from:link.from,to:link.to,types:link.types?[...link.types].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))):undefined})).sort((a,b)=>`${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`));
    const fingerprint=hash({objects,columns,types:[...types].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),pairs:sortLinks(pairing.pairs),existing:sortLinks(existing)});
    const summary={portalId:objects.left.portalId,sourceObject:objects.left.label,targetObject:objects.right.label,rows:pairing.rows,sourceRecords:pairing.sourceIds.length,targetRecords:pairing.targetIds.length,pairs:pairing.pairs.length,remove:existing.length,cardinality:pairing.cardinality,labels:labels.map(label=>({label:label.label||'Default (unlabeled)',typeId:label.typeId,category:label.category})),pairPreview:pairing.pairs.slice(0,20),removePreview:existing.slice(0,20).map(({from,to})=>({from,to})),issueCount,issues,scope:'All current relationships from uploaded source IDs to the selected target object type'};
    return {objects,...pairing,existing,types,fingerprint,summary};
  }
  async validate(){const plan=await this.plan();this.assertMutable();this.workspace.validation=plan.summary.issueCount?null:{id:plan.fingerprint,summary:plan.summary};this.save();return {id:plan.fingerprint,summary:plan.summary};}
  log(values,message){Object.assign(this.job,values);if(message)this.job.logs=[...(this.job.logs||[]),{timestamp:new Date().toISOString(),message}].slice(-150);this.persistJob();}
  start({dryRun=true,validationId,restoreId}={}){
    if(restoreId&&dryRun)throw fail('Restoring a backup requires an explicitly confirmed real operation.');
    if(this.busy()||this.rt.migration.status.running)throw fail('Another migration is running.');
    if(!dryRun&&!restoreId&&(!this.workspace.validation||validationId!==this.workspace.validation.id))throw fail('Validate the current file pair and replacement scope before running for real.');
    const lock=path.join(this.rt.root,'state/run.lock');let fd;
    try{fd=fs.openSync(lock,'wx',0o600);fs.writeFileSync(fd,String(process.pid));}catch{throw fail('Another migration holds the shared run lock.');}
    this.job={id:randomUUID(),running:true,phase:'validating',dryRun,removed:0,created:0,totalRemove:0,totalCreate:0,logs:[],error:null,cancelRequested:false,startedAt:new Date().toISOString(),restoreId:restoreId||null};
    this.workspace.lastJobId=this.job.id;this.save();this.persistJob();
    const done=(restoreId?this.restore(restoreId):this.execute(dryRun,validationId)).catch(error=>{this.log({phase:this.job.cancelRequested?'cancelled':'failed',error:safeError(error)},safeError(error));}).finally(()=>{fs.closeSync(fd);fs.unlinkSync(lock);this.log({running:false,finishedAt:new Date().toISOString()});});
    return {job:this.job,done};
  }
  checkCancel(){if(this.job.cancelRequested)throw fail('Run stopped. Some relationships may have changed; retry the replacement or restore the saved backup.');}
  async archive(plan){
    this.log({phase:'removing'},'Phase 1: removing existing associations for the uploaded source records.');
    const groups=new Map();for(const link of plan.existing){if(!groups.has(link.from))groups.set(link.from,[]);groups.get(link.from).push({id:link.to});}
    let batch=[],seen=new Set();
    const flush=async()=>{if(!batch.length)return;this.checkCancel();const result=await this.rt.hubspot.request(`/crm/associations/2026-09/${enc(plan.objects.left.objectTypeId)}/${enc(plan.objects.right.objectTypeId)}/batch/archive`,{method:'POST',body:{inputs:batch}});if(result?.numErrors||result?.errors?.length)throw fail('HubSpot did not confirm all removals. Review the backup and retry.');this.log({removed:this.job.removed+batch.reduce((sum,input)=>sum+input.to.length,0)},'Removal batch completed.');batch=[];seen=new Set();};
    for(const [from,to]of groups)for(const targets of chunks(to,500)){if(batch.length===100||seen.has(from))await flush();batch.push({from:{id:from},to:targets});seen.add(from);}await flush();
    for(const source of plan.sourceIds){this.checkCancel();if((await this.readLinks(plan.objects.left.objectTypeId,plan.objects.right.objectTypeId,source)).length)throw fail('Removal verification failed. New associations have not been created. Retry or restore the backup.');}
  }
  async create(plan,pairs){
    this.log({phase:'creating'},'Phase 2: creating the planned associations.');
    for(const batch of chunks(pairs,100)){
      this.checkCancel();const result=await this.rt.hubspot.request(`/crm/associations/2026-09/${enc(plan.objects.left.objectTypeId)}/${enc(plan.objects.right.objectTypeId)}/batch/create`,{method:'POST',body:{inputs:batch.map(pair=>({from:{id:pair.from},to:{id:pair.to},types:pair.types||plan.types}))}});
      if(result?.numErrors||result?.errors?.length)throw fail('Some associations could not be created. Review the saved backup and run results before retrying.');
      this.log({created:this.job.created+batch.length},'Association creation batch completed.');
    }
    this.log({phase:'verifying'},'Verifying all resulting associations.');
    const expected=new Map();for(const pair of pairs){if(!expected.has(pair.from))expected.set(pair.from,[]);expected.get(pair.from).push(pair);}
    for(const source of plan.sourceIds){this.checkCancel();const actual=await this.readLinks(plan.objects.left.objectTypeId,plan.objects.right.objectTypeId,source),wanted=expected.get(source)||[];
      if(actual.length!==wanted.length||wanted.some(pair=>!actual.some(link=>link.to===pair.to&&(pair.types||plan.types).every(type=>link.types.some(found=>found.associationCategory===type.associationCategory&&found.associationTypeId===type.associationTypeId)))))throw fail('Final association verification failed. Review the results and saved backup.');
    }
  }
  report(plan,dryRun){
    const report=`associations-${this.job.id}.csv`,headers=['source_record_id','target_record_id','action','association_types'];
    const rows=[...plan.existing.map(pair=>[pair.from,pair.to,dryRun?'would_remove':'removed',JSON.stringify(pair.types)]),...plan.pairs.map(pair=>[pair.from,pair.to,dryRun?'would_create':'created',JSON.stringify(plan.types)])];
    fs.writeFileSync(path.join(this.rt.root,'reports',report),'\uFEFF'+[headers,...rows].map(row=>row.map(csv).join(',')).join('\r\n'),{mode:0o600});this.log({report});
  }
  async execute(dryRun,validationId){
    const plan=await this.plan();this.log({review:plan.summary,totalRemove:plan.existing.length,totalCreate:plan.pairs.length});
    if(plan.summary.issueCount)throw fail('Resolve the validation issues before running this replacement.');
    if(dryRun){this.workspace.validation={id:plan.fingerprint,summary:plan.summary};this.save();this.report(plan,true);this.log({phase:'completed',validationId:plan.fingerprint},'Dry preview complete. No HubSpot associations or record properties were changed.');return;}
    if(plan.fingerprint!==validationId)throw fail('Files, labels or existing relationships changed since validation. Validate again before replacing associations.');
    this.checkCancel();
    const snapshot={portalId:plan.objects.left.portalId,objects:plan.objects,sourceIds:plan.sourceIds,existing:plan.existing,createdAt:new Date().toISOString(),runId:this.job.id};
    const backup=`associations-backup-${this.job.id}.json`;
    fs.writeFileSync(path.join(this.rt.root,'reports',backup),JSON.stringify(snapshot,null,2),{mode:0o600,flag:'wx'});
    this.db.prepare('UPDATE association_jobs SET snapshot=? WHERE id=?').run(JSON.stringify(snapshot),this.job.id);
    this.workspace.lastReplacementId=this.job.id;this.workspace.validation=null;this.save();this.log({backup},'Original associations backed up before any removals.');
    await this.archive(plan);await this.create(plan,plan.pairs);this.report(plan,false);this.log({phase:'completed'},'Association replacement completed and verified. No records or properties were uploaded.');
  }
  async restore(id){
    const row=this.db.prepare('SELECT snapshot FROM association_jobs WHERE id=?').get(id);if(!row?.snapshot)throw fail('No saved backup was found for this run.');
    const snapshot=JSON.parse(row.snapshot),identity=await this.rt.hubspot.portal.identity();
    if(String(identity.portalId)!==snapshot.portalId)throw fail('The backup belongs to another portal. Restore is blocked.');
    const targets=[...new Set(snapshot.existing.map(pair=>pair.to))];
    for(const [type,ids]of [[snapshot.objects.left.objectTypeId,snapshot.sourceIds],[snapshot.objects.right.objectTypeId,targets]])if((await this.verifyIds(type,ids)).length)throw fail('Some backup records no longer exist. Restore is blocked before any removals.');
    const existing=[];for(const id of snapshot.sourceIds)existing.push(...await this.readLinks(snapshot.objects.left.objectTypeId,snapshot.objects.right.objectTypeId,id));
    const plan={objects:snapshot.objects,sourceIds:snapshot.sourceIds,existing,types:[],pairs:snapshot.existing};
    this.log({totalRemove:existing.length,totalCreate:snapshot.existing.length},'Restoring the saved source-record association snapshot.');
    await this.archive(plan);await this.create(plan,snapshot.existing);this.log({phase:'restored'},'Original associations restored and verified.');
  }
}
