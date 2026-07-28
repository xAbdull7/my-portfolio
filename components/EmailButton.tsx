'use client';
import React, { useState } from 'react';
import { Mail, X, Send } from 'lucide-react';

export default function EmailButton({ fallbackUrl, className, children }: { fallbackUrl?: string, className?: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={className}
      >
        {children}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#050505] w-full max-w-md rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="text-zinc-900 dark:text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold font-sans text-zinc-900 dark:text-white tracking-tight">Get in touch</h3>
                <p className="text-sm text-zinc-500 font-sans mt-2">Send me a message and I'll get back to you as soon as possible.</p>
              </div>

              {status === 'success' ? (
                <div className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Message sent successfully!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Email</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" 
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm resize-none" 
                      placeholder="Hi there..."
                    />
                  </div>
                  
                  {status === 'error' && (
                    <p className="text-red-500 text-xs font-medium">Failed to send message. Please try again.</p>
                  )}

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-70 mt-2"
                  >
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={16} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
