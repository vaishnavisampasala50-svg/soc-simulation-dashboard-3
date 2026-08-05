import { DynamicIcon } from './DynamicIcon';
import type { SecurityEvent } from '../types';
import { SEVERITY_META } from '../data/threats';

export function RecommendationPanel({ event }: { event: SecurityEvent | null }) {
  if (!event) {
    return (
      <div className="flex flex-col rounded-xl border border-soc-border bg-soc-panel p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-soc-text">
          Recommended Security Action
        </h2>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-soc-muted">
          <DynamicIcon name="ShieldCheck" className="h-9 w-9 opacity-50" />
          <p className="text-sm">Select an event from the log</p>
          <p className="max-w-xs text-xs">
            Click any row in the event log to view the recommended response action for that threat.
          </p>
        </div>
      </div>
    );
  }

  const meta = SEVERITY_META[event.severity];

  return (
    <div className={`flex flex-col rounded-xl border ${meta.border} bg-soc-panel p-5`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-soc-text">
          Recommended Security Action
        </h2>
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${meta.border} ${meta.bg} ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      <div className={`mb-4 flex items-start gap-3 rounded-lg border ${meta.border} ${meta.bg} p-3`}>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${meta.border} bg-soc-bg/60`}>
          <DynamicIcon name={event.icon} className={`h-4 w-4 ${meta.color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-soc-text">{event.label}</p>
          <p className="mt-0.5 text-xs text-soc-dim">{event.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded border border-soc-border bg-soc-bg/50 px-1.5 py-0.5 font-mono text-[10px] text-soc-dim">
              {event.sourceIp}
            </span>
            <span className="rounded border border-soc-border bg-soc-bg/50 px-1.5 py-0.5 font-mono text-[10px] text-soc-dim">
              {event.targetSystem}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-accent/25 bg-accent/5 p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <DynamicIcon name="Lock" className="h-4 w-4 text-accent" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
            Response Procedure
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-soc-text">{event.recommendation}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-soc-border bg-soc-bg/40 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-soc-dim">Source</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-soc-text">{event.sourceIp}</p>
        </div>
        <div className="rounded-lg border border-soc-border bg-soc-bg/40 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-soc-dim">Target</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-soc-text">{event.targetSystem}</p>
        </div>
        <div className="rounded-lg border border-soc-border bg-soc-bg/40 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-soc-dim">Status</p>
          <p className="mt-0.5 text-[11px] font-semibold capitalize text-soc-text">
            {event.status}
          </p>
        </div>
      </div>
    </div>
  );
}
