import { useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Controls } from '@/components/Controls';
import { StatusCards } from '@/components/StatusCards';
import { ThreatLevelIndicator } from '@/components/ThreatLevelIndicator';
import { LiveAlerts } from '@/components/LiveAlerts';
import { EventLog } from '@/components/EventLog';
import { AttackStatistics } from '@/components/AttackStatistics';
import { SystemHealthIndicator } from '@/components/SystemHealthIndicator';
import { RecommendationPanel } from '@/components/RecommendationPanel';
import { AreaChart } from '@/components/AreaChart';
import { useSimulation } from '@/useSimulation';

export default function App() {
  const sim = useSimulation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEvent = useMemo(
    () => sim.events.find((e) => e.id === selectedId) ?? null,
    [sim.events, selectedId],
  );

  const systemStatusLabel = useMemo(() => {
    const critical = sim.systems.filter((s) => s.status === 'critical').length;
    const warning = sim.systems.filter((s) => s.status === 'warning').length;
    if (critical > 0) return 'Degraded';
    if (warning > 0) return 'Elevated';
    return 'Operational';
  }, [sim.systems]);

  const areaColor =
    sim.threatLevel.level === 'critical'
      ? '#ef4444'
      : sim.threatLevel.level === 'high'
        ? '#f97316'
        : sim.threatLevel.level === 'medium'
          ? '#eab308'
          : '#2dd4bf';

  return (
    <div className="soc-bg min-h-screen text-soc-text">
      <Header running={sim.running} />

      <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6">
        {/* Controls */}
        <div className="mb-5 rounded-xl border border-soc-border bg-soc-panel/60 p-3.5 backdrop-blur-sm sm:p-4">
          <Controls
            running={sim.running}
            onStart={sim.start}
            onPause={sim.pause}
            onReset={() => {
              sim.reset();
              setSelectedId(null);
            }}
            onGenerate={sim.generateRandomThreat}
          />
        </div>

        {/* Status cards */}
        <div className="mb-5">
          <StatusCards
            totalAlerts={sim.totalAlerts}
            activeThreats={sim.activeThreats}
            resolvedIncidents={sim.resolvedIncidents}
            systemStatus={systemStatusLabel}
            riskScore={sim.riskScore}
          />
        </div>

        {/* Row: throughput area + threat level gauge */}
        <div className="mb-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-soc-border bg-soc-panel p-5 lg:col-span-2">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-soc-text">
                Event Throughput
              </h2>
              <span className="text-[11px] text-soc-dim">last 30 intervals</span>
            </div>
            <AreaChart data={sim.throughput} color={areaColor} height={120} />
          </div>
          <ThreatLevelIndicator threatLevel={sim.threatLevel} />
        </div>

        {/* Row: live alerts + system health */}
        <div className="mb-5 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LiveAlerts alerts={sim.alerts} />
          </div>
          <SystemHealthIndicator systems={sim.systems} />
        </div>

        {/* Row: attack statistics (full width) */}
        <div className="mb-5">
          <AttackStatistics threatCounts={sim.threatCounts} events={sim.events} />
        </div>

        {/* Row: event log + recommendation */}
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EventLog
              events={sim.events}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onResolve={(id) => {
                sim.resolveEvent(id);
                if (selectedId === id) setSelectedId(null);
              }}
            />
          </div>
          <RecommendationPanel event={selectedEvent} />
        </div>

        <footer className="border-t border-soc-border pt-4 text-center text-[11px] text-soc-muted">
          SOC Simulation Dashboard · Synthetic threat data for demonstration and training purposes only
        </footer>
      </main>
    </div>
  );
}
