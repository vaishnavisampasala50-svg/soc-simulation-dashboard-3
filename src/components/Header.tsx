import { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Radio } from 'lucide-react';

export function Header({ running }: { running: boolean }) {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 border-b border-soc-border/80 bg-soc-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-info/10 ring-1 ring-accent/40">
            <ShieldCheck className="h-5 w-5 text-accent" strokeWidth={2.2} />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent/70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
            </span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-soc-text sm:text-lg">
              SOC Simulation Dashboard
            </h1>
            <p className="text-[11px] text-soc-dim">
              Security Operations Center · Threat Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-2 text-xs text-soc-dim sm:flex">
            <Activity className="h-4 w-4 text-accent" />
            <span className="font-mono">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              className={`h-4 w-4 ${running ? 'text-accent animate-pulse-soft' : 'text-soc-muted'}`}
            />
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                running ? 'text-accent' : 'text-soc-muted'
              }`}
            >
              {running ? 'Live' : 'Standby'}
            </span>
          </div>
          <div className="rounded-lg border border-soc-border bg-soc-panel px-3 py-1.5 font-mono text-sm font-semibold tnum text-soc-text">
            {timeStr}
          </div>
        </div>
      </div>
    </header>
  );
}
