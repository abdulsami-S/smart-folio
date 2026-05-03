import React, { useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, Wrench, FileText, Clock, Home as HomeIcon, Share2, LogOut } from 'lucide-react';
import ThemeToggle from '../portfolio/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);

  const navLinks = [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/projects", label: "Projects", icon: FolderKanban },
    { to: "/admin/skills", label: "Skills", icon: Wrench },
    { to: "/admin/about", label: "About", icon: FileText },
    { to: "/admin/timeline", label: "Timeline", icon: Clock },
    { to: "/admin/hero", label: "Hero", icon: HomeIcon },
    { to: "/admin/social", label: "Social", icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-black/10 dark:border-white/10 glass p-6 z-20">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-bold text-xl text-gradient truncate">Sami's Portfolio</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin/dashboard'}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                }`
              }
            >
              <link.icon size={20} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
          <ThemeToggle />
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors w-full cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0 relative z-10">
        <header className="md:hidden flex items-center justify-between p-4 glass sticky top-0 z-20 border-b border-black/10 dark:border-white/10">
          <h1 className="font-bold text-lg text-gradient">Sami's Admin</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={logout} className="text-red-500 cursor-pointer"><LogOut size={20} /></button>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 w-full glass border-t border-black/10 dark:border-white/10 z-30 flex justify-around p-2 pb-safe">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin/dashboard'}
            className={({ isActive }) => 
              `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-primary' : 'opacity-60'}`
            }
          >
            <link.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;
