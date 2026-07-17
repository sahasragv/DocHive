import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#F8F7FC] p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm ring-1 ring-violet-100">

        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-violet-700">
          Upload Documents
        </h1>

        <p className="mt-2 text-slate-500">
          Upload DOCX files to build your enterprise knowledge base.
        </p>

        <div className="mt-8 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 p-12 text-center">

          <div className="text-6xl">
            📄
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            Choose a DOCX Document
          </h2>

          <p className="mt-2 text-slate-500">
            Supported format: .docx
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
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Browse Files
          </button>

          {file && (
            <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-violet-100">
              <p className="font-semibold text-slate-800">
                {file.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <button
            disabled={loading || !file}
            onClick={handleUpload}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Uploading...'
              : 'Upload Document'}
          </button>

          {message && (
            <div
              className={`mt-6 rounded-xl border p-4 text-center font-medium ${
                isSuccess
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {isSuccess ? '✅ ' : '❌ '}
              {message}
            </div>
          )}

          {isSuccess && (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">

              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                Go to Dashboard
              </button>

              <button
                onClick={handleUploadAnother}
                className="flex-1 rounded-xl border border-violet-200 bg-white py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
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