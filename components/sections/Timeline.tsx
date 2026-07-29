'use client';

import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Timeline({ profile }: { profile: any }) {
  const timelineItems = profile?.timeline && Array.isArray(profile.timeline) ? profile.timeline : [];

  if (timelineItems.length === 0) return null;

  return (
    <div className="w-full mt-12 mb-12">
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
              Experience & Education
            </h2>
            <p className="text-zinc-500 font-medium">My professional journey and academic background.</p>
          </div>
        </div>

        {/* Horizontal Timeline Container */}
        <div className="relative flex flex-nowrap items-start gap-8 overflow-x-auto pb-8 pt-4 no-scrollbar scroll-smooth snap-x">
          
          {/* Background horizontal line */}
          <div 
            className="absolute top-[35px] left-0 h-[1px] bg-zinc-200 dark:bg-white/10" 
            style={{ width: `${Math.max(100, timelineItems.length * 32)}rem` }} 
          />

          {timelineItems.map((item: any, index: number) => {
            const isExperience = item.type === 'experience';
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex-shrink-0 w-[280px] md:w-[320px] snap-start group"
              >
                {/* Timeline Node */}
                <div className="absolute top-0 left-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md z-10 transition-transform duration-300 group-hover:scale-110">
                    {isExperience ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                </div>

                {/* Content */}
                <div className="mt-16">
                  <span className="inline-block text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-white/10 px-3 py-1 rounded-full mb-4 transition-colors group-hover:bg-zinc-200 dark:group-hover:bg-white/20">
                    {item.date}
                  </span>
                  
                  <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                    {item.title}
                  </h3>
                  
                  <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                    {item.subtitle}
                  </h4>
                  
                  {item.description && (
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[13px]">
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
