import React, { useContext, useState, useMemo } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { createSkill, updateSkill, deleteSkill, toggleSkillVisibility } from '../../api/skills.api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';

const SkillsManager = () => {
  const { skills, refetch } = useContext(PortfolioContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newCategory, setNewCategory] = useState('');

  const defaultCategories = ['Languages', 'Frontend', 'Backend', 'Data & ML', 'Databases', 'Tools'];
  
  const categories = useMemo(() => {
    const existingCats = Array.from(new Set(skills.map(s => s.category)));
    return Array.from(new Set([...defaultCategories, ...existingCats]));
  }, [skills]);

  const [formData, setFormData] = useState({
    name: '', category: 'Languages', proficiency: 3, visible: true
  });

  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  const openModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData(skill);
    } else {
      setEditingSkill(null);
      setFormData({ name: '', category: 'Languages', proficiency: 3, visible: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.category === 'new') {
        dataToSubmit.category = newCategory;
      }

      if (editingSkill) {
        await updateSkill(editingSkill._id, dataToSubmit);
        toast.success('Skill updated');
      } else {
        await createSkill(dataToSubmit);
        toast.success('Skill added');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await deleteSkill(id);
        toast.success('Skill deleted');
        refetch();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleSkillVisibility(id);
      refetch();
    } catch (error) {
      toast.error('Failed to toggle visibility');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Skills</h2>
          <p className="text-sm opacity-60">Manage your technical skills and proficiencies.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-secondary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Plus size={18} /> Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedSkills).map(([category, catSkills]) => (
          <div key={category} className="glass p-5 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold mb-4 text-gradient">{category}</h3>
            <div className="space-y-2">
              {catSkills.map(skill => (
                <div key={skill._id} className="flex items-center justify-between p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-medium w-32 truncate">{skill.name}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= skill.proficiency ? 'bg-secondary' : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleToggle(skill._id)} className={`p-1.5 rounded-md ${skill.visible ? 'text-primary' : 'text-gray-500'} hover:bg-white/10 cursor-pointer`}>
                      {skill.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => openModal(skill)} className="p-1.5 rounded-md text-accent hover:bg-white/10 cursor-pointer">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(skill._id)} className="p-1.5 rounded-md text-red-500 hover:bg-white/10 cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingSkill ? 'Edit Skill' : 'New Skill'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 opacity-80">Skill Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-secondary outline-none" />
              </div>

              <div>
                <label className="block text-sm mb-1 opacity-80">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-black/10 dark:bg-[#1a1a24] border border-white/10 focus:border-secondary outline-none">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="new">+ Add New Category</option>
                </select>
                {formData.category === 'new' && (
                  <input type="text" required placeholder="New Category Name" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full mt-2 px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/10 focus:border-secondary outline-none" />
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 opacity-80">Proficiency (1-5)</label>
                <input type="range" min="1" max="5" value={formData.proficiency} onChange={e => setFormData({...formData, proficiency: parseInt(e.target.value)})} className="w-full accent-secondary" />
                <div className="flex justify-between text-xs opacity-60 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="visible" checked={formData.visible} onChange={e => setFormData({...formData, visible: e.target.checked})} className="w-4 h-4 cursor-pointer accent-secondary" />
                <label htmlFor="visible" className="text-sm cursor-pointer opacity-80">Visible on portfolio</label>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-2 bg-secondary text-black font-semibold rounded-lg hover:opacity-90 cursor-pointer">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
