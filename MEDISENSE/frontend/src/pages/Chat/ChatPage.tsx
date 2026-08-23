import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Plus, Trash2, MessageCircle, Bot, User as UserIcon } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useConversations, useConversation, useCreateConversation, useSendMessage, useDeleteConversation } from '../../hooks/useChat';

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: conversations } = useConversations();
  const { data: conversation, isLoading } = useConversation(id);
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage(id || '');
  const deleteConversation = useDeleteConversation();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');

    if (!id) {
      const created = await createConversation.mutateAsync(text);
      navigate(`/chat/${created._id}`);
    } else {
      sendMessage.mutate(text);
    }
  };

  return (
    <DashboardLayout title="AI Skincare Assistant">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        {/* Conversation sidebar */}
        <div className="glass-card h-fit p-3">
          <button onClick={() => navigate('/chat')} className="btn-secondary mb-3 w-full !py-2">
            <Plus size={15} /> New chat
          </button>
          <div className="space-y-1">
            {conversations?.map((c) => (
              <div
                key={c._id}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  c._id === id ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'hover:bg-ink/5 dark:hover:bg-white/5'
                }`}
              >
                <button onClick={() => navigate(`/chat/${c._id}`)} className="flex-1 truncate text-left">
                  {c.title}
                </button>
                <button
                  onClick={() => deleteConversation.mutate(c._id, { onSuccess: () => id === c._id && navigate('/chat') })}
                  className="opacity-0 group-hover:opacity-100"
                  aria-label="Delete conversation"
                >
                  <Trash2 size={14} className="text-clay-500" />
                </button>
              </div>
            ))}
            {conversations?.length === 0 && <p className="px-3 py-2 text-xs text-ink/40">No conversations yet.</p>}
          </div>
        </div>

        {/* Message thread */}
        <div className="glass-card flex h-[65vh] flex-col p-4">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {!id && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <MessageCircle size={36} className="text-ink/20" />
                <p className="mt-3 max-w-xs text-sm text-ink/60 dark:text-canvas/60">
                  Ask about routines, symptoms, or preventive skincare. This assistant provides educational
                  information only — not a diagnosis.
                </p>
              </div>
            )}
            {isLoading && id && <div className="skeleton h-24 w-2/3" />}
            {conversation?.messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-clay-100 text-clay-600' : 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'}`}>
                  {m.role === 'user' ? <UserIcon size={15} /> : <Bot size={15} />}
                </span>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-clay-500 text-white' : 'bg-ink/5 text-ink dark:bg-white/10 dark:text-canvas'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="flex gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"><Bot size={15} /></span>
                <div className="rounded-2xl bg-ink/5 px-4 py-2.5 text-sm dark:bg-white/10">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-ink/10 pt-3 dark:border-white/10">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your skin…"
              className="input-field"
            />
            <button onClick={handleSend} className="btn-primary !px-4 !py-3" aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
