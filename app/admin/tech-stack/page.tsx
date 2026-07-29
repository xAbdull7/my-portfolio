'use client';
import { useState, useEffect } from 'react';
import { Save, Code2 } from 'lucide-react';

export default function TechStackAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    languages: '',
    data: '',
    web: '',
    devops: '',
  });

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const res = await fetch('/api/tech-stack');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setFormData({
              languages: data.languages || '',
              data: data.data || '',
              web: data.web || '',
              devops: data.devops || '',
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchTechStack();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/tech-stack', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Tech Stack saved successfully!');
      } else {
        alert('Failed to save tech stack');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving tech stack');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tech Stack</h1>
        <p className="text-zinc-500 text-sm">Update the technologies you work with. Separate tags with commas.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm space-y-6 overflow-hidden w-full max-w-full">
        <div className="flex items-center gap-2 text-lg font-semibold border-b border-zinc-100 dark:border-white/5 pb-4 mb-2">
          <Code2 className="text-zinc-400" /> Technology Categories
        </div>
        
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Languages</label>
            <textarea 
              rows={3} 
              value={formData.languages} 
              onChange={(e) => setFormData({...formData, languages: e.target.value})} 
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm resize-none" 
              placeholder="Python, JavaScript, TypeScript..." 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Data & DB</label>
            <textarea 
              rows={3} 
              value={formData.data} 
              onChange={(e) => setFormData({...formData, data: e.target.value})} 
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm resize-none" 
              placeholder="PostgreSQL, MongoDB, BigQuery..." 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Web & Frameworks</label>
            <textarea 
              rows={3} 
              value={formData.web} 
              onChange={(e) => setFormData({...formData, web: e.target.value})} 
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm resize-none" 
              placeholder="React, Next.js, Node.js..." 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">DevOps & Cloud</label>
            <textarea 
              rows={3} 
              value={formData.devops} 
              onChange={(e) => setFormData({...formData, devops: e.target.value})} 
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm resize-none" 
              placeholder="AWS, Docker, GitHub Actions..." 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 sticky bottom-6 z-10">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg disabled:opacity-70"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Tech Stack'}
          </button>
        </div>
      </form>
    </div>
  );
}
