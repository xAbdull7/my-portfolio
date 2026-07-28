import React from 'react';
import { GraduationCap, ExternalLink } from 'lucide-react';

export default function Education({ profile }: { profile: any }) {
  return (
    <div className="md:col-span-3 border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050505] rounded-[24px] p-5 flex flex-col transition-colors duration-300 text-center items-center min-h-[160px]">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap size={16} strokeWidth={2} className="text-zinc-700 dark:text-zinc-400" />
        <h3 className="font-bold font-sans text-[15px] tracking-tight text-zinc-900 dark:text-white">Education</h3>
      </div>
      
      <div className="mt-auto pb-4 flex flex-col items-center justify-center">
        <h4 className="text-[13px] font-bold font-sans text-zinc-900 dark:text-white mb-4 whitespace-pre-line leading-tight">
          {profile?.eduMajor || 'Major'}
        </h4>
        <p className="text-[12px] font-sans text-zinc-500 dark:text-zinc-400 mb-2">@ {profile?.eduUni || 'University'}</p>
        <p className="text-[12px] font-sans text-zinc-500 dark:text-zinc-500">{profile?.eduYear || 'Year'}</p>
      </div>
    </div>
  );
}
