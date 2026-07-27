import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentDocumentsProps {
  documents: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

export default function RecentDocuments({
  documents,
}: RecentDocumentsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recent Documents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recently uploaded knowledge sources
          </p>
        </div>

        <Link
          to="/documents"
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Empty State */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <div className="mb-4 rounded-2xl bg-slate-100 p-5">
            <FileText
              size={34}
              className="text-slate-400"
            />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            No documents uploaded
          </h3>

          <p className="mt-2 text-center text-sm text-slate-500">
            Upload your first document to start building
            your AI knowledge base.
          </p>

          <Link
            to="/upload"
            className="mt-6 rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Upload Document
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {documents.map((document) => (
            <div
              key={document.id}
              className="group flex items-center justify-between px-6 py-5 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                  <FileText
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {document.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-3">
                    {document.status === 'Indexed' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Indexed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        <Clock3 size={14} />
                        Processing
                      </span>
                    )}

                    <span className="text-xs text-slate-400">
                      Just now
                    </span>
                  </div>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}