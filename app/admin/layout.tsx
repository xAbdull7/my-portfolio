import React from 'react';
import Link from 'next/link';
import { Home, Folder, User, Code2, LogOut, MessageSquare, BarChart3 } from 'lucide-react';
import { getServerSession } from 'next-auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  const navLinks = [
    { href: '/admin/projects', icon: Folder, label: 'Projects' },
    { href: '/admin/profile', icon: User, label: 'Profile' },
    { href: '/admin/tech-stack', icon: Code2, label: 'Stack' },
    { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-white flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Admin</h2>
        </div>
        <Link href="/" className="p-2 bg-zinc-100 dark:bg-white/5 rounded-full text-zinc-600 dark:text-zinc-400">
          <Home size={18} />
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-[#050505] border-r border-zinc-200 dark:border-white/5 p-6 flex-col gap-8 sticky top-0 h-screen z-40">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Admin</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage your portfolio content</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="px-4 py-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-3">
              <link.icon size={18} /> {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-white/5 flex flex-col gap-2">
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
        <nav className="flex items-center justify-around p-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <link.icon size={20} className="mb-1" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
