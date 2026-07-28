import React from 'react';
import { ExternalLink, GraduationCap, Hexagon } from 'lucide-react';
import { prisma } from '@/lib/prisma';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function FeaturedProjects({ showDrafts = false }: { showDrafts?: boolean }) {
  const featuredProjects = await prisma.project.findMany({
    where: showDrafts ? undefined : { published: true },
    orderBy: { order: 'asc' }
  });
  const getIcon = (name: string) => {
    switch (name) {
      case 'avatar': return <GraduationCap size={18} strokeWidth={2} className="text-black" />;
      case 'hexagon': return <Hexagon size={18} strokeWidth={2} className="text-zinc-400" />;
      default: return <GraduationCap size={18} strokeWidth={2} className="text-black" />;
    }
  };

  return (
    <>
      {featuredProjects.map((project: any, index: number) => (
        <div key={project.id} className="flex flex-col p-7 border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050505] rounded-[24px] min-h-[380px] transition-colors duration-300">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                {/* For Kaggle, there's no white bg square. So we render it conditionally based on icon type */}
                {project.icon === 'avatar' ? (
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white text-black">
                    {getIcon(project.icon)}
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-w-8 w-8 h-8 text-zinc-400">
                    {getIcon(project.icon)}
                  </div>
                )}
                <h3 className="text-[19px] font-bold font-sans tracking-tight text-zinc-900 dark:text-white truncate">{project.title}</h3>
              </div>
              {index === 0 && (
                <span className="px-3 py-1 text-[10px] font-sans font-medium border border-zinc-200 dark:border-white/10 rounded-full text-zinc-600 dark:text-zinc-400 bg-transparent">
                  Featured
                </span>
              )}
            </div>

            {project.badge && (
              <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-6 font-sans">
                {project.badge}
              </p>
            )}

            {project.description && (
              <div className="text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400 mb-6 font-sans prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-a:text-blue-500 hover:prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              </div>
            )}

            {project.stats && (project.stats as any).length > 0 && (
              <div className="flex bg-zinc-100/50 dark:bg-white/[0.02] border border-transparent dark:border-white/5 rounded-2xl p-5 mb-8">
                <div className="grid grid-cols-2 w-full gap-4">
                  {(project.stats as any).map((stat: any, idx: number) => (
                    <div key={idx}>
                      <h4 className="text-xl font-bold mb-1 font-sans text-zinc-900 dark:text-white">{stat.value}</h4>
                      <p className="text-[12px] font-sans text-zinc-500 dark:text-zinc-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 mt-auto">
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: any) => (
                  <span key={tag} className="px-2.5 py-1 text-[11px] font-sans font-medium border border-zinc-200 dark:border-white/10 rounded-[6px] text-zinc-600 dark:text-zinc-300 bg-transparent">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-sans font-semibold border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-900 dark:text-zinc-100 focus:outline-none bg-transparent">
              <ExternalLink size={16} strokeWidth={2} className="text-zinc-900 dark:text-zinc-400" /> {project.linkText}
            </a>
          </div>
        </div>
      ))}
    </>
  );
}
