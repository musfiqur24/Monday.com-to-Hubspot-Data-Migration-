import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { readHubspotWorkbook } from './hubspotWorkbook.js';
import { fail, safeError } from '../lib/sanitize.js';
import { objectTypeId } from './hubspotPortal.js';

const objectType = z.string().regex(/^(?:[02]-\d+|contacts|companies|deals|tickets)$/);
export const importSchema = z.object({
  objectType, identifierColumn:z.string().min(1), idProperty:z.string().regex(/^[a-z][a-z0-9_]*$/),
  mapping:z.record(z.string()),
  associations:z.array(z.object({objectType,column:z.string().min(1),typeId:z.number().int().nonnegative().nullable().default(null)})).max(10).default([]),
}).strict();
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const enc = encodeURIComponent;
const csv = value => { let text=String(value??''); if(/^[=+@\-\t\r\n]/.test(text)) text="'"+text; return '"'+text.replaceAll('"','""')+'"'; };

export function propertyValue(raw, property) {
  const value=String(raw).trim();
  if (property.type === 'number' && !Number.isFinite(Number(value))) throw fail('Expected a numeric value.');
  if (property.type === 'bool') {
    if (!/^(true|false|1|0|yes|no)$/i.test(value)) throw fail('Expected true or false.');
    return /^(true|1|yes)$/i.test(value) ? 'true':'false';
  }
  if (['date','datetime'].includes(property.type)) {
    if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value) || Number.isNaN(Date.parse(value))) throw fail('Use an ISO date: YYYY-MM-DD.');
    const date=new Date(value);
    if(/^\d{4}-\d{2}-\d{2}$/.test(value)&&date.toISOString().slice(0,10)!==value)throw fail('Use a valid calendar date.');
    return String(property.type==='date' ? Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()) : date.getTime());
  }
  if (property.type === 'enumeration') {
    const allowed=new Set((property.options||[]).filter(option=>!option.hidden).map(option=>option.value));
    if(value.split(';').some(option=>!allowed.has(option))) throw fail('Use the property option internal value; separate multiple values with semicolons.');
  }
  return value;
}

export class HubspotImport {
  constructor(rt) {
    this.rt=rt; this.db=rt.state.db; this.sessions=new Map(); this.jobs=new Map();
    this.db.exec(`CREATE TABLE IF NOT EXISTS hubspot_sessions(mode TEXT PRIMARY KEY, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS hubspot_records(key TEXT PRIMARY KEY, account TEXT, object_type TEXT, record_id TEXT, status TEXT, completed_at TEXT);
      CREATE TABLE IF NOT EXISTS hubspot_jobs(mode TEXT PRIMARY KEY, data TEXT NOT NULL);`);
    for(const row of this.db.prepare('SELECT * FROM hubspot_sessions').all()) this.sessions.set(row.mode,JSON.parse(row.data));
    for(const row of this.db.prepare('SELECT * FROM hubspot_jobs').all()) {
      const job=JSON.parse(row.data);
      if(job.running) { job.running=false; job.phase='interrupted'; job.error='The server stopped. Run again to resume saved records.'; }
      this.jobs.set(row.mode,job);
    }
  }
  get(mode) { return this.sessions.get(mode) || null; }
  save(mode, data) {
    this.sessions.set(mode,data);
    this.db.prepare('INSERT OR REPLACE INTO hubspot_sessions VALUES (?,?)').run(mode,JSON.stringify(data));
  }
  status(mode) { return this.jobs.get(mode)||{running:false,phase:'idle',total:0,completed:0,succeeded:0,failed:0,skipped:0,logs:[]}; }
  progress(mode, values, message) {
    const job=this.status(mode); Object.assign(job,values);
    if(message) job.logs=[...(job.logs||[]),{timestamp:new Date().toISOString(),message}].slice(-100);
    this.jobs.set(mode,job);
    this.db.prepare('INSERT OR REPLACE INTO hubspot_jobs VALUES (?,?)').run(mode,JSON.stringify(job));
    return job;
  }
  busy() { return [...this.jobs.values()].some(job=>job.running); }
  requireToken() { if(!this.rt.config.hubspotToken) throw fail('Configure HUBSPOT_PRIVATE_APP_TOKEN in .env and restart.'); }
  async properties(type) {
    this.requireToken();
    const selected=await this.rt.hubspot.portal.object(type), properties=[];
    let after;
    do {
      const result=await this.rt.hubspot.request(`/crm/properties/2026-09/${enc(selected.objectTypeId)}${after?`?after=${enc(after)}`:''}`);
      properties.push(...(result.results||[]));after=result.paging?.next?.after;
    } while(after);
    return properties.filter(property=>!property.archived).map(({name,label,type,fieldType,options,hasUniqueValue,modificationMetadata,calculated,externalOptions})=>({name,label,type,fieldType,options,hasUniqueValue,modificationMetadata,calculated,externalOptions}));
  }
  async labels(from,to) {
    this.requireToken();
    const [source,target]=await Promise.all([this.rt.hubspot.portal.object(from),this.rt.hubspot.portal.object(to)]);
    return (await this.rt.hubspot.request(`/crm/associations/2026-09/${enc(source.objectTypeId)}/${enc(target.objectTypeId)}/labels`)).results||[];
  }
  async selectObject(mode,type) {
    const selectedObject=await this.rt.hubspot.portal.object(type), prior=this.get(mode)||{};
    const same=prior.selectedObject?.objectTypeId===selectedObject.objectTypeId&&prior.selectedObject?.portalId===selectedObject.portalId;
    if(!same){this.jobs.delete(mode);this.db.prepare('DELETE FROM hubspot_jobs WHERE mode=?').run(mode);}
    this.save(mode,{...prior,selectedObject,config:same?prior.config:null});
    return selectedObject;
  }
  async workbook(mode,file,extension,filename,sheet) {
    const parsed=await readHubspotWorkbook(file,extension,sheet);
    const selectedObject=this.get(mode)?.selectedObject;
    if(!selectedObject)throw fail('Select a destination object before uploading your workbook.');
    this.save(mode,{file,extension,filename,summary:parsed.summary,config:null,selectedObject});
    this.jobs.delete(mode);
    this.db.prepare('DELETE FROM hubspot_jobs WHERE mode=?').run(mode);
    return this.get(mode);
  }
  async configure(mode, input) {
    const parsed=importSchema.safeParse(input);
    if(!parsed.success) throw fail('Choose an object, record identifier column, matching property and valid association settings.');
    const config=parsed.data;
    const selectedObject=await this.rt.hubspot.portal.object(config.objectType);
    config.objectType=selectedObject.objectTypeId;
    for(const association of config.associations)association.objectType=(await this.rt.hubspot.portal.object(association.objectType)).objectTypeId;
    if(mode==='data-migrate' && config.associations.length) throw fail('Use Data Migrate with Association to configure relationships.');
    if(mode==='data-migrate-association' && !config.associations.length) throw fail('Configure at least one association.');
    const session=this.get(mode); if(!session?.file) throw fail('Choose a workbook first.');
    if(session.selectedObject?.objectTypeId!==selectedObject.objectTypeId||session.selectedObject?.portalId!==selectedObject.portalId)throw fail('The selected object or portal changed. Select it again and remap your columns.');
    this.save(mode,{...session,selectedObject,config}); return config;
  }
  async plan(mode) {
    this.requireToken();
    const session=this.get(mode);
    if(!session?.config) throw fail('Save column mappings first.');
    const config=importSchema.parse(session.config);
    config.objectType=objectTypeId(config.objectType);
    const selected=await this.rt.hubspot.portal.object(config.objectType);
    if(session.selectedObject?.portalId!==selected.portalId)throw fail('The saved workbook belongs to a different portal. Select the object and remap this workbook for the configured portal.');
    for(const association of config.associations)association.objectType=objectTypeId(association.objectType);
    const workbook=await readHubspotWorkbook(session.file,session.extension,session.summary.sheet);
    const properties=await this.properties(config.objectType), byName=new Map(properties.map(property=>[property.name,property]));
    const issues=[]; let issueCount=0;
    const issue=(row,message)=>{issueCount++;if(issues.length<100)issues.push({row,message});};
    if(!workbook.columns.includes(config.identifierColumn)) issue(null,'Select a valid record identifier column.');
    const identifier=byName.get(config.idProperty);
    if(config.idProperty!=='hs_object_id' && !(config.objectType==='0-1'&&config.idProperty==='email') && !identifier?.hasUniqueValue) issue(null,'Matching requires Record ID, contact email, or a HubSpot property with unique values.');
    const mappings=Object.entries(config.mapping).filter(([,property])=>property);
    const targets=new Set();
    for(const [column,target] of mappings) {
      const property=byName.get(target);
      if(!workbook.columns.includes(column)) issue(null,'A mapped column is missing from the workbook.');
      if(!property || property.calculated || property.modificationMetadata?.readOnlyValue || property.externalOptions || target==='hs_object_id') issue(null,`Destination property ${target} is unavailable or read-only.`);
      if(targets.has(target)) issue(null,`Destination property ${target} is mapped more than once.`);
      targets.add(target);
    }
    if(!mappings.length) issue(null,'Map at least one writable destination property.');
    for(const association of config.associations) {
      if(!workbook.columns.includes(association.column)) issue(null,'Select an association record-ID column.');
      const labels=await this.labels(config.objectType,association.objectType);
      if(!labels.some(label=>association.typeId===null ? label.label===null : label.typeId===association.typeId)) issue(null,'The selected association type is not available for these objects.');
      association.definition=labels.find(label=>association.typeId===null?label.label===null:label.typeId===association.typeId);
    }
    const records=new Map(), related=new Set(), account=hash(this.rt.config.hubspotToken);
    for(const row of workbook.rows) {
      let id=row.values[config.identifierColumn]?.trim();
      if(config.objectType==='0-1' && config.idProperty==='email') id=id?.toLowerCase();
      if(!id) {issue(row.number,'Record identifier is empty.');continue;}
      if(config.idProperty==='hs_object_id'&&!/^\d+$/.test(id)) issue(row.number,'Record ID must be numeric.');
      if(config.idProperty==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) issue(row.number,'Email identifier is invalid.');
      const values=Object.create(null);
      for(const [column,target] of mappings) {
        const raw=row.values[column]; if(!raw || !byName.has(target)) continue;
        try {values[target]=propertyValue(raw,byName.get(target));} catch(error) {issue(row.number,`${column}: ${safeError(error)}`);}
      }
      if(config.idProperty!=='hs_object_id') {
        if(config.objectType==='0-1'&&config.idProperty==='email'&&values.email)values.email=values.email.toLowerCase().trim();
        if(values[config.idProperty] && values[config.idProperty]!==id) issue(row.number,'Mapped identifier differs from the selected match column.');
        values[config.idProperty]=id;
      }
      const links=[];
      for(const association of config.associations) {
        const ids=[...new Set((row.values[association.column]||'').split(/[;,]/).map(value=>value.trim()).filter(Boolean))];
        if(!ids.length) issue(row.number,'Association record ID is empty.');
        for(const targetId of ids) {
          if(!/^\d+$/.test(targetId)) {issue(row.number,'Association IDs must be numeric destination HubSpot record IDs.');continue;}
          related.add(`${association.objectType}/${targetId}`);
          links.push({objectType:association.objectType,id:targetId,definition:association.definition});
        }
      }
      const previous=records.get(id);
      if(previous) {
        for(const [key,value] of Object.entries(values)) if(previous.properties[key] && previous.properties[key]!==value) issue(row.number,'Duplicate record identifier has conflicting property values.');
        Object.assign(previous.properties,values);previous.links.push(...links);previous.rows.push(row.number);
      } else records.set(id,{id,properties:values,links,rows:[row.number]});
    }
    if(issueCount) return {config,records:[],summary:{rows:workbook.rows.length,records:records.size,associations:0,existing:0,creating:0,issueCount,issues}};
    let existing=0, creating=0;
    for(const record of records.values()) {
      try {
        const found=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(config.objectType)}/${enc(record.id)}${config.idProperty==='hs_object_id'?'':`?idProperty=${enc(config.idProperty)}`}`);
        record.remoteId=String(found.id);existing++;
      } catch(error) {
        if(error.status!==404) throw error;
        if(config.idProperty==='hs_object_id') issue(record.rows[0],'Destination Record ID was not found.');
        else creating++;
      }
    }
    const required=[...new Set([...(selected.requiredProperties||[]),...(config.objectType==='0-3'?['dealname','dealstage','pipeline']:config.objectType==='0-5'?['subject','hs_pipeline','hs_pipeline_stage']:[])])];
    if(config.objectType.startsWith('2-') && creating) {
      const schema=await this.rt.hubspot.request(`/crm-object-schemas/2026-09/schemas/${enc(config.objectType)}`);
      required.push(...(schema.requiredProperties||[]));
    }
    for(const record of records.values()) if(!record.remoteId) for(const name of required) if(!record.properties[name]) issue(record.rows[0],`New records require ${name}.`);
    for(const value of related) {
      try {await this.rt.hubspot.request(`/crm/objects/2026-09/${value}`);}
      catch(error) {if(error.status!==404)throw error;issue(null,'An associated destination record was not found.');}
    }
    let associations=0;
    for(const record of records.values()) {
      record.links=[...new Map(record.links.map(link=>[JSON.stringify(link),link])).values()];associations+=record.links.length;
      record.key=hash([account,config.objectType,config.idProperty,record.id,record.properties,record.links]);
    }
    return {config,account,definitions:byName,records:[...records.values()],summary:{rows:workbook.rows.length,records:records.size,associations,existing,creating,issueCount,issues}};
  }
  async verifyRecord(config,id,properties,definitions=new Map()) {
    const remote=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(config.objectType)}/${enc(id)}?properties=${enc(Object.keys(properties).join(','))}`);
    for(const [key,value] of Object.entries(properties)) {
      const propertyValue=String(remote.properties?.[key]??'');
      const definition=definitions.get(key);
      const same=propertyValue===String(value)
        || (definition?.type==='number'&&propertyValue!==''&&Number(propertyValue)===Number(value))
        || (['date','datetime'].includes(definition?.type)&&/^\d{4}-\d{2}-\d{2}(T|$)/.test(propertyValue)&&String(Date.parse(propertyValue))===String(value))
        || (definition?.fieldType==='checkbox'&&propertyValue.split(';').sort().join(';')===String(value).split(';').sort().join(';'));
      if(!same) throw fail(`Read-back verification failed for ${key}.`);
    }
  }
  start(mode, dryRun) {
    if(this.busy()||this.rt.migration.status.running) throw fail('Another migration is running.');
    const lock=path.join(this.rt.root,'state/run.lock'); let fd;
    try {fd=fs.openSync(lock,'wx',0o600);fs.writeFileSync(fd,String(process.pid));}
    catch {throw fail('Another process holds the migration lock. See README for crash recovery.');}
    const job={running:true,phase:'validating',dryRun,total:0,completed:0,succeeded:0,failed:0,skipped:0,logs:[],error:null,review:null,report:null,finishedAt:null,cancelRequested:false,runId:randomUUID(),startedAt:new Date().toISOString()};
    this.progress(mode,job,'Checking workbook, destination properties and record IDs.');
    const done=this.execute(mode,dryRun).catch(error=>this.progress(mode,{phase:'failed',error:safeError(error)},safeError(error))).finally(()=>{
      fs.closeSync(fd);fs.unlinkSync(lock);this.progress(mode,{running:false});
    });
    return {job,done};
  }
  async execute(mode,dryRun) {
    const plan=await this.plan(mode);
    if(plan.summary.issueCount) {this.progress(mode,{phase:'blocked',review:plan.summary,error:'Resolve validation issues before running.'},'Validation blocked this run.');return;}
    this.progress(mode,{phase:dryRun?'previewing':'migrating',total:plan.records.length,review:plan.summary});
    const outcomes=[];
    const save=this.db.prepare('INSERT INTO hubspot_records(key,account,object_type,record_id,status,completed_at) VALUES(?,?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET record_id=excluded.record_id,status=excluded.status,completed_at=COALESCE(hubspot_records.completed_at,excluded.completed_at)');
    for(const record of plan.records) {
      if(this.status(mode).cancelRequested) break;
      let id=record.remoteId, status='preview', error='';
      try {
        if(!dryRun) {
          const previous=this.db.prepare('SELECT * FROM hubspot_records WHERE key=?').get(record.key);
          id=previous?.record_id||id;
          // Re-read before skipping: an external property edit must not be hidden.
          let unchanged=false;
          if(previous?.status==='completed') {try {await this.verifyRecord(plan.config,id,record.properties,plan.definitions);unchanged=true;} catch { /* Reapply the intended values. */ }}
          if(!unchanged) {
            if(plan.config.idProperty==='hs_object_id') {
              const result=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(plan.config.objectType)}/${enc(record.id)}`,{method:'PATCH',body:{properties:record.properties}});id=String(result.id);
            } else {
              const result=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(plan.config.objectType)}/batch/upsert`,{method:'POST',body:{inputs:[{idProperty:plan.config.idProperty,id:record.id,properties:record.properties}]}});
              if(result.errors?.length||!result.results?.[0]?.id) throw fail('HubSpot did not confirm the record write. Retry this row after reviewing its properties.');
              id=String(result.results[0].id);
            }
            save.run(record.key,plan.account,plan.config.objectType,id,'written',null);
          }
          await this.verifyRecord(plan.config,id,record.properties,plan.definitions);
          for(const link of record.links) {
            const definition=link.definition;
            await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(plan.config.objectType)}/${enc(id)}/associations/${enc(link.objectType)}/${enc(link.id)}`,{method:'PUT',body:[{associationCategory:definition.category,associationTypeId:definition.typeId}]});
            // Paginate reads: a record may already have more than one page of links.
            let after, found=false;
            do {
              const result=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(plan.config.objectType)}/${enc(id)}/associations/${enc(link.objectType)}?limit=500${after?`&after=${enc(after)}`:''}`);
              found=(result.results||[]).some(item=>String(item.toObjectId)===link.id && item.associationTypes?.some(type=>type.typeId===definition.typeId&&type.category===definition.category));
              after=result.paging?.next?.after;
            } while(!found&&after);
            if(!found) throw fail('Association read-back verification failed. Run again to retry the saved record.');
          }
          save.run(record.key,plan.account,plan.config.objectType,id,'completed',unchanged ? previous.completed_at : new Date().toISOString());
          status=unchanged?'skipped':'completed';
        }
      } catch(problem) {error=safeError(problem);status='failed';if(!dryRun)save.run(record.key,plan.account,plan.config.objectType,id||null,'failed',null);}
      outcomes.push({rows:record.rows.join(';'),object:plan.config.objectType,record_id:id||'',status,associations:record.links.length,error});
      const job=this.status(mode);
      this.progress(mode,{completed:job.completed+1,succeeded:job.succeeded+(['completed','preview'].includes(status)?1:0),failed:job.failed+(status==='failed'?1:0),skipped:job.skipped+(status==='skipped'?1:0)},`Record ${job.completed+1} of ${job.total}: ${status}.${error?' '+error:''}`);
    }
    const job=this.status(mode), report=`hubspot-${mode}-${job.runId}.csv`;
    const headers=['rows','object','record_id','status','associations','error'];
    fs.writeFileSync(path.join(this.rt.root,'reports',report),'\uFEFF'+[headers,...outcomes.map(row=>headers.map(key=>row[key]))].map(row=>row.map(csv).join(',')).join('\r\n'),{mode:0o600});
    this.progress(mode,{phase:job.cancelRequested?'cancelled':job.failed?'completed_with_errors':'completed',report,finishedAt:new Date().toISOString()},job.cancelRequested?'Run stopped; saved records can be resumed.':dryRun?'Dry preview complete. No HubSpot changes were made.':'Migration finished. Download the report for row outcomes.');
  }
}
