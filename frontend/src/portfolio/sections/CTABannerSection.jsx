import React, { useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const CTABanner = () => {
  const bannerRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!bannerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(bannerRef.current, {
        opacity: 0, 
        y: 60, 
        filter: "blur(8px)"
      }, {
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        duration: 1, 
        ease: "power4.out",
        scrollTrigger: { 
          trigger: bannerRef.current, 
          start: "top 80%" 
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="container mx-auto px-6 lg:px-12 w-full mb-20 relative z-10 py-8">
      <div 
        ref={bannerRef}
        className="relative w-full rounded-[24px] overflow-hidden"
        style={{
          padding: '80px',
          background: 'rgba(45,18,40,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-sub)'
        }}
      >
        {/* Light Ray pseudo-element equivalent */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 75% 50%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 65%)'
          }}
        />

        <div className="relative z-10 flex flex-col items-start">
          <span className="text-[var(--accent)] uppercase tracking-widest text-sm font-bold mb-6">
            READY TO BUILD?
          </span>
          
          <h2 className="text-[var(--fg)] mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.2 }}>
            We turn bold ideas into
          </h2>
          <h2 className="text-[var(--fg)] mb-8" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.2 }}>
            powerful digital <span className="text-[var(--accent)]">realities.</span>
          </h2>

          <a 
            href="#contact"
            className="flex items-center gap-2 transition-colors duration-300 group"
            style={{
              background: 'var(--fg-06)',
              border: '1px solid var(--border)',
              color: 'var(--fg)',
              padding: '16px 36px',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)',
              marginTop: '32px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.color = '#fff3e6';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--fg-06)';
              e.currentTarget.style.color = 'var(--fg)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <span className="font-semibold text-lg">Let's work together</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
