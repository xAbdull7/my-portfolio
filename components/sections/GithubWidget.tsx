import React from 'react';


const GithubIcon = ({ size = 24, className = '', strokeWidth = 2 }: { size?: number, className?: string, strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
import { prisma } from '@/lib/prisma';
import GithubCalendarClient from './GithubCalendarClient';

export default async function GithubWidget() {
  const profile = await prisma.profile.findUnique({ where: { id: 'default' } });
  
  if (!profile?.githubUrl) return null;
  
  // Extract username from URL (e.g., https://github.com/xAbdull7 -> xAbdull7)
  const usernameMatch = profile.githubUrl.match(/github\.com\/([^/]+)/);
  const username = usernameMatch ? usernameMatch[1] : null;

  return (
    <div className="md:col-span-3 border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050505] rounded-[24px] p-5 flex flex-col transition-colors duration-300 min-h-[160px] relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <GithubIcon size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <GithubIcon size={16} strokeWidth={2} className="text-zinc-700 dark:text-zinc-400" />
          <h3 className="font-bold font-sans text-[15px] tracking-tight text-zinc-900 dark:text-white">GitHub Stats</h3>
        </div>
        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors truncate max-w-[120px] text-right">
          @{username}
        </a>
      </div>
      
      <div className="flex-1 flex flex-col justify-end mt-4 relative z-10 w-full">
        {username ? (
          <GithubCalendarClient username={username} />
        ) : (
          <div className="text-zinc-500 text-sm text-center py-4">No GitHub username found</div>
        )}
      </div>
    </div>
  );
}
