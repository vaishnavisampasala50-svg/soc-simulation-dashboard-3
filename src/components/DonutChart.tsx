import { useEffect, useState } from 'react';

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

/**
 * Animated SVG donut chart. Values tween on change for a smooth effect.
 */
export function DonutChart({
  data,
  size = 180,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
}) {
  const [animated, setAnimated] = useState<DonutSlice[]>(
    data.map((d) => ({ ...d, value: 0 })),
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(data));
    return () => cancelAnimationFrame(raf);
  }, [data]);

  const total = animated.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
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
          {animated.map((slice) => {
            const fraction = slice.value / total;
            const dash = fraction * circumference;
            const circle = (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dasharray 0.7s cubic-bezier(0.16,1,0.3,1), stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tnum text-soc-text">
            {centerValue}
          </span>
          {centerLabel && (
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-soc-dim">
              {centerLabel}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {data.map((slice) => (
          <div key={slice.label} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-soc-dim">{slice.label}</span>
            <span className="font-semibold tnum text-soc-text">
              {slice.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
