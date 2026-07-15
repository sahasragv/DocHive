import { useRef, useState } from 'react';

import { uploadDocument } from '../../services/api';

const UploadPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith('.docx')
    ) {
      setMessage('Only DOCX files are supported.');
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a document.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response =
        await uploadDocument(file);

      setMessage(
        `✅ ${response.document.originalName} uploaded successfully.`,
      );

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);

      setMessage(
        '❌ Failed to upload document.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm ring-1 ring-violet-100">

        <h1 className="text-3xl font-bold text-violet-700">
          Upload Documents
        </h1>

        <p className="mt-2 text-slate-500">
          Upload DOCX files to build your enterprise
          knowledge base.
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
            <div className="mt-6 rounded-xl bg-white p-4 shadow">
              <p className="font-medium">
                {file.name}
              </p>

              <p className="text-sm text-slate-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <button
            disabled={loading || !file}
            onClick={handleUpload}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? 'Uploading...'
              : 'Upload Document'}
          </button>

          {message && (
            <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-4 text-center text-sm">
              {message}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default UploadPage;