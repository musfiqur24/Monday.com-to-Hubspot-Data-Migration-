import { objectLabel } from './hubspotPortal.js';
// Read-only aggregates; no customer identifiers are returned to the dashboard.
export function dashboard(db, now = new Date()) {
  const count = sql => db.prepare(sql).get().total;
  const hasImports=Boolean(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='hubspot_records'").get());
  const contactDates = db.prepare(hasImports ? `SELECT id, MIN(completed) completed FROM (
    SELECT contact_id id, MAX(updated_at) completed FROM contacts WHERE status='completed' AND contact_id IS NOT NULL GROUP BY contact_id
    UNION ALL SELECT record_id id, MIN(completed_at) completed FROM hubspot_records WHERE object_type IN ('contacts','0-1') AND status='completed' AND record_id IS NOT NULL GROUP BY record_id
  ) GROUP BY id` : "SELECT contact_id id, MAX(updated_at) completed FROM contacts WHERE status='completed' AND contact_id IS NOT NULL GROUP BY contact_id").all();
  const contacts = contactDates.length;
  const files = count("SELECT COUNT(DISTINCT hubspot_file_id) total FROM files WHERE status='completed' AND hubspot_file_id IS NOT NULL");
  const notes = count(hasImports?"SELECT COUNT(DISTINCT id) total FROM (SELECT note_id id FROM notes WHERE status='verified' AND note_id IS NOT NULL UNION ALL SELECT record_id id FROM hubspot_records WHERE status='completed' AND object_type IN ('notes','0-46') AND record_id IS NOT NULL)":"SELECT COUNT(DISTINCT note_id) total FROM notes WHERE status='verified' AND note_id IS NOT NULL");
  const failed = count("SELECT COUNT(*) total FROM contacts WHERE status IN ('failed','uncertain')") + count("SELECT COUNT(*) total FROM files WHERE status IN ('failed','upload_uncertain')") + (hasImports?count("SELECT COUNT(*) total FROM hubspot_records WHERE status='failed'"):0);
  const otherRecords=hasImports?db.prepare("SELECT CASE object_type WHEN 'companies' THEN '0-2' WHEN 'deals' THEN '0-3' WHEN 'tickets' THEN '0-5' WHEN 'notes' THEN '0-46' ELSE object_type END object_type,record_id,MIN(completed_at) completed FROM hubspot_records WHERE status='completed' AND object_type NOT IN ('contacts','0-1') AND record_id IS NOT NULL GROUP BY 1,record_id").all():[];
  const portalLabels=new Map();
  if(hasImports)for(const row of db.prepare('SELECT data FROM hubspot_sessions').all()) {
    const selected=JSON.parse(row.data).selectedObject;
    if(selected)portalLabels.set(selected.objectTypeId,selected.label);
  }
  const objects=[{name:'Contacts',count:contacts,source:'Monday / HubSpot'},{name:'Files',count:files,source:'Monday'},{name:'Notes',count:notes,source:'Monday'}];
  for(const row of otherRecords) {
    if(row.object_type==='0-46')continue;
    const name=portalLabels.get(row.object_type)||objectLabel(row.object_type);
    const object=objects.find(object=>object.name===name);
    if(object)object.count++;else objects.push({name,count:1,source:'HubSpot'});
  }
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  const weeks = Array.from({length:8}, (_, index) => {
    const start = new Date(monday);
    start.setUTCDate(start.getUTCDate() - (7 - index) * 7);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return {start:start.toISOString().slice(0,10), end:end.toISOString().slice(0,10), contacts:0, records:0, files:0};
  });
  // Contacts have a latest completion timestamp, not an immutable run history.
  // Files use their first completed event, avoiding audit/retry timestamp changes.
  const fileDates = db.prepare(`SELECT f.hubspot_file_id, MIN(e.created_at) completed FROM files f
    JOIN events e ON e.row_email=f.row_email AND e.column_name=f.column_name AND e.asset_id=f.asset_id AND e.step='completed'
    WHERE f.status='completed' AND f.hubspot_file_id IS NOT NULL GROUP BY f.hubspot_file_id`).all();
  for (const [kind, rows] of [['contacts', contactDates], ['files', fileDates]]) {
    for (const row of rows) {
      const day = row.completed?.slice(0,10);
      const week = weeks.find(week => day >= week.start && day < week.end);
      if (week) week[kind]++;
    }
  }
  for(const row of [...contactDates,...otherRecords]) {
    const day=row.completed?.slice(0,10), week=weeks.find(week=>day>=week.start&&day<week.end);
    if(week)week.records++;
  }
  return {contacts, files, notes, failed, objects, total:objects.reduce((sum,object)=>sum+object.count,0), weeks, updatedAt:now.toISOString()};
}
