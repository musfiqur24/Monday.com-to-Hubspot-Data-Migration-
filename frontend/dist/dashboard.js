(() => {
  const root = document.getElementById('dashboard-module');
  root.innerHTML = `
    <div class="dash-heading"><div><div class="dash-eyebrow">YOUR MIGRATION WORKSPACE</div><h1>Migration overview<span>.</span></h1><p>Every record. One clear view.</p></div><button type="button" id="dashboard-refresh" class="button secondary">Refresh</button></div>
    <div id="dashboard-error" class="notice error" role="status" hidden></div>
    <div class="dash-metrics">
      <article class="metric-card"><div class="metric-label">Total migrated <span class="metric-icon orange">&#8599;</span></div><strong id="metric-total">—</strong><small>Across all migration modules</small></article>
      <article class="metric-card"><div class="metric-label">Contacts <span class="metric-icon violet">&#9678;</span></div><strong id="metric-contacts">—</strong><small>Successfully migrated records</small></article>
      <article class="metric-card"><div class="metric-label">Files <span class="metric-icon blue">&#9636;</span></div><strong id="metric-files">—</strong><small>Completed file assignments</small></article>
      <article class="metric-card"><div class="metric-label">Needs attention <span class="metric-icon amber">!</span></div><strong id="metric-failed">—</strong><small>Failed or uncertain records</small></article>
    </div>
    <div class="dash-chart-grid">
      <article class="dash-card weekly-card"><div class="dash-card-heading"><div><h2>Weekly migration activity</h2><p>Completed records over the last 8 weeks</p></div><span class="dash-tag">Weekly · UTC</span></div><div class="chart-legend"><span><i class="legend-dot contacts"></i>CRM records</span><span><i class="legend-dot files"></i>Files</span></div><div id="weekly-chart" class="weekly-chart" aria-live="polite"><div class="chart-loading">Loading activity...</div></div><p class="chart-footnote">Monday contacts use their latest completion; HubSpot records and files use their first completed migration.</p></article>
      <article class="dash-card"><div class="dash-card-heading"><div><h2>Migrated by object</h2><p>Successfully completed records</p></div></div><div id="object-chart" class="object-chart"></div><div id="object-legend" class="object-legend"></div></article>
    </div>
    <article class="dash-card object-table-card"><div class="dash-card-heading"><div><h2>Object breakdown</h2><p>All migration modules</p></div><span class="dash-tag success">Saved migration data</span></div><div class="dash-table-wrap"><table class="dash-table"><thead><tr><th>Object</th><th>Migrated records</th><th>Source</th><th>Status</th></tr></thead><tbody id="object-table"></tbody></table></div></article>
    <div class="dash-bottom"><span id="dashboard-updated">Loading dashboard...</span><span></span></div>`;
  const number = value => value.toLocaleString();
  const colors = ['#ff785a', '#6983ee', '#24b8a6', '#af7dea', '#e3b34f', '#6aadc4'];
  const color = index => colors[index % colors.length];
  function render(data) {
    for (const key of ['total','contacts','files','failed']) document.getElementById(`metric-${key}`).textContent = number(data[key]);
    const objects = data.objects.map(object=>[object.name,object.count,object.source]);
    const chart = document.getElementById('object-chart'); chart.replaceChildren();
    const ring = document.createElement('div'); ring.className = 'object-ring';
    let offset = 0;
    const stops = objects.map(([,count], index) => {
      const start = offset; offset += data.total ? count / data.total * 100 : 0;
      return `${color(index)} ${start}% ${offset}%`;
    });
    ring.style.background = data.total ? `conic-gradient(${stops.join(',')})` : '#edf0f5';
    const center = document.createElement('div');
    const total = document.createElement('strong'); total.textContent = number(data.total);
    const caption = document.createElement('span'); caption.textContent = data.total ? 'records migrated' : 'No migrations yet';
    center.append(total,caption); ring.append(center); chart.append(ring);
    chart.setAttribute('aria-label', objects.map(([name,count]) => `${name}: ${count}`).join(', '));
    document.getElementById('object-legend').innerHTML = objects.map(([name,count], index) => `<div><span><i style="background:${color(index)}"></i>${name}</span><strong>${number(count)}</strong></div>`).join('');
    document.getElementById('object-table').innerHTML = objects.map(([name,count,source], index) => `<tr><td><span class="table-object-icon object-${index%3}">${name[0]}</span>${name}</td><td><strong>${number(count)}</strong></td><td>${source}</td><td><span class="dash-tag ${count ? 'success' : ''}">${count ? 'Migrated' : 'No records'}</span></td></tr>`).join('');
    drawWeekly(data.weeks);
    document.getElementById('dashboard-updated').textContent = `Updated ${new Date(data.updatedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} · Refreshes every 30 seconds`;
  }
  function drawWeekly(weeks) {
    const left=56, bottom=215, plotHeight=195;
    const peak=Math.max(1,...weeks.map(week => Math.max(week.records,week.files)));
    const max=peak <= 4 ? 4 : Math.ceil(peak / 4) * 4;
    const format=new Intl.DateTimeFormat('en', {month:'short',day:'numeric',timeZone:'UTC'});
    let svg='<svg viewBox="0 0 800 260" role="img" aria-labelledby="weekly-chart-title"><title id="weekly-chart-title">Weekly completed CRM records and files</title>';
    for(let index=0;index<=4;index++) {
      const y=bottom-index/4*plotHeight;
      svg+=`<line x1="${left}" y1="${y}" x2="785" y2="${y}" stroke="#edf0f5"/><text x="44" y="${y+4}" text-anchor="end">${number(max*index/4)}</text>`;
    }
    weeks.forEach((week,index) => {
      const x=left+((785-left)/weeks.length)*(index+.5);
      [['records',colors[0],-18],['files',colors[1],3]].forEach(([key,color,dx]) => {
        const barHeight=week[key]/max*plotHeight;
        svg+=`<rect x="${x+dx}" y="${bottom-barHeight}" width="15" height="${barHeight}" rx="4" fill="${color}"><title>Week of ${week.start}: ${week[key]} ${key}</title></rect>`;
      });
      svg+=`<text x="${x}" y="242" text-anchor="middle">${format.format(new Date(week.start+'T00:00:00Z'))}</text>`;
    });
    svg+='</svg>';
    if(!weeks.some(week => week.records || week.files)) svg+='<div class="chart-empty">No completed records in the last 8 weeks</div>';
    document.getElementById('weekly-chart').innerHTML=svg;
  }
  let loading=false;
  window.refreshDashboard = async ({notifySuccess=false}={}) => {
    if(loading) return; loading=true;
    const button=document.getElementById('dashboard-refresh'); button.disabled=true;
    const error=document.getElementById('dashboard-error');error.hidden=true;
    try {
      render(await window.UI.request('/api/dashboard'));
      if(notifySuccess)window.UI.toast('Dashboard refreshed.','success');
    } catch(problem) { window.UI.toast(problem.message,'error'); }
    finally { loading=false; button.disabled=false; }
  };
  document.getElementById('dashboard-refresh').addEventListener('click',()=>window.refreshDashboard({notifySuccess:true}));
  window.UI.decorate();
  setInterval(() => { if(!root.hidden && !document.hidden) window.refreshDashboard(); },30000);
})();
