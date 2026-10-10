import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import NotificationToggle from './components/NotificationToggle';
import { DesktopNav, MobileNav } from './components/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-[#09090b] font-sans text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 w-full">
        {children}
      </div>
    );
  }

  // Fetch counts safely for the sidebar badges without extra client roundtrips
  const [unreadMessages, totalVisits, totalProjects] = await Promise.all([
    prisma.message.count({ where: { read: false } }).catch(() => 0),
    prisma.pageVisit.count().catch(() => 0),
    prisma.project.count().catch(() => 0),
  ]);

  const counts = { unreadMessages, totalVisits, totalProjects };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] font-sans text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-zinc-800 selection:text-white">
      
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#0d0d11]/85 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-mono font-bold text-[11px]">
            OS
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-tight">Admin Console</h2>
            <span className="text-[10px] text-zinc-500 font-mono">Portfolio Control</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Open Portfolio"
          >
            <ExternalLink size={15} />
          </Link>
        </div>
      </header>

      {/* Desktop Sidebar (Monochrome Titanium) */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white dark:bg-[#0d0d11] border-r border-zinc-200/80 dark:border-zinc-800/80 p-5 flex-col justify-between sticky top-0 h-screen z-40 shrink-0">
        <div className="space-y-6">
          {/* Header & Clean Static Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                OS
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                  Portfolio HQ
                </h2>
                <p className="text-[11px] text-zinc-500 font-mono">Admin Panel</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <DesktopNav counts={counts} />
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col gap-2.5">
          <NotificationToggle />

          <Link
            href="/"
            target="_blank"
            className="group px-3 py-2 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-all font-medium text-xs flex items-center justify-between text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
              Live Website
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">↗</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-28 pt-5 md:p-8 lg:p-10 md:pb-12 max-w-7xl mx-auto w-full min-w-0">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-4 left-3 right-3 z-50 bg-white/90 dark:bg-[#0d0d11]/90 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl">
        <MobileNav counts={counts} />
      </div>
    </div>
  );
}
