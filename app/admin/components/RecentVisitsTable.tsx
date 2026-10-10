'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Monitor, 
  Smartphone, 
  Clock, 
  Search, 
  ArrowUpRight, 
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

interface VisitRecord {
  id: string;
  path: string;
  visitedAt: string | Date;
  browser?: string | null;
  os?: string | null;
  device?: string | null;
  country?: string | null;
  city?: string | null;
  duration?: number;
}

interface RecentVisitsTableProps {
  initialVisits: VisitRecord[];
  totalVisits: number;
}

export default function RecentVisitsTable({ initialVisits, totalVisits }: RecentVisitsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'Desktop' | 'Mobile'>('all');

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return '—';
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatPath = (p: string) => {
    if (!p || p === '/') return 'Home (/)';
    return p;
  };

  const formatTimeAgo = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredVisits = useMemo(() => {
    return initialVisits.filter((v) => {
      // Device filter
      if (deviceFilter !== 'all' && v.device !== deviceFilter) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const country = (v.country || '').toLowerCase();
      const city = (v.city || '').toLowerCase();
      const path = (v.path || '').toLowerCase();
      const browser = (v.browser || '').toLowerCase();
      const os = (v.os || '').toLowerCase();

      return (
        country.includes(q) ||
        city.includes(q) ||
        path.includes(q) ||
        browser.includes(q) ||
        os.includes(q)
      );
    });
  }, [initialVisits, searchQuery, deviceFilter]);

  return (
    <div className="bg-white dark:bg-[#0d0d11] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-zinc-200/70 dark:border-zinc-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
              Live Visit Telemetry
            </h3>
            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {totalVisits} Logged
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time access logs and audience sessions stream
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter country, path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Device Tabs */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
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
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all flex items-center gap-1 ${
                deviceFilter === 'Desktop'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Monitor size={12} />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceFilter('Mobile')}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all flex items-center gap-1 ${
                deviceFilter === 'Mobile'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Smartphone size={12} />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {filteredVisits.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-xs text-zinc-500">No visit logs match your filter criteria.</p>
          </div>
        ) : (
          filteredVisits.map((visit) => {
            const isMobile = visit.device === 'Mobile';
            const locationText =
              visit.country && visit.country !== 'Unknown'
                ? `${visit.city && visit.city !== 'Unknown' ? `${visit.city}, ` : ''}${visit.country}`
                : 'Unknown Origin';

            return (
              <div
                key={visit.id}
                className="group px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors"
              >
                {/* Left: Device & Location & Path */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isMobile
                        ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                        : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {isMobile ? <Smartphone size={15} /> : <Monitor size={15} />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {locationText}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60">
                        {formatPath(visit.path)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                      <span>{visit.browser || 'Browser'}</span>
                      {visit.os && (
                        <>
                          <span>•</span>
                          <span>{visit.os}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Duration & Timestamp */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {visit.duration !== undefined && visit.duration > 0 && (
                    <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-zinc-800">
                      <Clock size={11} className="text-zinc-400" />
                      {formatDuration(visit.duration)}
                    </div>
                  )}

                  <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 min-w-[65px] text-right">
                    {formatTimeAgo(visit.visitedAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/30 border-t border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between text-xs text-zinc-500">
        <span className="font-mono text-[11px]">
          Showing latest records from {totalVisits} persistent logs
        </span>
        <Link
          href="/admin/analytics"
          className="inline-flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-white transition-colors"
        >
          Detailed Analytics & Map
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
