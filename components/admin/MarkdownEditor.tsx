'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { motion } from 'framer-motion';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function MarkdownEditor({ value, onChange, placeholder = "Write something...", rows = 8 }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <div className="border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0a0a0a] focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
      <div className="flex items-center gap-1 px-4 py-3 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#111]">
        <div className="flex bg-zinc-200/50 dark:bg-white/5 p-1 rounded-xl relative">
          {['write', 'preview'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as 'write' | 'preview')}
              className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors z-10 capitalize ${
                activeTab === tab
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-0">
        {activeTab === 'write' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 bg-transparent border-none focus:outline-none focus:ring-0 resize-y min-h-[200px] text-zinc-900 dark:text-zinc-200 text-sm font-sans"
          />
        ) : (
          <div className="p-4 prose prose-sm dark:prose-invert max-w-none min-h-[200px] overflow-y-auto text-zinc-700 dark:text-zinc-300 font-sans">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-zinc-400 italic">Nothing to preview</p>
            )}
          </div>
        )}
      </div>
      <div className="px-4 py-2 bg-zinc-50 dark:bg-white/5 border-t border-zinc-200 dark:border-white/10 text-xs text-zinc-400 flex justify-between items-center">
        <span>Markdown is supported</span>
        <a href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax" target="_blank" rel="noreferrer" className="hover:underline text-blue-500">Styling guide</a>
      </div>
    </div>
  );
}
