import React, { useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const About = ({ portfolio }) => {
  const sectionRef = useRef(null);
  const bioRef = useRef(null);
  const socialRef = useRef(null);
  const badgesRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

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
    gsap.to(e.currentTarget, { scale: 1.1, borderColor: '#c9704a', backgroundColor: 'transparent', duration: 0.3, ease: 'power2.out' });
    gsap.to(e.currentTarget.children[0], { color: '#c9704a', duration: 0.3 });
  };
  const handleSocialLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, borderColor: 'var(--border)', backgroundColor: 'var(--fg-10)', duration: 0.3, ease: 'power2.out' });
    gsap.to(e.currentTarget.children[0], { color: 'var(--fg)', duration: 0.3 });
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
    <section ref={sectionRef} id="about" className="py-32 relative z-10 bg-[var(--bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          
          {/* Left: Rotating Border Card */}
          <div style={{ perspective: '1000px' }}>
            <div
              className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-[2rem] p-[2px] transition-transform duration-300"
              style={{
                background: 'var(--border)',
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
                className="w-full h-full backdrop-blur-xl rounded-[2rem] flex items-center justify-center relative overflow-hidden transition-transform duration-300 ease-out"
                style={{ 
                  transformStyle: 'preserve-3d',
                  background: isDark ? 'linear-gradient(145deg, #2d1228, #44203e)' : 'linear-gradient(145deg, #f0d4b0, #e0c090)'
                }}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--fg)_1px,transparent_1px)] [background-size:20px_20px]" />

                <div
                  className="w-32 h-32 rounded-full border flex items-center justify-center"
                  style={{ transform: 'translateZ(50px)', borderColor: 'var(--border)', background: 'var(--bg-card)' }}
                >
                  <span className="text-4xl font-black text-[var(--accent)] tracking-widest">
                    {nameInitials}
                  </span>
                </div>

                <div
                  className="absolute bottom-8 w-full text-center"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <p className="text-[var(--fg-60)] text-xs uppercase tracking-[0.3em]">
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
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
                01 // Discover
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-[var(--fg)]">About Me.</h2>
              <div className="w-[100px] h-[1px] bg-[var(--accent)] mt-6" />
            </div>

            <div ref={bioRef}>
              {bioLines.map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-6 font-medium"
                  style={{
                    fontSize: '1.2rem',
                    lineHeight: 1.85,
                    color: 'var(--fg-60)'
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
                  style={{ border: '1px solid var(--border)', backgroundColor: 'var(--fg-10)' }}
                  onMouseEnter={handleSocialEnter}
                  onMouseLeave={handleSocialLeave}
                >
                  <item.icon className="w-5 h-5 text-[var(--fg)]" />
                </a>
              ))}
            </div>

            {/* Badges */}
            <div ref={badgesRef} className="flex flex-wrap gap-4 pt-8 border-t" style={{ borderColor: 'var(--border-sub)' }}>
              <span className="px-6 py-3 rounded-full border text-sm uppercase tracking-widest" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--fg)' }}>
                B.Tech CSE
              </span>
              <span className="px-6 py-3 rounded-full border text-sm uppercase tracking-widest" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--fg)' }}>
                IIIT Dharwad
              </span>
              <span className="px-6 py-3 rounded-full border text-sm uppercase tracking-widest" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
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
