import {
  Database,
  Files,
  HardDrive,
  MessageSquare,
  Upload,
  FolderOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import RecentDocuments from '../../components/dashboard/RecentDocuments';
import StatCard from '../../components/dashboard/StatCard';

const DashboardPage = () => {
  const recentDocuments = [
    { id: '1', name: 'Quarterly Report.docx', status: 'Indexed' },
    { id: '2', name: 'Product Handbook.docx', status: 'Processing' },
  ];

  return (
    <div className="space-y-8">
      <WelcomeBanner />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Documents"
          value={12}
          subtitle="Uploaded files"
          icon={Files}
          color="bg-blue-100 text-blue-600"
          trend="+12%"
        />

        <StatCard
          title="Chunks"
          value={284}
          subtitle="Indexed chunks"
          icon={Database}
          color="bg-violet-100 text-violet-600"
          trend="+18%"
        />

        <StatCard
          title="AI Chats"
          value={56}
          subtitle="Questions answered"
          icon={MessageSquare}
          color="bg-emerald-100 text-emerald-600"
          trend="+7%"
        />

        <StatCard
          title="Storage"
          value="2.4 GB"
          subtitle="Used of 10 GB"
          icon={HardDrive}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Quick Actions */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              to="/upload"
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <Upload
                  className="text-blue-600"
                  size={28}
                />
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                Upload Documents
              </h3>

              <p className="mt-3 text-sm text-slate-500">
                Upload DOCX or PDF files and build your AI knowledge base.
              </p>
            </Link>

            <Link
              to="/documents"
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                <FolderOpen
                  className="text-amber-600"
                  size={28}
                />
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                Documents
              </h3>

              <p className="mt-3 text-sm text-slate-500">
                Browse and manage all indexed enterprise documents.
              </p>
            </Link>

            <Link
              to="/chat"
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl md:col-span-2"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                <MessageSquare
                  className="text-emerald-600"
                  size={28}
                />
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                AI Assistant
              </h3>

              <p className="mt-3 text-sm text-slate-500">
                Ask questions and retrieve answers from your uploaded documents.
              </p>
            </Link>
          </div>
        </section>

        <RecentDocuments documents={recentDocuments} />
      </div>
    </div>
  );
};

export default DashboardPage;