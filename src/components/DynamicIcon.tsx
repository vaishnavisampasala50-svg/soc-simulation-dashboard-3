import {
  Bug,
  Fish,
  Database,
  KeyRound,
  Radio,
  Shield,
  UserX,
  ShieldAlert,
  Activity,
  Server,
  Cpu,
  HardDrive,
  Network,
  Radar,
  MonitorSmartphone,
  Fingerprint,
  Lock,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Bug,
  Fish,
  Database,
  KeyRound,
  Radio,
  Shield,
  UserX,
  ShieldAlert,
  Activity,
  Server,
  Cpu,
  HardDrive,
  Network,
  Radar,
  MonitorSmartphone,
  Fingerprint,
  Lock,
};

export function DynamicIcon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? ShieldAlert;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
