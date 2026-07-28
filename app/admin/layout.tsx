import React from 'react';
import Link from 'next/link';
import { Home, Folder, User, Code2, LogOut, MessageSquare, BarChart3 } from 'lucide-react';
import { getServerSession } from 'next-auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white dark:bg-[#050505] md:border-r border-b md:border-b-0 border-zinc-200 dark:border-white/5 p-6 flex flex-col gap-8 md:sticky md:top-0 md:h-screen">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Admin</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage your portfolio content</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/admin/projects" className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3">
            <Folder size={18} /> Projects
          </Link>
          <Link href="/admin/profile" className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3">
            <User size={18} /> Profile Data
          </Link>
          <Link href="/admin/tech-stack" className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3">
            <Code2 size={18} /> Tech Stack
          </Link>
          <Link href="/admin/messages" className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3">
            <MessageSquare size={18} /> Messages
          </Link>
          <Link href="/admin/analytics" className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3">
            <BarChart3 size={18} /> Analytics
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-white/5 flex flex-col gap-2">
          <Link href="/" className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <Home size={18} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
