'use client';
import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, TrendingUp, Monitor, Smartphone, Globe, Clock, LayoutTemplate } from 'lucide-react';

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

      <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            Recent Visits Log
          </h3>
          <div className="text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
            Live Updates
          </div>
        </div>
        
        {data?.recentVisits?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Eye size={24} className="text-zinc-400" />
            </div>
            <h4 className="text-zinc-900 dark:text-white font-medium mb-1">No visits recorded yet</h4>
            <p className="text-zinc-500 text-sm">Wait for some traffic to see detailed analytics here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.recentVisits?.map((v: any) => (
              <div key={v.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-3xl transition-all duration-300 border border-transparent hover:border-zinc-200 dark:hover:border-white/10 gap-4">
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${v.device === 'Mobile' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                    {v.device === 'Mobile' ? <Smartphone size={24} /> : <Monitor size={24} />}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                      <LayoutTemplate size={14} className="text-zinc-400" />
                      {v.path}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1 mt-1.5 font-medium">
                      <Clock size={12} />
                      {new Date(v.visitedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3 md:justify-end">
                  {v.country && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm">
                      <Globe size={14} className="text-blue-500" />
                      {v.city && v.city !== 'Unknown' ? `${v.city}, ` : ''}{v.country}
                    </span>
                  )}
                  {(v.browser || v.os) && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm">
                      {v.browser && v.browser !== 'Unknown' ? v.browser : ''}
                      {v.browser && v.browser !== 'Unknown' && v.os && v.os !== 'Unknown' ? ' on ' : ''}
                      {v.os && v.os !== 'Unknown' ? v.os : ''}
                      {(!v.browser || v.browser === 'Unknown') && (!v.os || v.os === 'Unknown') ? 'Unknown Device' : ''}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
