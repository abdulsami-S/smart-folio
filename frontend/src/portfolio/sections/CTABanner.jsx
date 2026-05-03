import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CTABanner = () => {
  const bannerRef = useRef(null);

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
    <section className="container mx-auto px-6 lg:px-12 w-full mb-20 relative z-10">
      <div 
        ref={bannerRef}
        className="relative w-full rounded-[24px] overflow-hidden"
        style={{
          padding: '80px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)'
        }}
      >
        {/* Light Ray pseudo-element equivalent */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 75% 50%, rgba(139,92,246,0.35), transparent 65%)'
          }}
        />

        <div className="relative z-10 flex flex-col items-start">
          <span className="text-[var(--accent-cyan)] uppercase tracking-widest text-sm font-bold mb-6">
            READY TO BUILD?
          </span>
          
          <h2 className="text-white mb-2" style={{ fontSize: '2.5rem', fontWeight: 400, lineHeight: 1.2 }}>
            We turn bold ideas into
          </h2>
          <h2 className="text-white mb-8" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2 }}>
            powerful digital realities.
          </h2>

          <a 
            href="#contact"
            className="flex items-center gap-2 transition-colors duration-300 group"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
              padding: '16px 36px',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)',
              marginTop: '32px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
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
