export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ThreatTypeId =
  | 'malware'
  | 'phishing'
  | 'sqli'
  | 'brute_force'
  | 'ddos'
  | 'firewall'
  | 'unauthorized_access';

export interface ThreatType {
  id: ThreatTypeId;
  label: string;
  icon: string; // lucide icon name
  severity: Severity;
  description: string;
  recommendation: string;
}

export type EventStatus = 'active' | 'investigating' | 'resolved';

export interface SecurityEvent {
  id: string;
  threatId: ThreatTypeId;
  label: string;
  icon: string;
  severity: Severity;
  description: string;
  recommendation: string;
  sourceIp: string;
  targetSystem: string;
  timestamp: number;
  status: EventStatus;
}

export interface ThreatTypeInfo extends ThreatType {
  count: number;
}

export interface ThreatLevel {
  level: Severity;
  score: number; // 0-100
  label: string;
}

export type SystemKey = 'firewall' | 'ids' | 'endpoint' | 'network' | 'auth';

export interface SystemHealth {
  key: SystemKey;
  label: string;
  icon: string;
  load: number; // 0-100
  status: 'healthy' | 'warning' | 'critical';
}
