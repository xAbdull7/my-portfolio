'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Globe2 } from 'lucide-react';

export default function SkillsWidget({ profile }: { profile: any }) {
  const [activeTab, setActiveTab] = useState<'soft' | 'languages'>('soft');

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab((prev) => (prev === 'soft' ? 'languages' : 'soft'));
    }, 3500); // Wait 3.5 seconds before auto-swapping
    return () => clearTimeout(timer);
  }, [activeTab]); // Reset timer whenever the tab changes (even if clicked)

  const toggleTab = () => {
    setActiveTab((prev) => (prev === 'soft' ? 'languages' : 'soft'));
  };

  return (
    <div 
      onClick={toggleTab}
      className="md:col-span-3 border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050505] rounded-[24px] p-6 transition-colors duration-300 min-h-[160px] cursor-pointer group grid items-center overflow-hidden"
    >
      
      <div 
        className="col-start-1 row-start-1 w-full flex flex-col transition-all duration-700 ease-in-out"
        style={{
          opacity: activeTab === 'soft' ? 1 : 0,
          transform: activeTab === 'soft' ? 'translateY(0)' : 'translateY(15px)',
          pointerEvents: activeTab === 'soft' ? 'auto' : 'none'
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} strokeWidth={2} className="text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          <h3 className="font-bold font-sans text-[15px] tracking-tight text-zinc-900 dark:text-white">Soft Skills</h3>
        </div>
        
        <div className="flex flex-col h-full justify-center">
          {profile?.softSkills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(profile.softSkills || []).map((skill: string) => (
                <span key={skill} className="px-2 py-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-md text-[11px] text-zinc-700 dark:text-zinc-300">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
              No soft skills listed.
            </p>
          )}
        </div>
      </div>

      <div 
        className="col-start-1 row-start-1 w-full flex flex-col transition-all duration-700 ease-in-out"
        style={{
          opacity: activeTab === 'languages' ? 1 : 0,
          transform: activeTab === 'languages' ? 'translateY(0)' : 'translateY(-15px)',
          pointerEvents: activeTab === 'languages' ? 'auto' : 'none'
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe2 size={16} strokeWidth={2} className="text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          <h3 className="font-bold font-sans text-[15px] tracking-tight text-zinc-900 dark:text-white">Languages</h3>
        </div>
        
        <div className="mt-4 space-y-4">
          {(profile?.languages || []).map((lang: any, index: number) => {
            const isObj = typeof lang === 'object' && lang !== null;
            const langName = isObj ? lang.name : lang;
            const langLevel = isObj ? (
              lang.level === 'Native' ? '100%' : 
              lang.level === 'Fluent' ? '85%' : 
              lang.level === 'Intermediate' ? '60%' : 
              '40%' // Beginner
            ) : '85%';
            return (
              <div key={langName || index} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[12px] font-sans mb-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200 whitespace-nowrap">{langName}</span>
                  {isObj && lang.level && (
                    <span className="text-zinc-500 text-[10px] font-medium tracking-wide">{lang.level}</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-800 dark:bg-white/80 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: activeTab === 'languages' ? langLevel : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
