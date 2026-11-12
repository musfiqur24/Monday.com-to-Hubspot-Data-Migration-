import { fail } from '../lib/sanitize.js';

export const HUBSPOT_API_VERSION='2026-09';
// Official object IDs are discovery candidates, never a hardcoded dropdown.
// Each candidate must return portal property metadata to be offered to a user.
const core=[
  ['0-1','contacts','Contacts'],['0-2','companies','Companies'],['0-3','deals','Deals'],['0-5','tickets','Tickets'],
  ['0-7','products','Products'],['0-8','line_items','Line items'],['0-14','quotes','Quotes'],
  ['0-18','communications','Communications'],['0-27','tasks','Tasks'],['0-46','notes','Notes'],
  ['0-48','calls','Calls'],['0-49','emails','Emails'],['0-47','meetings','Meetings'],
  ['0-84','discounts','Discounts'],['0-85','fees','Fees'],['0-19','feedback_submissions','Feedback submissions'],
  ['0-74','goals','Goals'],['0-53','invoices','Invoices'],['0-136','leads','Leads'],
  ['0-54','marketing_events','Marketing events'],['0-123','orders','Orders'],['0-101','payments','Payments'],
  ['0-116','postal_mail','Postal mail'],['0-970','projects','Projects'],['0-69','subscriptions','Subscriptions'],
  ['0-86','taxes','Taxes'],['0-115','users','Users'],['0-142','carts','Carts'],
];
const activatable={
  '0-410':['courses','Courses'],'0-420':['listings','Listings'],'0-421':['appointments','Appointments'],
  '0-162':['services','Services'],'0-136':['leads','Leads'],'0-53':['invoices','Invoices'],
  '0-123':['orders','Orders'],'0-142':['carts','Carts'],'0-69':['subscriptions','Subscriptions'],
  '0-101':['payments','Payments'],'0-970':['projects','Projects'],
};
const aliases=new Map(core.map(([id,name])=>[name,id]));
export const objectTypeId=value=>aliases.get(value)||value;
export const objectLabel=value=>core.find(([id])=>id===objectTypeId(value))?.[2]||activatable[objectTypeId(value)]?.[1]||`Object ${value}`;

export class HubspotPortal {
  constructor(hubspot){this.hubspot=hubspot;this.cache=null;this.pending=null;}
  async identity() {
    const configured=this.hubspot.config.hubspotPortalId;
    if(!configured||!/^\d+$/.test(configured))throw fail('Set HUBSPOT_PORTAL_ID and HUBSPOT_PRIVATE_APP_TOKEN in .env, then restart the app.');
    return this.hubspot.verifyPortal();
  }
  async objects({refresh=false}={}) {
    await this.identity();
    if(!refresh&&this.cache&&Date.now()-this.cache.at<300000)return this.cache.value;
    if(this.pending)return this.pending;
    this.pending=this.discover().then(value=>{this.cache={at:Date.now(),value};return value;}).finally(()=>{this.pending=null;});
    return this.pending;
  }
  async discover() {
    const portal=await this.identity(), warnings=[];
    const [enablement,schemas]=await Promise.allSettled([
      this.hubspot.request('/crm/object-library/2026-09/enablement', { silent: true }),
      this.hubspot.request('/crm-object-schemas/2026-09/schemas', { silent: true }),
    ]);
    for(const [name,result]of [['activated objects',enablement],['custom schemas',schemas]]) {
      if(result.status==='rejected') {
        if(result.reason.status!==403)throw result.reason;
        warnings.push(`The private app cannot read ${name}. Grant the corresponding HubSpot read scope and refresh the object list.`);
      }
    }
    const candidates=new Map(core.map(([id,name,label])=>[id,{objectTypeId:id,name,label,custom:false,requiredProperties:[]}]));
    if(enablement.status==='fulfilled')for(const [id,enabled]of Object.entries(enablement.value.enablementByObjectTypeId||{})) {
      if(!enabled){candidates.delete(id);continue;}
      const [name,label]=activatable[id]||[id,`Object ${id}`];
      if(!candidates.has(id))candidates.set(id,{objectTypeId:id,name,label,custom:false,requiredProperties:[]});
    }
    if(schemas.status==='fulfilled')for(const schema of schemas.value.results||[]) {
      if(schema.archived)continue;
      candidates.set(schema.objectTypeId,{objectTypeId:schema.objectTypeId,name:schema.name,label:schema.labels?.plural||schema.labels?.singular||schema.name,custom:true,requiredProperties:schema.requiredProperties||[]});
    }
    const unavailable=[];
    const accessible=await Promise.all([...candidates.values()].map(async object=>{
      try {
        await this.hubspot.request(`/crm/properties/2026-09/${encodeURIComponent(object.objectTypeId)}`, { silent: true });
        return object;
      } catch(error) {
        if(error.status===403){unavailable.push(object.label);return null;}
        if([400,404].includes(error.status))return null;
        throw error;
      }
    }));
    if(unavailable.length)warnings.push(`Not accessible to this private app: ${unavailable.sort().join(', ')}. Check the objects' schema/read permissions.`);
    const objects=accessible.filter(Boolean).sort((a,b)=>a.label.localeCompare(b.label));
    if(!objects.length)throw fail('No accessible CRM objects were returned by this portal. Check the private app object/schema read scopes.');
    return {portalId:String(portal.portalId),portalName:portal.portalName||'',apiVersion:HUBSPOT_API_VERSION,objects,warnings};
  }
  async object(type) {
    const id=objectTypeId(type), catalogue=await this.objects();
    const selected=catalogue.objects.find(object=>object.objectTypeId===id);
    if(!selected)throw fail('This object is not available in the configured HubSpot portal. Refresh the object list and choose an available object.');
    return {...selected,portalId:catalogue.portalId};
  }
}
