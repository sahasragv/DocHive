import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  UploadCloud,
  Loader2,
  XCircle,
} from 'lucide-react';

import { uploadDocument } from '../../services/api';

const UploadPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.docx')) {
      setIsSuccess(false);
      setMessage('Only DOCX files are supported.');
      return;
    }

    setFile(selectedFile);
    setMessage('');
    setIsSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setIsSuccess(false);
      setMessage('Please select a document.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await uploadDocument(file);

      setIsSuccess(true);
      setMessage(
        `${response.document.originalName} uploaded successfully.`,
      );

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);

      setIsSuccess(false);
      setMessage('Failed to upload document.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAnother = () => {
    setFile(null);
    setMessage('');
    setIsSuccess(false);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            Upload Knowledge Base
          </h1>

          <p className="mt-2 text-slate-500">
            Upload DOCX documents and build your enterprise AI knowledge base.
          </p>
        </div>
      </div>

      {/* Upload Card */}

      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="rounded-3xl border-2 border-dashed border-violet-300 bg-violet-50 p-12 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-100">
            <UploadCloud
              size={42}
              className="text-violet-600"
            />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-slate-900">
            Upload DOCX Document
          </h2>

          <p className="mt-2 text-slate-500">
            Select a DOCX file to generate embeddings and make it searchable by
            AI.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".docx"
            hidden
            onChange={handleFileChange}
          />

          <button
            onClick={handleChooseFile}
            className="mt-8 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Browse Files
          </button>

          {file && (
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <div className="rounded-xl bg-violet-100 p-3">
                <FileText
                  size={24}
                  className="text-violet-600"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {file.name}
                </h3>

                <p className="text-sm text-slate-500">
                  DOCX Document
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          <button
            disabled={loading || !file}
            onClick={handleUpload}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud size={18} />
                Upload Document
              </>
            )}
          </button>

          {message && (
            <div
              className={`mt-8 flex items-center gap-3 rounded-2xl border p-5 ${
                isSuccess
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 size={22} />
              ) : (
                <XCircle size={22} />
              )}

              <span className="font-medium">
                {message}
              </span>
            </div>
          )}

          {isSuccess && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => navigate('/chat')}
                className="rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                Ask AI
              </button>

              <button
                onClick={handleUploadAnother}
                className="rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Upload Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;