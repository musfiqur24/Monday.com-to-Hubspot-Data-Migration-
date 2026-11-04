// Shared browser components. Kept framework-independent so existing workflows
// retain their event handlers and migration state.
(() => {
  function icon(name, size=18) {
    const definition=window.lucide?.icons[name];
    if(!definition)throw new Error(`Unknown Lucide icon: ${name}`);
    return window.lucide.createElement(definition,{width:size,height:size,'stroke-width':1.8,'aria-hidden':'true',class:'ui-icon'});
  }
  const region=document.createElement('div');
  region.className='toast-region';region.setAttribute('aria-label','Notifications');
  document.body.append(region);
  const recent=new Map();
  function toast(message, type='info', {key=type+':'+message}={}) {
    if(!message)return;
    const prior=recent.get(key);
    if(prior&&(Date.now()-prior)<30000)return;
    recent.set(key,Date.now());if(recent.size>200)recent.delete(recent.keys().next().value);
    const item=document.createElement('div');item.className=`ui-toast toast-${type}`;
    item.setAttribute('role',type==='error'?'alert':'status');
    item.setAttribute('aria-atomic','true');
    const symbol=document.createElement('span');symbol.className='toast-symbol';
    symbol.append(icon(type==='error'?'CircleAlert':type==='success'?'CircleCheck':'Info',20));
    const content=document.createElement('div');content.className='toast-content';
    const heading=document.createElement('strong');heading.textContent=type==='error'?'Something needs attention':type==='success'?'Success':'Notification';
    const text=document.createElement('p');text.textContent=message;content.append(heading,text);
    const close=document.createElement('button');close.type='button';close.className='toast-close';close.setAttribute('aria-label','Dismiss notification');close.append(icon('X',16));
    let timer;
    const dismiss=()=>{clearTimeout(timer);item.remove();};
    const schedule=()=>{clearTimeout(timer);timer=setTimeout(dismiss,type==='error'?10000:6000);};
    close.addEventListener('click',dismiss);
    item.addEventListener('mouseenter',()=>clearTimeout(timer));item.addEventListener('mouseleave',schedule);
    item.addEventListener('focusin',()=>clearTimeout(timer));item.addEventListener('focusout',schedule);
    item.append(symbol,content,close);region.prepend(item);
    while(region.children.length>4)region.lastElementChild.remove();
    schedule();return item;
  }
  async function request(url,method='GET',body) {
    let response;
    try {
      response=await fetch(url,{method,headers:body instanceof FormData?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body)});
    } catch {throw new Error('Cannot connect to the local server. Start the app with npm start and try again.');}
    const contentType=response.headers.get('Content-Type')||'';
    if(!/(application\/json|\+json)/i.test(contentType)) {
      throw new Error('The local server returned a page instead of API data. Restart the app with npm start, then refresh this page.');
    }
    let data;
    try {data=await response.json();} catch {throw new Error('The server returned an invalid API response. Restart the app and try again.');}
    if(!response.ok)throw new Error(typeof data.error==='string'?data.error:`The request failed (HTTP ${response.status}). Try again.`);
    return data;
  }
  const labels=['Choose workbook','Map columns','Review & validate','Run & monitor'];
  const symbols=['FileUp','Columns3','ShieldCheck','Activity'];
  function progress({onSelect,label='Migration progress',steps=labels}) {
    const root=document.createElement('nav');root.className='workflow-progress';root.setAttribute('aria-label',label);
    const meta=document.createElement('div');meta.className='workflow-progress-meta';
    const caption=document.createElement('strong'),percent=document.createElement('span');meta.append(caption,percent);
    const bar=document.createElement('progress');bar.max=4;bar.value=1;bar.setAttribute('aria-label',label);
    const list=document.createElement('div');list.className='workflow-progress-steps';
    const buttons=steps.map((text,index)=>{
      const button=document.createElement('button');button.type='button';
      const mark=document.createElement('span');mark.className='workflow-step-icon';
      const name=document.createElement('span');name.textContent=text;
      button.append(mark,name);button.addEventListener('click',()=>onSelect(index));list.append(button);
      return {button,mark};
    });
    root.append(meta,bar,list);
    function update(step,{disabled=false,canAdvance=true}={}) {
      caption.textContent=`Step ${step+1} of 4`;
      percent.textContent=`${Math.round((step+1)/4*100)}%`;bar.value=step+1;
      buttons.forEach(({button,mark},index)=>{
        button.classList.toggle('is-current',index===step);button.classList.toggle('is-complete',index<step);
        button.disabled=disabled||(index>0&&!canAdvance);
        if(index===step)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
        const name=index<step?'Check':symbols[index];
        if(mark.dataset.icon!==name){mark.replaceChildren(icon(name,16));mark.dataset.icon=name;}
      });
    }
    update(0);return {root,update};
  }
  function decorate(root=document) {
    const buttons={
      'dashboard-refresh':'RefreshCw','refresh-properties':'RefreshCw','upload-button':'FileUp',
      'save-mappings':'Save','preflight':'ShieldCheck','dry-preview':'ScanEye','start-run':'Play',
      'cancel-run':'Square','restart-app':'RotateCw','reset-credentials':'KeyRound','clear-log':'ListRestart',
    };
    for(const [id,name] of Object.entries(buttons)) {
      const button=document.getElementById(id);
      if(button&&!button.querySelector('.ui-icon'))button.prepend(icon(name,16));
    }
    const hs={upload:'FileUp',properties:'RefreshCw','refresh-objects':'RefreshCw',save:'Save',validate:'ShieldCheck',run:'Play',cancel:'Square',report:'Download','add-association':'Link2'};
    for(const [key,name] of Object.entries(hs))root.querySelectorAll(`[data-hs="${key}"]`).forEach(button=>{
      if(!button.querySelector('.ui-icon'))button.prepend(icon(name,16));
    });
    const nav=document.querySelector('.nav-icon');if(nav&&!nav.querySelector('svg'))nav.replaceChildren(icon('LayoutDashboard',19));
    document.querySelectorAll('.upload-icon,.hs-upload-symbol').forEach(mark=>{if(!mark.querySelector('svg'))mark.replaceChildren(icon('Upload',25));});
    document.querySelectorAll('.reports-bar a').forEach(link=>{if(!link.querySelector('svg'))link.prepend(icon('Download',16));});
    const help=document.querySelector('.help-icon');if(help&&!help.querySelector('svg'))help.replaceChildren(icon('Workflow',23));
    const review=document.querySelector('.review-icon');if(review&&!review.querySelector('svg'))review.replaceChildren(icon('ShieldCheck',24));
    const metrics=[['orange','ArrowUpRight'],['violet','Users'],['blue','Files'],['amber','CircleAlert']];
    for(const [style,name] of metrics)document.querySelectorAll(`.metric-icon.${style}`).forEach(mark=>{if(!mark.querySelector('svg'))mark.replaceChildren(icon(name,18));});
    document.querySelectorAll('.file-icon').forEach(mark=>{if(!mark.querySelector('svg'))mark.replaceChildren(icon('FileSpreadsheet',23));});
  }
  window.UI={icon,toast,request,progress,decorate};
})();
