import { Play, Pause, RotateCcw, Zap, ShieldCheck } from 'lucide-react';

interface Props {
  running: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onGenerate: () => void;
}

export function Controls({ running, onStart, onPause, onReset, onGenerate }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={onStart}
        disabled={running}
        className="group inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/15 px-4 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/25 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent/15 disabled:hover:shadow-none"
      >
        <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
        Start Simulation
      </button>
      <button
        type="button"
        onClick={onPause}
        disabled={!running}
        className="group inline-flex items-center gap-2 rounded-lg border border-medium/40 bg-medium/10 px-4 py-2.5 text-sm font-semibold text-medium transition-all hover:bg-medium/20 hover:shadow-glow-yellow disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-medium/10 disabled:hover:shadow-none"
      >
        <Pause className="h-4 w-4 transition-transform group-hover:scale-110" />
        Pause
      </button>
      <button
        type="button"
        onClick={onGenerate}
        className="group inline-flex items-center gap-2 rounded-lg border border-high/40 bg-high/10 px-4 py-2.5 text-sm font-semibold text-high transition-all hover:bg-high/20 hover:shadow-glow-orange"
      >
        <Zap className="h-4 w-4 transition-transform group-hover:scale-110" />
        Generate Random Threat
      </button>
      <button
        type="button"
        onClick={onReset}
        className="group inline-flex items-center gap-2 rounded-lg border border-soc-border2 bg-soc-panel2 px-4 py-2.5 text-sm font-semibold text-soc-dim transition-all hover:border-critical/40 hover:bg-critical/10 hover:text-critical"
      >
        <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
        Reset
      </button>

      <div className="ml-auto hidden items-center gap-1.5 rounded-lg border border-soc-border bg-soc-panel px-3 py-2 text-[11px] font-medium text-soc-dim lg:flex">
        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
        Autonomous monitoring mode
      </div>
    </div>
  );
}
