import {
  Calendar,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Trash2,
} from 'lucide-react';

import type { Document } from '../../types/document';

interface DocumentCardProps {
  document: Document;
  formatSize: (size: number) => string;
  onDelete: () => void;
}

export default function DocumentCard({
  document,
  formatSize,
  onDelete,
}: DocumentCardProps) {
  const indexed = document.status === 'Indexed';

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <FileText
              size={28}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 break-all">
              {document.originalName}
            </h2>

            <div className="mt-2 flex items-center gap-2">
              {indexed ? (
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
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${document.originalName}`}
          className="rounded-xl p-3 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <Database
            size={20}
            className="text-violet-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Chunks
            </p>

            <p className="font-semibold">
              {document.chunkCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <FileText
            size={20}
            className="text-blue-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Size
            </p>

            <p className="font-semibold">
              {formatSize(document.size)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <Calendar
            size={20}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Uploaded
            </p>

            <p className="font-semibold">
              {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}