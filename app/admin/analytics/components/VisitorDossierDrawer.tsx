'use client';

import { useState } from 'react';
import { 
  X, 
  Globe, 
  Monitor, 
  Smartphone, 
  Clock, 
  Shield, 
  Copy, 
  Check, 
  Trash2, 
  Filter,
  Terminal,
  Cpu,
  MapPin,
  ExternalLink
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
  ipHash?: string | null;
}

interface VisitorDossierDrawerProps {
  visit: VisitRecord | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onFilterLocation: (query: string) => void;
}

export default function VisitorDossierDrawer({
  visit,
  onClose,
  onDelete,
  onFilterLocation,
}: VisitorDossierDrawerProps) {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!visit) return null;

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return '0s (Bounce)';
    const totalSec = Math.round(seconds);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    if (m > 0) return `${m}m ${s}s (${totalSec}s total)`;
    return `${s}s`;
  };

  const copyHashToClipboard = () => {
    if (visit.ipHash) {
      navigator.clipboard.writeText(visit.ipHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const isMobile = visit.device === 'Mobile';
  const visitedDate = new Date(visit.visitedAt);
  const locationText = visit.country && visit.country !== 'Unknown'
    ? `${visit.city && visit.city !== 'Unknown' ? `${visit.city}, ` : ''}${visit.country}`
    : 'Unknown Origin';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-Over Drawer Sheet */}
      <aside className="w-full max-w-md bg-white dark:bg-[#0c0d12] border-l border-zinc-200 dark:border-zinc-800 h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 antialiased">
        
        {/* Header HUD */}
        <div>
          <div className="p-5 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-200/60 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  DOSSIER // INTERCEPT
                </span>
                <span className="font-mono text-[11px] text-zinc-400">
                  #{visit.id.slice(0, 10)}
                </span>
              </div>
              <h2 className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                Target Intelligence File
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Dossier Content Blocks */}
          <div className="p-5 space-y-5 text-xs">
            
            {/* Section 1: Geographic Radar Coordinates */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase tracking-wider pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-zinc-400" />
                  GEO COORDINATES
                </span>
                <span>ORIGIN NODE</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                  {locationText}
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span>Country: {visit.country || 'N/A'}</span>
                  <span>•</span>
                  <span>City: {visit.city || 'N/A'}</span>
                </div>
              </div>

              {visit.country && visit.country !== 'Unknown' && (
                <button
                  onClick={() => {
                    onFilterLocation(visit.country!);
                    onClose();
                  }}
                  className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Filter size={11} />
                  Filter Table by {visit.country}
                </button>
              )}
            </div>

            {/* Section 2: Hardware & Client Telemetry */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase tracking-wider pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
                <span className="flex items-center gap-1.5">
                  <Cpu size={13} className="text-zinc-400" />
                  HARDWARE & OS SIGNATURE
                </span>
                <span>CLIENT PROFILE</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Device Class</span>
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {isMobile ? <Smartphone size={13} /> : <Monitor size={13} />}
                    {visit.device || 'Desktop'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Operating System</span>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                    {visit.os || 'Unknown OS'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 col-span-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Browser Client</span>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                    {visit.browser || 'Unknown Client'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Navigation Path & Dwell Gauge */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase tracking-wider pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
                <span className="flex items-center gap-1.5">
                  <Terminal size={13} className="text-zinc-400" />
                  NAVIGATION TELEMETRY
                </span>
                <span>INSPECTION</span>
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Infiltration Route</span>
                  <div className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 mt-1">
                    {visit.path || '/'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Session Dwell Time</span>
                  <div className="flex items-center justify-between font-mono text-xs text-zinc-900 dark:text-zinc-100 px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-zinc-400" />
                      {formatDuration(visit.duration)}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {(visit.duration || 0) > 60 ? 'Deep Engagement' : 'Quick Scan'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Cryptographic Fingerprint */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase tracking-wider pb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
                <span className="flex items-center gap-1.5">
                  <Shield size={13} className="text-zinc-400" />
                  CRYPTOGRAPHIC FINGERPRINT
                </span>
                <span>SHA-256</span>
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-700 dark:text-zinc-300 p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                  <span className="truncate mr-2">
                    {visit.ipHash ? `SIG:${visit.ipHash}` : 'ANONYMIZED_SIG'}
                  </span>
                  <button
                    onClick={copyHashToClipboard}
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
                    title="Copy Fingerprint Hash"
                  >
                    {copiedHash ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Section 5: Timestamp Chrono */}
            <div className="p-3 bg-zinc-100/60 dark:bg-zinc-900/30 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 font-mono text-[11px] text-zinc-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>LOCAL TIME:</span>
                <span className="text-zinc-800 dark:text-zinc-200">{visitedDate.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>UTC TIME:</span>
                <span className="text-zinc-800 dark:text-zinc-200">{visitedDate.toISOString().replace('T', ' ').slice(0, 19)} UTC</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-medium text-xs transition-colors"
          >
            Close Dossier
          </button>

          <button
            onClick={() => {
              if (confirm('Permanently purge this visitor signal record?')) {
                onDelete(visit.id);
                onClose();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            Purge Signal
          </button>
        </div>

      </aside>
    </div>
  );
}
