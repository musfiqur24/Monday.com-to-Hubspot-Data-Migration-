import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { HubspotImport } from '../services/hubspotImport.js';
import { fail, safeError } from '../lib/sanitize.js';
import { associations } from './associations.js';
import { schemaRoutes } from './schema.js';

export function hubspotMigration(rt) {
  const router=Router(), service=new HubspotImport(rt);
  router.use('/associations',associations(rt,service));
  router.use('/schema',schemaRoutes(rt));
  const upload=multer({dest:path.join(rt.root,'tmp'),limits:{fileSize:50*1024**2,files:1,fields:0}});
  router.param('mode',(req,res,next,mode)=>{
    if(mode!=='data-migrate') return res.status(404).json({error:'Use the association-only workflow for association jobs.'});
    next();
  });
  const mutable=(req,res,next)=>{
    if(service.busy()||rt.associationReplacement?.busy()||rt.migration.status.running) return res.status(409).json({error:'A migration is running. Wait for it to finish before changing workbooks or mappings.'});
    next();
  };
  const sessionResponse=mode=>{
    const session=service.get(mode);
    return {workbook:session?.summary?{filename:session.filename,...session.summary}:null,selectedObject:session?.selectedObject||null,config:session?.config||null,status:service.status(mode),credentialsConfigured:Boolean(rt.config.hubspotToken&&rt.config.hubspotPortalId)};
  };
  router.get('/objects',async(req,res)=>res.json(await rt.hubspot.portal.objects({refresh:req.query.refresh==='true'})));
  router.get('/properties/:objectType',async(req,res)=>res.json(await service.properties(req.params.objectType)));
  router.get('/labels/:from/:to',async(req,res)=>res.json(await service.labels(req.params.from,req.params.to)));
  router.get('/:mode/state',(req,res)=>res.json(sessionResponse(req.params.mode)));
  router.get('/:mode/status',(req,res)=>res.json(service.status(req.params.mode)));
  router.put('/:mode/object',mutable,async(req,res)=>{
    if(typeof req.body?.objectTypeId!=='string')throw fail('Choose a destination object from the portal list.');
    await service.selectObject(req.params.mode,req.body.objectTypeId);
    res.json(sessionResponse(req.params.mode));
  });
  router.post('/:mode/workbook',mutable,upload.single('file'),async(req,res)=>{
    if(!req.file) throw fail('Choose a CSV or XLSX workbook.');
    let destination;
    try {
      if(service.busy()||rt.migration.status.running) throw fail('A migration started during upload. Try again when it finishes.');
      const extension=path.extname(req.file.originalname).toLowerCase();
      if(!['.csv','.xlsx'].includes(extension)) throw fail('Only CSV and XLSX files are supported.');
      destination=path.join(rt.root,'data',`hubspot-${randomUUID()}${extension}`);
      await fs.copyFile(req.file.path,destination);
      await service.workbook(req.params.mode,destination,extension,path.basename(req.file.originalname));
      res.json(sessionResponse(req.params.mode));
    } catch(error) {if(destination) await fs.unlink(destination).catch(()=>{});throw error;}
    finally {await fs.unlink(req.file.path).catch(()=>{});}
  });
  router.delete('/:mode/workbook',mutable,async(req,res)=>{
    service.clearWorkbook(req.params.mode);
    res.json(sessionResponse(req.params.mode));
  });
  router.post('/:mode/sheet',mutable,async(req,res)=>{
    const session=service.get(req.params.mode);
    if(!session) throw fail('Choose a workbook first.');
    if(typeof req.body?.sheet!=='string'||req.body.sheet.length>200) throw fail('Choose a valid worksheet.');
    await service.workbook(req.params.mode,session.file,session.extension,session.filename,req.body.sheet);
    res.json(sessionResponse(req.params.mode));
  });
  router.put('/:mode/config',mutable,async(req,res)=>res.json(await service.configure(req.params.mode,req.body)));
  router.post('/:mode/preflight',mutable,async(req,res)=>res.json((await service.plan(req.params.mode)).summary));
  router.post('/:mode/run',(req,res)=>{
    const {dryRun=true,confirmation}=req.body||{};
    if(typeof dryRun!=='boolean') throw fail('dryRun must be true or false.');
    if(!dryRun&&confirmation!=='RUN FOR REAL') throw fail('Type RUN FOR REAL to start a real migration.');
    service.requireToken();
    if(!service.get(req.params.mode)?.config) throw fail('Choose a workbook and save mappings first.');
    const {job}=service.start(req.params.mode,dryRun);
    res.status(202).json(job);
  });
  router.post('/:mode/cancel',(req,res)=>{
    const job=service.status(req.params.mode);
    if(job.running) service.progress(req.params.mode,{cancelRequested:true},'Stopping after the current record.');
    res.json(service.status(req.params.mode));
  });
  router.post('/:mode/reset',(req,res)=>{
    const job=service.reset(req.params.mode);
    res.json(job);
  });
  router.get('/:mode/report',(req,res)=>{
    const report=service.status(req.params.mode).report;
    if(!report) return res.status(404).json({error:'No report is available yet.'});
    res.download(path.join(rt.root,'reports',path.basename(report)));
  });
  router.get('/:mode/issues-report',async(req,res)=>{
    try {
      const session=service.get(req.params.mode);
      if(!session?.config) return res.status(400).json({error:'Map columns and run validation before downloading issues.'});
      const result=await service.issuesCsv(req.params.mode);
      res.setHeader('Content-Type','text/csv; charset=utf-8');
      res.setHeader('Content-Disposition',`attachment; filename="${result.filename}"`);
      res.send(result.content);
    } catch(err) {
      res.status(400).json({error:safeError(err)});
    }
  });
  return router;
}
