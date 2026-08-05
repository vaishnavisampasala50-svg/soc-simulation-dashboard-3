import { DynamicIcon } from './DynamicIcon';
import type { Severity, ThreatLevel } from '../types';
import { SEVERITY_META } from '../data/threats';

function GaugeArc({ level, score }: { level: Severity; score: number }) {
  const colorMap: Record<Severity, string> = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  };
  const color = colorMap[level];
  const size = 200;
  const thickness = 14;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1), stroke 0.5s ease',
            filter: `drop-shadow(0 0 6px ${color}aa)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <DynamicIcon
          name={level === 'critical' ? 'ShieldAlert' : level === 'high' ? 'ShieldAlert' : 'Shield'}
          className={`h-7 w-7 ${SEVERITY_META[level].color}`}
        />
        <span className={`mt-1 text-4xl font-bold tnum ${SEVERITY_META[level].color}`}>
          {score}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-soc-dim">
          Risk Index
        </span>
      </div>
    </div>
  );
}

export function ThreatLevelIndicator({ threatLevel }: { threatLevel: ThreatLevel }) {
  const { level, score, label } = threatLevel;
  const meta = SEVERITY_META[level];

  return (
    <div className={`flex h-full flex-col rounded-xl border ${meta.border} bg-soc-panel p-5`}>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-soc-text">
          Threat Level
        </h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-soc-dim">
          Real-time
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-2">
        <GaugeArc level={level} score={score} />
        <div className="text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full border ${meta.border} ${meta.bg} px-4 py-1.5`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${level === 'critical' || level === 'high' ? 'animate-pulse-soft' : ''}`}
              style={{ backgroundColor: 'currentColor' }}
            />
            <span className={`text-sm font-bold uppercase tracking-wider ${meta.color}`}>
              {label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {(['low', 'medium', 'high', 'critical'] as Severity[]).map((s) => (
          <div
            key={s}
            className={`rounded-md border px-1 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide ${
              level === s
                ? `${SEVERITY_META[s].border} ${SEVERITY_META[s].bg} ${SEVERITY_META[s].color}`
                : 'border-soc-border bg-soc-bg/40 text-soc-muted'
            }`}
          >
            {SEVERITY_META[s].label}
          </div>
        ))}
      </div>
    </div>
  );
}
