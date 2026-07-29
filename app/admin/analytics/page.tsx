'use client';
import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, TrendingUp, Monitor, Smartphone, Globe, Clock, LayoutTemplate, Trash2, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ActivityCalendar } from 'react-activity-calendar';
import GeoMap from './components/GeoMap';

export default function AnalyticsAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

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

  useEffect(() => {
    fetchAnalytics();
    
    // Poll for live visitors every 10 seconds
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/analytics/live');
        if (res.ok) {
          const liveData = await res.json();
          setLiveCount(liveData.count || 0);
        }
      } catch (e) {}
    };
    fetchLive();
    const interval = setInterval(fetchLive, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      await fetch('/api/analytics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteSelected', ids: selectedIds })
      });
      setSelectedIds([]);
      await fetchAnalytics();
    } catch (err) {
      console.error(err);
    }
    setIsDeleting(false);
  };

  const handleClearAll = async () => {
    setIsDeleting(true);
    try {
      await fetch('/api/analytics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteAll' })
      });
      setShowClearConfirm(false);
      setSelectedIds([]);
      await fetchAnalytics();
    } catch (err) {
      console.error(err);
    }
    setIsDeleting(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === data?.recentVisits?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data?.recentVisits?.map((v: any) => v.id) || []);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const formatPath = (p: string) => p === '/' ? 'Home Page' : p;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">Analytics Intelligence</h1>
          <p className="text-zinc-500 text-sm font-medium">Deep insights into your portfolio's traffic and audience.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setShowClearConfirm(true)}
             className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
           >
             <Trash2 size={16} /> Clear All Logs
           </button>
        </div>
      </div>

      {showClearConfirm && (
        <div className="p-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-200">Are you absolutely sure?</h3>
              <p className="text-sm text-red-700 dark:text-red-400">This will permanently delete all analytics data. This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowClearConfirm(false)} className="px-5 py-2.5 bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-xl font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Cancel</button>
            <button onClick={handleClearAll} disabled={isDeleting} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-500/20">{isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}</button>
          </div>
        </div>
      )}

      {/* Live Visitors Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] p-6 md:p-8 flex items-center justify-between shadow-lg shadow-blue-500/20 text-white animate-in zoom-in-95 duration-500 overflow-hidden w-full max-w-full">
        <div className="flex items-center gap-4">
          <div className="relative flex h-5 w-5">
            {liveCount > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-5 w-5 ${liveCount > 0 ? 'bg-green-400' : 'bg-white/30'}`}></span>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Real-Time Presence</h3>
            <p className="text-blue-100 text-sm font-medium">Active sessions on your portfolio right now.</p>
          </div>
        </div>
        <div className="text-5xl font-black">{liveCount}</div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between h-40 group hover:border-blue-500/50 transition-colors overflow-hidden w-full max-w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Eye size={20} />
            </div>
            <span className="font-semibold text-sm text-zinc-500">Total Pageviews</span>
          </div>
          <div className="text-5xl font-black tracking-tight">{data?.totalVisits || 0}</div>
        </div>

        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between h-40 group hover:border-purple-500/50 transition-colors overflow-hidden w-full max-w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <span className="font-semibold text-sm text-zinc-500">Unique Visitors</span>
          </div>
          <div className="text-5xl font-black tracking-tight">{data?.uniqueVisitors || 0}</div>
        </div>

        <div className="bg-white dark:bg-[#050505] p-6 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between h-40 group hover:border-green-500/50 transition-colors overflow-hidden w-full max-w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={20} />
            </div>
            <span className="font-semibold text-sm text-zinc-500">Visits Today</span>
          </div>
          <div className="text-5xl font-black tracking-tight">{data?.todayVisits || 0}</div>
        </div>
      </div>

      {/* Geographic Distribution - Full Width */}
      <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden w-full max-w-full">
         <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Globe className="text-zinc-400" /> Geographic Distribution
        </h3>
        <div className="space-y-4">
           {data?.geoDistribution && data.geoDistribution.length > 0 ? (
              <div className="w-full h-full min-h-[400px] bg-zinc-50 dark:bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center cursor-move">
                 <GeoMap data={data.geoDistribution} />
              </div>
           ) : (
             <p className="text-zinc-500 text-sm">No location data available.</p>
           )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7 Day Trend */}
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm lg:col-span-2 flex flex-col h-full overflow-hidden w-full max-w-full">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-zinc-400" /> 7-Day Traffic Trend
          </h3>
          <div className="flex-1 min-h-[300px] w-full">
            {data?.chartData && data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">Not enough data to display chart.</div>
            )}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col h-full overflow-hidden w-full max-w-full">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Monitor className="text-zinc-400" /> Device Split
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {data?.deviceDistribution && data.deviceDistribution.length > 0 ? (
              <>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.deviceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {data.deviceDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {data.deviceDistribution.map((entry: any, index: number) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      {entry.name} ({entry.value})
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-zinc-500 text-sm">No device data available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Annual Activity Heatmap */}
      <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm w-full max-w-full overflow-hidden overflow-x-auto">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 min-w-max">
          <TrendingUp className="text-zinc-400" /> Annual Activity
        </h3>
        <div className="min-w-max flex justify-center pb-4">
          {data?.heatmapData && data.heatmapData.length > 0 ? (
            <ActivityCalendar 
              data={data.heatmapData} 
              theme={{
                light: ['#f4f4f5', '#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8'],
                dark: ['#18181b', '#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa'],
              }}
              labels={{
                legend: {
                  less: 'Less',
                  more: 'More',
                },
                months: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                ],
                totalCount: '{{count}} visits in the last year',
              }}
            />
          ) : (
            <div className="text-zinc-500 text-sm py-10">No activity data yet.</div>
          )}
        </div>
      </div>

      {/* Top Browsers and Recent Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm lg:col-span-1 h-fit overflow-hidden w-full max-w-full">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Globe className="text-zinc-400" /> Top Browsers
          </h3>
          <div className="space-y-4">
             {data?.browserDistribution && data.browserDistribution.length > 0 ? data.browserDistribution.map((browser: any, i: number) => (
               <div key={browser.name} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</div>
                   <span className="font-semibold text-sm truncate max-w-[150px]">{browser.name}</span>
                 </div>
                 <div className="font-black text-lg">{browser.value}</div>
               </div>
             )) : (
               <p className="text-zinc-500 text-sm">No browser data yet.</p>
             )}
          </div>
        </div>

        {/* Recent Visits Log */}
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm lg:col-span-2 overflow-hidden w-full max-w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              Detailed Visit Logs
            </h3>
            <div className="flex items-center gap-3">
               <button 
                  onClick={toggleAll}
                  className="px-4 py-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  {selectedIds.length === data?.recentVisits?.length && data?.recentVisits?.length > 0 ? <CheckSquare size={16}/> : <Square size={16}/>}
                  Select All
                </button>
               {selectedIds.length > 0 && (
                 <button 
                   onClick={handleDeleteSelected}
                   disabled={isDeleting}
                   className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 animate-in zoom-in"
                 >
                   <Trash2 size={16} /> Delete ({selectedIds.length})
                 </button>
               )}
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
              {data?.recentVisits?.map((v: any) => {
                const isSelected = selectedIds.includes(v.id);
                return (
                <div 
                  key={v.id} 
                  onClick={() => toggleSelection(v.id)}
                  className={`group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 rounded-3xl transition-all duration-300 border cursor-pointer gap-4
                    ${isSelected 
                      ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' 
                      : 'bg-zinc-50 dark:bg-white/5 border-transparent hover:border-zinc-200 dark:hover:border-white/10'
                    }`}
                >
                  
                  <div className="flex items-center gap-4">
                    <div className={`text-zinc-400 transition-colors ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`}>
                      {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${v.device === 'Mobile' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                      {v.device === 'Mobile' ? <Smartphone size={24} /> : <Monitor size={24} />}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                        <LayoutTemplate size={14} className="text-zinc-400" />
                        {formatPath(v.path)}
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
              )})}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
