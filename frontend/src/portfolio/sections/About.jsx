import React, { useEffect, useRef } from 'react';

const About = ({ portfolio }) => {
  const textContainerRef = useRef(null);

  useEffect(() => {
    if (!textContainerRef.current) return;

    const lines = textContainerRef.current.querySelectorAll('.bio-line');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute('data-delay') || 0;
            el.style.transition = `clip-path 0.8s ease ${delay}s`;
            el.style.clipPath = 'inset(0 0% 0 0)';
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    lines.forEach((line) => observer.observe(line));
    return () => observer.disconnect();
  }, [portfolio?.bio]);

  const nameInitials = portfolio?.name
    ? portfolio.name
        .split(' ')
        .map((n) => n[0])
        .join('')
    : 'SAS';

  // Split bio into sentences or fall back to a default
  const bioLines = portfolio?.bio
    ? portfolio.bio.split('\n').filter(Boolean)
    : [
        'Pre-final year B.Tech CSE student at IIIT Dharwad with hands-on experience building full-stack web applications and AI-powered systems.',
        'Skilled in Python, JavaScript, React, and Flask.',
      ];

  return (
    <section id="about" className="py-32 relative z-10">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
            01 // Discover
          </span>
          <h2 className="text-5xl md:text-7xl font-black">About Me.</h2>
          <div className="w-[100px] h-[1px] bg-primary mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Rotating Border Card */}
          <div className="lg:col-span-4" style={{ perspective: '1000px' }}>
            <div
              className="relative w-full aspect-[3/4] rounded-[2rem] p-[2px] animated-border shadow-[0_0_50px_rgba(0,212,255,0.1)] group transition-transform duration-300"
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
                className="w-full h-full bg-[var(--bg-2)] backdrop-blur-xl rounded-[2rem] flex items-center justify-center relative overflow-hidden transition-transform duration-300 ease-out"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

                <div
                  className="w-32 h-32 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 shadow-[0_0_30px_rgba(0,212,255,0.2)]"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <span className="text-4xl font-black text-primary tracking-widest">
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

          {/* Right: Bio Text Reveal — THIS IS THE FIX */}
          <div className="lg:col-span-8 space-y-10">
            <div ref={textContainerRef}>
              {bioLines.map((paragraph, i) => (
                <div key={i} className="mb-6 overflow-hidden">
                  <p
                    className="bio-line"
                    data-delay={i * 0.15}
                    style={{
                      clipPath: 'inset(0 100% 0 0)',
                      fontSize: '1.3rem',
                      lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-[var(--border)]">
              <span className="px-6 py-3 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-sm uppercase tracking-widest text-[var(--text-muted)]">
                B.Tech CSE
              </span>
              <span className="px-6 py-3 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-sm uppercase tracking-widest text-[var(--text-muted)]">
                IIIT Dharwad
              </span>
              <span className="px-6 py-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm uppercase tracking-widest">
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
