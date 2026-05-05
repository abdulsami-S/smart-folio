import React, { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import {
  Menu, X,
  Home, User, Code2, LayoutGrid,
  Briefcase, Mail
} from 'lucide-react';
import { gsap } from 'gsap';

const navItems = [
  { name: 'Home',       icon: Home,        href: '#hero' },
  { name: 'About',      icon: User,        href: '#about' },
  { name: 'Skills',     icon: Code2,       href: '#skills' },
  { name: 'Projects',   icon: LayoutGrid,  href: '#projects' },
  { name: 'Experience', icon: Briefcase,   href: '#experience' },
  { name: 'Contact',    icon: Mail,        href: '#contact' },
];

const Navbar = ({ portfolio }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef(null);

  // GSAP entrance
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

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const sectionIds = navItems.map(item => item.href.substring(1));
    const observers = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-40% 0px -55% 0px',
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
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
            ? 'py-4 border-b shadow-lg'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
        style={scrolled ? {
          backgroundColor: 'color-mix(in srgb, var(--bg) 85%, transparent)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--border-sub)'
        } : {}}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollTo(e, '#hero')}
            className="flex flex-col leading-none cursor-pointer relative z-50 group"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span
              className="text-[var(--fg-40)] group-hover:text-[var(--accent)] transition-colors duration-300"
              style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 600 }}
            >
              Welcome to
            </span>
            <span className="text-xl md:text-2xl font-bold text-[var(--fg)] tracking-tight">
              Sami's Portfolio<span className="text-[var(--accent)] transition-colors duration-300">.</span>
            </span>
          </a>

          {/* Desktop Icon Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const sectionId = item.href.substring(1);
                const isActive = activeSection === sectionId;

                return (
                  <React.Fragment key={item.name}>
                    {/* Separator before Contact */}
                    {item.name === 'Contact' && <div className="nav-sep" />}

                    <a
                      href={item.href}
                      onClick={(e) => scrollTo(e, item.href)}
                      className={`nav-icon-item ${isActive ? 'active' : ''}`}
                      aria-label={item.name}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                      <span className="nav-tooltip">{item.name}</span>
                    </a>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex items-center gap-6 border-l border-[var(--border)] pl-6">
              <ThemeToggle />
              <a
                href="#contact"
                onClick={(e) => scrollTo(e, '#contact')}
                className="text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border text-[var(--fg)] hover:bg-[var(--accent)] hover:text-[#fff3e6] hover:border-[var(--accent)] transition-all cursor-pointer"
                style={{ borderColor: 'var(--border)', fontFamily: 'var(--font-body)' }}
              >
                Hire Me
              </a>
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[var(--fg)] cursor-pointer transition-transform">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center items-center md:hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg) 95%, transparent)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <ul className="flex flex-col items-center gap-8">
          {navItems.map((link, i) => (
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
                  activeSection === link.href.substring(1) ? 'text-[var(--accent)]' : 'text-[var(--fg-60)]'
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
