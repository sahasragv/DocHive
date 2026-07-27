import { useEffect, useMemo, useState } from 'react';

import {
  deleteDocument,
  getDocuments,
} from '../../services/api';

import type { Document } from '../../types/document';

import DocumentCard from '../../components/documents/DocumentCard';
import DocumentToolbar from '../../components/documents/DocumentToolbar';
import DeleteDocumentModal from '../../components/documents/DeleteDocumentModal';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedDocument, setSelectedDocument] =
    useState<Document | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDelete = (document: Document) => {
    setSelectedDocument(document);
  };

  const confirmDelete = async () => {
    if (!selectedDocument) return;

    try {
      setDeleteLoading(true);

      await deleteDocument(selectedDocument.id);

      await loadDocuments();

      setSelectedDocument(null);
    } catch (error) {
      console.error(error);
      alert('Failed to delete document');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) =>
      doc.originalName
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [documents, search]);

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      <div className="space-y-8">
        <DocumentToolbar
          search={search}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-20 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-600">
              Loading documents...
            </p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-20 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              No documents found
            </h2>

            <p className="mt-3 text-slate-500">
              Upload a document or change your search.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                formatSize={formatSize}
                onDelete={() => handleDelete(document)}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteDocumentModal
        isOpen={selectedDocument !== null}
        documentName={selectedDocument?.originalName ?? ''}
        loading={deleteLoading}
        onCancel={() => setSelectedDocument(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default DocumentsPage;