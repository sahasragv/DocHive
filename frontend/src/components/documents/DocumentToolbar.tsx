import { ArrowUpDown, Filter, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export type DocumentFilter = 'all' | 'indexed' | 'processing' | 'uploaded' | 'failed';
export type DocumentSort = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'largest' | 'smallest';

interface DocumentToolbarProps {
  search: string;
  filter: DocumentFilter;
  sort: DocumentSort;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: DocumentFilter) => void;
  onSortChange: (value: DocumentSort) => void;
}

export default function DocumentToolbar({ search, filter, sort, onSearchChange, onFilterChange, onSortChange }: DocumentToolbarProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="text-sm font-medium text-blue-600">Enterprise knowledge system</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Knowledge Base</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Manage the documents powering your organization&apos;s AI knowledge system.</p></div>
        <Link to="/upload" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"><Plus size={18} /> Upload Document</Link>
      </div>
      <div className="mt-7 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
        <label className="relative block"><span className="sr-only">Search documents</span><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search by filename..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" /></label>
        <label className="relative block"><span className="sr-only">Filter documents</span><Filter size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><select value={filter} onChange={(event) => onFilterChange(event.target.value as DocumentFilter)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="all">All statuses</option><option value="indexed">Indexed</option><option value="processing">Processing</option><option value="uploaded">Uploaded</option><option value="failed">Failed</option></select></label>
        <label className="relative block"><span className="sr-only">Sort documents</span><ArrowUpDown size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><select value={sort} onChange={(event) => onSortChange(event.target.value as DocumentSort)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="largest">Largest first</option><option value="smallest">Smallest first</option></select></label>
      </div>
    </section>
  );
}
