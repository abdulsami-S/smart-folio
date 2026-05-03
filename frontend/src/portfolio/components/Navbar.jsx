import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';

const Navbar = ({ portfolio }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const lenis = useLenis();

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['hero', ...navLinks.map(l => l.href.substring(1)), 'contact'];
      let current = 'hero';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 300) {
          current = section;
        }
      }
      if (window.scrollY < 100) current = 'hero';
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(href, { offset: -80, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 4.5 }} // Slide down last in sequence
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-4 bg-black/70 backdrop-blur-[24px] border-b border-white/5 shadow-lg' 
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} className="text-2xl font-bold text-white tracking-tight cursor-pointer relative z-50 group">
            Shaik Abdul Sami<span className="text-primary group-hover:text-secondary transition-colors duration-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name} className="relative">
                  <a 
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer block py-2 ${
                      activeSection === link.href.substring(1) ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {activeSection === link.href.substring(1) && (
                      <motion.div 
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center gap-6 border-l border-white/10 pl-6">
              <ThemeToggle />
              <a 
                href="#contact"
                onClick={(e) => scrollTo(e, '#contact')}
                className="text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-primary/50 text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all cursor-pointer"
              >
                Hire Me
              </a>
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white cursor-pointer">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-40 bg-black/90 flex flex-col justify-center items-center md:hidden"
          >
            <ul className="flex flex-col items-center gap-8">
              {[...navLinks, { name: 'Contact', href: '#contact' }].map((link, i) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <a 
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className={`text-2xl font-black uppercase tracking-widest cursor-pointer ${
                      activeSection === link.href.substring(1) ? 'text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'text-white/60'
                    }`}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
