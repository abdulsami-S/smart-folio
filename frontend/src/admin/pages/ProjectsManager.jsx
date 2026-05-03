import React, { useContext, useState } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { createProject, updateProject, deleteProject, toggleProjectVisibility, reorderProjects } from '../../api/projects.api';
import toast from 'react-hot-toast';
import { GripVertical, Eye, EyeOff, Edit, Trash2, Plus, X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableProjectItem = ({ id, project, onEdit, onDelete, onToggleVisibility }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="glass p-4 rounded-xl flex items-center gap-4 border border-black/10 dark:border-white/5 mb-3">
      <button {...attributes} {...listeners} className="cursor-grab hover:text-primary transition-colors">
        <GripVertical size={20} />
      </button>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold truncate">{project.title}</h4>
        <div className="flex gap-2 mt-1 overflow-x-auto no-scrollbar">
          {project.techStack.map((tech, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-black/10 dark:bg-white/10 whitespace-nowrap">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onToggleVisibility(project._id)} className={`p-2 rounded-lg transition-colors ${project.visible ? 'text-secondary hover:bg-secondary/10' : 'text-gray-500 hover:bg-gray-500/10'}`}>
          {project.visible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <button onClick={() => onEdit(project)} className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(project._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const ProjectsManager = () => {
  const { projects, refetch } = useContext(PortfolioContext);
  const [localProjects, setLocalProjects] = useState(projects || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Update local state when context updates
  React.useEffect(() => { setLocalProjects(projects || []); }, [projects]);

  const [formData, setFormData] = useState({
    title: '', description: '', techStack: [], githubUrl: '', liveUrl: '', category: '', visible: true
  });
  const [techInput, setTechInput] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLocalProjects((items) => {
        const oldIndex = items.findIndex((i) => i._id === active.id);
        const newIndex = items.findIndex((i) => i._id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Save to backend
        const updates = newArray.map((item, index) => ({ id: item._id, order: index }));
        toast.promise(reorderProjects(updates), {
          loading: 'Reordering...',
          success: 'Order saved',
          error: 'Failed to reorder'
        }).then(() => refetch());

        return newArray;
      });
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({ title: '', description: '', techStack: [], githubUrl: '', liveUrl: '', category: '', visible: true });
    }
    setIsModalOpen(true);
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.techStack.includes(techInput.trim())) {
        setFormData({ ...formData, techStack: [...formData.techStack, techInput.trim()] });
      }
      setTechInput('');
    }
  };

  const removeTech = (techToRemove) => {
    setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== techToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject._id, formData);
        toast.success('Project updated');
      } else {
        await createProject({ ...formData, order: localProjects.length });
        toast.success('Project added');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted');
        refetch();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleProjectVisibility(id);
      refetch();
    } catch (error) {
      toast.error('Failed to toggle visibility');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm opacity-60">Manage your portfolio projects. Drag to reorder.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="max-w-3xl">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localProjects.map(p => p._id)} strategy={verticalListSortingStrategy}>
            {localProjects.map(project => (
              <SortableProjectItem 
                key={project._id} 
                id={project._id} 
                project={project} 
                onEdit={openModal} 
                onDelete={handleDelete} 
                onToggleVisibility={handleToggleVisibility} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 opacity-80">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1 opacity-80">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1 opacity-80">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm mb-1 opacity-80">Tech Stack (Press Enter to add)</label>
                <div className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus-within:border-primary flex flex-wrap gap-2 items-center">
                  {formData.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs flex items-center gap-1">
                      {tech} <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-500 cursor-pointer"><X size={12} /></button>
                    </span>
                  ))}
                  <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={handleAddTech} placeholder="e.g. React" className="bg-transparent outline-none flex-1 min-w-[100px] text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 opacity-80">GitHub URL</label>
                  <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1 opacity-80">Live URL</label>
                  <input type="url" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="visible" checked={formData.visible} onChange={e => setFormData({...formData, visible: e.target.checked})} className="w-4 h-4 cursor-pointer" />
                <label htmlFor="visible" className="text-sm cursor-pointer opacity-80">Visible on portfolio</label>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-black font-semibold rounded-lg hover:opacity-90 cursor-pointer">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
