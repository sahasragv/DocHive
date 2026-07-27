import {
  ArrowRight,
  MessageSquare,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WelcomeBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 p-8 text-white shadow-lg">
      {/* Background Decoration */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        {/* Left */}
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
            🚀 Enterprise AI Knowledge Platform
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight">
            Welcome to DocHive
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-8 text-blue-100">
            Upload documents, build an intelligent knowledge base,
            and chat with your organization's information using AI.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105 hover:shadow-xl"
            >
              <Upload size={18} />
              Upload Document
            </Link>

            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageSquare size={18} />
              Open AI Chat
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-blue-100">
              AI Responses
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Instant
            </h2>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-blue-100">
              Semantic Search
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Enabled
            </h2>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-blue-100">
              RAG Pipeline
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Active
            </h2>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-blue-100">
              Workspace
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Ready
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}