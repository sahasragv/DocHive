import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'bg-[#f1ecff] text-[#7653d6]',
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon size={28} />
        </div>

      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {value}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
