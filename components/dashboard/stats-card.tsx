import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ label, value, icon: Icon, iconColor = 'text-primary' }: StatsCardProps) {
  return (
    <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-neutral-400 text-sm font-medium">{label}</span>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}
