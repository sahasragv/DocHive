import { ArrowUpDown, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DocumentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function DocumentToolbar({
  search,
  onSearchChange,
}: DocumentToolbarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Documents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your enterprise knowledge base.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:w-80"
            />
          </div>

          {/* Sort Button (future functionality) */}
          <button
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:border-blue-500 hover:bg-blue-50"
          >
            <ArrowUpDown size={18} />
            Sort
          </button>

          {/* Upload */}
          <Link
            to="/upload"
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Upload
          </Link>
        </div>
      </div>
    </div>
  );
}