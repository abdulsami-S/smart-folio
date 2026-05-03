import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { updatePortfolio } from '../../api/portfolio.api';
import toast from 'react-hot-toast';
import { Save, Plus, X, Loader2 } from 'lucide-react';

const HeroEditor = () => {
  const { portfolio, refetch } = useContext(PortfolioContext);
  const [heroTitles, setHeroTitles] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (portfolio) {
      setHeroTitles(portfolio.heroTitles || []);
      setResumeUrl(portfolio.resumeUrl || '');
    }
  }, [portfolio]);

  const handleAddTitle = (e) => {
    e.preventDefault();
    if (newTitle.trim() && !heroTitles.includes(newTitle.trim())) {
      setHeroTitles([...heroTitles, newTitle.trim()]);
      setNewTitle('');
    }
  };

  const removeTitle = (index) => {
    setHeroTitles(heroTitles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updatePortfolio({ ...portfolio, heroTitles, resumeUrl });
      toast.success('Hero section updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update hero section');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hero Section</h2>
        <p className="text-sm opacity-60">Edit the typing animation titles and resume link.</p>
      </div>

      <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 space-y-8">
        <div>
          <label className="block text-sm font-medium mb-3 opacity-80">Typing Animation Titles</label>
          <div className="space-y-3 mb-4">
            {heroTitles.map((title, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 bg-black/10 dark:bg-white/5 rounded-lg border border-white/5">
                <span>{title}</span>
                <button onClick={() => removeTitle(i)} className="text-red-500 hover:bg-white/10 p-1 rounded cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddTitle} className="flex gap-2">
            <input 
              type="text" 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)} 
              placeholder="e.g. AI Builder" 
              className="flex-1 px-4 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary outline-none transition-colors"
            />
            <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
              <Plus size={18} /> Add
            </button>
          </form>
        </div>

        <hr className="border-white/10" />

        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Resume PDF Link (Google Drive, Dropbox, etc.)</label>
          <input 
            type="url" 
            value={resumeUrl} 
            onChange={e => setResumeUrl(e.target.value)} 
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary outline-none transition-colors" 
          />
        </div>

        <div className="pt-4 flex justify-between items-center">
          <p className="text-xs text-secondary bg-secondary/10 px-3 py-1 rounded-full">Changes reflect immediately on portfolio</p>
          <button onClick={handleSubmit} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
