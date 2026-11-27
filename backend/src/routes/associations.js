import {Router} from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {AssociationReplacement} from '../services/associationReplacement.js';
import {fail} from '../lib/sanitize.js';

export function associations(rt,imports){
  const router=Router(),service=new AssociationReplacement(rt);rt.associationReplacement=service;
  service.imports=imports;
  const upload=multer({dest:path.join(rt.root,'tmp'),limits:{fileSize:rt.config.maxBytes||(500*1024**2),files:1,fields:0}});
  const mutable=(req,res,next)=>{if(service.busy()||imports.busy()||rt.migration.status.running)return res.status(409).json({error:'A migration is running. Wait until it finishes before changing this association job.'});next();};
  router.param('side',(req,res,next,side)=>['left','right'].includes(side)?next():res.status(404).json({error:'Unknown association file side.'}));
  router.get('/state',(req,res)=>res.json(service.publicState()));
  router.get('/status',(req,res)=>res.json(service.status()));
  router.put('/object/:side',mutable,async(req,res)=>{if(typeof req.body?.objectTypeId!=='string')throw fail('Select a portal object.');res.json(await service.object(req.params.side,req.body.objectTypeId));});
  router.post('/workbook/:side',mutable,upload.single('file'),async(req,res)=>{
    if(!req.file)throw fail('Choose this object’s CSV or XLSX file.');let destination;
    try{
      if(service.busy()||imports.busy()||rt.migration.status.running)throw fail('A migration started during upload. Try again after it finishes.');
      const extension=path.extname(req.file.originalname).toLowerCase();if(!['.csv','.xlsx'].includes(extension))throw fail('Only CSV and XLSX files are supported.');
      destination=path.join(rt.root,'data',`associations-${req.params.side}-${randomUUID()}${extension}`);await fs.copyFile(req.file.path,destination);
      res.json(await service.workbook(req.params.side,destination,extension,path.basename(req.file.originalname)));
    }catch(error){if(destination)await fs.unlink(destination).catch(()=>{});throw error;}finally{await fs.unlink(req.file.path).catch(()=>{});}
  });
  router.post('/clear',mutable,(req,res)=>res.json(service.clear()));
  router.post('/reset',mutable,(req,res)=>res.json(service.resetJob()));
  router.delete('/workbook/:side',mutable,(req,res)=>res.json(service.clearSide(req.params.side)));
  router.post('/sheet/:side',mutable,async(req,res)=>{const item=service.workspace.sides[req.params.side];if(!item?.file||typeof req.body?.sheet!=='string')throw fail('Upload a file and choose its worksheet.');res.json(await service.workbook(req.params.side,item.file,item.extension,item.filename,req.body.sheet));});
  router.post('/labels',mutable,async(req,res)=>res.json(await service.labels()));
  router.put('/labels',mutable,(req,res)=>res.json(service.selectLabels(req.body?.keys)));
  router.put('/columns',mutable,(req,res)=>res.json(service.columns(req.body)));
  router.post('/preflight',mutable,async(req,res)=>res.json(await service.validate()));
  router.post('/run',mutable,(req,res)=>{
    const {dryRun=true,confirmation,validationId}=req.body||{};
    if(typeof dryRun!=='boolean')throw fail('dryRun must be true or false.');
    if(!dryRun&&confirmation!=='RUN FOR REAL')throw fail('Type RUN FOR REAL to replace the associations in the reviewed scope.');
    const {job}=service.start({dryRun,validationId});res.status(202).json(job);
  });
  router.post('/cancel',(req,res)=>{if(service.busy())service.log({cancelRequested:true},'Stopping after the current request; a backup is available for real runs.');res.json(service.status());});
  router.post('/restore',mutable,(req,res)=>{
    if(req.body?.confirmation!=='RESTORE BACKUP')throw fail('Type RESTORE BACKUP to restore the last replacement’s original relationships.');
    const restoreId=service.workspace.lastReplacementId;if(!restoreId)throw fail('No original association backup is available.');
    const {job}=service.start({dryRun:false,restoreId});res.status(202).json(job);
  });
  router.get('/backup',(req,res)=>{const job=service.workspace.lastReplacementId?service.readJob(service.workspace.lastReplacementId):null;if(!job?.backup)return res.status(404).json({error:'No association backup is available.'});res.download(path.join(rt.root,'reports',path.basename(job.backup)));});
  router.get('/report',(req,res)=>{const report=service.status().report;if(!report)return res.status(404).json({error:'Complete a validation preview or run to generate a report.'});res.download(path.join(rt.root,'reports',path.basename(report)));});
  return router;
}
