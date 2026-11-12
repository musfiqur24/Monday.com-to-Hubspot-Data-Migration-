import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { request } from '../hooks/useApi.js';
import { LoadingOverlay } from '../components/ui/Loader.jsx';

const COLORS = ['#ff785a', '#6983ee', '#24b8a6', '#af7dea', '#e3b34f', '#6aadc4'];
const color = (i) => COLORS[i % COLORS.length];
const num = (v) => (v ?? 0).toLocaleString();

function MetricCard({ label, value, sub, iconText, iconClass }) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-slate-500">{label}</span>
        <span className={`text-lg font-bold ${iconClass}`}>{iconText}</span>
      </div>
      <strong className="text-[2rem] font-bold text-slate-900 leading-none">{num(value)}</strong>
      <small className="text-[12px] text-slate-400">{sub}</small>
    </article>
  );
}

function WeeklyChart({ weeks = [] }) {
  if (!weeks.length) return <div className="text-slate-400 italic text-sm p-4">No data.</div>;
  const left = 56, bottom = 215, plotHeight = 195;
  const peak = Math.max(1, ...weeks.map((w) => Math.max(w.records || 0, w.files || 0)));
  const max = peak <= 4 ? 4 : Math.ceil(peak / 4) * 4;
  const fmt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const lines = Array.from({ length: 5 }, (_, i) => {
    const y = bottom - (i / 4) * plotHeight;
    return <g key={i}>
      <line x1={left} y1={y} x2={785} y2={y} stroke="#edf0f5" />
      <text x={44} y={y + 4} textAnchor="end" fontSize={11} fill="#94a3b8">{num(max * i / 4)}</text>
    </g>;
  });
  const bars = weeks.flatMap((week, idx) => {
    const x = left + ((785 - left) / weeks.length) * (idx + 0.5);
    return [
      ['records', COLORS[0], -18],
      ['files', COLORS[1], 3],
    ].map(([key, clr, dx]) => {
      const h = (week[key] || 0) / max * plotHeight;
      return <rect key={`${idx}-${key}`} x={x + dx} y={bottom - h} width={15} height={h} rx={4} fill={clr}>
        <title>Week of {week.start}: {week[key] || 0} {key}</title>
      </rect>;
    }).concat(
      <text key={`${idx}-lbl`} x={x} y={242} textAnchor="middle" fontSize={10} fill="#94a3b8">
        {fmt.format(new Date(week.start + 'T00:00:00Z'))}
      </text>
    );
  });
  const hasData = weeks.some((w) => w.records || w.files);
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 800 260" role="img" className="w-full" aria-label="Weekly migration activity">
        <title>Weekly completed CRM records and files</title>
        {lines}{bars}
      </svg>
      {!hasData && <p className="text-center text-slate-400 text-sm mt-2">No completed records in the last 8 weeks</p>}
    </div>
  );
}

function DonutChart({ objects = [], total = 0 }) {
  if (!total) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-40 h-40 rounded-full border-[12px] border-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-slate-800">0</div>
            <div className="text-[11px] text-slate-400">No migrations yet</div>
          </div>
        </div>
      </div>
    );
  }
  let offset = 0;
  const stops = objects.map(([, count], i) => {
    const start = offset; offset += total ? (count / total) * 100 : 0;
    return `${color(i)} ${start}% ${offset}%`;
  });
  const gradient = `conic-gradient(${stops.join(',')})`;
  return (
    <div className="flex items-center gap-6">
      <div
        className="w-40 h-40 shrink-0 rounded-full flex items-center justify-center relative"
        style={{ background: gradient }}
        aria-label={objects.map(([n, c]) => `${n}: ${c}`).join(', ')}
      >
        <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
          <strong className="text-[22px] font-bold text-slate-900 leading-none">{num(total)}</strong>
          <span className="text-[11px] text-slate-400 mt-0.5">records migrated</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {objects.map(([name, count], i) => (
          <div key={name} className="flex items-center justify-between gap-6 text-[12px]">
            <span className="flex items-center gap-2 text-slate-700">
              <i className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color(i) }} />
              {name}
            </span>
            <strong className="text-slate-900 tabular-nums">{num(count)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Dashboard({ onShowToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async ({ notifySuccess = false } = {}) => {
    if (loading) return;
    setLoading(true);
    try {
      const d = await request('/api/dashboard');
      setData(d);
      if (notifySuccess) onShowToast?.('Dashboard refreshed.', 'success');
    } catch (err) {
      onShowToast?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [loading, onShowToast]);

  useEffect(() => {
    refresh();
    const id = setInterval(() => { if (!document.hidden) refresh(); }, 30000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line

  const objects = data ? data.objects.map((o) => [o.name, o.count, o.source]) : [];

  return (
    <div className="py-6 px-8 max-w-6xl">
      <LoadingOverlay show={loading && !data} title="Loading dashboard…" sub="Fetching migration data" />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-slate-400 mb-1 uppercase">Your Migration Workspace</div>
          <h1 className="text-[2.2rem] font-black text-slate-900 leading-tight">
            Migration overview<span className="text-[#ff7a59]">.</span>
          </h1>
          <p className="text-slate-500 mt-1 text-[13px]">Every record. One clear view.</p>
        </div>
        <button
          type="button"
          onClick={() => refresh({ notifySuccess: true })}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total migrated" value={data?.total} sub="Across all migration modules" iconText="↗" iconClass="text-orange-400" />
        <MetricCard label="Contacts" value={data?.contacts} sub="Successfully migrated records" iconText="◎" iconClass="text-violet-400" />
        <MetricCard label="Files" value={data?.files} sub="Completed file assignments" iconText="▪" iconClass="text-blue-400" />
        <MetricCard label="Needs attention" value={data?.failed} sub="Failed or uncertain records" iconText="!" iconClass="text-amber-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-4">
        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="font-bold text-slate-800 text-[15px]">Weekly migration activity</h2>
              <p className="text-[12px] text-slate-400">Completed records over the last 8 weeks</p>
            </div>
            <span className="text-[11px] px-2.5 py-1 bg-slate-100 rounded-md text-slate-500 font-medium">Weekly · UTC</span>
          </div>
          <div className="flex items-center gap-4 mb-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <i className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[0] }} />CRM records
            </span>
            <span className="flex items-center gap-1.5">
              <i className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[1] }} />Files
            </span>
          </div>
          <WeeklyChart weeks={data?.weeks ?? []} />
          <p className="text-[11px] text-slate-400 mt-2">Monday contacts use their latest completion; HubSpot records and files use their first completed migration.</p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6 w-full lg:w-[320px] shrink-0">
          <h2 className="font-bold text-slate-800 text-[15px] mb-0.5">Migrated by object</h2>
          <p className="text-[12px] text-slate-400 mb-5">Successfully completed records</p>
          <DonutChart objects={objects} total={data?.total ?? 0} />
        </article>
      </div>

      {/* Object breakdown table */}
      <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-[15px]">Object breakdown</h2>
            <p className="text-[12px] text-slate-400">All migration modules</p>
          </div>
          <span className="text-[11px] px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium border border-emerald-100">Saved migration data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Object', 'Migrated records', 'Source', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {objects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic text-[13px]">
                    {data ? 'No migrations yet.' : 'Loading…'}
                  </td>
                </tr>
              )}
              {objects.map(([name, count, source], i) => (
                <tr key={name} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-medium text-slate-800">
                    <span className="inline-flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[11px]"
                        style={{ background: color(i) }}>{name[0]}</span>
                      {name}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-900 tabular-nums">{num(count)}</td>
                  <td className="px-6 py-3 text-slate-500">{source}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-md font-medium ${count ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {count ? 'Migrated' : 'No records'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 text-[11px] text-slate-400">
          {data ? `Updated ${new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Refreshes every 30 seconds` : 'Loading dashboard…'}
        </div>
      </article>
    </div>
  );
}

