import { useState } from 'react';
import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  User,
} from 'lucide-react';

import { askQuestion } from '../../services/chat';

interface Source {
  documentId: string;
  chunkIndex: number;
  score: number;
}

const suggestions = [
  'Summarize my uploaded documents',
  'Explain the leave policy',
  'What is the onboarding process?',
  'List important company policies',
];

const ChatPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (prompt?: string) => {
    const query = prompt ?? question;

    if (!query.trim()) return;

    setQuestion(query);
    setLoading(true);
    setAnswer('');
    setSources([]);

    try {
      const response = await askQuestion(query.trim());

      setAnswer(response.answer || 'No answer returned.');
      setSources(response.sources || []);
    } catch (error) {
      console.error(error);
      setAnswer('Unable to get an answer right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAsk();
    }
  };

  const newChat = () => {
    setQuestion('');
    setAnswer('');
    setSources([]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}

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
              Ask questions about your uploaded documents using AI.
            </p>
          </div>
        </div>

        <button
          onClick={newChat}
          className="rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
        >
          New Chat
        </button>
      </div>

      {/* Suggested Prompts */}

      {!answer && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Suggested Questions
          </h2>

          <div className="flex flex-wrap gap-3">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => handleAsk(item)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm transition hover:border-violet-600 hover:bg-violet-50 hover:text-violet-700"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User */}

      {question && (
        <div className="flex justify-end gap-4">
          <div className="max-w-3xl rounded-3xl bg-violet-600 px-6 py-5 text-white shadow">
            {question}
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <User size={20} />
          </div>
        </div>
      )}

      {/* Assistant */}

      {(loading || answer) && (
        <div className="flex gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <Bot size={20} />
          </div>

          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {loading ? (
              <div className="flex items-center gap-3 text-slate-600">
                <Loader2
                  className="animate-spin"
                  size={20}
                />

                Thinking...
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap leading-8 text-slate-700">
                  {answer}
                </p>

                {sources.length > 0 && (
                  <div className="mt-8 border-t pt-5">
                    <h3 className="mb-4 font-semibold text-slate-900">
                      Sources
                    </h3>

                    <div className="space-y-3">
                      {sources.map((source, index) => (
                        <div
                          key={`${source.documentId}-${index}`}
                          className="rounded-2xl bg-slate-50 p-4"
                        >
                          <div className="font-medium">
                            📄 {source.documentId}
                          </div>

                          <div className="mt-2 text-sm text-slate-500">
                            Similarity:{' '}
                            {(source.score * 100).toFixed(1)}%
                            {' • '}
                            Chunk #{source.chunkIndex}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Input */}

      <div className="sticky bottom-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your documents..."
          className="w-full resize-none rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-violet-600"
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
          >
            {loading ? (
              <Loader2
                className="animate-spin"
                size={18}
              />
            ) : (
              <Send size={18} />
            )}

            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;