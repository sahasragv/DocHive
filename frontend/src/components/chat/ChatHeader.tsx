import { Plus, Sparkles } from 'lucide-react';

interface ChatHeaderProps {
  onNewChat: () => void;
}

export default function ChatHeader({
  onNewChat,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
          <Sparkles size={30} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            DocHive AI Assistant
          </h1>

          <p className="mt-1 text-slate-500">
            Ask questions and get answers from your uploaded
            documents using Retrieval-Augmented Generation (RAG).
          </p>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
      >
        <Plus size={18} />
        New Chat
      </button>
    </div>
  );
}