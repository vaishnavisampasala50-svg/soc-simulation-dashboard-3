import { DynamicIcon } from './DynamicIcon';
import type { SecurityEvent } from '../types';
import { SEVERITY_META } from '../data/threats';

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ago`;
}

function AlertRow({ event }: { event: SecurityEvent }) {
  const meta = SEVERITY_META[event.severity];

  const statusBadge =
    event.status === 'active'
      ? { text: 'ACTIVE', cls: 'bg-critical/15 text-critical border-critical/30' }
      : event.status === 'investigating'
        ? { text: 'INVESTIGATING', cls: 'bg-medium/15 text-medium border-medium/30' }
        : { text: 'RESOLVED', cls: 'bg-low/15 text-low border-low/30' };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-soc-border bg-soc-panel2/60 p-3 transition-colors hover:border-soc-border2">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.bg} ${meta.border} border`}>
        <DynamicIcon name={event.icon} className={`h-4 w-4 ${meta.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-soc-text">
            {event.label}
          </p>
          <span className="shrink-0 text-[10px] font-medium text-soc-muted">
            {timeAgo(event.timestamp)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-soc-dim">{event.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase ${meta.border} ${meta.bg} ${meta.color}`}>
            {meta.label}
          </span>
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase ${statusBadge.cls}`}>
            {statusBadge.text}
          </span>
          <span className="rounded border border-soc-border bg-soc-bg/50 px-1.5 py-0.5 font-mono text-[10px] text-soc-dim">
            {event.sourceIp}
          </span>
          <span className="rounded border border-soc-border bg-soc-bg/50 px-1.5 py-0.5 font-mono text-[10px] text-soc-dim">
            {event.targetSystem}
          </span>
        </div>
      </div>
    </div>
  );
}

export function LiveAlerts({ alerts }: { alerts: SecurityEvent[] }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-soc-border bg-soc-panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-soc-text">
          Live Threat Alerts
        </h2>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-critical">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-critical/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-critical" />
          </span>
          {alerts.length} active
        </span>
      </div>

      <div className="soc-scroll -mr-2 flex-1 space-y-2.5 overflow-y-auto pr-2" style={{ maxHeight: 460 }}>
        {alerts.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-soc-muted">
            <DynamicIcon name="ShieldCheck" className="h-8 w-8 opacity-60" />
            <p className="text-sm">No active threats detected</p>
            <p className="text-xs">Start the simulation or generate a threat.</p>
          </div>
        ) : (
          alerts.map((a) => <AlertRow key={a.id} event={a} />)
        )}
      </div>
    </div>
  );
}
