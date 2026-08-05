import { DonutChart } from './DonutChart';
import { BarChart } from './BarChart';
import { THREAT_ORDER, THREAT_TYPES, SEVERITY_META } from '../data/threats';
import type { Severity, ThreatTypeId } from '../types';

const SEVERITY_COLORS: Record<Severity, string> = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

const THREAT_COLORS: Record<ThreatTypeId, string> = {
  malware: '#f97316',
  phishing: '#eab308',
  sqli: '#ef4444',
  brute_force: '#38bdf8',
  ddos: '#a855f7',
  firewall: '#2dd4bf',
  unauthorized_access: '#fb7185',
};

interface Props {
  threatCounts: Record<ThreatTypeId, number>;
  events: { severity: Severity }[];
}

export function AttackStatistics({ threatCounts, events }: Props) {
  const total = THREAT_ORDER.reduce((s, id) => s + threatCounts[id], 0);

  const donutData = (['critical', 'high', 'medium', 'low'] as Severity[])
    .map((sev) => ({
      label: SEVERITY_META[sev].label,
      value: events.filter((e) => e.severity === sev).length,
      color: SEVERITY_COLORS[sev],
    }))
    .filter((d) => d.value > 0);

  const barData = THREAT_ORDER.map((id) => ({
    label: THREAT_TYPES[id].label,
    value: threatCounts[id],
    color: THREAT_COLORS[id],
  }));

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-soc-border bg-soc-panel p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-soc-text">
          Attack Statistics
        </h2>
        <span className="text-[11px] text-soc-dim">{total} total detections</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col items-center justify-center">
          <DonutChart
            data={donutData.length ? donutData : [{ label: 'None', value: 1, color: '#1e293b' }]}
            centerValue={total}
            centerLabel="Detections"
          />
          <p className="mt-3 text-center text-[11px] text-soc-dim">
            Distribution by severity
          </p>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-soc-dim">
            By attack type
          </p>
          <BarChart data={barData} />
        </div>
      </div>
    </div>
  );
}
