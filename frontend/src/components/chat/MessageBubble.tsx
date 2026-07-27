import { Bot, User } from 'lucide-react';

interface Source {
  documentId: string;
  chunkIndex: number;
  score: number;
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
  sources?: Source[];
}

export default function MessageBubble({
  role,
  content,
  loading = false,
  sources = [],
}: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`flex gap-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md">
          <Bot size={20} />
        </div>
      )}

      <div
        className={`max-w-3xl rounded-3xl px-6 py-5 shadow-sm ${
          isUser
            ? 'bg-violet-600 text-white'
            : 'border border-slate-200 bg-white text-slate-800'
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-7">
            {content}
          </p>
        )}

        {!isUser && sources.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-500">
              Sources
            </h4>

            <div className="space-y-2">
              {sources.map((source, index) => (
                <div
                  key={`${source.documentId}-${source.chunkIndex}-${index}`}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  <div className="font-medium text-slate-800">
                    📄 {source.documentId}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
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
      </div>

      {isUser && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-md">
          <User size={20} />
        </div>
      )}
    </div>
  );
}