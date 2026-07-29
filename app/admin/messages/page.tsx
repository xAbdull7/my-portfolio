'use client';
import { Mail, Trash2, CheckCircle, ChevronLeft } from 'lucide-react';
import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MessagesAdmin() {
  const { data: messages = [], error, isLoading, mutate } = useSWR('/api/messages', fetcher, {
    refreshInterval: 1000,
  });

  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isMobileList, setIsMobileList] = useState(true);

  const markAsRead = async (id: string, currentRead: boolean) => {
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
      mutate();
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    mutate(messages.filter((m: any) => m.id !== id), false);
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      mutate();
    } catch (err) {
      console.error(err);
      mutate();
    }
  };

  const deleteConversation = async (email: string) => {
    if (!confirm(`Are you sure you want to delete all messages from ${email}?`)) return;
    
    const messagesToDelete = messages.filter((m: any) => m.email === email);
    mutate(messages.filter((m: any) => m.email !== email), false);
    
    try {
      await Promise.all(messagesToDelete.map((m: any) => fetch(`/api/messages/${m.id}`, { method: 'DELETE' })));
      if (selectedEmail === email) {
        setSelectedEmail(null);
        setIsMobileList(true);
      }
      mutate();
    } catch (err) {
      console.error(err);
      mutate();
    }
  };

  const conversations = useMemo(() => {
    const groups: Record<string, { email: string, name: string, messages: any[], latestDate: number, unreadCount: number }> = {};
    
    messages.forEach((msg: any) => {
      if (!groups[msg.email]) {
        groups[msg.email] = {
          email: msg.email,
          name: msg.name,
          messages: [],
          latestDate: 0,
          unreadCount: 0
        };
      }
      groups[msg.email].messages.push(msg);
      
      const msgTime = new Date(msg.createdAt).getTime();
      if (msgTime > groups[msg.email].latestDate) {
        groups[msg.email].latestDate = msgTime;
        groups[msg.email].name = msg.name; 
      }
      if (!msg.read) groups[msg.email].unreadCount++;
    });

    Object.values(groups).forEach(group => {
      group.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return Object.values(groups).sort((a, b) => b.latestDate - a.latestDate);
  }, [messages]);

  const activeConversation = conversations.find(c => c.email === selectedEmail);

  // Auto-select first conversation if none selected on desktop, only when conversations load
  useEffect(() => {
    if (!selectedEmail && conversations.length > 0 && window.innerWidth >= 768) {
      setSelectedEmail(conversations[0].email);
    }
  }, [conversations, selectedEmail]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex h-[calc(100dvh-16rem)] md:h-[calc(100vh-8rem)]">
        <div className="w-full md:w-1/3 border-r border-zinc-200 dark:border-white/10 p-4 space-y-4">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="h-20 bg-zinc-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>
           ))}
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-16rem)] md:h-[calc(100vh-12rem)] bg-white dark:bg-[#050505] rounded-3xl md:rounded-[32px] border border-zinc-200 dark:border-white/10 text-center p-12">
        <Mail className="text-zinc-300 dark:text-zinc-700 mb-4" size={48} />
        <h3 className="text-lg font-bold">No messages yet</h3>
        <p className="text-zinc-500 text-sm">When someone contacts you, their messages will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-16rem)] md:h-[calc(100vh-8rem)] bg-white dark:bg-[#050505] rounded-3xl md:rounded-[32px] border border-zinc-200 dark:border-white/10 overflow-hidden animate-in fade-in duration-500">
      
      {/* Left Pane: Conversations List */}
      <div className={`w-full md:w-[360px] flex-col border-r border-zinc-200 dark:border-white/10 ${!isMobileList ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02]">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-1">
          {conversations.map(conv => (
            <button
              key={conv.email}
              onClick={() => {
                setSelectedEmail(conv.email);
                setIsMobileList(false);
              }}
              className={`w-full text-left p-3 rounded-[20px] transition-all ${selectedEmail === conv.email ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-900 dark:text-white'}`}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold truncate pr-2">{conv.name}</span>
                <span className={`text-xs whitespace-nowrap ${selectedEmail === conv.email ? 'text-blue-100' : 'text-zinc-500'}`}>
                  {new Date(conv.latestDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <p className={`text-sm truncate ${selectedEmail === conv.email ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {conv.messages[conv.messages.length - 1].message}
                </p>
                {conv.unreadCount > 0 && (
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${selectedEmail === conv.email ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'}`}>
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Pane: Message Thread */}
      <div className={`flex-1 flex-col bg-zinc-50/50 dark:bg-black/20 ${isMobileList ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Thread Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden p-2 -ml-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10"
                  onClick={() => setIsMobileList(true)}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {activeConversation.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white leading-none mb-1">{activeConversation.name}</h3>
                  <a href={`mailto:${activeConversation.email}`} className="text-sm text-zinc-500 hover:text-blue-500 transition-colors leading-none">{activeConversation.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => deleteConversation(activeConversation.email)}
                  className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title="Delete Conversation"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            </div>

            {/* Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {activeConversation.messages.map((msg, idx) => {
                const isConsecutive = idx > 0 && activeConversation.messages[idx - 1].email === msg.email && 
                                      (new Date(msg.createdAt).getTime() - new Date(activeConversation.messages[idx - 1].createdAt).getTime() < 3600000); // 1 hour
                
                return (
                  <div key={msg.id} className={`flex flex-col ${isConsecutive ? 'mt-2' : 'mt-6'}`}>
                    {!isConsecutive && (
                      <div className="flex justify-center mb-6 mt-2">
                        <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          {new Date(msg.createdAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div className="group flex items-end gap-2 max-w-[85%] self-start relative">
                      <div className={`bg-white dark:bg-[#111] px-5 py-3.5 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm text-zinc-800 dark:text-zinc-200 text-[15px] leading-relaxed whitespace-pre-wrap ${!isConsecutive ? 'rounded-tl-md' : ''}`}>
                        {msg.message}
                      </div>
                      {/* Action bubbles that appear on hover */}
                      <div className="absolute top-1/2 -translate-y-1/2 -right-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button 
                          onClick={() => markAsRead(msg.id, msg.read)}
                          className={`p-1.5 rounded-full border shadow-sm ${msg.read ? 'bg-white border-zinc-200 text-zinc-400 dark:bg-[#222] dark:border-zinc-700 hover:text-zinc-900 dark:hover:text-white' : 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'}`}
                          title={msg.read ? "Mark as unread" : "Mark as read"}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#222] text-zinc-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900 shadow-sm transition-colors"
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <Mail className="text-zinc-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Select a Conversation</h3>
            <p className="text-zinc-500 max-w-sm">Choose a message from the list to view the full thread and reply.</p>
          </div>
        )}
      </div>

    </div>
  );
}
