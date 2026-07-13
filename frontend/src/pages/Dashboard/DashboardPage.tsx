import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC]">

      {/* Header */}
      <header className="border-b border-violet-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="DocHive"
              className="h-12 w-12"
            />

            <div>
              <h1 className="text-2xl font-bold text-violet-700">
                DocHive
              </h1>

              <p className="text-sm text-slate-500">
                Enterprise AI Knowledge Platform
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-violet-600 px-5 py-2 font-medium text-white transition hover:bg-violet-700"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-8 py-10">

        <div className="mb-10">
          <h2 className="text-4xl font-bold text-slate-900">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-slate-600">
            Manage your enterprise knowledge base and interact with your AI assistant.
          </p>
        </div>

        {/* Stats */}

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-violet-100">
            <div className="text-5xl">📄</div>

            <h3 className="mt-5 text-lg font-semibold">
              Documents
            </h3>

            <p className="mt-2 text-4xl font-bold text-violet-700">
              --
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Uploaded Files
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-violet-100">
            <div className="text-5xl">⚡</div>

            <h3 className="mt-5 text-lg font-semibold">
              Indexed
            </h3>

            <p className="mt-2 text-4xl font-bold text-violet-700">
              --
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Ready for Semantic Search
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-violet-100">
            <div className="text-5xl">🧠</div>

            <h3 className="mt-5 text-lg font-semibold">
              AI Assistant
            </h3>

            <p className="mt-2 text-4xl font-bold text-violet-700">
              Ready
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Ask questions from your documents
            </p>
          </div>

        </div>

        {/* Quick Actions */}

        <h2 className="mt-14 mb-6 text-2xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <div className="grid gap-6 md:grid-cols-3">

          <Link
            to="/upload"
            className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-violet-100 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              ⬆️
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Upload Documents
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Upload DOCX documents and build your AI knowledge base.
            </p>
          </Link>

          <Link
            to="/documents"
            className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-violet-100 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              📂
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Documents
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Browse all indexed enterprise documents.
            </p>
          </Link>

          <Link
            to="/chat"
            className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-violet-100 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              💬
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              AI Chat
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Ask questions and get answers from your uploaded documents.
            </p>
          </Link>

        </div>

      </main>
    </div>
  );
};

export default DashboardPage;