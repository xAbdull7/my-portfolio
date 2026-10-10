'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  TrendingUp, 
  Monitor, 
  Smartphone, 
  Globe, 
  Clock, 
  Trash2, 
  CheckSquare, 
  Square, 
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ActivityCalendar } from 'react-activity-calendar';
import GeoMap from './components/GeoMap';

const MONO_COLORS = ['#f4f4f5', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'];

export default function AnalyticsAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  // Table State
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'Desktop' | 'Mobile'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

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
    
    // Poll for live visitors every 15 seconds
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
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected visit log(s)?`)) return;
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

  const formatPath = (p: string) => (!p || p === '/') ? 'Home Page (/)' : p;

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return '0s';
    const totalSec = Math.round(seconds);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // Filtered visits
  const filteredVisits = useMemo(() => {
    const visits = data?.recentVisits || [];
    return visits.filter((v: any) => {
      if (deviceFilter !== 'all' && v.device !== deviceFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const country = (v.country || '').toLowerCase();
      const city = (v.city || '').toLowerCase();
      const path = (v.path || '').toLowerCase();
      const browser = (v.browser || '').toLowerCase();
      const os = (v.os || '').toLowerCase();
      return country.includes(q) || city.includes(q) || path.includes(q) || browser.includes(q) || os.includes(q);
    });
  }, [data?.recentVisits, searchQuery, deviceFilter]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, deviceFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredVisits.length / pageSize));
  const paginatedVisits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVisits.slice(start, start + pageSize);
  }, [filteredVisits, currentPage, pageSize]);

  const toggleAllCurrentPage = () => {
    const currentPageIds = paginatedVisits.map((v: any) => v.id);
    const allSelected = currentPageIds.every((id: string) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const allPageIdsSelected = paginatedVisits.length > 0 && paginatedVisits.every((v: any) => selectedIds.includes(v.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Top Header & Clear Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest mb-1.5">
            Traffic Intelligence & Audit
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Analytics Telemetry
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Audience metrics, geographic distribution, and session history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              Delete Selected ({selectedIds.length})
            </button>
          )}

          <button 
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={13} /> Clear All Logs
          </button>
        </div>
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="p-5 bg-zinc-100 dark:bg-[#121216] border border-red-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-950 dark:text-zinc-100">Confirm Deletion</h3>
              <p className="text-xs text-zinc-500">This will permanently delete all {data?.totalVisits || 0} preserved visit records.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowClearConfirm(false)} 
              className="px-3.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-xs hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleClearAll} 
              disabled={isDeleting} 
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-xs transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete Everything'}
            </button>
          </div>
        </div>
      )}

      {/* Top 5 KPI Metrics Row (Monochrome Titanium) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        
        {/* Total Pageviews */}
        <div className="bg-white dark:bg-[#0d0d11] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Pageviews</span>
            <Eye size={15} />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {data?.totalVisits || 0}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1">Total loads</span>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white dark:bg-[#0d0d11] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Unique Visitors</span>
            <Users size={15} />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {data?.uniqueVisitors || 0}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1">Distinct audiences</span>
        </div>

        {/* Visits Today */}
        <div className="bg-white dark:bg-[#0d0d11] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Visits Today</span>
            <TrendingUp size={15} />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {data?.todayVisits || 0}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1">Past 24 hours</span>
        </div>

        {/* Live Presence (Clean Titanium Card - No Bright Blue Banner) */}
        <div className="bg-white dark:bg-[#0d0d11] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Active Now</span>
            <span className="text-[10px] font-mono text-zinc-500">Live</span>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {liveCount}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1">Active sessions</span>
        </div>

        {/* Avg Duration (Fixed Math.round Bug) */}
        <div className="bg-white dark:bg-[#0d0d11] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Avg. Duration</span>
            <Clock size={15} />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {formatDuration(data?.averageDuration || 0)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1">Time on site</span>
        </div>

      </div>

      {/* World Map Section (Monochrome Titanium) */}
      <div className="bg-white dark:bg-[#0d0d11] p-5 md:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-zinc-400" />
            <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
              Geographic Distribution
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {data?.geoDistribution?.length || 0} Countries Represented
          </span>
        </div>

        <div className="w-full h-[280px] md:h-[380px] bg-zinc-50 dark:bg-zinc-900/40 rounded-xl overflow-hidden flex items-center justify-center relative border border-zinc-200/60 dark:border-zinc-800/60">
          {data?.geoDistribution && data.geoDistribution.length > 0 ? (
            <div className="absolute inset-0 w-full h-full">
              <GeoMap data={data.geoDistribution} />
            </div>
          ) : (
            <p className="text-xs text-zinc-500">No geographic data recorded yet.</p>
          )}
        </div>
      </div>

      {/* Charts: 7-Day Trend + Device Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7-Day Traffic Trend */}
        <div className="bg-white dark:bg-[#0d0d11] p-5 md:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-zinc-400" />
              <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                7-Day Traffic Trend
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">Daily Volume</span>
          </div>

          <div className="h-[240px] w-full">
            {data?.chartData && data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderRadius: '12px', 
                      border: '1px solid #27272a',
                      color: '#fafafa',
                      fontSize: '12px' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#fafafa" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#18181b', strokeWidth: 2, stroke: '#fafafa' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">Not enough data to display trend.</div>
            )}
          </div>
        </div>

        {/* Device Split */}
        <div className="bg-white dark:bg-[#0d0d11] p-5 md:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Monitor size={16} className="text-zinc-400" />
              <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                Device Distribution
              </h3>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
            {data?.deviceDistribution && data.deviceDistribution.length > 0 ? (
              <>
                <div className="h-[160px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={data.deviceDistribution} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={48} 
                        outerRadius={68} 
                        paddingAngle={4} 
                        dataKey="value"
                      >
                        {data.deviceDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={MONO_COLORS[index % MONO_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#18181b', 
                          borderRadius: '10px', 
                          border: '1px solid #27272a',
                          color: '#fafafa',
                          fontSize: '11px' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  {data.deviceDistribution.map((entry: any, index: number) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MONO_COLORS[index % MONO_COLORS.length] }} />
                      <span>{entry.name}</span>
                      <span className="font-mono text-[11px] text-zinc-400">({entry.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-xs text-zinc-500">No device data available.</div>
            )}
          </div>
        </div>

      </div>

      {/* Annual Activity Heatmap & Top Browsers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap */}
        <div className="bg-white dark:bg-[#0d0d11] p-5 md:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs lg:col-span-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-4 min-w-max">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
              <TrendingUp size={16} className="text-zinc-400" />
              Annual Activity Heatmap
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">365 Days</span>
          </div>

          <div className="min-w-max flex justify-center py-2">
            {data?.heatmapData && data.heatmapData.length > 0 ? (
              <ActivityCalendar 
                data={data.heatmapData} 
                theme={{
                  light: ['#f4f4f5', '#e4e4e7', '#a1a1aa', '#52525b', '#18181b'],
                  dark: ['#18181b', '#27272a', '#3f3f46', '#71717a', '#f4f4f5'],
                }}
                labels={{
                  legend: { less: 'Less', more: 'More' },
                  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  totalCount: '{{count}} visits recorded',
                }}
              />
            ) : (
              <div className="text-xs text-zinc-500 py-6">No activity recorded yet.</div>
            )}
          </div>
        </div>

        {/* Top Browsers */}
        <div className="bg-white dark:bg-[#0d0d11] p-5 md:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Globe size={16} className="text-zinc-400" />
            Top Browsers
          </h3>
          <div className="space-y-2">
            {data?.browserDistribution && data.browserDistribution.length > 0 ? (
              data.browserDistribution.map((browser: any, i: number) => (
                <div key={browser.name} className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-zinc-400 w-4">{i + 1}.</span>
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200">{browser.name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">{browser.value}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">No browser data yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* Detailed Visit Logs: Paginated Clean Table (MVP Design) */}
      <div className="bg-white dark:bg-[#0d0d11] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs overflow-hidden">
        
        {/* Table Controls Header */}
        <div className="p-5 border-b border-zinc-200/70 dark:border-zinc-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                Detailed Visit Logs
              </h3>
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {filteredVisits.length} Records
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              High-density paginated audit stream • Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative md:w-52">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search country, path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>

            {/* Device Filter */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-xs">
              <button
                onClick={() => setDeviceFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                  deviceFilter === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDeviceFilter('Desktop')}
                className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all ${
                  deviceFilter === 'Desktop'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setDeviceFilter('Mobile')}
                className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all ${
                  deviceFilter === 'Mobile'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
        </div>

        {/* Paginated Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4 w-10">
                  <button onClick={toggleAllCurrentPage} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                    {allPageIdsSelected ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th className="py-2.5 px-3">Device & Origin</th>
                <th className="py-2.5 px-3">Page Path</th>
                <th className="py-2.5 px-3">Client / OS</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {paginatedVisits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                    No visit records found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedVisits.map((v: any) => {
                  const isSelected = selectedIds.includes(v.id);
                  const isMobile = v.device === 'Mobile';
                  const locationText = v.country && v.country !== 'Unknown'
                    ? `${v.city && v.city !== 'Unknown' ? `${v.city}, ` : ''}${v.country}`
                    : 'Unknown Location';

                  return (
                    <tr 
                      key={v.id}
                      onClick={() => toggleSelection(v.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-zinc-100/90 dark:bg-zinc-800/70' 
                          : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => toggleSelection(v.id)} 
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                          {isSelected ? <CheckSquare size={15} className="text-zinc-900 dark:text-zinc-100" /> : <Square size={15} />}
                        </button>
                      </td>

                      {/* Device & Origin */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                            {isMobile ? <Smartphone size={13} /> : <Monitor size={13} />}
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                              {locationText}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {v.device || 'Desktop'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Page Path */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
                          {formatPath(v.path)}
                        </span>
                      </td>

                      {/* Client / OS */}
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                        <div className="text-[11px]">
                          <span>{v.browser || 'Unknown'}</span>
                          {v.os && <span className="text-zinc-400"> on {v.os}</span>}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                        {v.duration !== undefined && v.duration > 0 ? formatDuration(v.duration) : '—'}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-right font-mono text-[11px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                        {new Date(v.visitedAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-3.5 bg-zinc-50/70 dark:bg-zinc-900/30 border-t border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between text-xs text-zinc-500">
          <span className="font-mono text-[11px]">
            Showing {filteredVisits.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredVisits.length)} of {filteredVisits.length} logs
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="font-mono text-[11px] px-2 py-0.5">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
