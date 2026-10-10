import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import RecentVisitsTable from './components/RecentVisitsTable';
import RecentInquiriesPanel from './components/RecentInquiriesPanel';
import { 
  Eye, 
  Users, 
  MessageSquare, 
  FolderGit2, 
  ArrowUpRight, 
  Activity, 
  Compass,
  ArrowRight
} from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getServerSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Concurrent data fetching for fast, responsive rendering
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const [
    unreadMessages,
    totalMessages,
    todayVisits,
    totalVisits,
    publishedProjects,
    totalProjects,
    liveVisitorsCount,
    recentVisits,
    recentMessages,
  ] = await Promise.all([
    prisma.message.count({ where: { read: false } }).catch(() => 0),
    prisma.message.count().catch(() => 0),
    prisma.pageVisit.count({ where: { visitedAt: { gte: today } } }).catch(() => 0),
    prisma.pageVisit.count().catch(() => 0),
    prisma.project.count({ where: { published: true } }).catch(() => 0),
    prisma.project.count().catch(() => 0),
    prisma.liveVisitor.count({ where: { lastActive: { gte: fiveMinutesAgo } } }).catch(() => 0),
    prisma.pageVisit.findMany({
      take: 12,
      orderBy: { visitedAt: 'desc' },
      select: {
        id: true,
        path: true,
        visitedAt: true,
        browser: true,
        os: true,
        device: true,
        country: true,
        city: true,
        duration: true,
      },
    }).catch(() => []),
    prisma.message.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        read: true,
        createdAt: true,
      },
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Quick Telemetry Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry & Dashboard
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Control Center
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Real-time telemetry, visitor traffic, and incoming portfolio inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/analytics"
            className="px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d0d11] hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Compass size={14} className="text-zinc-500" />
            Deep Analytics
          </Link>
          <Link
            href="/admin/messages"
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare size={14} />
            Inbox ({unreadMessages})
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid (Monochrome Titanium 4-Card Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Visits Card */}
        <div className="bg-white dark:bg-[#0d0d11] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500">Total Visits</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Eye size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {totalVisits}
              </span>
              <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +{todayVisits} today
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">Preserved visit audit records</p>
          </div>
          <Link
            href="/admin/analytics"
            className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors"
          >
            <span>Traffic analytics</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Real-time Presence Card */}
        <div className="bg-white dark:bg-[#0d0d11] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500">Live Presence</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Users size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {liveVisitorsCount}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-200/80 dark:border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active now
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">Concurrent portfolio sessions</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            <span>Ping every 10s</span>
            <Activity size={12} />
          </div>
        </div>

        {/* Inquiries Card */}
        <div className="bg-white dark:bg-[#0d0d11] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500">Messages</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <MessageSquare size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {unreadMessages}
              </span>
              <span className="font-mono text-[11px] font-medium text-zinc-500">
                / {totalMessages} total
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              {unreadMessages > 0 ? 'Unread messages awaiting reply' : 'All inquiries reviewed'}
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors"
          >
            <span>Open inbox</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Projects Card */}
        <div className="bg-white dark:bg-[#0d0d11] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500">Portfolio Work</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <FolderGit2 size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {publishedProjects}
              </span>
              <span className="font-mono text-[11px] font-medium text-zinc-500">
                / {totalProjects} published
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">Live case studies on site</p>
          </div>
          <Link
            href="/admin/projects"
            className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors"
          >
            <span>Manage projects</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Dual Panel Section: Visit Logs (Telemetry Stream) + Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Left Area: Smart Activity Table for Visit Logs (8 cols) */}
        <div className="lg:col-span-8">
          <RecentVisitsTable 
            initialVisits={recentVisits as any} 
            totalVisits={totalVisits} 
          />
        </div>

        {/* Side Right Area: Recent Inquiries & System Health (4 cols) */}
        <div className="lg:col-span-4">
          <RecentInquiriesPanel
            messages={recentMessages as any}
            unreadCount={unreadMessages}
            totalVisits={totalVisits}
          />
        </div>

      </div>

    </div>
  );
}
