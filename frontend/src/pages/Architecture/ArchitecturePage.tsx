import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Braces,
  CheckCircle2,
  Database,
  FileText,
  Layers3,
  Network,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type Capability = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  color: string;
  endpoint?: string;
  href?: string;
};

const capabilities: Capability[] = [
  { id: 'ingest', title: 'Secure document ingestion', eyebrow: 'Documents module', description: 'Accepts PDF and DOCX files, validates them, and connects each upload to its owner.', detail: 'Files are limited to 10 MB and accepted only in supported document formats.', icon: UploadCloud, color: 'bg-sky-500', endpoint: 'POST /documents/upload', href: '/upload' },
  { id: 'parse', title: 'Text extraction', eyebrow: 'Document parser', description: 'Turns uploaded files into clean text that can be prepared for retrieval.', detail: 'Parsing happens before the document is made available to the assistant.', icon: FileText, color: 'bg-indigo-500' },
  { id: 'chunk', title: 'Smart chunking', eyebrow: 'Embeddings module', description: 'Breaks long documents into smaller, meaningful knowledge segments.', detail: 'Chunked content lets retrieval return precise evidence instead of whole files.', icon: Layers3, color: 'bg-violet-500' },
  { id: 'embed', title: 'Semantic embeddings', eyebrow: 'Gemini / Ollama providers', description: 'Converts each knowledge segment into vector representations of its meaning.', detail: 'Multiple embedding providers are available behind one service layer.', icon: BrainCircuit, color: 'bg-fuchsia-500' },
  { id: 'vector', title: 'Vector knowledge store', eyebrow: 'MongoDB Atlas vector search', description: 'Stores indexed chunks and finds the most relevant knowledge for a question.', detail: 'Semantic search matches meaning, not only exact keywords.', icon: Database, color: 'bg-emerald-500', endpoint: 'POST /retrieval/search', href: '/retrieval' },
  { id: 'retrieve', title: 'Grounded retrieval', eyebrow: 'Retrieval module', description: 'Selects the best document chunks to use as context for an AI response.', detail: 'Each answer can return the matching document ID, chunk, and similarity score.', icon: SearchCheck, color: 'bg-teal-500', endpoint: 'POST /retrieval/search', href: '/retrieval' },
  { id: 'answer', title: 'AI answer generation', eyebrow: 'LLM module', description: 'Uses the retrieved context to generate a concise, document-grounded response.', detail: 'Groq and Ollama LLM providers are abstracted behind the same service.', icon: Bot, color: 'bg-orange-500', endpoint: 'POST /chat', href: '/chat' },
];

const ArchitecturePage = () => {
  const [selectedId, setSelectedId] = useState('ingest');
  const [mode, setMode] = useState<'ingestion' | 'question'>('ingestion');
  const selected = useMemo(() => capabilities.find((capability) => capability.id === selectedId) ?? capabilities[0], [selectedId]);
  const visibleCapabilities = mode === 'ingestion' ? capabilities.slice(0, 5) : capabilities.slice(4);
  const SelectedIcon = selected.icon;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-[#eee4ff] via-[#f8f1ff] to-[#ffe5ef] p-7 text-slate-900 shadow-lg shadow-violet-100/70 md:p-10">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#f05b8d]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#7653d6]/15 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3 py-1 text-sm font-medium text-[#7653d6]"><Braces size={15} /> Built on your live backend modules</p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Your document intelligence system, made visible.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Explore how DocHive turns a document into grounded answers. This view reflects the services already powering your application—no new backend workflow is introduced here.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/upload" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7653d6] to-[#f05b8d] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"><UploadCloud size={16} /> Add a document</Link>
            <Link to="/chat" className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#7653d6] transition hover:bg-white"><Sparkles size={16} /> Ask the assistant</Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-blue-600">Interactive system map</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Follow a knowledge request</h2></div><div className="inline-flex rounded-xl bg-slate-100 p-1"><button onClick={() => { setMode('ingestion'); setSelectedId('ingest'); }} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'ingestion' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Ingest a file</button><button onClick={() => { setMode('question'); setSelectedId('vector'); }} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'question' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Answer a question</button></div></div>
        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5"><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{visibleCapabilities.map((capability, index) => { const Icon = capability.icon; const active = selectedId === capability.id; return <button key={capability.id} onClick={() => setSelectedId(capability.id)} className={`group relative min-h-40 rounded-2xl border p-4 text-left transition ${active ? 'border-blue-500 bg-white shadow-md ring-4 ring-blue-50' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm'}`}><div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${capability.color}`}><Icon size={19} /></div><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{String(index + 1).padStart(2, '0')} · {capability.eyebrow}</p><h3 className="mt-1 font-semibold text-slate-900">{capability.title}</h3>{index < visibleCapabilities.length - 1 && <ArrowRight size={17} className="absolute -right-6 top-1/2 z-10 hidden -translate-y-1/2 text-slate-300 lg:block" />}</button>; })}</div></div>
          <aside className="rounded-2xl border border-violet-200 bg-gradient-to-br from-white to-[#f7eeff] p-6 text-slate-900 shadow-sm"><div className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${selected.color}`}><SelectedIcon size={21} /></div><p className="mt-5 text-xs font-semibold uppercase tracking-widest text-[#7653d6]">{selected.eyebrow}</p><h3 className="mt-2 text-xl font-semibold">{selected.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{selected.description}</p><div className="mt-5 rounded-xl border border-violet-100 bg-white/75 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-[#7653d6]">Why it matters</p><p className="mt-2 text-sm leading-6 text-slate-600">{selected.detail}</p></div>{selected.endpoint && <p className="mt-4 font-mono text-xs text-[#b43e76]">{selected.endpoint}</p>}{selected.href && <Link to={selected.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7653d6] hover:text-[#5834b6]">Open capability <ArrowRight size={15} /></Link>}</aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ShieldCheck size={20} /></div><h3 className="mt-4 font-semibold text-slate-900">Protected knowledge</h3><p className="mt-2 text-sm leading-6 text-slate-500">JWT-guarded document endpoints keep each user’s document collection separated.</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Network size={20} /></div><h3 className="mt-4 font-semibold text-slate-900">Provider flexibility</h3><p className="mt-2 text-sm leading-6 text-slate-500">Embedding and LLM providers are modular, supporting Gemini, Groq, and Ollama integrations.</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={20} /></div><h3 className="mt-4 font-semibold text-slate-900">Evidence-aware answers</h3><p className="mt-2 text-sm leading-6 text-slate-500">Retrieved chunks include similarity metadata, helping users understand where answers come from.</p></article>
      </section>
    </div>
  );
};

export default ArchitecturePage;
