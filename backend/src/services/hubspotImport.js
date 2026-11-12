import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import pLimit from 'p-limit';
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
    const lockPath=path.join(rt.root,'state/run.lock');
    // Auto-recover stale lock left by a killed process
    try {
      const pid=Number(fs.readFileSync(lockPath,'utf8').trim());
      let alive=false;
      try { process.kill(pid,0); alive=true; } catch { /* dead */ }
      if(!alive) { try{fs.unlinkSync(lockPath);}catch{} console.log('[info] Removed stale migration lock (PID',pid,'is dead)'); }
    } catch { /* lock file doesn't exist — normal */ }
    for(const row of this.db.prepare('SELECT * FROM hubspot_jobs').all()) {
      const job=JSON.parse(row.data);
      if(job.running) {
        job.running=false; job.phase='interrupted'; job.error='The server stopped. Run again to resume saved records.';
        // Persist the interrupted state so the next restart sees it correctly
        this.db.prepare('INSERT OR REPLACE INTO hubspot_jobs VALUES (?,?)').run(row.mode,JSON.stringify(job));
      }
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
  async plan(mode, { allIssues = false } = {}) {
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
    const issue=(row,message,column='',value='',identifier='')=>{
      issueCount++;
      if(allIssues||issues.length<100)issues.push({row,message,column,value,identifier});
    };
    if(!workbook.columns.includes(config.identifierColumn)) issue(null,'Select a valid record identifier column.',config.identifierColumn);
    const identifier=byName.get(config.idProperty);
    if(config.idProperty!=='hs_object_id' && !(config.objectType==='0-1'&&config.idProperty==='email') && !identifier?.hasUniqueValue) issue(null,'Matching requires Record ID, contact email, or a HubSpot property with unique values.',config.identifierColumn);
    const mappings=Object.entries(config.mapping).filter(([,property])=>property);
    const targets=new Set();
    for(const [column,target] of mappings) {
      const property=byName.get(target);
      if(!workbook.columns.includes(column)) issue(null,'A mapped column is missing from the workbook.',column);
      if(!property || property.calculated || property.modificationMetadata?.readOnlyValue || property.externalOptions || target==='hs_object_id') issue(null,`Destination property ${target} is unavailable or read-only.`,column);
      if(targets.has(target)) issue(null,`Destination property ${target} is mapped more than once.`,column);
      targets.add(target);
    }
    if(!mappings.length) issue(null,'Map at least one writable destination property.');
    for(const association of config.associations) {
      if(!workbook.columns.includes(association.column)) issue(null,'Select an association record-ID column.',association.column);
      const labels=await this.labels(config.objectType,association.objectType);
      if(!labels.some(label=>association.typeId===null ? label.label===null : label.typeId===association.typeId)) issue(null,'The selected association type is not available for these objects.',association.column);
      association.definition=labels.find(label=>association.typeId===null?label.label===null:label.typeId===association.typeId);
    }
    const records=new Map(), related=new Set(), account=hash(this.rt.config.hubspotToken);
    for(const row of workbook.rows) {
      let id=row.values[config.identifierColumn]?.trim();
      if(config.objectType==='0-1' && config.idProperty==='email') id=id?.toLowerCase();
      if(!id) {issue(row.number,'Record identifier is empty.',config.identifierColumn,'','');continue;}
      if(config.idProperty==='hs_object_id'&&!/^\d+$/.test(id)) issue(row.number,'Record ID must be numeric.',config.identifierColumn,id,id);
      if(config.idProperty==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) issue(row.number,'Email identifier is invalid.',config.identifierColumn,id,id);
      const values=Object.create(null);
      for(const [column,target] of mappings) {
        const raw=row.values[column]; if(!raw || !byName.has(target)) continue;
        try {values[target]=propertyValue(raw,byName.get(target));} catch(error) {issue(row.number,`${column}: ${safeError(error)}`,column,raw,id);}
      }
      if(config.idProperty!=='hs_object_id') {
        if(config.objectType==='0-1'&&config.idProperty==='email'&&values.email)values.email=values.email.toLowerCase().trim();
        if(values[config.idProperty] && values[config.idProperty]!==id) issue(row.number,'Mapped identifier differs from the selected match column.',config.identifierColumn,values[config.idProperty],id);
        values[config.idProperty]=id;
      }
      const links=[];
      for(const association of config.associations) {
        const ids=[...new Set((row.values[association.column]||'').split(/[;,]/).map(value=>value.trim()).filter(Boolean))];
        if(!ids.length) issue(row.number,'Association record ID is empty.',association.column,'',id);
        for(const targetId of ids) {
          if(!/^\d+$/.test(targetId)) {issue(row.number,'Association IDs must be numeric destination HubSpot record IDs.',association.column,targetId,id);continue;}
          related.add(`${association.objectType}/${targetId}`);
          links.push({objectType:association.objectType,id:targetId,definition:association.definition});
        }
      }
      const previous=records.get(id);
      if(previous) {
        for(const [key,value] of Object.entries(values)) if(previous.properties[key] && previous.properties[key]!==value) issue(row.number,'Duplicate record identifier has conflicting property values.',config.identifierColumn,value,id);
        Object.assign(previous.properties,values);previous.links.push(...links);previous.rows.push(row.number);
      } else records.set(id,{id,properties:values,links,rows:[row.number]});
    }
    if(issueCount) return {config,records:[],summary:{rows:workbook.rows.length,records:records.size,associations:0,existing:0,creating:0,issueCount,issues}};
    let existing=0, creating=0;
    const recordList=[...records.values()];

    // Quick portal probe: if destination portal currently has 0 records of this object type,
    // skip hundreds of redundant network roundtrips.
    let portalHasRecords=true;
    try {
      const probe=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(config.objectType)}?limit=1`,{silent:true});
      if(!probe.results||probe.results.length===0) portalHasRecords=false;
    } catch { portalHasRecords=true; }

    if(!portalHasRecords) {
      if(config.idProperty==='hs_object_id') {
        for(const record of recordList) {
          issue(record.rows[0],'Destination Record ID was not found.',config.identifierColumn,record.id,record.id);
        }
      } else {
        creating=recordList.length;
      }
    } else {
      const chunks=[];
      for(let i=0; i<recordList.length; i+=100) {
        chunks.push(recordList.slice(i, i+100));
      }
      // High-performance asynchronous parallel processing pool (10 concurrent workers)
      const limit=pLimit(10);
      const chunkResults=await Promise.all(chunks.map(chunk=>limit(async()=>{
        let localExisting=0, localCreating=0;
        try {
          const body={
            inputs:chunk.map(r=>({id:r.id})),
            properties:[config.idProperty==='hs_object_id'?'hs_object_id':config.idProperty]
          };
          if(config.idProperty!=='hs_object_id') body.idProperty=config.idProperty;
          const res=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(config.objectType)}/batch/read`,{
            method:'POST',
            body,
            silent:true
          });
          const foundMap=new Map();
          for(const item of res?.results||[]) {
            const matchKey=config.idProperty==='hs_object_id' ? String(item.id) : String(item.properties?.[config.idProperty]||'').toLowerCase();
            foundMap.set(matchKey,String(item.id));
          }
          for(const record of chunk) {
            const lookupKey=config.idProperty==='hs_object_id' ? record.id : record.id.toLowerCase();
            const remoteId=foundMap.get(lookupKey);
            if(remoteId) {
              record.remoteId=remoteId;
              localExisting++;
            } else {
              if(config.idProperty==='hs_object_id') {
                issue(record.rows[0],'Destination Record ID was not found.',config.identifierColumn,record.id,record.id);
              } else {
                localCreating++;
              }
            }
          }
        } catch(batchErr) {
          for(const record of chunk) {
            try {
              const found=await this.rt.hubspot.request(`/crm/objects/2026-09/${enc(config.objectType)}/${enc(record.id)}${config.idProperty==='hs_object_id'?'':`?idProperty=${enc(config.idProperty)}`}`,{silent:true});
              record.remoteId=String(found.id);
              localExisting++;
            } catch(err) {
              if(err.status!==404) throw err;
              if(config.idProperty==='hs_object_id') issue(record.rows[0],'Destination Record ID was not found.',config.identifierColumn,record.id,record.id);
              else localCreating++;
            }
          }
        }
        return {existing:localExisting, creating:localCreating};
      })));
      for(const r of chunkResults) {
        existing+=r.existing;
        creating+=r.creating;
      }
    }
    const required=[...new Set([...(selected.requiredProperties||[]),...(config.objectType==='0-3'?['dealname','dealstage','pipeline']:config.objectType==='0-5'?['subject','hs_pipeline','hs_pipeline_stage']:[])])];
    if(config.objectType.startsWith('2-') && creating) {
      const schema=await this.rt.hubspot.request(`/crm-object-schemas/2026-09/schemas/${enc(config.objectType)}`);
      required.push(...(schema.requiredProperties||[]));
    }
    for(const record of records.values()) if(!record.remoteId) for(const name of required) if(!record.properties[name]) issue(record.rows[0],`New records require ${name}.`,'','',record.id);
    for(const value of related) {
      try {await this.rt.hubspot.request(`/crm/objects/2026-09/${value}`,{silent:true});}
      catch(error) {if(error.status!==404)throw error;issue(null,'An associated destination record was not found.','',value);}
    }
    let associations=0;
    for(const record of records.values()) {
      record.links=[...new Map(record.links.map(link=>[JSON.stringify(link),link])).values()];associations+=record.links.length;
      record.key=hash([account,config.objectType,config.idProperty,record.id,record.properties,record.links]);
    }
    return {config,account,definitions:byName,records:[...records.values()],summary:{rows:workbook.rows.length,records:records.size,associations,existing,creating,issueCount,issues}};
  }
  async issuesCsv(mode) {
    const session=this.sessions.get(mode);
    if(!session)throw fail('Choose a workbook first.');
    if(!session.config)throw fail('Map columns and record matching before downloading issues.');
    const plan=await this.plan(mode,{allIssues:true});
    const issues=plan.summary.issues||[];
    const headers=['Row','Identifier','Column','Value','Error'];
    const lines=[
      headers.map(csv).join(','),
      ...issues.map(iss=>[iss.row??'',iss.identifier??'',iss.column??'',iss.value??'',iss.message??''].map(csv).join(','))
    ];
    const baseName=(session.filename||mode).replace(/\.[^/.]+$/,'');
    const filename=`validation-issues-${baseName}.csv`;
    return {
      filename,
      content:'\uFEFF'+lines.join('\r\n'),
      count:plan.summary.issueCount
    };
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
  reset(mode) {
    const lock=path.join(this.rt.root,'state/run.lock');
    try { fs.unlinkSync(lock); } catch {}
    const job={running:false,phase:'idle',dryRun:true,total:0,completed:0,succeeded:0,failed:0,skipped:0,logs:[],error:null,review:null,report:null,finishedAt:null,cancelRequested:false,runId:null,startedAt:null};
    this.jobs.set(mode,job);
    this.db.prepare('INSERT OR REPLACE INTO hubspot_jobs VALUES (?,?)').run(mode,JSON.stringify(job));
    return job;
  }
  start(mode, dryRun) {
    const lock=path.join(this.rt.root,'state/run.lock');
    // If run.lock doesn't exist on disk, no process actually holds it. Clear any stuck running job in-memory.
    if(!fs.existsSync(lock)) {
      for(const [m, j] of this.jobs.entries()) {
        if(j.running) {
          j.running = false;
          if(j.phase === 'validating' || j.phase === 'previewing' || j.phase === 'migrating') {
            j.phase = 'interrupted';
          }
          this.db.prepare('INSERT OR REPLACE INTO hubspot_jobs VALUES (?,?)').run(m, JSON.stringify(j));
        }
      }
    }
    if(this.busy()||this.rt.migration.status.running) throw fail('Another migration is running.');

    let fd;
    try {
      fd=fs.openSync(lock,'wx',0o600);
      fs.writeFileSync(fd,String(process.pid));
    } catch {
      // Check if existing lock is stale (PID dead or same process)
      let isStale = false;
      try {
        const existingPid = Number(fs.readFileSync(lock,'utf8').trim());
        if (!existingPid || existingPid === process.pid) {
          isStale = true;
        } else {
          try { process.kill(existingPid, 0); } catch { isStale = true; }
        }
      } catch {
        isStale = true;
      }
      if (isStale) {
        try { fs.unlinkSync(lock); } catch {}
        try {
          fd=fs.openSync(lock,'wx',0o600);
          fs.writeFileSync(fd,String(process.pid));
        } catch {
          throw fail('Another process holds the migration lock. See README for crash recovery.');
        }
      } else {
        throw fail('Another process holds the migration lock. See README for crash recovery.');
      }
    }

    const job={running:true,phase:'validating',dryRun,total:0,completed:0,succeeded:0,failed:0,skipped:0,logs:[],error:null,review:null,report:null,finishedAt:null,cancelRequested:false,runId:randomUUID(),startedAt:new Date().toISOString()};
    this.progress(mode,job,'Checking workbook, destination properties and record IDs.');
    const done=this.execute(mode,dryRun).catch(error=>this.progress(mode,{phase:'failed',error:safeError(error)},safeError(error))).finally(()=>{
      try { if (fd !== undefined) fs.closeSync(fd); } catch {}
      try { fs.unlinkSync(lock); } catch {}
      this.progress(mode,{running:false});
    });
    return {job,done};
  }
  async execute(mode,dryRun) {
    const plan=await this.plan(mode);
    if(plan.summary.issueCount) {
      this.progress(mode,{phase:'blocked',review:plan.summary,error:`Validation found ${plan.summary.issueCount} issue(s). Resolve them before running.`},'Validation blocked this run.');
      return;
    }
    this.progress(mode,{phase:dryRun?'previewing':'migrating',total:plan.records.length,review:plan.summary}, dryRun ? `Starting dry preview for ${plan.records.length.toLocaleString()} records...` : `Starting migration for ${plan.records.length.toLocaleString()} records...`);
    const outcomes=[];
    const save=this.db.prepare('INSERT INTO hubspot_records(key,account,object_type,record_id,status,completed_at) VALUES(?,?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET record_id=excluded.record_id,status=excluded.status,completed_at=COALESCE(hubspot_records.completed_at,excluded.completed_at)');

    if (dryRun) {
      const total = plan.records.length;
      const step = Math.max(1, Math.floor(total / 20));
      for (let i = 0; i < total; i++) {
        if (this.status(mode).cancelRequested) break;
        const record = plan.records[i];
        outcomes.push({
          rows: record.rows.join(';'),
          object: plan.config.objectType,
          record_id: record.remoteId || '',
          status: 'preview',
          associations: record.links.length,
          error: ''
        });
        if (i % step === 0 || i === total - 1) {
          const completed = i + 1;
          this.progress(mode, {
            completed,
            succeeded: completed,
            failed: 0,
            skipped: 0
          }, `Previewed ${completed.toLocaleString()} of ${total.toLocaleString()} records`);
        }
      }
    } else {
      const BATCH_SIZE = 100;
      const records = plan.records;
      const total = records.length;
      const totalBatches = Math.ceil(total / BATCH_SIZE);
      const isRecordIdMatch = plan.config.idProperty === 'hs_object_id';
      const endpointPath = isRecordIdMatch
        ? `/crm/objects/2026-09/${enc(plan.config.objectType)}/batch/update`
        : `/crm/objects/2026-09/${enc(plan.config.objectType)}/batch/upsert`;

      const saveMany = this.db.transaction((items) => {
        for (const item of items) {
          save.run(item.key, item.account, item.objectType, item.recordId, item.status, item.completedAt);
        }
      });

      let totalProcessed = 0;
      let totalSucceeded = 0;
      let totalFailed = 0;
      let totalSkipped = 0;

      for (let b = 0; b < totalBatches; b++) {
        if (this.status(mode).cancelRequested) break;

        const batchRecords = records.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
        const dbItems = [];
        let batchSucceeded = 0;
        let batchFailed = 0;

        try {
          const inputs = batchRecords.map(record => {
            if (isRecordIdMatch) {
              return {
                id: record.id,
                properties: record.properties
              };
            }
            return {
              idProperty: plan.config.idProperty,
              id: record.id,
              properties: record.properties
            };
          });

          const res = await this.rt.hubspot.request(endpointPath, {
            method: 'POST',
            body: { inputs }
          });

          // Index returned results by match key
          const resultMap = new Map();
          for (const item of res?.results || []) {
            const key = isRecordIdMatch
              ? String(item.id)
              : String(item.properties?.[plan.config.idProperty] || '').toLowerCase().trim();
            resultMap.set(key, String(item.id));
          }

          // Index any errors for specific IDs
          const errorMap = new Map();
          for (const err of res?.errors || []) {
            const ids = err.context?.id || [];
            for (const errId of ids) {
              errorMap.set(String(errId).toLowerCase().trim(), err.message || 'HubSpot batch error');
            }
          }

          // Process batch associations if any
          const associationInputs = [];

          for (const record of batchRecords) {
            const lookupKey = isRecordIdMatch ? record.id : record.id.toLowerCase().trim();
            const remoteId = resultMap.get(lookupKey) || (isRecordIdMatch ? record.id : null);
            const specificError = errorMap.get(lookupKey);

            if (remoteId && !specificError) {
              record.remoteId = remoteId;
              batchSucceeded++;
              dbItems.push({
                key: record.key,
                account: plan.account,
                objectType: plan.config.objectType,
                recordId: remoteId,
                status: 'completed',
                completedAt: new Date().toISOString()
              });
              outcomes.push({
                rows: record.rows.join(';'),
                object: plan.config.objectType,
                record_id: remoteId,
                status: 'completed',
                associations: record.links.length,
                error: ''
              });

              if (record.links?.length) {
                for (const link of record.links) {
                  associationInputs.push({
                    fromId: remoteId,
                    toObjectType: link.objectType,
                    toId: link.id,
                    definition: link.definition
                  });
                }
              }
            } else {
              const errMsg = specificError || 'HubSpot did not return a confirmation ID for this record.';
              batchFailed++;
              dbItems.push({
                key: record.key,
                account: plan.account,
                objectType: plan.config.objectType,
                recordId: remoteId || null,
                status: 'failed',
                completedAt: null
              });
              outcomes.push({
                rows: record.rows.join(';'),
                object: plan.config.objectType,
                record_id: remoteId || '',
                status: 'failed',
                associations: record.links.length,
                error: errMsg
              });
            }
          }

          // Send associations in batch if any exist
          if (associationInputs.length > 0) {
            const byTargetObject = new Map();
            for (const assoc of associationInputs) {
              if (!byTargetObject.has(assoc.toObjectType)) byTargetObject.set(assoc.toObjectType, []);
              byTargetObject.get(assoc.toObjectType).push(assoc);
            }
            for (const [targetType, links] of byTargetObject) {
              for (let i = 0; i < links.length; i += 100) {
                const linkChunk = links.slice(i, i + 100);
                try {
                  await this.rt.hubspot.request(`/crm/associations/2026-09/${enc(plan.config.objectType)}/${enc(targetType)}/batch/create`, {
                    method: 'POST',
                    body: {
                      inputs: linkChunk.map(l => ({
                        from: { id: l.fromId },
                        to: { id: l.toId },
                        types: [{
                          associationCategory: l.definition?.category || 'HUBSPOT_DEFINED',
                          associationTypeId: l.definition?.typeId || 1
                        }]
                      }))
                    }
                  });
                } catch (assocErr) {
                  console.error('[warning] Batch association error:', assocErr.message);
                }
              }
            }
          }
        } catch (batchErr) {
          const errMsg = safeError(batchErr);
          batchFailed += batchRecords.length;
          for (const record of batchRecords) {
            dbItems.push({
              key: record.key,
              account: plan.account,
              objectType: plan.config.objectType,
              recordId: record.remoteId || null,
              status: 'failed',
              completedAt: null
            });
            outcomes.push({
              rows: record.rows.join(';'),
              object: plan.config.objectType,
              record_id: record.remoteId || '',
              status: 'failed',
              associations: record.links.length,
              error: errMsg
            });
          }

          // If the destination portal has reached its account tier / contact limit (HTTP 402), stop further batches
          if (batchErr.status === 402) {
            saveMany(dbItems);
            totalProcessed += batchRecords.length;
            totalFailed += batchFailed;
            this.progress(mode, {
              completed: totalProcessed,
              succeeded: totalSucceeded,
              failed: totalFailed,
              skipped: totalSkipped,
              error: errMsg
            }, `Batch ${b + 1} of ${totalBatches} halted: ${errMsg}`);
            break;
          }
        }

        saveMany(dbItems);
        totalProcessed += batchRecords.length;
        totalSucceeded += batchSucceeded;
        totalFailed += batchFailed;

        this.progress(mode, {
          completed: totalProcessed,
          succeeded: totalSucceeded,
          failed: totalFailed,
          skipped: totalSkipped
        }, `Batch ${b + 1} of ${totalBatches}: ${batchSucceeded} succeeded, ${batchFailed} failed (${totalProcessed.toLocaleString()} of ${total.toLocaleString()} processed)`);
      }
    }
    const job=this.status(mode), report=`hubspot-${mode}-${job.runId}.csv`;
    const headers=['rows','object','record_id','status','associations','error'];
    fs.writeFileSync(path.join(this.rt.root,'reports',report),'\uFEFF'+[headers,...outcomes.map(row=>headers.map(key=>row[key]))].map(row=>row.map(csv).join(',')).join('\r\n'),{mode:0o600});
    this.progress(mode,{phase:job.cancelRequested?'cancelled':job.failed?'completed_with_errors':'completed',report,finishedAt:new Date().toISOString()},job.cancelRequested?'Run stopped; saved records can be resumed.':dryRun?'Dry preview complete. No HubSpot changes were made.':'Migration finished. Download the report for row outcomes.');
  }
}
