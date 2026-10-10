import Link from 'next/link';
import { Mail, ArrowUpRight, Database, Server, CheckCircle2, MessageSquare } from 'lucide-react';

interface MessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string | Date;
}

interface RecentInquiriesPanelProps {
  messages: MessageRecord[];
  unreadCount: number;
  totalVisits: number;
}

export default function RecentInquiriesPanel({
  messages,
  unreadCount,
  totalVisits,
}: RecentInquiriesPanelProps) {
  const formatTimeAgo = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Messages Panel */}
      <div className="bg-white dark:bg-[#0d0d11] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                Recent Inquiries
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Inbox messages from portfolio visitors</p>
          </div>
          <Link
            href="/admin/messages"
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Open Inbox"
          >
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {messages.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={20} className="mx-auto text-zinc-400 mb-2" />
              <p className="text-xs text-zinc-500">No incoming messages yet.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <Link
                key={msg.id}
                href="/admin/messages"
                className="p-4 block hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-white shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {msg.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0">
                    {formatTimeAgo(msg.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>

                <div className="mt-2 text-[11px] font-mono text-zinc-400 truncate">
                  {msg.email}
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="p-3.5 bg-zinc-50/70 dark:bg-zinc-900/30 border-t border-zinc-200/70 dark:border-zinc-800/70 text-right">
          <Link
            href="/admin/messages"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors inline-flex items-center gap-1"
          >
            View all messages
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* System Telemetry Widget */}
      <div className="bg-white dark:bg-[#0d0d11] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200/70 dark:border-zinc-800/70">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-zinc-500" />
            <h4 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-200">
              System Telemetry
            </h4>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">Operational</span>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <Database size={12} className="text-zinc-400" />
              Database Engine
            </span>
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">PostgreSQL</span>
          </div>

          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-zinc-400" />
              Preserved Visit Logs
            </span>
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">{totalVisits} Logs</span>
          </div>

          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-zinc-400 flex items-center justify-center text-[8px]">
                ⚡
              </span>
              Next.js Runtime
            </span>
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">App Router 16</span>
          </div>
        </div>
      </div>
    </div>
  );
}
