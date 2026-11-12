(() => {
  const pages = {
    'data-migrate': ['Data Migrate', 'Migrate data between HubSpot accounts.'],
    'data-migrate-association': ['Association Migration', 'Replace associations between existing HubSpot records.'],
  };
  const buttons = document.querySelectorAll('[data-module]');
  function show(module) {
    const page = pages[module], isMonday = module === 'monday';
    document.getElementById('dashboard-module').hidden = module !== 'dashboard';
    document.getElementById('monday-module').hidden = !isMonday;
    document.getElementById('hubspot-module').hidden = !page;
    document.querySelector('.wizard-footer').hidden = !isMonday;
    document.body.classList.toggle('hubspot-module-active', !isMonday);
    document.querySelector('.topbar-label').textContent = page ? `HubSpot / ${page[0]}` : isMonday ? 'Monday to HubSpot' : 'Dashboard';
    buttons.forEach(button => {
      const active = button.dataset.module === module;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    if (page) {
      window.showHubspotFlow(module);
    }
    document.querySelectorAll('[data-hs-nav-group]').forEach(group=>group.hidden=group.dataset.hsNavGroup!==module);
    if (module === 'dashboard') window.refreshDashboard?.();
  }
  buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.module)));
  document.getElementById('steps').addEventListener('click', event => {
    if (event.target.closest('[data-step]')) show('monday');
  });
  document.querySelectorAll('[data-hs-nav]').forEach(button=>button.addEventListener('click',()=>{
    show(button.dataset.hsNav);
    window.showHubspotFlow(button.dataset.hsNav,Number(button.dataset.hsIndex));
  }));
  show('dashboard');
})();
