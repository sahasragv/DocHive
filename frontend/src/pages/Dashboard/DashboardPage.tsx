import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Bot, BrainCircuit, Database, FileCog, Files, FileText, LoaderCircle, MessageSquare, Network, SearchCheck, Upload } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import RecentDocuments from '../../components/dashboard/RecentDocuments';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts';
import { getDocuments } from '../../services/api';
import type { Document } from '../../types/document';

interface PipelineStep {
  label: string;
  detail: string;
  icon: LucideIcon;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      try { setDocuments(await getDocuments()); }
      catch (error) { console.error(error); setLoadError(true); }
      finally { setLoading(false); }
    };
    void loadDocuments();
  }, []);

  const metrics = useMemo(() => {
    const indexed = documents.filter((document) => document.status.toLowerCase().includes('indexed')).length;
    const failed = documents.filter((document) => document.status.toLowerCase().includes('fail')).length;
    const processing = documents.length - indexed - failed;
    const chunks = documents.reduce((total, document) => total + (Number.isFinite(document.chunkCount) ? document.chunkCount : 0), 0);
    return { indexed, failed, processing, chunks };
  }, [documents]);

  const recentDocuments = useMemo(() => [...documents].sort((first, second) => new Date(second.uploadedAt).getTime() - new Date(first.uploadedAt).getTime()).slice(0, 5), [documents]);
  const firstName = user?.name.trim().split(/\s+/)[0] || 'there';
  const pipeline: PipelineStep[] = [
    { label: 'Upload', detail: 'PDF or DOCX', icon: Upload }, { label: 'Parse', detail: 'Text extraction', icon: FileText }, { label: 'Chunk', detail: 'Knowledge segments', icon: FileCog }, { label: 'Gemini embeddings', detail: 'Semantic vectors', icon: BrainCircuit }, { label: 'Atlas Vector Search', detail: 'Relevant context', icon: SearchCheck }, { label: 'RAG retrieval', detail: 'Grounded sources', icon: Network }, { label: 'Groq AI', detail: 'Generated answer', icon: Bot },
  ];

  return <div className="space-y-8">
    <WelcomeBanner userName={firstName} hasDocuments={documents.length > 0} />
    <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-[#7653d6]">Workspace overview</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Your knowledge base at a glance</h2></div><Link to="/documents" className="hidden text-sm font-semibold text-slate-600 transition hover:text-[#7653d6] sm:block">Manage documents</Link></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total documents" value={loading ? '—' : documents.length} subtitle="Knowledge sources uploaded" icon={Files} color="bg-[#f1ecff] text-[#7653d6]" />
      <StatCard title="Indexed documents" value={loading ? '—' : metrics.indexed} subtitle="Ready for retrieval" icon={SearchCheck} color="bg-emerald-50 text-emerald-600" />
      <StatCard title="Processing documents" value={loading ? '—' : metrics.processing} subtitle="Awaiting indexing completion" icon={LoaderCircle} color="bg-amber-50 text-amber-600" />
      <StatCard title="Knowledge chunks" value={loading ? '—' : metrics.chunks} subtitle="Extracted document segments" icon={Database} color="bg-violet-50 text-violet-600" />
    </div>

    {loadError ? <section className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center"><h2 className="text-lg font-semibold text-rose-900">Documents could not be loaded</h2><p className="mt-2 text-sm text-rose-700">Refresh the page to try loading your knowledge base again.</p></section>
      : loading ? <section className="rounded-3xl border border-violet-100 bg-white px-6 py-14 text-center shadow-sm"><LoaderCircle size={28} className="mx-auto animate-spin text-[#7653d6]" /><p className="mt-4 text-sm font-medium text-slate-600">Loading your knowledge base...</p></section>
      : documents.length === 0 ? <section className="rounded-3xl border border-dashed border-violet-200 bg-white px-6 py-14 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1ecff] text-[#7653d6]"><BrainCircuit size={28} /></div><h2 className="mt-5 text-2xl font-semibold text-slate-900">Build your organization&apos;s AI knowledge base</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">Upload a PDF or DOCX file and DocHive will extract, chunk, index, and make its content available for grounded AI answers.</p><Link to="/upload" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7653d6] to-[#f05b8d] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"><Upload size={17} /> Upload document</Link></section>
      : <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]"><RecentDocuments documents={recentDocuments} /><section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1ecff] text-[#7653d6]"><MessageSquare size={20} /></div><div><h2 className="font-semibold text-slate-900">AI Knowledge Assistant</h2><p className="text-sm text-slate-500">Grounded answers from your documents.</p></div></div><p className="mt-6 text-sm leading-6 text-slate-600">Ask questions across your organization&apos;s knowledge and review retrieved document sources alongside each response.</p><Link to="/chat" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7653d6] to-[#f05b8d] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"><MessageSquare size={17} /> Ask AI</Link></section></div>}

    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-violet-600">Knowledge pipeline</p><h2 className="mt-1 text-xl font-semibold text-slate-900">From source file to grounded AI response</h2></div><p className="text-sm text-slate-500">How DocHive prepares knowledge for AI.</p></div><div className="mt-6 flex flex-col gap-2 overflow-x-auto pb-1 lg:flex-row lg:items-stretch lg:gap-1">{pipeline.map(({ label, detail, icon: Icon }, index) => <div key={label} className="flex min-w-36 flex-1 items-center gap-2 lg:flex-row"><div className="flex min-h-24 flex-1 flex-col justify-center rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50"><Icon size={19} className="text-blue-600" /><p className="mt-3 text-sm font-semibold text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>{index < pipeline.length - 1 && <ArrowDown size={17} className="mx-auto shrink-0 text-slate-300 lg:rotate-[-90deg]" />}</div>)}</div></section>

    {!loading && documents.length > 0 && <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-medium text-blue-600">Knowledge health</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Indexing status</h2></div><Link to="/documents" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View documents</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-emerald-700">Indexed</p><p className="mt-1 text-2xl font-semibold text-emerald-900">{metrics.indexed}</p></div><div className="rounded-2xl bg-amber-50 p-4"><p className="text-sm text-amber-700">Processing or uploaded</p><p className="mt-1 text-2xl font-semibold text-amber-900">{metrics.processing}</p></div><div className="rounded-2xl bg-rose-50 p-4"><p className="text-sm text-rose-700">Failed</p><p className="mt-1 text-2xl font-semibold text-rose-900">{metrics.failed}</p></div></div></section>}
  </div>;
};

export default DashboardPage;
