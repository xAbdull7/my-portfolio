'use client';
import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, TrendingUp } from 'lucide-react';

export default function AnalyticsAdmin() {
  const [data, setData] = useState<{totalVisits: number, todayVisits: number, recentVisits: any[]} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-zinc-500 text-sm">Track your portfolio's performance and page views.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between h-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={20} />
            </div>
            <span className="font-semibold text-sm text-zinc-500">Total Visits</span>
          </div>
          <div className="text-5xl font-black tracking-tight">{data?.totalVisits || 0}</div>
        </div>

        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between h-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
              <TrendingUp size={20} />
            </div>
            <span className="font-semibold text-sm text-zinc-500">Visits Today</span>
          </div>
          <div className="text-5xl font-black tracking-tight">{data?.todayVisits || 0}</div>
        </div>

        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between h-40 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Eye size={20} />
            </div>
            <span className="font-semibold text-sm text-zinc-500">Recent Activity</span>
          </div>
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {data?.recentVisits?.length || 0} hits logged recently
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#050505] p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="text-zinc-400" /> Recent Visits Log
        </h3>
        {data?.recentVisits?.length === 0 ? (
          <p className="text-zinc-500 text-sm">No visits recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {data?.recentVisits?.map(v => (
              <div key={v.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl">
                <span className="font-medium text-sm truncate max-w-[200px] md:max-w-md">{v.path}</span>
                <span className="text-xs text-zinc-500">{new Date(v.visitedAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
