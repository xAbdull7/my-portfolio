import React from 'react';
import { Box } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function TechStack() {
  const techStack = await prisma.techStack.findUnique({ where: { id: 'default' } });
  return (
    <div className="md:col-span-3 border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050505] rounded-[24px] p-5 flex flex-col transition-colors duration-300 min-h-[160px]">
      <div className="flex items-center gap-2 mb-6">
        <Box size={16} strokeWidth={2} className="text-zinc-700 dark:text-zinc-400" />
        <h3 className="font-bold font-sans text-[15px] tracking-tight text-zinc-900 dark:text-white">Tech Stack</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 text-[11px] mt-auto">
        <div>
          <h4 className="text-zinc-900 dark:text-zinc-300 font-sans font-semibold mb-1">Languages</h4>
          <p className="text-zinc-500 font-sans leading-relaxed pr-2">{techStack?.languages}</p>
        </div>
        <div>
          <h4 className="text-zinc-900 dark:text-zinc-300 font-sans font-semibold mb-1">ML & Data</h4>
          <p className="text-zinc-500 font-sans leading-relaxed pr-2">{techStack?.data}</p>
        </div>
        <div>
          <h4 className="text-zinc-900 dark:text-zinc-300 font-sans font-semibold mb-1">Web & Backend</h4>
          <p className="text-zinc-500 font-sans leading-relaxed pr-2">{techStack?.web}</p>
        </div>
        <div>
          <h4 className="text-zinc-900 dark:text-zinc-300 font-sans font-semibold mb-1">DevOps & Cloud</h4>
          <p className="text-zinc-500 font-sans leading-relaxed pr-2">{techStack?.devops}</p>
        </div>
      </div>
    </div>
  );
}
