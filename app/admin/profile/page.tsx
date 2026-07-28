'use client';
import { useState, useEffect } from 'react';
import { Save, User, Link as LinkIcon, Music, BookOpen, Brain, Globe } from 'lucide-react';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

export default function ProfileAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', role: '', bio: '',
    resumeUrl: '', githubUrl: '', linkedinUrl: '', twitterUrl: '', emailUrl: '',
    eduMajor: '', eduUni: '', eduYear: '',
    softSkills: '', languages: [] as {name: string, level: string}[],
    seoTitle: '', seoDescription: '', seoKeywords: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setFormData({
              name: data.name || '',
              role: data.role || '',
              bio: data.bio || '',
              resumeUrl: data.resumeUrl || '',
              githubUrl: data.githubUrl || '',
              linkedinUrl: data.linkedinUrl || '',
              twitterUrl: data.twitterUrl || '',
              emailUrl: data.emailUrl || '',
              eduMajor: data.eduMajor || '',
              eduUni: data.eduUni || '',
              eduYear: data.eduYear || '',
              softSkills: data.softSkills ? data.softSkills.join(', ') : '',
              languages: data.languages && Array.isArray(data.languages) ? data.languages.map((l: any) => {
                if (typeof l === 'string') {
                  return { name: l.replace('[object Object]', '').trim() || 'Unknown', level: 'Fluent' };
                }
                return l;
              }).filter((l: any) => l.name) : [],
              seoTitle: data.seoTitle || '',
              seoDescription: data.seoDescription || '',
              seoKeywords: data.seoKeywords || '',
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Parse arrays
    const payload = {
      ...formData,
      softSkills: formData.softSkills.split(',').map((s: string) => s.trim()).filter(Boolean),
      languages: formData.languages.filter(l => l.name.trim() !== ''),
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile Data</h1>
        <p className="text-zinc-500 text-sm">Update your personal information, links, and education.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold border-b border-zinc-100 dark:border-white/5 pb-4 mb-2">
            <User className="text-zinc-400" /> Basic Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
              <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role</label>
              <input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
            <MarkdownEditor value={formData.bio} onChange={(val) => setFormData({...formData, bio: val})} />
          </div>
        </div>

        {/* Links */}
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold border-b border-zinc-100 dark:border-white/5 pb-4 mb-2">
            <LinkIcon className="text-zinc-400" /> Connect Links
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Resume URL</label>
              <input value={formData.resumeUrl} onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">GitHub URL</label>
              <input value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">LinkedIn URL</label>
              <input value={formData.linkedinUrl} onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Twitter URL</label>
              <input value={formData.twitterUrl} onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email URL (mailto:)</label>
              <input value={formData.emailUrl} onChange={(e) => setFormData({...formData, emailUrl: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold border-b border-zinc-100 dark:border-white/5 pb-4 mb-2">
            <BookOpen className="text-zinc-400" /> Education
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Major/Degree</label>
              <input value={formData.eduMajor} onChange={(e) => setFormData({...formData, eduMajor: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">University</label>
              <input value={formData.eduUni} onChange={(e) => setFormData({...formData, eduUni: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Years</label>
              <input value={formData.eduYear} onChange={(e) => setFormData({...formData, eduYear: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm" />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold border-b border-zinc-100 dark:border-white/5 pb-4 mb-2">
            <Brain className="text-zinc-400" /> Soft Skills & Languages
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Soft Skills (comma separated)</label>
              <textarea rows={3} value={formData.softSkills} onChange={(e) => setFormData({...formData, softSkills: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm resize-none" placeholder="Communication, Teamwork..." />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Languages & Proficiency</label>
              <div className="space-y-2">
                {formData.languages.map((lang, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input 
                      value={lang.name}
                      onChange={(e) => {
                        const newLangs = [...formData.languages];
                        newLangs[index].name = e.target.value;
                        setFormData({...formData, languages: newLangs});
                      }}
                      placeholder="e.g. English"
                      className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm"
                    />
                    <select 
                      value={lang.level}
                      onChange={(e) => {
                        const newLangs = [...formData.languages];
                        newLangs[index].level = e.target.value;
                        setFormData({...formData, languages: newLangs});
                      }}
                      className="w-32 md:w-40 px-4 py-3 bg-zinc-50 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm cursor-pointer text-zinc-900 dark:text-zinc-200"
                    >
                      <option value="Native" className="bg-white dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-200">Native</option>
                      <option value="Fluent" className="bg-white dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-200">Fluent</option>
                      <option value="Intermediate" className="bg-white dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-200">Intermediate</option>
                      <option value="Beginner" className="bg-white dark:bg-[#1a1a1a] text-zinc-900 dark:text-zinc-200">Beginner</option>
                    </select>
                    <button 
                      type="button"
                      onClick={() => {
                        const newLangs = formData.languages.filter((_, i) => i !== index);
                        setFormData({...formData, languages: newLangs});
                      }}
                      className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors shrink-0 flex items-center justify-center"
                      title="Remove Language"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, languages: [...formData.languages, {name: '', level: 'Fluent'}]})}
                className="text-sm font-semibold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10 px-5 py-2.5 rounded-full hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors mt-2"
              >
                + Add Language
              </button>
            </div>
          </div>
        </div>

        {/* SEO Management */}
        <div className="bg-white dark:bg-[#050505] p-6 md:p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold border-b border-zinc-100 dark:border-white/5 pb-4 mb-2">
            <Globe className="text-zinc-400" /> SEO & Metadata
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">SEO Title (Overrides default)</label>
              <input 
                value={formData.seoTitle} 
                onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm"
                placeholder="e.g. Abdullah Muhammad | Full-Stack Developer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">SEO Description</label>
              <textarea 
                rows={3}
                value={formData.seoDescription} 
                onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm resize-none"
                placeholder="Brief description for search engines..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">SEO Keywords (Comma separated)</label>
              <input 
                value={formData.seoKeywords} 
                onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm"
                placeholder="e.g. Developer, React, Next.js, Portfolio"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 sticky bottom-6 z-10">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg disabled:opacity-70"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
