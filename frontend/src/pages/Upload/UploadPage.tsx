import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  ChevronDown,
  Database,
  FileText,
  Layers3,
  Loader2,
  Network,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  XCircle,
} from 'lucide-react';

import { uploadDocument } from '../../services/api';
import type { Document } from '../../types/document';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileTypeLabel = (selectedFile: File) => {
  if (selectedFile.type === 'application/pdf') return 'PDF Document';

  return 'DOCX Document';
};

const ingestionSteps = [
  { label: 'Upload', icon: UploadCloud },
  { label: 'Text Extraction', icon: FileText },
  { label: 'Chunking', icon: Layers3 },
  { label: 'Gemini Embeddings', icon: Brain },
  { label: 'MongoDB Atlas', icon: Database },
  { label: 'Vector Search', icon: Search },
  { label: 'RAG', icon: Network },
  { label: 'Groq AI', icon: Sparkles },
];

const UploadPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedDocument, setUploadedDocument] =
    useState<Document | null>(null);

  const validateFile = (selectedFile: File) => {
    if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
      return 'Only PDF and DOCX files are supported.';
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return 'Files must be 10 MB or smaller.';
    }

    return '';
  };

  const selectFile = (selectedFile: File) => {
    const validationMessage = validateFile(selectedFile);

    if (validationMessage) {
      setFile(null);
      setUploadedDocument(null);
      setIsSuccess(false);
      setMessage(validationMessage);
      return;
    }

    setFile(selectedFile);
    setMessage('');
    setIsSuccess(false);
    setUploadedDocument(null);
  };

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    selectFile(selectedFile);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) return;

    selectFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setMessage('');
    setIsSuccess(false);
    setUploadedDocument(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setIsSuccess(false);
      setMessage('Please select a PDF or DOCX document.');
      return;
    }

    const validationMessage = validateFile(file);

    if (validationMessage) {
      setIsSuccess(false);
      setMessage(validationMessage);
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await uploadDocument(file);
      const document = response.document as Document | undefined;

      setUploadedDocument(document ?? null);
      setIsSuccess(true);
      setMessage('Document added to your knowledge base.');
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);

      setIsSuccess(false);
      setMessage('Upload failed. Please check the file and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAnother = () => {
    setFile(null);
    setMessage('');
    setIsSuccess(false);
    setUploadedDocument(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <ShieldCheck size={16} />
              AI ingestion workspace
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Add to Knowledge Base
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Upload documents and make their content available to DocHive's AI assistant.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            PDF or DOCX only • Maximum 10 MB
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          {!isSuccess && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-3xl border-2 border-dashed p-8 text-center transition md:p-12 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 shadow-inner'
                  : 'border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100">
                <UploadCloud size={38} className="text-blue-600" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-slate-950">
                Drop a document here
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">
                Add enterprise knowledge to DocHive with a supported PDF or DOCX file. The upload starts only after you confirm the selected file.
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                hidden
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={handleChooseFile}
                disabled={loading}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileText size={18} />
                Browse Files
              </button>

              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">PDF</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">DOCX</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">10 MB max</span>
              </div>
            </div>
          )}

          {file && !isSuccess && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
                  <FileText size={26} className="text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold text-slate-950">{file.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {getFileTypeLabel(file)} • {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleUpload}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading document...
                  </>
                ) : (
                  <>
                    <UploadCloud size={18} />
                    Upload to Knowledge Base
                  </>
                )}
              </button>
            </div>
          )}

          {message && (
            <div
              className={`mt-6 rounded-3xl border p-5 ${
                isSuccess
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {isSuccess ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                <div>
                  <p className="font-semibold">{message}</p>
                  {isSuccess && uploadedDocument && (
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-white/80 px-3 py-1">Status: {uploadedDocument.status}</span>
                      <span className="rounded-full bg-white/80 px-3 py-1">Knowledge chunks: {uploadedDocument.chunkCount}</span>
                      <span className="rounded-full bg-white/80 px-3 py-1">Size: {formatFileSize(uploadedDocument.size)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                to="/documents"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                View Knowledge Base
              </Link>
              <button
                type="button"
                onClick={handleUploadAnother}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Upload Another
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Knowledge ingestion flow</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This architecture view explains how uploaded knowledge becomes available for semantic search and retrieval-augmented answers.
            </p>
            <div className="mt-6 space-y-2">
              {ingestionSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.label}>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <Icon size={19} />
                      </div>
                      <span className="font-semibold text-slate-800">{step.label}</span>
                    </div>
                    {index < ingestionSteps.length - 1 && (
                      <div className="flex justify-center py-1 text-slate-300">
                        <ChevronDown size={18} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <ServerCog size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-950">What happens after upload</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Once uploaded, DocHive processes the document so its knowledge can be used by the AI assistant.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• PDF/DOCX text is extracted.</li>
              <li>• Content is divided into knowledge chunks.</li>
              <li>• Gemini generates embeddings.</li>
              <li>• Embeddings are stored in MongoDB Atlas.</li>
              <li>• Semantic retrieval makes relevant knowledge available to the AI assistant.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default UploadPage;
