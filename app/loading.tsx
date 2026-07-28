import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto w-full pt-16 md:pt-24 px-4 md:px-8 pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center justify-center pt-6 pb-6 text-center space-y-4">
        <div className="h-10 md:h-12 w-64 bg-zinc-200 dark:bg-white/5 rounded-2xl"></div>
        <div className="h-6 md:h-7 w-48 bg-zinc-200 dark:bg-white/5 rounded-xl"></div>
        <div className="mt-4 flex flex-col items-center space-y-2">
          <div className="h-4 w-full max-w-sm bg-zinc-200 dark:bg-white/5 rounded-md"></div>
          <div className="h-4 w-3/4 max-w-sm bg-zinc-200 dark:bg-white/5 rounded-md"></div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <div className="h-10 w-28 bg-zinc-200 dark:bg-white/5 rounded-xl"></div>
          <div className="h-10 w-28 bg-zinc-200 dark:bg-white/5 rounded-xl"></div>
          <div className="h-[38px] w-[40px] bg-zinc-200 dark:bg-white/5 rounded-xl"></div>
        </div>
      </div>

      {/* Projects Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="h-[380px] bg-zinc-200 dark:bg-white/5 rounded-[24px]"></div>
        <div className="h-[380px] bg-zinc-200 dark:bg-white/5 rounded-[24px]"></div>
      </div>

      {/* Widgets Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* TechStack (Span 3) */}
        <div className="md:col-span-3 h-[160px] bg-zinc-200 dark:bg-white/5 rounded-[24px]"></div>
        {/* GithubWidget (Span 3) */}
        <div className="md:col-span-3 h-[160px] bg-zinc-200 dark:bg-white/5 rounded-[24px]"></div>
        
        {/* SkillsWidget (Span 3) */}
        <div className="md:col-span-3 h-[160px] bg-zinc-200 dark:bg-white/5 rounded-[24px]"></div>
        {/* Education (Span 3) */}
        <div className="md:col-span-3 h-[160px] bg-zinc-200 dark:bg-white/5 rounded-[24px]"></div>
      </div>
    </div>
  );
}
