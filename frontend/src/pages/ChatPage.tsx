import { useState } from 'react';
import { askQuestion } from '../services/chat';

const ChatPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Array<{
    documentId: string;
    chunkIndex: number;
    score: number;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer('');
    setSources([]);

    try {
      const response = await askQuestion(question.trim());
      setAnswer(response.answer || '');
      setSources(response.sources || []);
    } catch (error) {
      setAnswer('Unable to get an answer right now.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">AI Assistant</h1>
        <p className="mt-2 text-slate-600">Ask questions about your uploaded documents.</p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <textarea
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-purple-500"
            placeholder="Ask a question..."
            rows={4}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleAsk}
              disabled={loading}
              className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>

            {loading && <span className="text-sm text-slate-500">⏳</span>}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Answer</h2>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
            {loading ? 'Thinking...' : (answer || 'Ask a question to get started.')}
          </div>

          {sources.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold text-slate-900">Sources</h3>
              <ul className="mt-3 space-y-2">
                {sources.map((source, index) => (
                  <li key={`${source.documentId}-${source.chunkIndex}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="font-medium text-slate-800">✔ {source.documentId}</div>
                    <div className="mt-1 text-sm text-slate-600">Similarity: {source.score.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
