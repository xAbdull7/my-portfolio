'use client';
import React, { useEffect, useState } from 'react';
import { ExternalLink, Trophy, Mail, Sun, Moon, Download, Copy, Check } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import EmailButton from '@/components/EmailButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

export default function Header({ profile }: { profile: any }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'external': return <ExternalLink size={14} strokeWidth={2} />;
      case 'trophy': return <Trophy size={14} strokeWidth={2} />;
      case 'mail': return <Mail size={14} strokeWidth={2} />;
      case 'download': return <Download size={14} strokeWidth={2} />;
      case 'copy': return <Copy size={14} strokeWidth={2} />;
      case 'check': return <Check size={14} strokeWidth={2} className="text-green-500" />;
      default: return null;
    }
  };

  const handleCopyEmail = () => {
    if (profile?.emailUrl) {
      const email = profile.emailUrl.replace('mailto:', '');
      navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success('Email copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="flex flex-col items-center justify-center pt-6 pb-6 text-center space-y-4 transition-colors duration-300">
      <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white">{profile.name}</h1>
      <h2 className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-sans">{profile.role}</h2>
      <div className="text-[14px] text-zinc-500 dark:text-zinc-400 max-w-lg font-sans mt-2 prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-a:text-blue-500 hover:prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {profile.bio}
        </ReactMarkdown>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
        {profile.resumeUrl && (
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="relative inline-flex h-10 overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a1a1aa_50%,transparent_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#71717a_50%,transparent_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-white dark:bg-[#050505] px-4 py-2.5 text-[13px] font-sans font-semibold text-zinc-900 dark:text-zinc-300 backdrop-blur-3xl gap-2.5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
              {getIcon('download')} Download CV
            </span>
          </a>
        )}
        {profile.emailUrl && (
          <>
            <EmailButton className="relative inline-flex h-10 overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a1a1aa_50%,transparent_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#71717a_50%,transparent_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-white dark:bg-[#050505] px-4 py-2.5 text-[13px] font-sans font-semibold text-zinc-900 dark:text-zinc-300 backdrop-blur-3xl gap-2.5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                {getIcon('mail')} Hire Me
              </span>
            </EmailButton>
            <button 
              onClick={handleCopyEmail}
              className="relative inline-flex h-10 overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              title="Copy Email Address"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a1a1aa_50%,transparent_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#71717a_50%,transparent_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-white dark:bg-[#050505] px-4 py-2.5 text-[13px] font-sans font-semibold text-zinc-900 dark:text-zinc-300 backdrop-blur-3xl gap-2.5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                {copied ? getIcon('check') : getIcon('copy')}
              </span>
            </button>
          </>
        )}
        <button onClick={toggleTheme} aria-label="Toggle Theme" className="flex items-center justify-center w-[40px] h-[40px] rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors bg-transparent focus:outline-none">
          {mounted ? (theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />) : <div className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}

