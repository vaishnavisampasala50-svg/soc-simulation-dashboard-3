import { useEffect, useState } from 'react';

interface BarDatum {
  label: string;
  value: number;
  color: string;
}

/**
 * Animated horizontal bar chart used for attack-type statistics.
 */
export function BarChart({ data, max }: { data: BarDatum[]; max?: number }) {
  const [animated, setAnimated] = useState<BarDatum[]>(
    data.map((d) => ({ ...d, value: 0 })),
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(data));
    return () => cancelAnimationFrame(raf);
  }, [data]);

  const peak = max ?? Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-2.5">
      {animated.map((d) => {
        const pct = (d.value / peak) * 100;
        return (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-xs font-medium text-soc-dim">
              {d.label}
            </span>
            <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-soc-bg/60">
              <div
                className="absolute inset-y-0 left-0 rounded-md transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${d.color}cc, ${d.color})`,
                  boxShadow: `0 0 12px -2px ${d.color}99`,
                }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-semibold tnum text-soc-text">
              {d.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
