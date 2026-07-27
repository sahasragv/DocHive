import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'bg-blue-100 text-blue-600',
  trend,
}: StatCardProps) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon size={28} />
        </div>

        {trend && (
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight size={14} />
            {trend}
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          {value}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}