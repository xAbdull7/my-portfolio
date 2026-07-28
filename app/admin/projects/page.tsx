'use client';
import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, GripVertical, Folder, X, Save, Eye, EyeOff, ExternalLink } from 'lucide-react';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableProjectRow({ project, onEdit, onDelete }: { project: any, onEdit: (p: any) => void, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className={`grid grid-cols-[auto_1fr_auto] gap-4 p-6 items-center transition-colors group ${isDragging ? 'bg-zinc-100 dark:bg-white/10 shadow-lg scale-[1.01]' : 'bg-transparent hover:bg-zinc-50 dark:hover:bg-white/5'}`}>
      <div {...attributes} {...listeners} className="w-8 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400 flex items-center">
        <GripVertical size={18} />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            {project.title}
            {!project.published && (
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <EyeOff size={10} /> Draft
              </span>
            )}
          </h3>
          {project.badge && (
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
              {project.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-500 line-clamp-1 max-w-xl">{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {project.tags.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="text-xs text-zinc-400 dark:text-zinc-500">#{tag}</span>
            ))}
            {project.tags.length > 3 && <span className="text-xs text-zinc-400 dark:text-zinc-500">+{project.tags.length - 3}</span>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!project.published && (
          <a href={`/?preview=true#projects`} target="_blank" rel="noreferrer" title="Preview Draft" className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors">
            <ExternalLink size={16} />
          </a>
        )}
        <button onClick={() => onEdit(project)} title="Edit" className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
          <Edit2 size={16} />
        </button>
        <button onClick={() => onDelete(project.id)} title="Delete" className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    badge: '',
    description: '',
    link: '',
    linkText: 'Visit Live Site',
    icon: 'library',
    tags: '',
    published: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        // Sort by order initially
        setProjects(data.sort((a: any, b: any) => a.order - b.order));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over?.id);
      
      const newOrderedProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newOrderedProjects);
      
      // Save order to DB
      setIsSavingOrder(true);
      try {
        const updates = newOrderedProjects.map((p, index) => ({ id: p.id, order: index }));
        await fetch('/api/projects/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projects: updates })
        });
      } catch (error) {
        console.error("Failed to reorder", error);
      }
      setIsSavingOrder(false);
    }
  };

  const openModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        badge: project.badge || '',
        description: project.description || '',
        link: project.link || '',
        linkText: project.linkText || 'Visit Live Site',
        icon: project.icon || 'library',
        tags: project.tags?.join(', ') || '',
        published: project.published !== false,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        badge: '',
        description: '',
        link: '',
        linkText: 'Visit Live Site',
        icon: 'library',
        tags: '',
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    
    const payload = {
      ...formData,
      tags: tagsArray,
      order: editingProject ? editingProject.order : projects.length, // Put new at the end
    };

    const method = editingProject ? 'PUT' : 'POST';
    const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchProjects();
      } else {
        alert('Failed to save project');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
          <p className="text-zinc-500 text-sm">Manage and reorder projects displayed on your portfolio.</p>
        </div>
        <div className="flex items-center gap-4">
          {isSavingOrder && <span className="text-sm text-zinc-500 flex items-center gap-2"><div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div> Saving order...</span>}
          <button 
            onClick={() => openModal()}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#050505] rounded-[32px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-4">
            <div className="w-6 h-6 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-2">
              <Folder size={24} className="text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-900 dark:text-white">No projects found</p>
            <p className="text-sm text-zinc-500 max-w-sm">Projects table will appear here once the API is connected. Click "Add Project" to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-6 border-b border-zinc-100 dark:border-white/5 text-xs font-medium text-zinc-400 uppercase tracking-wider">
              <div className="w-8"></div>
              <div>Project Details</div>
              <div className="pr-4">Actions</div>
            </div>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={projects.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="divide-y divide-zinc-100 dark:divide-white/5 flex flex-col relative">
                  {projects.map((project) => (
                    <SortableProjectRow 
                      key={project.id} 
                      project={project} 
                      onEdit={openModal} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-100 dark:border-white/10 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/5">
                <div>
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">Publish Status</h4>
                  <p className="text-xs text-zinc-500 mt-1">If unchecked, this project will be saved as a draft and hidden.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Project Title *</label>
                    <input 
                      required 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm"
                      placeholder="e.g. StudentsAI"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Badge/Subtitle</label>
                    <input 
                      value={formData.badge} 
                      onChange={(e) => setFormData({...formData, badge: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm"
                      placeholder="e.g. AI-powered study platform"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                  <MarkdownEditor 
                    value={formData.description} 
                    onChange={(val) => setFormData({...formData, description: val})} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Project URL *</label>
                    <input 
                      required
                      value={formData.link} 
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Link Text</label>
                    <input 
                      value={formData.linkText} 
                      onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm"
                      placeholder="e.g. Visit Live Site"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Icon Type</label>
                    <select 
                      value={formData.icon} 
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm appearance-none"
                    >
                      <option value="library">Library (Code)</option>
                      <option value="terminal">Terminal</option>
                      <option value="avatar">Avatar (People)</option>
                      <option value="hexagon">Hexagon (Misc)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tags (comma separated)</label>
                    <input 
                      value={formData.tags} 
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm"
                      placeholder="React, Next.js, Tailwind..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-white/10 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm shadow-md"
                >
                  <Save size={16} /> Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
