import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, BrainCircuit, Database, Files, LoaderCircle, SearchCheck, Upload } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import DocumentCard from '../../components/documents/DocumentCard';
import DeleteDocumentModal from '../../components/documents/DeleteDocumentModal';
import DocumentToolbar from '../../components/documents/DocumentToolbar';
import type { DocumentFilter, DocumentSort } from '../../components/documents/DocumentToolbar';
import { deleteDocument, getDocuments } from '../../services/api';
import type { Document } from '../../types/document';

const formatSize = (size: number) => size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(2)} MB`;
const matchesStatus = (document: Document, filter: DocumentFilter) => {
  if (filter === 'all') return true;
  const status = document.status.toLowerCase();
  if (filter === 'indexed') return status.includes('indexed');
  if (filter === 'failed') return status.includes('fail');
  if (filter === 'processing') return status.includes('process');
  return status.includes('uploaded');
};

const DocumentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const search = searchParams.get('search') ?? '';
  const [filter, setFilter] = useState<DocumentFilter>('all');
  const [sort, setSort] = useState<DocumentSort>('newest');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      setDocuments(await getDocuments());
    } catch (error) {
      console.error(error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDocuments(); }, [loadDocuments]);

  const handleSearchChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set('search', value);
    else nextParams.delete('search');
    setSearchParams(nextParams, { replace: true });
  };

  const metrics = useMemo(() => {
    const indexed = documents.filter((document) => document.status.toLowerCase().includes('indexed')).length;
    const failed = documents.filter((document) => document.status.toLowerCase().includes('fail')).length;
    const processing = documents.filter((document) => {
      const status = document.status.toLowerCase();
      return !status.includes('indexed') && !status.includes('fail');
    }).length;
    const chunks = documents.reduce((total, document) => total + (Number.isFinite(document.chunkCount) ? document.chunkCount : 0), 0);
    return { indexed, failed, processing, chunks };
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const result = documents.filter((document) => document.originalName.toLowerCase().includes(search.trim().toLowerCase()) && matchesStatus(document, filter));
    return result.sort((first, second) => {
      if (sort === 'oldest') return new Date(first.uploadedAt).getTime() - new Date(second.uploadedAt).getTime();
      if (sort === 'name-asc') return first.originalName.localeCompare(second.originalName);
      if (sort === 'name-desc') return second.originalName.localeCompare(first.originalName);
      if (sort === 'largest') return second.size - first.size;
      if (sort === 'smallest') return first.size - second.size;
      return new Date(second.uploadedAt).getTime() - new Date(first.uploadedAt).getTime();
    });
  }, [documents, filter, search, sort]);

  const confirmDelete = async () => {
    if (!selectedDocument) return;
    try {
      setDeleteLoading(true);
      setDeleteError(false);
      await deleteDocument(selectedDocument.id);
      await loadDocuments();
      setSelectedDocument(null);
    } catch (error) {
      console.error(error);
      setDeleteError(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const summaryCards = [
    { label: 'Total documents', value: documents.length, icon: Files, color: 'text-blue-600 bg-blue-50' },
    { label: 'Indexed', value: metrics.indexed, icon: SearchCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Processing / uploaded', value: metrics.processing, icon: LoaderCircle, color: 'text-amber-600 bg-amber-50' },
    { label: 'Failed', value: metrics.failed, icon: AlertCircle, color: 'text-rose-600 bg-rose-50' },
    { label: 'Knowledge chunks', value: metrics.chunks, icon: Database, color: 'text-violet-600 bg-violet-50' },
  ];

  return <><div className="space-y-7">
    <DocumentToolbar search={search} filter={filter} sort={sort} onSearchChange={handleSearchChange} onFilterChange={setFilter} onSortChange={setSort} />
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{summaryCards.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}><Icon size={18} /></div><p className="mt-4 text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{loading ? '—' : value}</p></div>)}</section>
    {deleteError && <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><span>Document deletion failed. Your knowledge base has not been changed.</span><button type="button" onClick={() => setDeleteError(false)} className="font-semibold">Dismiss</button></div>}
    {loading ? <div className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"><div className="h-5 w-1/3 rounded bg-slate-200" /><div className="mt-4 h-4 w-1/4 rounded bg-slate-100" /><div className="mt-7 grid gap-3 sm:grid-cols-4">{[1, 2, 3, 4].map((cell) => <div key={cell} className="h-20 rounded-xl bg-slate-100" />)}</div></div>)}</div>
      : loadError ? <section className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-600"><AlertCircle size={24} /></div><h2 className="mt-5 text-xl font-semibold text-rose-950">Knowledge base could not be loaded</h2><p className="mt-2 text-sm text-rose-700">We could not retrieve your documents. Please try again.</p><button type="button" onClick={() => void loadDocuments()} className="mt-6 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700">Retry loading documents</button></section>
        : documents.length === 0 ? <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><BrainCircuit size={28} /></div><h2 className="mt-5 text-2xl font-semibold text-slate-900">Your knowledge base is empty.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">Upload documents to make organizational knowledge available to the AI assistant.</p><Link to="/upload" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"><Upload size={17} /> Upload Document</Link></section>
          : filteredDocuments.length === 0 ? <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><h2 className="text-xl font-semibold text-slate-900">No matching documents</h2><p className="mt-2 text-sm text-slate-500">Adjust your search or status filter to see more knowledge sources.</p><button type="button" onClick={() => { setSearchParams({}, { replace: true }); setFilter('all'); }} className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700">Clear filters</button></section>
            : <section><div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-700">{filteredDocuments.length}</span> of {documents.length} documents</p><p className="hidden text-sm text-slate-500 sm:block">Documents power semantic search and the AI Assistant.</p></div><div className="space-y-4">{filteredDocuments.map((document) => <DocumentCard key={document.id} document={document} formatSize={formatSize} onDelete={() => setSelectedDocument(document)} />)}</div></section>}
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-medium text-violet-600">Knowledge pipeline</p><h2 className="mt-1 text-xl font-semibold text-slate-900">How documents become AI-ready knowledge</h2><div className="mt-5 flex flex-wrap items-center gap-2 text-sm"><span className="rounded-xl bg-slate-100 px-3 py-2 font-medium text-slate-700">Document</span><span className="text-slate-300">→</span><span className="rounded-xl bg-slate-100 px-3 py-2 font-medium text-slate-700">Text Extraction</span><span className="text-slate-300">→</span><span className="rounded-xl bg-slate-100 px-3 py-2 font-medium text-slate-700">Chunking</span><span className="text-slate-300">→</span><span className="rounded-xl bg-slate-100 px-3 py-2 font-medium text-slate-700">Gemini Embeddings</span><span className="text-slate-300">→</span><span className="rounded-xl bg-slate-100 px-3 py-2 font-medium text-slate-700">MongoDB Atlas Vector Search</span><span className="text-slate-300">→</span><span className="rounded-xl bg-blue-50 px-3 py-2 font-medium text-blue-700">RAG</span></div><p className="mt-4 text-sm leading-6 text-slate-500">This describes the knowledge pipeline. Individual documents only show the indexing status returned by the document API.</p></section>
  </div><DeleteDocumentModal isOpen={selectedDocument !== null} documentName={selectedDocument?.originalName ?? ''} loading={deleteLoading} onCancel={() => setSelectedDocument(null)} onConfirm={() => void confirmDelete()} /></>;
};

export default DocumentsPage;
