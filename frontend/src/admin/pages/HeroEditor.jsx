import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { updatePortfolio, uploadFile } from '../../api/portfolio.api';
import toast from 'react-hot-toast';
import { Save, Plus, X, Loader2, Upload, FileText, ExternalLink, Trash2 } from 'lucide-react';

const HeroEditor = () => {
  const { portfolio, refetch } = useContext(PortfolioContext);
  const [heroTitles, setHeroTitles] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15MB limit');
      e.target.value = '';
      return;
    }

    const data = new FormData();
    data.append('file', file);
    setIsUploading(true);

    try {
      const result = await uploadFile(data);
      setResumeUrl(result.url);
      toast.success("Resume uploaded! Don't forget to save changes.");
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload resume file';
      toast.error(msg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveResume = () => {
    setResumeUrl('');
    toast.success('Resume removed. Click Save Changes to apply.');
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return '';
    try {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      const match = lastPart.match(/^\d+-\d+-(.+)$/);
      return match ? decodeURIComponent(match[1]) : decodeURIComponent(lastPart);
    } catch {
      return url;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updatePortfolio({ ...portfolio, heroTitles, resumeUrl });
      toast.success('Hero section updated successfully');
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
        <p className="text-sm opacity-60">Edit the typing animation titles and upload your resume.</p>
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

        {/* Resume Upload Section */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Resume Document (PDF, DOC, DOCX)</label>
            <p className="text-xs opacity-60">Upload your resume directly from your computer or provide a file URL.</p>
          </div>

          <div className="flex gap-3 items-center">
            <input 
              type="text" 
              value={resumeUrl} 
              onChange={e => setResumeUrl(e.target.value)} 
              placeholder="Select file or enter link..."
              className="flex-1 px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary outline-none transition-colors text-sm" 
            />
            <div className="relative shrink-0">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                onChange={handleResumeUpload} 
                disabled={isUploading} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default" 
              />
              <button 
                type="button" 
                disabled={isUploading} 
                className="px-6 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-primary transition-colors flex items-center gap-2 font-medium cursor-pointer"
              >
                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                Upload
              </button>
            </div>
          </div>

          {/* Current Resume Preview Card */}
          {resumeUrl && (
            <div className="mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate max-w-xs md:max-w-md">
                    {getFileNameFromUrl(resumeUrl)}
                  </p>
                  <p className="text-xs opacity-50 truncate max-w-xs md:max-w-md">
                    {resumeUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href={resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <ExternalLink size={14} /> View File
                </a>
                <button 
                  type="button"
                  onClick={handleRemoveResume}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-between items-center">
          <p className="text-xs text-secondary bg-secondary/10 px-3 py-1 rounded-full">Changes reflect immediately on portfolio</p>
          <button onClick={handleSubmit} disabled={isSaving || isUploading} className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
