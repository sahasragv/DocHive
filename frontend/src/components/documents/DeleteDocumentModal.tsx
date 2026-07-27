import type { FC } from 'react';

interface DeleteDocumentModalProps {
  isOpen: boolean;
  documentName: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteDocumentModal: FC<DeleteDocumentModalProps> = ({
  isOpen,
  documentName,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-900">
          Delete Document
        </h2>

        <p className="mt-4 text-slate-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900">
            {documentName}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-slate-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-2 font-medium transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDocumentModal;