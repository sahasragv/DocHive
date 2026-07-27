import type { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageTitle({
  title,
  description,
  action,
}: PageTitleProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-2 text-slate-600">{description}</p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}
