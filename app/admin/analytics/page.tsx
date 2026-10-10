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
  Filter,
  Radar,
  MapPin,
  ArrowUpRight,
  Shield,
  Terminal,
  Activity,
  Maximize2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ActivityCalendar } from 'react-activity-calendar';
import GeoMap from './components/GeoMap';
import VisitorDossierDrawer from './components/VisitorDossierDrawer';

const MONO_COLORS = ['#f4f4f5', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'];

export default function AnalyticsAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  // Tactical Dossier Drawer State
  const [inspectingVisit, setInspectingVisit] = useState<any | null>(null);

  // Table State
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'Desktop' | 'Mobile'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Live Military UTC Clock (Clean static ticker)
  const [utcClock, setUtcClock] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcClock(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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
    if (!confirm(`Purge ${selectedIds.length} selected surveillance records?`)) return;
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

  const handleSingleDelete = async (id: string) => {
    try {
      await fetch('/api/analytics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteSelected', ids: [id] })
      });
      setSelectedIds(prev => prev.filter(i => i !== id));
      await fetchAnalytics();
    } catch (err) {
      console.error(err);
    }
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

  const formatPath = (p: string) => (!p || p === '/') ? 'Home (/)' : p;

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return '0s';
    const totalSec = Math.round(seconds);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    if (hCalc(totalSec) > 0) return `${hCalc(totalSec)}h ${m % 60}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const hCalc = (sec: number) => Math.floor(sec / 3600);

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

  // Reset page when filter/search changes
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
    <div className="space-y-7 animate-in fade-in duration-300 pb-16 antialiased">
      
      {/* 1. Tactical HUD Header (CIA Command Center) */}
      <div className="p-4 md:p-5 rounded-2xl bg-zinc-100/80 dark:bg-[#0c0d12] border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold">
                STATION // CAI-01
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                GLOBAL TELEMETRY NETWORK
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Surveillance Intelligence Command
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                Purge Selected ({selectedIds.length})
              </button>
            )}

            <button 
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-1.5 bg-zinc-200/60 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/80 dark:border-zinc-800 rounded-xl font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} /> Purge All Records
            </button>
          </div>
        </div>

        {/* Tactical Telemetry Ribbon */}
        <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-zinc-400" />
            <span>ZULU TIME:</span>
            <span className="text-zinc-950 dark:text-zinc-100 font-semibold">{utcClock || 'SYNCHRONIZING'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Shield size={13} className="text-zinc-400" />
            <span>PROTOCOL:</span>
            <span className="text-zinc-950 dark:text-zinc-100">SHA-256 HASHED</span>
          </div>

          <div className="flex items-center gap-2">
            <Activity size={13} className="text-zinc-400" />
            <span>GRID NODE:</span>
            <span className="text-zinc-950 dark:text-zinc-100">POSTGRESQL-V16</span>
          </div>

          <div className="flex items-center gap-2">
            <Terminal size={13} className="text-zinc-400" />
            <span>SIGNAL POOL:</span>
            <span className="text-zinc-950 dark:text-zinc-100 font-semibold">{data?.totalVisits || 0} CAPTURED</span>
          </div>
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
              <h3 className="text-xs font-semibold text-zinc-950 dark:text-zinc-100">Confirm Global Data Purge</h3>
              <p className="text-xs text-zinc-500">This will permanently delete all {data?.totalVisits || 0} surveillance records.</p>
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
              {isDeleting ? 'Purging...' : 'Execute Full Purge'}
            </button>
          </div>
        </div>
      )}

      {/* 2. Top 5 Tactical Metrics (Monochrome Titanium) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        
        {/* Total Pageviews */}
        <div className="bg-white dark:bg-[#0c0d12] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">TOTAL INFILTRATION</span>
            <Eye size={14} />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {data?.totalVisits || 0}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-1">LOGGED SIGNALS</span>
        </div>

        {/* Unique Targets */}
        <div className="bg-white dark:bg-[#0c0d12] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">UNIQUE TARGETS</span>
            <Users size={14} />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {data?.uniqueVisitors || 0}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-1">DISTINCT AUDIENCES</span>
        </div>

        {/* 24H Intercepts */}
        <div className="bg-white dark:bg-[#0c0d12] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">24H INTERCEPTS</span>
            <TrendingUp size={14} />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {data?.todayVisits || 0}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-1">LAST 24 HOURS</span>
        </div>

        {/* Active Now */}
        <div className="bg-white dark:bg-[#0c0d12] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">ACTIVE NODES</span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1 rounded">LIVE</span>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {liveCount}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-1">CONCURRENT ON-GRID</span>
        </div>

        {/* Avg Duration */}
        <div className="bg-white dark:bg-[#0c0d12] p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">AVG DWELL TIME</span>
            <Clock size={14} />
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            {formatDuration(data?.averageDuration || 0)}
          </div>
          <span className="text-[10px] font-mono text-zinc-400 mt-1">SESSION RETENTION</span>
        </div>

      </div>

      {/* 3. Split Geo Radar Terminal (65% Map / 35% Geo Dossier Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: World Map Radar (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radar size={15} className="text-zinc-400" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
                GLOBAL SURVEILLANCE RADAR
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
              <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                GRID // WGS-84
              </span>
              <span>{data?.geoDistribution?.length || 0} SECTORS</span>
            </div>
          </div>

          <div className="w-full h-[280px] md:h-[360px] bg-zinc-50 dark:bg-zinc-900/40 rounded-xl overflow-hidden flex items-center justify-center relative border border-zinc-200/60 dark:border-zinc-800/60">
            <GeoMap data={data?.geoDistribution || []} />
          </div>
        </div>

        {/* Right: Tactical Geo Dossier Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-zinc-400" />
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
                  GEO DOSSIER // TOP REGIONS
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">SIGNALS</span>
            </div>

            {/* Countries Ranked */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Top Intercepted Countries</span>
              {data?.geoDistribution && data.geoDistribution.length > 0 ? (
                data.geoDistribution.slice(0, 4).map((geo: any, i: number) => {
                  const pct = Math.round((geo.count / (data.totalVisits || 1)) * 100);
                  return (
                    <div 
                      key={geo.country}
                      onClick={() => setSearchQuery(geo.country)}
                      className="group cursor-pointer p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-zinc-900 dark:text-zinc-200 font-mono flex items-center gap-1.5">
                          <span className="text-zinc-400 text-[10px]">{i + 1}.</span>
                          {geo.country}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-500">{geo.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-800 dark:bg-zinc-200 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-zinc-500">No country data.</p>
              )}
            </div>

            {/* Cities Breakdown */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Top Detected Cities</span>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-[140px] overflow-y-auto">
                {data?.topCities && data.topCities.length > 0 ? (
                  data.topCities.map((cityItem: any) => (
                    <div 
                      key={`${cityItem.city}-${cityItem.country}`}
                      onClick={() => setSearchQuery(cityItem.city)}
                      className="py-1.5 px-1 flex items-center justify-between text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/40 rounded cursor-pointer transition-colors"
                    >
                      <span className="text-zinc-800 dark:text-zinc-300 truncate max-w-[170px]">
                        {cityItem.city}, <span className="text-zinc-500 font-mono text-[10px]">{cityItem.country}</span>
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 shrink-0">
                        <span>{formatDuration(cityItem.avgDuration)}</span>
                        <span className="font-bold text-zinc-700 dark:text-zinc-200">{cityItem.count}x</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 py-1">No city coordinates available.</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Click any location to filter logs</span>
            <span>AUTO-SYNCED</span>
          </div>
        </div>

      </div>

      {/* 4. Telemetry Charts: 7-Day Trend + Hardware & OS Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7-Day Traffic Trend */}
        <div className="bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-zinc-400" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
                TELEMETRY TIMELINE // 7-DAY INTERCEPT
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">SIGNALS PER DAY</span>
          </div>

          <div className="h-[220px] w-full">
            {data?.chartData && data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#121216', 
                      borderRadius: '10px', 
                      border: '1px solid #27272a',
                      color: '#fafafa',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#fafafa" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: '#121216', strokeWidth: 1.5, stroke: '#fafafa' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500">Not enough data to display trend.</div>
            )}
          </div>
        </div>

        {/* Hardware & OS Matrix */}
        <div className="bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Monitor size={15} className="text-zinc-400" />
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
                  HARDWARE MATRIX
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">DEVICES</span>
            </div>

            {/* Donut Chart */}
            <div className="h-[140px] w-full">
              {data?.deviceDistribution && data.deviceDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={data.deviceDistribution} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={40} 
                      outerRadius={56} 
                      paddingAngle={4} 
                      dataKey="value"
                    >
                      {data.deviceDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={MONO_COLORS[index % MONO_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#121216', 
                        borderRadius: '8px', 
                        border: '1px solid #27272a',
                        color: '#fafafa',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            {/* Device counts list */}
            <div className="flex flex-wrap justify-center gap-3 text-xs mt-2">
              {data?.deviceDistribution?.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: MONO_COLORS[index % MONO_COLORS.length] }} />
                  <span>{entry.name}:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-200">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span>CLIENT FINGERPRINTS</span>
            <span>DECODED</span>
          </div>
        </div>

      </div>

      {/* 5. Annual Activity Grid & Top Browsers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap */}
        <div className="bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs lg:col-span-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-3 min-w-max">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
              <Terminal size={14} className="text-zinc-400" />
              365-DAY SURVEILLANCE GRID
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">ANNUAL DENSITY</span>
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
                  totalCount: '{{count}} signals recorded',
                }}
              />
            ) : (
              <div className="text-xs text-zinc-500 py-6">No surveillance records logged yet.</div>
            )}
          </div>
        </div>

        {/* Top Browsers Engines */}
        <div className="bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 mb-3 flex items-center gap-2">
            <Globe size={14} className="text-zinc-400" />
            USER-AGENT ENGINES
          </h3>
          <div className="space-y-1.5">
            {data?.browserDistribution && data.browserDistribution.length > 0 ? (
              data.browserDistribution.map((browser: any, i: number) => (
                <div key={browser.name} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-400 w-3">{i + 1}.</span>
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

      {/* 6. Detailed Surveillance Table (CIA Audit Stream with Dossier Inspection) */}
      <div className="bg-white dark:bg-[#0c0d12] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs overflow-hidden">
        
        {/* Table Controls Header */}
        <div className="p-4 md:p-5 border-b border-zinc-200/70 dark:border-zinc-800/70 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
                INTERCEPT AUDIT LOGS
              </h3>
              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {filteredVisits.length} Records
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Click any row to open the Visitor Dossier Drawer • Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative md:w-52">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search city, country, hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
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
              <tr className="border-b border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/70 dark:bg-zinc-900/40 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4 w-10">
                  <button onClick={toggleAllCurrentPage} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                    {allPageIdsSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                  </button>
                </th>
                <th className="py-2.5 px-3">Coordinates / Origin</th>
                <th className="py-2.5 px-3">Target Route</th>
                <th className="py-2.5 px-3">Hardware / OS</th>
                <th className="py-2.5 px-3">Dwell Time</th>
                <th className="py-2.5 px-3">Intercept Timestamp</th>
                <th className="py-2.5 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono text-[11px]">
              {paginatedVisits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-zinc-500">
                    No surveillance records found matching current query.
                  </td>
                </tr>
              ) : (
                paginatedVisits.map((v: any) => {
                  const isSelected = selectedIds.includes(v.id);
                  const isMobile = v.device === 'Mobile';
                  const locationText = v.country && v.country !== 'Unknown'
                    ? `${v.city && v.city !== 'Unknown' ? `${v.city}, ` : ''}${v.country}`
                    : 'Unknown Origin';

                  return (
                    <tr 
                      key={v.id}
                      onClick={() => setInspectingVisit(v)}
                      className={`cursor-pointer transition-colors group ${
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
                          {isSelected ? <CheckSquare size={14} className="text-zinc-900 dark:text-zinc-100" /> : <Square size={14} />}
                        </button>
                      </td>

                      {/* Coordinates & Origin */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                            {isMobile ? <Smartphone size={12} /> : <Monitor size={12} />}
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block truncate max-w-[170px]">
                              {locationText}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {v.ipHash ? `SIG:#${v.ipHash.slice(0, 8)}` : 'ANON'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Target Route */}
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {formatPath(v.path)}
                        </span>
                      </td>

                      {/* Client / OS */}
                      <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                        <div className="truncate max-w-[150px]">
                          <span>{v.browser || 'Client'}</span>
                          {v.os && <span className="text-zinc-400"> ({v.os})</span>}
                        </div>
                      </td>

                      {/* Dwell Time */}
                      <td className="py-3 px-3 text-zinc-700 dark:text-zinc-300">
                        {v.duration !== undefined && v.duration > 0 ? formatDuration(v.duration) : '0s'}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-3 text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                        {new Date(v.visitedAt).toLocaleString()}
                      </td>

                      {/* Dossier Action Button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingVisit(v);
                          }}
                          className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono transition-colors inline-flex items-center gap-1 group-hover:border-zinc-400"
                        >
                          Dossier
                          <ArrowUpRight size={11} />
                        </button>
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

      {/* 7. Slide-Over Visitor Dossier Drawer */}
      <VisitorDossierDrawer
        visit={inspectingVisit}
        onClose={() => setInspectingVisit(null)}
        onDelete={handleSingleDelete}
        onFilterLocation={(query) => setSearchQuery(query)}
      />

    </div>
  );
}
