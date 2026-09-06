import { AlertTriangle, Trash2 } from 'lucide-react';
import type { FC } from 'react';

interface DeleteDocumentModalProps { isOpen: boolean; documentName: string; onCancel: () => void; onConfirm: () => void; loading?: boolean; }

const DeleteDocumentModal: FC<DeleteDocumentModalProps> = ({ isOpen, documentName, onCancel, onConfirm, loading = false }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-document-title"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle size={22} /></div><h2 id="delete-document-title" className="mt-5 text-xl font-semibold text-slate-900">Delete document?</h2><p className="mt-3 text-sm leading-6 text-slate-600">This will remove <span className="font-semibold text-slate-900">{documentName}</span> and its indexed knowledge from DocHive.</p><p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p><div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} disabled={loading} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="button" onClick={onConfirm} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"><Trash2 size={16} />{loading ? 'Deleting...' : 'Delete document'}</button></div></div></div>;
};

export default DeleteDocumentModal;
