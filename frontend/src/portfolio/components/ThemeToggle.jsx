import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full glass hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer relative w-10 h-10 flex items-center justify-center overflow-hidden border border-[var(--border)]"
      aria-label="Toggle theme"
    >
      <Moon 
        size={18} 
        className={`absolute text-secondary transition-all duration-400 ease-in-out ${theme === 'light' ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
      />
      <Sun 
        size={18} 
        className={`absolute text-primary transition-all duration-400 ease-in-out ${theme === 'dark' ? 'opacity-0 -rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
      />
    </button>
  );
};

export default ThemeToggle;
