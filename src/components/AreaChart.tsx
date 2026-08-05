import { useEffect, useRef, useState } from 'react';

/**
 * Animated area/line chart for event throughput over time.
 * Pure SVG, no deps. The sliding data window provides the motion.
 */
export function AreaChart({
  data,
  height = 70,
  color = '#2dd4bf',
  label = 'Events / interval',
}: {
  data: number[];
  height?: number;
  color?: string;
  label?: string;
}) {
  const [width, setWidth] = useState(320);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(Math.max(120, entry.contentRect.width));
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const max = Math.max(4, ...data);
  const stepX = width / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - (v / max) * (height - 6) - 3;
    return [x, y] as const;
  });
  const line =
    points.length > 0
      ? points
          .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
          .join(' ')
      : '';
  const area =
    points.length > 0
      ? `${line} L${points[points.length - 1][0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`
      : '';
  const last = data[data.length - 1] ?? 0;

  return (
    <div ref={containerRef} className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-soc-dim">
          {label}
        </span>
        <span className="text-xs font-semibold tnum text-soc-text">
          {last} <span className="text-soc-dim">/ interval</span>
        </span>
      </div>
      <svg
        width={width}
        height={height}
        className="block w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={0}
            x2={width}
            y1={height * g}
            y2={height * g}
            stroke="#1e293b"
            strokeWidth={1}
            strokeDasharray="3 5"
          />
        ))}
        <path d={area} fill="url(#areaFill)" />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
