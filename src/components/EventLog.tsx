import { DynamicIcon } from './DynamicIcon';
import type { SecurityEvent } from '../types';
import { SEVERITY_META } from '../data/threats';

function fmtTime(ts: number): string {
  const d = new Date(ts);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function statusDot(status: SecurityEvent['status']): string {
  if (status === 'active') return 'bg-critical animate-pulse-soft';
  if (status === 'investigating') return 'bg-medium';
  return 'bg-low';
}

function EventRow({ event, onClick, selected, onResolve }: {
  event: SecurityEvent;
  onClick: () => void;
  selected: boolean;
  onResolve: () => void;
}) {
  const meta = SEVERITY_META[event.severity];
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer border-b border-soc-border/60 transition-colors hover:bg-soc-panel2/60 ${selected ? 'bg-soc-panel2/80' : ''}`}
    >
      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-soc-dim">
        {fmtTime(event.timestamp)}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <DynamicIcon name={event.icon} className={`h-4 w-4 shrink-0 ${meta.color}`} />
          <span className="truncate text-xs font-medium text-soc-text">
            {event.label}
          </span>
        </div>
      </td>
      <td className="hidden px-3 py-2.5 font-mono text-xs text-soc-dim md:table-cell">
        {event.sourceIp}
      </td>
      <td className="hidden px-3 py-2.5 font-mono text-xs text-soc-dim lg:table-cell">
        {event.targetSystem}
      </td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase ${meta.border} ${meta.bg} ${meta.color}`}>
          {meta.label}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs text-soc-dim">
          <span className={`h-2 w-2 rounded-full ${statusDot(event.status)}`} />
          <span className="capitalize">{event.status}</span>
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 text-right">
        {event.status !== 'resolved' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onResolve();
            }}
            className="rounded border border-low/30 bg-low/10 px-2 py-1 text-[10px] font-semibold text-low transition-colors hover:bg-low/20"
          >
            Resolve
          </button>
        )}
      </td>
    </tr>
  );
}

export function EventLog({
  events,
  selectedId,
  onSelect,
  onResolve,
}: {
  events: SecurityEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-soc-border bg-soc-panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-soc-text">
          Event Log
        </h2>
        <span className="text-[11px] text-soc-dim">
          {events.length} {events.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <div className="soc-scroll -mx-2 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-soc-border text-[10px] font-semibold uppercase tracking-wider text-soc-muted">
              <th className="px-3 py-2 font-semibold">Time</th>
              <th className="px-3 py-2 font-semibold">Event</th>
              <th className="hidden px-3 py-2 font-semibold md:table-cell">Source IP</th>
              <th className="hidden px-3 py-2 font-semibold lg:table-cell">Target</th>
              <th className="px-3 py-2 font-semibold">Severity</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-soc-muted">
                  No events recorded. Start the simulation to begin logging.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <EventRow
                  key={e.id}
                  event={e}
                  selected={selectedId === e.id}
                  onClick={() => onSelect(e.id)}
                  onResolve={() => onResolve(e.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
