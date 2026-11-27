import React, { useState, useEffect } from 'react';
import { LayoutGrid, ChevronRight, History } from 'lucide-react';

export function Sidebar({ activeModule, onSelectModule, mondayStep, onSelectMondayStep }) {
  const isHubspotModule = [
    'data-migrate',
    'data-migrate-association',
    'schema-manager',
    'object-group-creation',
    'property-creation',
  ].includes(activeModule);

  const [hubspotOpen, setHubspotOpen] = useState(isHubspotModule);
  const [mondayOpen, setMondayOpen] = useState(activeModule === 'monday');

  useEffect(() => {
    if (isHubspotModule) {
      setHubspotOpen(true);
    } else if (activeModule === 'monday') {
      setMondayOpen(true);
    }
  }, [activeModule, isHubspotModule]);

  const handleMondayClick = (stepIndex) => {
    onSelectModule('monday');
    if (onSelectMondayStep) {
      onSelectMondayStep(stepIndex);
    }
  };

  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-slate-200 py-4 px-3 flex flex-col h-full overflow-y-auto">
      <div className="text-[10px] font-bold tracking-widest text-slate-400 px-3 mb-2 select-none">
        WORKSPACE
      </div>
      <button
        type="button"
        onClick={() => onSelectModule('dashboard')}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition cursor-pointer border-0 text-left ${
          activeModule === 'dashboard'
            ? 'bg-[#fff0eb] text-[#df6d50]'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-transparent'
        }`}
      >
        <span className="text-base leading-none text-slate-500 shrink-0">&#9638;</span>
        <span>Dashboard</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectModule('history')}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition cursor-pointer border-0 text-left mt-1 ${
          activeModule === 'history'
            ? 'bg-[#fff0eb] text-[#df6d50]'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-transparent'
        }`}
      >
        <History className="w-4 h-4 text-slate-500 shrink-0" />
        <span>Migration History</span>
      </button>

      <div className="text-[10px] font-bold tracking-widest text-slate-400 px-3 mt-6 mb-2 select-none">
        MIGRATION
      </div>

      {/* HubSpot Accordion */}
      <div className="mt-1">
        <button
          type="button"
          onClick={() => {
            setHubspotOpen(!hubspotOpen);
            if (!isHubspotModule) {
              onSelectModule('data-migrate');
            }
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer select-none transition border-0 bg-transparent"
        >
          <span className="inline-flex items-center gap-2.5 font-semibold text-inherit">
            <svg className="w-[18px] h-[18px] shrink-0 inline-block align-middle" viewBox="0 0 24 24" fill="#ff7a59" aria-hidden="true">
              <path d="M18.894 8.016V5.17a2.25 2.25 0 0 0 1.341-2.057v-.063A2.25 2.25 0 0 0 17.985.8h-.063a2.25 2.25 0 0 0-2.25 2.25v.063c0 .878.508 1.637 1.24 2.003v2.9A6.29 6.29 0 0 0 13.9 9.38L6.02 3.29A2.5 2.5 0 1 0 4.4 4.747l7.76 6.022a6.262 6.262 0 0 0-1.077 3.53c0 1.38.442 2.656 1.19 3.693l-2.404 2.405a2.015 2.015 0 0 0-.61-.097 2.05 2.05 0 1 0 2.05 2.05 2.01 2.01 0 0 0-.097-.61l2.385-2.385a6.286 6.286 0 1 0 4.807-11.34zm-.99 9.544a3.255 3.255 0 1 1 3.255-3.255 3.259 3.259 0 0 1-3.254 3.255z"/>
            </svg>
            <span>HubSpot</span>
          </span>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${hubspotOpen ? 'rotate-90' : ''}`} />
        </button>

        {hubspotOpen && (
          <nav className="flex flex-col gap-1 my-1.5 ml-3.5 pl-3 border-l border-slate-200" aria-label="HubSpot">
            <button
              type="button"
              onClick={() => onSelectModule('data-migrate')}
              className={`px-3 py-2 rounded-md text-left text-xs transition border-0 cursor-pointer ${
                activeModule === 'data-migrate'
                  ? 'bg-[#fff0eb] text-[#df6d50] font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium bg-transparent'
              }`}
            >
              Data Migrate
            </button>
            <button
              type="button"
              onClick={() => onSelectModule('data-migrate-association')}
              className={`px-3 py-2 rounded-md text-left text-xs transition border-0 cursor-pointer ${
                activeModule === 'data-migrate-association'
                  ? 'bg-[#fff0eb] text-[#df6d50] font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium bg-transparent'
              }`}
            >
              Association Migration
            </button>

            {/* Section: Object group and property creation */}
            <div className="pt-2 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase select-none">
              Group &amp; Property Creation
            </div>
            <button
              type="button"
              onClick={() => onSelectModule('schema-manager')}
              className={`px-3 py-2 rounded-md text-left text-xs transition border-0 cursor-pointer ${
                activeModule === 'schema-manager' || activeModule === 'object-group-creation' || activeModule === 'property-creation'
                  ? 'bg-[#fff0eb] text-[#df6d50] font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium bg-transparent'
              }`}
            >
              Object Group &amp; Property Creation
            </button>
          </nav>
        )}
      </div>

      {/* Monday to HubSpot Accordion */}
      <div className="mt-1">
        <button
          type="button"
          onClick={() => {
            setMondayOpen(!mondayOpen);
            if (activeModule !== 'monday') onSelectModule('monday');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer select-none transition border-0 bg-transparent"
        >
          <span className="inline-flex items-center gap-2.5 font-semibold text-inherit">
            <svg className="w-[18px] h-[18px] shrink-0 inline-block align-middle" viewBox="0 0 24 24" aria-hidden="true">
              <g transform="translate(1.5, 5.5)">
                <path d="M2.62 12.627a2.63 2.63 0 0 1-2.292-1.33A2.54 2.54 0 0 1 .4 8.679l4.72-7.412A2.63 2.63 0 0 1 7.45.001a2.63 2.63 0 0 1 2.255 1.39 2.54 2.54 0 0 1-.142 2.614l-4.717 7.412a2.63 2.63 0 0 1-2.226 1.21" fill="#FF3D57"/>
                <path d="M10.716 12.627A2.62 2.62 0 0 1 8.428 11.3 2.54 2.54 0 0 1 8.5 8.689l4.711-7.395A2.63 2.63 0 0 1 15.543.001c.96.021 1.83.558 2.27 1.398.437.84.373 1.847-.17 2.626l-4.71 7.395a2.63 2.63 0 0 1-2.217 1.207" fill="#FFCC00"/>
                <circle cx="18.631" cy="10.31" r="2.379" fill="#00CA72"/>
              </g>
            </svg>
            <span>Monday to HubSpot</span>
          </span>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mondayOpen ? 'rotate-90' : ''}`} />
        </button>

        {mondayOpen && (
          <nav className="flex flex-col gap-1 my-1.5 ml-3.5 pl-3 border-l border-slate-200" aria-label="Migration steps">
            {[
              { idx: 0, label: 'Choose workbook', sub: 'Select your Monday export' },
              { idx: 1, label: 'Map columns', sub: 'Choose HubSpot destinations' },
              { idx: 2, label: 'Review & validate', sub: 'Check before you import' },
              { idx: 3, label: 'Run & monitor', sub: 'Follow the live results' },
            ].map((step) => {
              const isActive = activeModule === 'monday' && mondayStep === step.idx;
              return (
                <button
                  key={step.idx}
                  type="button"
                  onClick={() => handleMondayClick(step.idx)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition border-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#fff0eb] text-[#df6d50] font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium bg-transparent'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                      isActive
                        ? 'bg-[#ff7a59] border-[#ff7a59] text-white'
                        : 'border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    {step.idx + 1}
                  </span>
                  <span>
                    <strong>{step.label}</strong>
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      <div className="mt-auto pt-6 text-[11px] text-slate-400 flex items-center gap-1.5 select-none">
        <i className="inline-block w-2 h-2 rounded-full mr-1.5 bg-emerald-500" /> Private &amp; local
      </div>
    </aside>
  );
}

