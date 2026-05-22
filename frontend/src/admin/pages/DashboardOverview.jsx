import React, { useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { FolderKanban, Wrench, Clock, ExternalLink } from 'lucide-react';

const Overview = () => {
  const { projects, skills, timeline, portfolio } = useContext(PortfolioContext);

  const stats = [
    { label: 'Active Projects', value: projects ? projects.filter(p => p.visible !== false).length : 0, icon: FolderKanban, color: 'text-primary' },
    { label: 'Active Skills', value: skills ? skills.filter(s => s.visible !== false).length : 0, icon: Wrench, color: 'text-secondary' },
    { label: 'Timeline Entries', value: timeline?.length || 0, icon: Clock, color: 'text-accent' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome back, {portfolio?.name?.split(' ')[0] || 'Admin'}</h2>
          <p className="text-sm opacity-60">Here's what's happening with your portfolio today.</p>
        </div>
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ExternalLink size={16} />
          Preview Portfolio
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex items-center justify-between border border-black/10 dark:border-white/5">
            <div>
              <p className="text-sm opacity-60 mb-1">{stat.label}</p>
              <h3 className="text-4xl font-bold">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-full bg-black/5 dark:bg-white/5 ${stat.color}`}>
              <stat.icon size={32} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-black/10 dark:border-white/5">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/projects" className="px-6 py-3 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
            + Add New Project
          </Link>
          <Link to="/admin/skills" className="px-6 py-3 rounded-lg bg-secondary/10 text-secondary font-medium hover:bg-secondary/20 transition-colors">
            + Add New Skill
          </Link>
          <Link to="/admin/about" className="px-6 py-3 rounded-lg bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors">
            Edit Bio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
