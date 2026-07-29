'use client';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MessagesAdmin() {
  const { data: messages = [], error, isLoading, mutate } = useSWR('/api/messages', fetcher, {
    refreshInterval: 1000, // Poll every second for instant feel
  });

  const markAsRead = async (id: string, currentRead: boolean) => {
    // Optimistic update
    mutate(messages.map((m: any) => m.id === id ? { ...m, read: !currentRead } : m), false);
    
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead })
      });
      mutate();
    } catch (err) {
      console.error(err);
      mutate(); // Revert on error
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    // Optimistic update
    mutate(messages.filter((m: any) => m.id !== id), false);

    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      mutate();
    } catch (err) {
      console.error(err);
      mutate(); // Revert on error
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Inbox</h1>
          <p className="text-zinc-500 text-sm">Read and manage messages from your visitors.</p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white dark:bg-[#050505] p-12 rounded-[32px] border border-zinc-200 dark:border-white/10 text-center flex flex-col items-center">
            <Mail className="text-zinc-300 dark:text-zinc-700 mb-4" size={48} />
            <h3 className="text-lg font-bold">No messages yet</h3>
            <p className="text-zinc-500 text-sm">When someone contacts you, their messages will appear here.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`bg-white dark:bg-[#050505] p-6 rounded-[24px] border transition-colors ${msg.read ? 'border-zinc-200 dark:border-white/5 opacity-80' : 'border-zinc-300 dark:border-white/20 shadow-md'}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{msg.name}</h3>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>}
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline break-all">{msg.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => markAsRead(msg.id, msg.read)}
                      className={`p-2 rounded-xl transition-colors ${msg.read ? 'bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-500/20'}`}
                      title={msg.read ? "Mark as unread" : "Mark as read"}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed bg-zinc-50 dark:bg-white/5 p-4 rounded-2xl break-words">
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
