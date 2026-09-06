import { ArrowRight, CheckCircle2, Clock3, File, FileText, LoaderCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Document } from '../../types/document';

interface RecentDocumentsProps { documents: Document[]; }

const formatSize = (size: number) => size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
const fileType = (document: Document) => document.originalName.split('.').pop()?.toUpperCase() || document.mimetype || 'FILE';
const statusDetails = (value: string) => {
  const status = value.toLowerCase();
  if (status.includes('indexed')) return { label: 'Indexed', Icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' };
  if (status.includes('fail')) return { label: 'Failed', Icon: XCircle, style: 'bg-rose-50 text-rose-700 ring-rose-600/10' };
  if (status.includes('process')) return { label: 'Processing', Icon: LoaderCircle, style: 'bg-amber-50 text-amber-700 ring-amber-600/10' };
  return { label: value || 'Uploaded', Icon: Clock3, style: 'bg-slate-100 text-slate-700 ring-slate-600/10' };
};

export default function RecentDocuments({ documents }: RecentDocumentsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-violet-100 px-6 py-5"><div><h2 className="text-xl font-semibold text-slate-900">Recent documents</h2><p className="mt-1 text-sm text-slate-500">Recently uploaded knowledge sources</p></div><Link to="/documents" className="flex items-center gap-2 text-sm font-semibold text-[#7653d6] transition hover:text-[#5834b6]">View all <ArrowRight size={16} /></Link></div>
      <div className="divide-y divide-slate-100">
        {documents.map((document) => {
          const status = statusDetails(document.status);
          const StatusIcon = status.Icon;
          return <Link key={document.id} to="/documents" className="group flex items-center justify-between px-6 py-5 transition hover:bg-[#faf8ff]"><div className="flex min-w-0 items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f1ecff]"><FileText size={22} className="text-[#7653d6]" /></div><div className="min-w-0"><h3 className="truncate font-semibold text-slate-900">{document.originalName}</h3><div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><File size={13} /> {fileType(document)}</span><span>{formatSize(document.size)}</span><span>{document.chunkCount} chunks</span><span>{new Date(document.uploadedAt).toLocaleDateString()}</span></div></div></div><span className={`ml-4 hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 sm:inline-flex ${status.style}`}><StatusIcon size={13} className={status.label === 'Processing' ? 'animate-spin' : undefined} />{status.label}</span><ArrowRight size={18} className="ml-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#7653d6]" /></Link>;
        })}
      </div>
    </section>
  );
}
