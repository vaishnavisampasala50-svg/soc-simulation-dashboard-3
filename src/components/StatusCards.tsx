import { AlertTriangle, ShieldAlert, ShieldCheck, Activity, Gauge } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface StatusCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent: string;
  ring: string;
  glowColor: string;
  delta?: string;
  pulse?: boolean;
}

function useCountUp(value: number, duration = 600) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number>();

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration]);

  return display;
}

function StatusCard({
  label,
  value,
  icon: Icon,
  accent,
  ring,
  glowColor,
  delta,
  pulse,
}: StatusCardProps) {
  const numeric = typeof value === 'number';
  const animated = useCountUp(numeric ? (value as number) : 0);
  const display: number | string = numeric ? animated : value;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border ${ring} bg-soc-panel p-4 transition-all duration-300 hover:-translate-y-0.5`}
      style={{ ['--card-glow' as string]: glowColor }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-soc-dim">
            {label}
          </p>
          <p className={`mt-1.5 text-2xl font-bold tnum ${accent} sm:text-3xl`}>
            {display}
            {pulse && numeric && animated > 0 && (
              <span className="ml-1.5 inline-flex h-2 w-2 animate-pulse-soft rounded-full bg-current align-middle" />
            )}
          </p>
          {delta && <p className="mt-0.5 text-[11px] text-soc-dim">{delta}</p>}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ring} bg-soc-bg/50`}>
          <Icon className={`h-5 w-5 ${accent}`} strokeWidth={2.1} />
        </div>
      </div>
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-20 w-20 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.18]"
        style={{ backgroundColor: glowColor }}
      />
    </div>
  );
}

interface Props {
  totalAlerts: number;
  activeThreats: number;
  resolvedIncidents: number;
  systemStatus: string;
  riskScore: number;
}

export function StatusCards({
  totalAlerts,
  activeThreats,
  resolvedIncidents,
  systemStatus,
  riskScore,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      <StatusCard
        label="Total Alerts"
        value={totalAlerts}
        icon={AlertTriangle}
        accent="text-info"
        ring="border-info/30"
        glowColor="#38bdf8"
        delta="Since last reset"
      />
      <StatusCard
        label="Active Threats"
        value={activeThreats}
        icon={ShieldAlert}
        accent="text-high"
        ring="border-high/30"
        glowColor="#f97316"
        delta="Requiring attention"
        pulse
      />
      <StatusCard
        label="Resolved"
        value={resolvedIncidents}
        icon={ShieldCheck}
        accent="text-low"
        ring="border-low/30"
        glowColor="#22c55e"
        delta="Incidents closed"
      />
      <StatusCard
        label="System Status"
        value={systemStatus}
        icon={Activity}
        accent="text-accent"
        ring="border-accent/30"
        glowColor="#2dd4bf"
      />
      <StatusCard
        label="Risk Score"
        value={riskScore}
        icon={Gauge}
        accent={
          riskScore >= 78
            ? 'text-critical'
            : riskScore >= 55
              ? 'text-high'
              : riskScore >= 32
                ? 'text-medium'
                : 'text-low'
        }
        ring="border-soc-border2"
        glowColor={riskScore >= 78 ? '#ef4444' : riskScore >= 55 ? '#f97316' : riskScore >= 32 ? '#eab308' : '#22c55e'}
        delta={riskScore >= 78 ? 'Critical risk' : riskScore >= 55 ? 'High risk' : riskScore >= 32 ? 'Elevated' : 'Nominal'}
      />
    </div>
  );
}
