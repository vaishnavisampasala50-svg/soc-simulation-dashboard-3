import type { ThreatType, ThreatTypeId, Severity } from '../types';

export const THREAT_TYPES: Record<ThreatTypeId, ThreatType> = {
  malware: {
    id: 'malware',
    label: 'Malware Detection',
    icon: 'Bug',
    severity: 'high',
    description: 'Malicious software signature detected on endpoint.',
    recommendation:
      'Quarantine the affected endpoint immediately. Run a full anti-malware scan, isolate from the network, and analyze the sample in a sandboxed environment.',
  },
  phishing: {
    id: 'phishing',
    label: 'Phishing Attempt',
    icon: 'Fish',
    severity: 'medium',
    description: 'Suspicious email with credential-harvesting link blocked.',
    recommendation:
      'Do not click links or open attachments. Report the email to the security team, verify the sender through an out-of-band channel, and reset credentials if any interaction occurred.',
  },
  sqli: {
    id: 'sqli',
    label: 'SQL Injection Attack',
    icon: 'Database',
    severity: 'critical',
    description: 'Malicious SQL payload detected in input parameters.',
    recommendation:
      'Block the source IP at the WAF. Review application logs for successful injection, rotate database credentials, and enforce parameterized queries across the codebase.',
  },
  brute_force: {
    id: 'brute_force',
    label: 'Brute Force Login',
    icon: 'KeyRound',
    severity: 'medium',
    description: 'Repeated failed authentication attempts detected.',
    recommendation:
      'Enable account lockout and rate limiting. Force a password reset for targeted accounts, enforce MFA, and review successful logins during the attack window.',
  },
  ddos: {
    id: 'ddos',
    label: 'DDoS Attack',
    icon: 'Radio',
    severity: 'critical',
    description: 'Abnormal traffic surge targeting edge services.',
    recommendation:
      'Activate DDoS mitigation and traffic scrubbing. Scale edge capacity, block offending source ranges, and monitor upstream for volumetric patterns.',
  },
  firewall: {
    id: 'firewall',
    label: 'Firewall Alert',
    icon: 'Shield',
    severity: 'medium',
    description: 'Policy violation flagged by perimeter firewall.',
    recommendation:
      'Review the matched rule and packet metadata. Confirm the policy is still required, block repeat offenders, and update rule sets if a false positive is confirmed.',
  },
  unauthorized_access: {
    id: 'unauthorized_access',
    label: 'Unauthorized Access',
    icon: 'UserX',
    severity: 'high',
    description: 'Access attempt to a restricted resource without privileges.',
    recommendation:
      'Revoke active sessions for the account. Audit access logs for lateral movement, reset credentials, and verify least-privilege role assignments.',
  },
};

export const THREAT_ORDER: ThreatTypeId[] = [
  'malware',
  'phishing',
  'sqli',
  'brute_force',
  'ddos',
  'firewall',
  'unauthorized_access',
];

export const SEVERITY_META: Record<
  Severity,
  { label: string; color: string; bg: string; border: string; ring: string; rank: number }
> = {
  low: {
    label: 'Low',
    color: 'text-low',
    bg: 'bg-low/10',
    border: 'border-low/40',
    ring: 'ring-low/30',
    rank: 1,
  },
  medium: {
    label: 'Medium',
    color: 'text-medium',
    bg: 'bg-medium/10',
    border: 'border-medium/40',
    ring: 'ring-medium/30',
    rank: 2,
  },
  high: {
    label: 'High',
    color: 'text-high',
    bg: 'bg-high/10',
    border: 'border-high/40',
    ring: 'ring-high/30',
    rank: 3,
  },
  critical: {
    label: 'Critical',
    color: 'text-critical',
    bg: 'bg-critical/10',
    border: 'border-critical/40',
    ring: 'ring-critical/30',
    rank: 4,
  },
};

export const SEVERITY_RANK: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const THREAT_LEVEL_LABELS: Record<Severity, string> = {
  low: 'Low Threat',
  medium: 'Elevated',
  high: 'High Threat',
  critical: 'Critical',
};

const SOURCE_IPS = [
  '45.227.89.14',
  '91.240.118.33',
  '203.0.113.7',
  '198.51.100.22',
  '185.220.101.45',
  '104.244.72.115',
  '89.248.165.91',
  '193.169.244.62',
  '212.193.30.128',
  '77.247.108.49',
];

const TARGETS = [
  'web-srv-01',
  'db-cluster-primary',
  'auth-service',
  'edge-gateway',
  'mail-relay-02',
  'vpn-concentrator',
  'api-gateway-prod',
  'internal-proxy-03',
  'app-srv-prod-04',
  'endpoint-finance-09',
];

export function randomSourceIp(): string {
  return SOURCE_IPS[Math.floor(Math.random() * SOURCE_IPS.length)];
}

export function randomTarget(): string {
  return TARGETS[Math.floor(Math.random() * TARGETS.length)];
}

// Weighted threat selection — rarer critical events
const WEIGHTS: Record<ThreatTypeId, number> = {
  malware: 14,
  phishing: 18,
  sqli: 8,
  brute_force: 16,
  ddos: 9,
  firewall: 20,
  unauthorized_access: 15,
};

const TOTAL_WEIGHT = THREAT_ORDER.reduce((s, id) => s + WEIGHTS[id], 0);

export function pickRandomThreatId(): ThreatTypeId {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const id of THREAT_ORDER) {
    r -= WEIGHTS[id];
    if (r <= 0) return id;
  }
  return THREAT_ORDER[0];
}

export function makeEvent(threatId: ThreatTypeId): {
  threatId: ThreatTypeId;
  sourceIp: string;
  targetSystem: string;
  timestamp: number;
} {
  return {
    threatId,
    sourceIp: randomSourceIp(),
    targetSystem: randomTarget(),
    timestamp: Date.now(),
  };
}
