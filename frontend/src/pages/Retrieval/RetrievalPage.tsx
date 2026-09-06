import { useState } from 'react';
import { ArrowRight, BookOpenText, Database, FileText, LoaderCircle, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { searchKnowledge } from '../../services/api/retrieval.service';
import type { RetrievalResponse } from '../../services/api/retrieval.service';

const examples = ['What is the onboarding process?', 'Summarize our leave policy', 'What are the security requirements?'];

const RetrievalPage = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<RetrievalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runSearch = async (value?: string) => {
    const searchQuery = (value ?? query).trim();
    if (!searchQuery) return;
    setQuery(searchQuery);
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      setResponse(await searchKnowledge(searchQuery));
    } catch (searchError) {
      console.error(searchError);
      setError('Semantic search is unavailable right now. Check that the API and its embedding provider are running, then try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="space-y-7">
    <section className="relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-[#f0e6ff] via-[#f9f1ff] to-[#ffe4ee] p-7 text-slate-900 shadow-lg shadow-violet-100/70 md:p-10">
      <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#f05b8d]/20 blur-3xl" />
      <div className="relative max-w-3xl"><p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3 py-1 text-sm font-medium text-[#7653d6]"><Database size={15} /> Retrieval module</p><h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Explore the knowledge behind every answer.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">Run the same semantic retrieval used by DocHive&apos;s RAG workflow. Inspect matching chunks, their source IDs, and relevance scores before you ask AI.</p></div>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><form onSubmit={(event) => { event.preventDefault(); void runSearch(); }}><label className="text-sm font-semibold text-slate-800" htmlFor="retrieval-query">Search your knowledge base</label><div className="mt-3 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="retrieval-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask a question or describe what you need..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" /></div><button type="submit" disabled={loading || !query.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <LoaderCircle size={17} className="animate-spin" /> : <Search size={17} />}{loading ? 'Searching…' : 'Search knowledge'}</button></div></form><div className="mt-4 flex flex-wrap gap-2">{examples.map((example) => <button key={example} type="button" onClick={() => void runSearch(example)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">{example}</button>)}</div></section>

    {error && <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-800">{error}</section>}
    {loading && <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"><LoaderCircle size={30} className="mx-auto animate-spin text-emerald-600" /><p className="mt-4 text-sm font-medium text-slate-600">Finding the most relevant document chunks…</p></section>}
    {response && <section className="space-y-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-emerald-600">Search results</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{response.total} matching {response.total === 1 ? 'chunk' : 'chunks'}</h2></div><Link to="/chat" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-800"><Sparkles size={16} /> Continue in AI Chat <ArrowRight size={15} /></Link></div>{response.results.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><BookOpenText size={28} className="mx-auto text-slate-400" /><h3 className="mt-4 text-lg font-semibold text-slate-900">No matching knowledge found</h3><p className="mt-2 text-sm text-slate-500">Try a more specific phrase or upload a relevant document.</p></div> : <div className="grid gap-4">{response.results.map((result, index) => <article key={result.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">{index + 1}</span><div><p className="font-semibold text-slate-900">Document chunk #{result.chunkIndex}</p><p className="mt-0.5 font-mono text-xs text-slate-500">Source: {result.documentId}</p></div></div><span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{(result.score * 100).toFixed(1)}% relevant</span></div><div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{result.document}</p></div><div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><FileText size={14} /> Vector result ID: <span className="font-mono">{result.id}</span></div></article>)}</div>}</section>}
  </div>;
};

export default RetrievalPage;
