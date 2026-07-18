import { useEffect, useState } from 'react';
import {
  getDocuments,
  deleteDocument,
} from '../../services/api';
import type { Document } from '../../types/document';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this document?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDocument(id);

      // Refresh document list
      await loadDocuments();

      alert('Document deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete document');
    }
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-3xl font-bold">
          📄 My Documents
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : documents.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {documents.map((document) => (
              <div
                key={document.id}
                className="rounded-xl bg-white p-6 shadow"
              >
                <h2 className="text-xl font-semibold">
                  {document.originalName}
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">

                  <div>
                    <strong>Status</strong>
                    <p>{document.status}</p>
                  </div>

                  <div>
                    <strong>Chunks</strong>
                    <p>{document.chunkCount}</p>
                  </div>

                  <div>
                    <strong>Uploaded</strong>
                    <p>
                      {new Date(document.uploadedAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <strong>Size</strong>
                    <p>{formatSize(document.size)}</p>
                  </div>

                </div>

                <div className="mt-6 flex gap-3">

                  <button
                    className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(document.id)}
                    className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                  >
                    🗑 Delete
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DocumentsPage;