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
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
              Experience & Education
            </h2>
            <p className="text-zinc-500 font-medium">My professional journey and academic background.</p>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Mobile Vertical Line (Fades out at the bottom) */}
          <div className="absolute left-[19px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-zinc-200 via-zinc-200/50 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent md:hidden" />
          
          {/* Desktop Horizontal Line (Fades out at the right) */}
          <div className="hidden md:block absolute top-[19px] left-4 right-0 h-[2px] bg-gradient-to-r from-zinc-200 via-zinc-200/50 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 relative">
            {timelineItems.map((item: any, index: number) => {
              const isExperience = item.type === 'experience';
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-16 md:pl-0 md:pt-16 group"
                >
                  {/* Timeline Node */}
                  <div className="absolute top-0 left-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md z-10 transition-transform duration-300 group-hover:scale-110">
                      {isExperience ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                  </div>

                  {/* Content */}
                  <div>
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
    </div>
  );
}
