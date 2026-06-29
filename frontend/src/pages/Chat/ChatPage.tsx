const ChatPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Chat</h1>
        <p className="mt-2 text-slate-600">Ask questions about your uploaded documents.</p>

        <div className="mt-6 rounded-xl bg-slate-100 p-4">
          <p className="text-sm text-slate-600">Assistant: Hello! I can help answer questions from your documents.</p>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-purple-500"
            placeholder="Type your question..."
          />
          <button className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
