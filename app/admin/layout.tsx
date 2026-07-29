import React from 'react';
import Link from 'next/link';
import { Home, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import NotificationToggle from './components/NotificationToggle';
import { DesktopNav, MobileNav } from './components/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-white flex items-center justify-center p-4 w-full">
        {children}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-white flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Admin</h2>
        </div>
        <div className="flex items-center gap-2">
          <NotificationToggle />
          <Link href="/" className="p-2 bg-zinc-100 dark:bg-white/5 rounded-full text-zinc-600 dark:text-zinc-400">
            <Home size={18} />
          </Link>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-[#050505] border-r border-zinc-200 dark:border-white/5 p-6 flex-col gap-8 sticky top-0 h-screen z-40">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Admin</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage your portfolio content</p>
        </div>
        
        <DesktopNav />
        
        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-white/5 flex flex-col gap-2">
          <NotificationToggle />
          <Link href="/" className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <Home size={18} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24 pt-6 md:p-12 md:pb-12 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#050505]/90 backdrop-blur-xl border-t border-zinc-200 dark:border-white/5 pb-safe">
        <MobileNav />
      </div>
    </div>
  );
}
