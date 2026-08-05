import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  EventStatus,
  SecurityEvent,
  SystemHealth,
  ThreatLevel,
  ThreatTypeId,
} from './types';
import {
  THREAT_TYPES,
  SEVERITY_RANK,
  THREAT_LEVEL_LABELS,
  pickRandomThreatId,
  randomSourceIp,
  randomTarget,
} from './data/threats';

const MAX_EVENTS = 120;
const MAX_ALERTS = 60;
const TICK_MS = 2600;

const INITIAL_SYSTEMS: SystemHealth[] = [
  { key: 'firewall', label: 'Firewall', icon: 'Shield', load: 34, status: 'healthy' },
  { key: 'ids', label: 'Intrusion Detection', icon: 'Radar', load: 41, status: 'healthy' },
  { key: 'endpoint', label: 'Endpoint Protection', icon: 'MonitorSmartphone', load: 28, status: 'healthy' },
  { key: 'network', label: 'Network Traffic', icon: 'Network', load: 47, status: 'healthy' },
  { key: 'auth', label: 'Authentication Svc', icon: 'Fingerprint', load: 22, status: 'healthy' },
];

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `evt-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

export interface SimulationState {
  running: boolean;
  events: SecurityEvent[];
  alerts: SecurityEvent[];
  systems: SystemHealth[];
  threatLevel: ThreatLevel;
  totalAlerts: number;
  resolvedIncidents: number;
  riskScore: number;
  throughput: number[]; // events per tick history (for area chart)
  threatCounts: Record<ThreatTypeId, number>;
}

function computeThreatLevel(events: SecurityEvent[]): ThreatLevel {
  if (events.length === 0) {
    return { level: 'low', score: 12, label: THREAT_LEVEL_LABELS.low };
  }
  const now = Date.now();
  const recent = events.filter((e) => now - e.timestamp < 60000 && e.status !== 'resolved');
  if (recent.length === 0) {
    return { level: 'low', score: 18, label: THREAT_LEVEL_LABELS.low };
  }
  const maxRank = Math.max(...recent.map((e) => SEVERITY_RANK[e.severity]));
  const criticalCount = recent.filter((e) => e.severity === 'critical').length;
  const highCount = recent.filter((e) => e.severity === 'high').length;
  const volumeFactor = Math.min(recent.length * 3, 34);
  const severityFactor = maxRank * 14;
  const surge = criticalCount * 6 + highCount * 3;
  const score = Math.min(100, 10 + volumeFactor + severityFactor + surge);

  let level: ThreatLevel['level'] = 'low';
  if (score >= 78) level = 'critical';
  else if (score >= 55) level = 'high';
  else if (score >= 32) level = 'medium';

  return { level, score, label: THREAT_LEVEL_LABELS[level] };
}

function statusFromSeverity(severity: SecurityEvent['severity']): EventStatus {
  if (severity === 'critical' || severity === 'high') return 'active';
  return 'investigating';
}

function updateSystems(
  systems: SystemHealth[],
  event: SecurityEvent | null,
  running: boolean,
): SystemHealth[] {
  return systems.map((s) => {
    let load = s.load;
    // gentle drift toward a resting baseline depending on run state
    const baseline = running ? 38 : 26;
    load += (baseline - load) * 0.12 + (Math.random() - 0.5) * 6;

    if (event) {
      if (event.threatId === 'ddos' && s.key === 'network') load += 22;
      if (event.threatId === 'ddos' && s.key === 'firewall') load += 16;
      if (event.threatId === 'malware' && s.key === 'endpoint') load += 18;
      if (event.threatId === 'brute_force' && s.key === 'auth') load += 20;
      if (event.threatId === 'sqli' && s.key === 'ids') load += 14;
      if (event.threatId === 'firewall' && s.key === 'firewall') load += 12;
      if (event.threatId === 'unauthorized_access' && s.key === 'auth') load += 16;
    }
    load = Math.max(6, Math.min(99, load));

    let status: SystemHealth['status'] = 'healthy';
    if (load >= 82) status = 'critical';
    else if (load >= 64) status = 'warning';

    return { ...s, load: Math.round(load), status };
  });
}

function emptyThreatCounts(): Record<ThreatTypeId, number> {
  return {
    malware: 0,
    phishing: 0,
    sqli: 0,
    brute_force: 0,
    ddos: 0,
    firewall: 0,
    unauthorized_access: 0,
  };
}

function buildEvent(threatId: ThreatTypeId): SecurityEvent {
  const type = THREAT_TYPES[threatId];
  return {
    id: nextId(),
    threatId,
    label: type.label,
    icon: type.icon,
    severity: type.severity,
    description: type.description,
    recommendation: type.recommendation,
    sourceIp: randomSourceIp(),
    targetSystem: randomTarget(),
    timestamp: Date.now(),
    status: statusFromSeverity(type.severity),
  };
}

export function useSimulation() {
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<SecurityEvent[]>([]);
  const [systems, setSystems] = useState<SystemHealth[]>(INITIAL_SYSTEMS);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [resolvedIncidents, setResolvedIncidents] = useState(0);
  const [throughput, setThroughput] = useState<number[]>(() =>
    Array.from({ length: 30 }, () => 0),
  );

  const runningRef = useRef(running);
  runningRef.current = running;

  // periodic tick — generate events, age/resolve existing ones, drift systems
  useEffect(() => {
    const interval = setInterval(() => {
      if (!runningRef.current) return;

      const newEvent = buildEvent(pickRandomThreatId());

      setEvents((prev) => [newEvent, ...prev].slice(0, MAX_EVENTS));
      setAlerts((prev) => [newEvent, ...prev].slice(0, MAX_ALERTS));
      setTotalAlerts((n) => n + 1);
      setThroughput((prev) => [...prev.slice(1), 1 + Math.floor(Math.random() * 2)]);
      setSystems((prev) => updateSystems(prev, newEvent, true));

      // age existing events toward resolution
      setEvents((prev) =>
        prev.map((e) => {
          const age = Date.now() - e.timestamp;
          if (e.status === 'active' && age > 9000) {
            return { ...e, status: 'investigating' };
          }
          if (e.status === 'investigating' && age > 16000) {
            return { ...e, status: 'resolved' };
          }
          return e;
        }),
      );
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);

  // count resolved incidents as alerts age out
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => {
        const remaining: SecurityEvent[] = [];
        let newlyResolved = 0;
        for (const a of prev) {
          const age = Date.now() - a.timestamp;
          if (a.status === 'resolved' && age > 22000) {
            newlyResolved += 1;
          } else {
            remaining.push(a);
          }
        }
        if (newlyResolved > 0) setResolvedIncidents((n) => n + newlyResolved);
        return remaining.length > MAX_ALERTS
          ? remaining.slice(0, MAX_ALERTS)
          : remaining;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // idle system drift when paused (so health bars still move gently)
  useEffect(() => {
    if (running) return;
    const interval = setInterval(() => {
      setSystems((prev) => updateSystems(prev, null, false));
    }, 3000);
    return () => clearInterval(interval);
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRunning(false);
    setEvents([]);
    setAlerts([]);
    setSystems(INITIAL_SYSTEMS);
    setTotalAlerts(0);
    setResolvedIncidents(0);
    setThroughput(Array.from({ length: 30 }, () => 0));
  }, []);
  const generateRandomThreat = useCallback(() => {
    const newEvent = buildEvent(pickRandomThreatId());
    setEvents((prev) => [newEvent, ...prev].slice(0, MAX_EVENTS));
    setAlerts((prev) => [newEvent, ...prev].slice(0, MAX_ALERTS));
    setTotalAlerts((n) => n + 1);
    setThroughput((prev) => [...prev.slice(1), 2]);
    setSystems((prev) => updateSystems(prev, newEvent, runningRef.current));
  }, []);

  const resolveEvent = useCallback((id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'resolved' } : e)),
    );
    setAlerts((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'resolved' } : e)),
    );
    setResolvedIncidents((n) => n + 1);
  }, []);

  const threatCounts = emptyThreatCounts();
  for (const e of events) {
    threatCounts[e.threatId] += 1;
  }

  const activeThreats = events.filter((e) => e.status !== 'resolved').length;
  const threatLevel = computeThreatLevel(events);
  const riskScore = Math.round(threatLevel.score);

  const state: SimulationState = {
    running,
    events,
    alerts,
    systems,
    threatLevel,
    totalAlerts,
    resolvedIncidents,
    riskScore,
    throughput,
    threatCounts,
  };

  return {
    ...state,
    activeThreats,
    start,
    pause,
    reset,
    generateRandomThreat,
    resolveEvent,
  };
}
