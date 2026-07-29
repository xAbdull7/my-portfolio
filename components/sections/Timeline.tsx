'use client';

import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Timeline({ profile }: { profile: any }) {
  const timelineItems = profile?.timeline && Array.isArray(profile.timeline) ? profile.timeline : [];

  if (timelineItems.length === 0) return null;

  return (
    <div className="w-full mt-4 mb-4">
      <div className="border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050505] rounded-[32px] p-8 md:p-12 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
              Experience & Education
            </h2>
            <p className="text-zinc-500 font-medium">My professional journey and academic background.</p>
          </div>
        </div>

        <div className="relative border-l border-zinc-200 dark:border-white/10 ml-4 md:ml-6 space-y-12">
          {timelineItems.map((item: any, index: number) => {
            const isExperience = item.type === 'experience';
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline Node */}
                <div className="absolute -left-5 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#050505] border-4 border-zinc-50 dark:border-[#050505] shadow-sm">
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-white shadow-md ${isExperience ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-orange-400 to-red-500'}`}>
                    {isExperience ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                  </div>
                </div>

                {/* Content */}
                <div className="group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-white/10 px-3 py-1 rounded-full w-max">
                      {item.date}
                    </span>
                  </div>
                  
                  <h4 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
                    {item.subtitle}
                  </h4>
                  
                  {item.description && (
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
