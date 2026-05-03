import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { updatePortfolio } from '../../api/portfolio.api';
import toast from 'react-hot-toast';
import { Save, Loader2, Github, Linkedin, Twitter, Mail } from 'lucide-react';

const SocialEditor = () => {
  const { portfolio, refetch } = useContext(PortfolioContext);
  const [socials, setSocials] = useState({
    github: '', linkedin: '', twitter: '', email: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (portfolio?.socials) {
      setSocials({
        github: portfolio.socials.github || '',
        linkedin: portfolio.socials.linkedin || '',
        twitter: portfolio.socials.twitter || '',
        email: portfolio.socials.email || ''
      });
    }
  }, [portfolio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updatePortfolio({ ...portfolio, socials });
      toast.success('Social links updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update social links');
    } finally {
      setIsSaving(false);
    }
  };

  const platforms = [
    { id: 'github', label: 'GitHub Profile', icon: Github, color: 'text-gray-300' },
    { id: 'linkedin', label: 'LinkedIn Profile', icon: Linkedin, color: 'text-blue-500' },
    { id: 'twitter', label: 'Twitter / X Profile', icon: Twitter, color: 'text-sky-400' },
    { id: 'email', label: 'Email Address', icon: Mail, color: 'text-red-400' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Social Links</h2>
        <p className="text-sm opacity-60">Manage your social media presence.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
        
        {platforms.map(platform => (
          <div key={platform.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-black/10 dark:bg-white/5 rounded-xl border border-white/5">
            <div className={`flex items-center gap-3 md:w-1/3 ${platform.color}`}>
              <platform.icon size={24} />
              <span className="font-medium text-[var(--text)]">{platform.label}</span>
            </div>
            <div className="flex-1">
              <input 
                type={platform.id === 'email' ? 'email' : 'url'}
                value={socials[platform.id]} 
                onChange={e => setSocials({...socials, [platform.id]: e.target.value})} 
                placeholder={platform.id === 'email' ? 'email@example.com' : 'https://...'}
                className="w-full px-4 py-2 rounded-lg bg-black/20 dark:bg-black/40 border border-transparent focus:border-white/20 outline-none transition-colors"
              />
            </div>
          </div>
        ))}

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Links
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialEditor;
