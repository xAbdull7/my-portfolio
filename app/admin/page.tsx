import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Mail, TrendingUp, FolderGit2, ArrowRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await getServerSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch all necessary data concurrently for speed
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    unreadMessages,
    totalMessages,
    todayVisits,
    totalVisits,
    publishedProjects,
    totalProjects
  ] = await Promise.all([
    prisma.message.count({ where: { read: false } }),
    prisma.message.count(),
    prisma.pageVisit.count({ where: { visitedAt: { gte: today } } }),
    prisma.pageVisit.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.project.count(),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-zinc-500 text-sm">Welcome back! Here's what's happening with your portfolio today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Messages Stat */}
        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between group hover:border-blue-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Mail size={24} />
            </div>
            <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1 rounded-full">
              {totalMessages} Total
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white">{unreadMessages}</span>
              <span className="text-sm font-medium text-zinc-500">Unread</span>
            </div>
            <p className="text-zinc-500 text-sm mt-2">New messages waiting for you</p>
          </div>
          <Link href="/admin/messages" className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all">
            View Inbox <ArrowRight size={16} />
          </Link>
        </div>

        {/* Analytics Stat */}
        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between group hover:border-green-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1 rounded-full">
              {totalVisits} Total
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white">{todayVisits}</span>
              <span className="text-sm font-medium text-zinc-500">Today</span>
            </div>
            <p className="text-zinc-500 text-sm mt-2">Unique page visits today</p>
          </div>
          <Link href="/admin/analytics" className="mt-6 flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:gap-3 transition-all">
            View Analytics <ArrowRight size={16} />
          </Link>
        </div>

        {/* Projects Stat */}
        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between group hover:border-purple-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FolderGit2 size={24} />
            </div>
            <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1 rounded-full">
              {totalProjects} Total
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white">{publishedProjects}</span>
              <span className="text-sm font-medium text-zinc-500">Published</span>
            </div>
            <p className="text-zinc-500 text-sm mt-2">Live projects on portfolio</p>
          </div>
          <Link href="/admin/projects" className="mt-6 flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:gap-3 transition-all">
            Manage Projects <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
