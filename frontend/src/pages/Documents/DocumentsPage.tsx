const DocumentsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
        <p className="mt-2 text-slate-600">Your uploaded files and knowledge sources will appear here.</p>

        <ul className="mt-6 space-y-3">
          <li className="rounded-lg border border-slate-200 p-4">Project Overview.pdf</li>
          <li className="rounded-lg border border-slate-200 p-4">API Reference.docx</li>
          <li className="rounded-lg border border-slate-200 p-4">Product Notes.txt</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentsPage;
