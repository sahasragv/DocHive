import { Bot, Calendar, CheckCircle2, Clock3, Database, FileText, LoaderCircle, SearchCheck, Trash2, XCircle } from 'lucide-react';
import type { Document } from '../../types/document';

interface DocumentCardProps { document: Document; formatSize: (size: number) => string; onDelete: () => void; }

const statusDetails = (value: string) => {
  const status = value.toLowerCase();
  if (status.includes('indexed')) return { label: 'AI Ready', description: 'Available to AI Assistant', Icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' };
  if (status.includes('fail')) return { label: 'Indexing Failed', description: 'Not available for AI queries', Icon: XCircle, style: 'bg-rose-50 text-rose-700 ring-rose-600/10' };
  if (status.includes('process')) return { label: 'Processing', description: 'Not ready for AI queries', Icon: LoaderCircle, style: 'bg-amber-50 text-amber-700 ring-amber-600/10' };
  return { label: 'Uploaded', description: 'Not ready for AI queries', Icon: Clock3, style: 'bg-slate-100 text-slate-700 ring-slate-600/10' };
};

export default function DocumentCard({ document, formatSize, onDelete }: DocumentCardProps) {
  const status = statusDetails(document.status);
  const StatusIcon = status.Icon;
  const fileType = document.originalName.split('.').pop()?.toUpperCase() || document.mimetype || 'FILE';
  const aiReady = status.label === 'AI Ready';
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><FileText size={24} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="break-all text-lg font-semibold text-slate-900">{document.originalName}</h2><span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold tracking-wide text-slate-600">{fileType}</span></div><div className="mt-3 flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${status.style}`}><StatusIcon size={13} className={status.label === 'Processing' ? 'animate-spin' : undefined} />{status.label}</span><span className="text-xs text-slate-500">{status.description}</span></div></div></div>
        <button type="button" onClick={onDelete} aria-label={`Delete ${document.originalName}`} className="rounded-xl p-2.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={18} /></button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-3.5"><div className="flex items-center gap-2 text-xs text-slate-500"><Database size={15} className="text-violet-600" /> Knowledge chunks</div><p className="mt-2 text-lg font-semibold text-slate-900">{document.chunkCount}</p></div>
        <div className="rounded-xl bg-slate-50 p-3.5"><div className="flex items-center gap-2 text-xs text-slate-500"><FileText size={15} className="text-blue-600" /> File size</div><p className="mt-2 text-lg font-semibold text-slate-900">{formatSize(document.size)}</p></div>
        <div className="rounded-xl bg-slate-50 p-3.5"><div className="flex items-center gap-2 text-xs text-slate-500"><Calendar size={15} className="text-slate-500" /> Uploaded</div><p className="mt-2 text-sm font-semibold text-slate-900">{new Date(document.uploadedAt).toLocaleDateString()}</p></div>
        <div className={`rounded-xl p-3.5 ${aiReady ? 'bg-emerald-50' : 'bg-slate-50'}`}><div className={`flex items-center gap-2 text-xs ${aiReady ? 'text-emerald-700' : 'text-slate-500'}`}>{aiReady ? <SearchCheck size={15} /> : <Bot size={15} />} AI Assistant</div><p className={`mt-2 text-sm font-semibold ${aiReady ? 'text-emerald-900' : 'text-slate-700'}`}>{aiReady ? 'Available to AI Assistant' : 'Unavailable until indexed'}</p></div>
      </div>
    </article>
  );
}
