import React, { useContext, useState } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { createTimelineEntry, updateTimelineEntry, deleteTimelineEntry, reorderTimeline } from '../../api/timeline.api';
import toast from 'react-hot-toast';
import { GripVertical, Edit, Trash2, Plus, X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableTimelineItem = ({ id, entry, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeColors = {
    'Education': 'text-primary',
    'Work': 'text-secondary',
    'Achievement': 'text-accent'
  };

  return (
    <div ref={setNodeRef} style={style} className="glass p-4 rounded-xl flex items-center gap-4 border border-black/10 dark:border-white/5 mb-3">
      <button {...attributes} {...listeners} className="cursor-grab hover:text-primary transition-colors">
        <GripVertical size={20} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 ${typeColors[entry.type]}`}>
            {entry.type}
          </span>
          <span className="text-xs opacity-60">{entry.duration}</span>
        </div>
        <h4 className="font-bold truncate">{entry.title}</h4>
        <p className="text-sm opacity-80 truncate">{entry.institution}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(entry)} className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(entry._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const TimelineManager = () => {
  const { timeline, refetch } = useContext(PortfolioContext);
  const [localTimeline, setLocalTimeline] = useState(timeline || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  
  React.useEffect(() => { setLocalTimeline(timeline || []); }, [timeline]);

  const [formData, setFormData] = useState({
    title: '', institution: '', duration: '', description: '', type: 'Education'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLocalTimeline((items) => {
        const oldIndex = items.findIndex((i) => i._id === active.id);
        const newIndex = items.findIndex((i) => i._id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        const updates = newArray.map((item, index) => ({ id: item._id, order: index }));
        toast.promise(reorderTimeline(updates), {
          loading: 'Reordering...',
          success: 'Order saved',
          error: 'Failed to reorder'
        }).then(() => refetch());

        return newArray;
      });
    }
  };

  const openModal = (entry = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData(entry);
    } else {
      setEditingEntry(null);
      setFormData({ title: '', institution: '', duration: '', description: '', type: 'Education' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntry) {
        await updateTimelineEntry(editingEntry._id, formData);
        toast.success('Entry updated');
      } else {
        await createTimelineEntry({ ...formData, order: localTimeline.length });
        toast.success('Entry added');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this timeline entry?')) {
      try {
        await deleteTimelineEntry(id);
        toast.success('Entry deleted');
        refetch();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Timeline & Experience</h2>
          <p className="text-sm opacity-60">Manage your education, work, and achievements.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Plus size={18} /> Add Entry
        </button>
      </div>

      <div className="max-w-3xl">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localTimeline.map(p => p._id)} strategy={verticalListSortingStrategy}>
            {localTimeline.map(entry => (
              <SortableTimelineItem 
                key={entry._id} id={entry._id} entry={entry} onEdit={openModal} onDelete={handleDelete} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass w-full max-w-xl rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingEntry ? 'Edit Entry' : 'New Entry'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 opacity-80">Title / Role</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1 opacity-80">Type</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-[#1a1a24] border border-white/10 focus:border-primary outline-none">
                    <option value="Education">Education</option>
                    <option value="Work">Work</option>
                    <option value="Achievement">Achievement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 opacity-80">Institution / Company</label>
                  <input required type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1 opacity-80">Duration (e.g. 2023 - 2027)</label>
                  <input required type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1 opacity-80">Description (Optional)</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-primary outline-none resize-none"></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:opacity-90 cursor-pointer">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineManager;
