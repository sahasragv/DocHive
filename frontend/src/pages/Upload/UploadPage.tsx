const UploadPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Upload Documents</h1>
        <p className="mt-2 text-slate-600">Add files to train the assistant with your content.</p>

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-500">Drop files here or click to browse</p>
          <button className="mt-4 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white">
            Choose Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
