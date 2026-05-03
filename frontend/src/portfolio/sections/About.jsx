import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = ({ portfolio }) => {
  const sectionRef = useRef(null);
  const bioRef = useRef(null);
  const socialRef = useRef(null);
  const badgesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Blur -> Clear entrance for the right column elements
      gsap.fromTo(
        [bioRef.current, socialRef.current, badgesRef.current],
        { opacity: 0, y: 40, filter: "blur(8px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)", 
          duration: 1, 
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSocialEnter = (e) => {
    gsap.to(e.currentTarget, { scale: 1.1, borderColor: '#00d4ff', duration: 0.3, ease: 'power2.out' });
  };
  const handleSocialLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, borderColor: 'rgba(255,255,255,0.1)', duration: 0.3, ease: 'power2.out' });
  };

  const nameInitials = portfolio?.name
    ? portfolio.name.split(' ').map((n) => n[0]).join('')
    : 'SAS';

  const bioLines = portfolio?.bio
    ? portfolio.bio.split('\n').filter(Boolean)
    : [
        'Pre-final year B.Tech CSE student at IIIT Dharwad with hands-on experience building full-stack web applications and AI-powered systems.',
        'Skilled in Python, JavaScript, React, and Flask.'
      ];

  return (
    <section ref={sectionRef} id="about" className="py-32 relative z-10 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          
          {/* Left: Rotating Border Card */}
          <div style={{ perspective: '1000px' }}>
            <div
              className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-[2rem] p-[2px] transition-transform duration-300"
              style={{
                background: 'conic-gradient(from 0deg, var(--accent-cyan), var(--accent-purple), var(--accent-green), var(--accent-cyan))',
              }}
              onMouseMove={(e) => {
                const card = e.currentTarget.children[0];
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget.children[0];
                card.style.transform = 'rotateX(0deg) rotateY(0deg)';
              }}
            >
              <div
                className="w-full h-full bg-[#080a18] backdrop-blur-xl rounded-[2rem] flex items-center justify-center relative overflow-hidden transition-transform duration-300 ease-out"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

                <div
                  className="w-32 h-32 rounded-full border border-[var(--accent-cyan)] flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.2)]"
                  style={{ transform: 'translateZ(50px)', background: 'rgba(0,212,255,0.05)' }}
                >
                  <span className="text-4xl font-black text-[var(--accent-cyan)] tracking-widest">
                    {nameInitials}
                  </span>
                </div>

                <div
                  className="absolute bottom-8 w-full text-center"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <p className="text-white/50 text-xs uppercase tracking-[0.3em]">
                    Developer / Engineer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio Text Reveal */}
          <div className="space-y-10">
            {/* Heading */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-cyan)] mb-4 block">
                01 // Discover
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-white">About Me.</h2>
              <div className="w-[100px] h-[1px] bg-[var(--accent-cyan)] mt-6" />
            </div>

            <div ref={bioRef}>
              {bioLines.map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-6"
                  style={{
                    fontSize: '1.2rem',
                    lineHeight: 1.85,
                    color: 'rgba(255,255,255,0.75)'
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Social Icons */}
            <div ref={socialRef} className="flex gap-4">
              {[
                { icon: Github, href: portfolio?.github || '#' },
                { icon: Linkedin, href: portfolio?.linkedin || '#' },
                { icon: Mail, href: `mailto:${portfolio?.email || ''}` }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={handleSocialEnter}
                  onMouseLeave={handleSocialLeave}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>

            {/* Badges */}
            <div ref={badgesRef} className="flex flex-wrap gap-4 pt-8 border-t border-[rgba(255,255,255,0.06)]">
              <span className="px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] bg-[var(--bg-card)] text-sm uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
                B.Tech CSE
              </span>
              <span className="px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] bg-[var(--bg-card)] text-sm uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
                IIIT Dharwad
              </span>
              <span className="px-6 py-3 rounded-full border border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.1)] text-[var(--accent-cyan)] text-sm uppercase tracking-widest">
                Graduating 2027
              </span>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
