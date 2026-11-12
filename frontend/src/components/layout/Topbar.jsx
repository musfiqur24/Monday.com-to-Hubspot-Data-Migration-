import React from 'react';

export function Topbar({ activeModule, isConnected }) {
  const getLabel = () => {
    switch (activeModule) {
      case 'data-migrate':
        return 'HubSpot / Data Migrate';
      case 'data-migrate-association':
        return 'HubSpot / Association Migration';
      case 'monday':
        return 'Monday to HubSpot';
      case 'history':
        return 'Migration History';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between z-30">
      {/* Brand logo & text: exact 240px width to match the sidebar below */}
      <div className="w-[240px] shrink-0 h-full border-r border-slate-200 flex items-center px-4">
        <a href="/" className="flex items-center gap-2.5 no-underline text-slate-800 text-[15px] font-bold tracking-tight min-w-0">
          <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 shadow-xs">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#ff7a59" aria-hidden="true">
              <path d="M18.894 8.016V5.17a2.25 2.25 0 0 0 1.341-2.057v-.063A2.25 2.25 0 0 0 17.985.8h-.063a2.25 2.25 0 0 0-2.25 2.25v.063c0 .878.508 1.637 1.24 2.003v2.9A6.29 6.29 0 0 0 13.9 9.38L6.02 3.29A2.5 2.5 0 1 0 4.4 4.747l7.76 6.022a6.262 6.262 0 0 0-1.077 3.53c0 1.38.442 2.656 1.19 3.693l-2.404 2.405a2.015 2.015 0 0 0-.61-.097 2.05 2.05 0 1 0 2.05 2.05 2.01 2.01 0 0 0-.097-.61l2.385-2.385a6.286 6.286 0 1 0 4.807-11.34zm-.99 9.544a3.255 3.255 0 1 1 3.255-3.255 3.259 3.259 0 0 1-3.254 3.255z"/>
            </svg>
          </span>
          <strong className="text-[14.5px] font-bold tracking-tight text-slate-800 truncate">Hubspot Migration Tool</strong>
        </a>
      </div>

      {/* Breadcrumb section */}
      <div className="flex-1 px-6 flex items-center">
        <span className="text-xs text-slate-400 font-medium">{getLabel()}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 px-6">
        <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-500">
          Local workspace
        </span>
        <span className="flex items-center text-xs font-semibold text-slate-600 gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
          {isConnected ? 'Live' : 'Connecting...'}
        </span>
      </div>
    </header>
  );
}

