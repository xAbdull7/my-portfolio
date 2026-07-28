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
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 text-sm font-sans font-bold rounded-xl transition-all shadow-sm bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-white">
            {getIcon('download')} Download CV
          </a>
        )}
        {profile.emailUrl && (
          <>
            <EmailButton className="flex items-center gap-2 px-5 py-2.5 text-sm font-sans font-bold rounded-xl transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {getIcon('mail')} Hire Me
            </EmailButton>
            <button 
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-sans font-semibold border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-900 dark:text-zinc-300 focus:outline-none bg-transparent"
              title="Copy Email Address"
            >
              {copied ? getIcon('check') : getIcon('copy')}
            </button>
          </>
        )}
        <button onClick={toggleTheme} aria-label="Toggle Theme" className="flex items-center justify-center w-[42px] h-[42px] rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors bg-transparent focus:outline-none">
          {mounted ? (theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />) : <div className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}

