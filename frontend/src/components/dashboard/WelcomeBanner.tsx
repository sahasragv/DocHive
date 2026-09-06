import { ArrowRight, BrainCircuit, MessageSquare, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeBannerProps { userName: string; hasDocuments: boolean; }

export default function WelcomeBanner({ userName, hasDocuments }: WelcomeBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-violet-300 bg-gradient-to-br from-[#5d3bb8] via-[#9560ce] to-[#ed78a5] p-7 text-white shadow-lg shadow-violet-200/70 sm:p-9">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#ffd6e4]/35 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 h-44 w-72 rounded-full bg-[#7ee4f7]/20 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-xs font-medium tracking-wide text-white"><BrainCircuit size={14} /> Enterprise AI knowledge platform</span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {userName}.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/85">Turn your organization&apos;s documents into grounded answers with a secure, searchable AI knowledge base.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/upload" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#6b3bb6] shadow-sm transition hover:bg-[#fff0f6]"><Upload size={18} /> Upload document</Link>
            {hasDocuments && <Link to="/chat" className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/25"><MessageSquare size={18} /> Open AI Chat <ArrowRight size={18} /></Link>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:min-w-80">
          <div className="rounded-2xl border border-white/25 bg-white/15 p-4"><p className="text-xs font-medium text-white/70">Retrieval</p><p className="mt-1.5 text-sm font-semibold">Vector search</p></div>
          <div className="rounded-2xl border border-white/25 bg-white/15 p-4"><p className="text-xs font-medium text-white/70">Responses</p><p className="mt-1.5 text-sm font-semibold">AI-assisted</p></div>
        </div>
      </div>
    </section>
  );
}
