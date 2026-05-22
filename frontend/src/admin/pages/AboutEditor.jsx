import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { updatePortfolio, uploadImage } from '../../api/portfolio.api';
import toast from 'react-hot-toast';
import { Save, Loader2, Upload } from 'lucide-react';

const AboutEditor = () => {
  const { portfolio, refetch } = useContext(PortfolioContext);
  const [formData, setFormData] = useState({
    name: '', tagline: '', bio: '', email: '', phone: '', aboutImage: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setIsUploading(true);

    try {
      const result = await uploadImage(data);
      setFormData(prev => ({ ...prev, aboutImage: result.url }));
      toast.success("Image uploaded! Don't forget to save.");
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (portfolio) {
      setFormData({
        name: portfolio.name || '',
        tagline: portfolio.tagline || '',
        bio: portfolio.bio || '',
        email: portfolio.email || '',
        phone: portfolio.phone || '',
        aboutImage: portfolio.aboutImage || ''
      });
    }
  }, [portfolio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updatePortfolio(formData);
      toast.success('Profile updated successfully');
      refetch();
    } catch (error) {
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map(err => `${err.field}: ${err.message}`).join(', ') 
        : (error.response?.data?.message || 'Failed to update profile');
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">About / Bio</h2>
        <p className="text-sm opacity-60">Update your personal information and bio.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Tagline / Title</label>
            <input required type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Profile Image</label>
          <div className="flex gap-4 items-center">
            <input type="text" placeholder="e.g. https://imgur.com/your-image.png" value={formData.aboutImage} onChange={e => setFormData({...formData, aboutImage: e.target.value})} className="flex-1 px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default" />
              <button type="button" disabled={isUploading} className="px-6 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-accent transition-colors flex items-center gap-2 font-medium">
                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                Upload
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Biography</label>
          <textarea required rows={6} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors resize-y"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Email Contact</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Phone Number</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutEditor;
