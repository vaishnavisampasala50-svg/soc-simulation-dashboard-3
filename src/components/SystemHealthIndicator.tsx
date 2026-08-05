import { DynamicIcon } from './DynamicIcon';
import type { SystemHealth } from '../types';

function statusColor(status: SystemHealth['status']): { bar: string; text: string; dot: string } {
  if (status === 'critical') return { bar: 'bg-critical', text: 'text-critical', dot: 'bg-critical animate-pulse-soft' };
  if (status === 'warning') return { bar: 'bg-medium', text: 'text-medium', dot: 'bg-medium' };
  return { bar: 'bg-low', text: 'text-low', dot: 'bg-low' };
}

function SystemRow({ system }: { system: SystemHealth }) {
  const c = statusColor(system.status);
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-soc-border bg-soc-bg/50">
        <DynamicIcon name={system.icon} className="h-4 w-4 text-soc-dim" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-soc-text">
            {system.label}
          </span>
          <span className={`flex items-center gap-1 text-xs font-semibold tnum ${c.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {system.load}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-soc-bg/70">
          <div
            className={`h-full rounded-full ${c.bar} transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
            style={{ width: `${system.load}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function SystemHealthIndicator({ systems }: { systems: SystemHealth[] }) {
  const critical = systems.filter((s) => s.status === 'critical').length;
  const warning = systems.filter((s) => s.status === 'warning').length;
  const overall = critical > 0 ? 'Degraded' : warning > 0 ? 'Elevated Load' : 'Operational';

  return (
    <div className="flex flex-col rounded-xl border border-soc-border bg-soc-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-soc-text">
          System Health
        </h2>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            critical > 0
              ? 'border-critical/40 bg-critical/10 text-critical'
              : warning > 0
                ? 'border-medium/40 bg-medium/10 text-medium'
                : 'border-low/40 bg-low/10 text-low'
          }`}
        >
          {overall}
        </span>
      </div>
      <div className="flex flex-col gap-3.5">
        {systems.map((s) => (
          <SystemRow key={s.key} system={s} />
        ))}
      </div>
    </div>
  );
}
