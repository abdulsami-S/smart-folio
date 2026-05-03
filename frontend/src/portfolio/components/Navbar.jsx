import React, { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar = ({ portfolio }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef(null);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
  ];

  useEffect(() => {
    if (!navRef.current) return;
    
    gsap.fromTo(navRef.current, {
      y: -80, opacity: 0
    }, {
      y: 0, opacity: 1,
      duration: 1, delay: 2.5,
      ease: "power4.out"
    });
  }, []);

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
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-4 bg-[#04050f]/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.05)] shadow-lg' 
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} className="text-xl md:text-2xl font-black text-white tracking-tight cursor-pointer relative z-50 group">
            Shaik Abdul Sami<span className="text-[var(--accent-cyan)] transition-colors duration-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">.</span>
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
                      activeSection === link.href.substring(1) ? 'text-white' : 'text-[rgba(255,255,255,0.5)] hover:text-white'
                    }`}
                  >
                    {link.name}
                    {activeSection === link.href.substring(1) && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-cyan)] shadow-[0_0_8px_rgba(0,212,255,0.8)]"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center gap-6 border-l border-[rgba(255,255,255,0.1)] pl-6">
              <ThemeToggle />
              <a 
                href="#contact"
                onClick={(e) => scrollTo(e, '#contact')}
                className="text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-[var(--accent-cyan)]/50 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all cursor-pointer"
              >
                Hire Me
              </a>
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white cursor-pointer transition-transform">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-[#04050f]/95 backdrop-blur-lg flex flex-col justify-center items-center md:hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col items-center gap-8">
          {[...navLinks, { name: 'Contact', href: '#contact' }].map((link, i) => (
            <li 
              key={link.name}
              style={{
                transitionDelay: mobileMenuOpen ? `${i * 0.1}s` : '0s',
                transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: mobileMenuOpen ? 1 : 0,
                transition: 'all 0.5s ease-out'
              }}
            >
              <a 
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`text-2xl font-black uppercase tracking-widest cursor-pointer ${
                  activeSection === link.href.substring(1) ? 'text-[var(--accent-cyan)] drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'text-[rgba(255,255,255,0.6)]'
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
