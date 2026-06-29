import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Manage your AI workspace from here.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link to="/upload" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">Upload</h2>
            <p className="mt-2 text-sm text-slate-600">Add documents to your knowledge base.</p>
          </Link>
          <Link to="/documents" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">Documents</h2>
            <p className="mt-2 text-sm text-slate-600">Browse and organize uploaded files.</p>
          </Link>
          <Link to="/chat" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">Chat</h2>
            <p className="mt-2 text-sm text-slate-600">Start a conversation with your documents.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
