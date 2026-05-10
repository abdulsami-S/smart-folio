import React, { useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

/* Stylized SVG avatar — warm palette, editorial illustration style */
const AvatarIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="bg-grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c9704a" stopOpacity="0.15"/>
        <stop offset="100%" stopColor="#9b3d1e" stopOpacity="0.08"/>
      </linearGradient>
      <linearGradient id="skin" x1="80" y1="40" x2="120" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#d4a574"/>
        <stop offset="100%" stopColor="#c4956a"/>
      </linearGradient>
      <linearGradient id="hair" x1="70" y1="30" x2="130" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2d1228"/>
        <stop offset="100%" stopColor="#1a0a15"/>
      </linearGradient>
      <linearGradient id="shirt" x1="60" y1="130" x2="140" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#44203e"/>
        <stop offset="100%" stopColor="#381932"/>
      </linearGradient>
      <radialGradient id="glow" cx="100" cy="100" r="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c9704a" stopOpacity="0.12"/>
        <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
      </radialGradient>
    </defs>
    {/* Background glow */}
    <circle cx="100" cy="100" r="90" fill="url(#glow)"/>
    {/* Neck */}
    <rect x="88" y="118" width="24" height="22" rx="6" fill="url(#skin)"/>
    {/* Shoulders / Shirt */}
    <path d="M55 200 C55 160, 75 145, 100 140 C125 145, 145 160, 145 200" fill="url(#shirt)"/>
    {/* Collar accent */}
    <path d="M88 140 L100 155 L112 140" fill="none" stroke="#c9704a" strokeWidth="1.5" opacity="0.6"/>
    {/* Head */}
    <ellipse cx="100" cy="90" rx="36" ry="40" fill="url(#skin)"/>
    {/* Hair */}
    <path d="M64 82 C64 55, 78 38, 100 38 C122 38, 136 55, 136 82 C136 72, 130 52, 100 50 C70 52, 64 72, 64 82Z" fill="url(#hair)"/>
    {/* Hair sides */}
    <path d="M64 82 C62 90, 63 75, 65 70" fill="url(#hair)"/>
    <path d="M136 82 C138 90, 137 75, 135 70" fill="url(#hair)"/>
    {/* Eyes */}
    <ellipse cx="86" cy="88" rx="4" ry="3.5" fill="#1a0a15"/>
    <ellipse cx="114" cy="88" rx="4" ry="3.5" fill="#1a0a15"/>
    <circle cx="87.5" cy="87" r="1.2" fill="#fff3e6" opacity="0.8"/>
    <circle cx="115.5" cy="87" r="1.2" fill="#fff3e6" opacity="0.8"/>
    {/* Eyebrows */}
    <path d="M79 81 Q86 77, 92 80" stroke="#1a0a15" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M108 80 Q114 77, 121 81" stroke="#1a0a15" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* Nose */}
    <path d="M98 92 Q100 99, 102 92" stroke="#b8895e" strokeWidth="1" fill="none" opacity="0.5"/>
    {/* Smile */}
    <path d="M90 102 Q100 110, 110 102" stroke="#9b3d1e" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    {/* Glasses (subtle wireframe) */}
    <circle cx="86" cy="88" r="10" stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.25"/>
    <circle cx="114" cy="88" r="10" stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.25"/>
    <line x1="96" y1="88" x2="104" y2="88" stroke="var(--accent)" strokeWidth="0.8" opacity="0.25"/>
  </svg>
);

const About = ({ portfolio }) => {
  const sectionRef = useRef(null);
  const bioRef = useRef(null);
  const socialRef = useRef(null);
  const badgesRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [bioRef.current, socialRef.current, badgesRef.current],
        { opacity: 0, y: 40, filter: "blur(8px)" },
        { 
          opacity: 1, y: 0, filter: "blur(0px)", 
          duration: 1, stagger: 0.15, ease: "power4.out",
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

  const bioLines = portfolio?.bio
    ? portfolio.bio.split('\n').filter(Boolean)
    : [
        'Pre-final year B.Tech CSE student at IIIT Dharwad with hands-on experience building full-stack web applications and AI-powered systems.',
        'Skilled in Python, JavaScript, React, and Flask — with a strong focus on machine learning, geospatial analysis, and creating products that solve real-world problems.'
      ];

  const coreSkills = ['Python', 'React', 'AI/ML', 'Flask', 'Node.js'];

  return (
    <section ref={sectionRef} id="about" className="py-40 relative z-10 bg-[var(--bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          
          {/* Left: Premium Profile Card */}
          <div style={{ perspective: '1000px' }}>
            <div
              className="relative w-full max-w-md mx-auto rounded-[2rem] p-[1px] transition-transform duration-300"
              style={{
                background: 'linear-gradient(145deg, var(--accent), var(--border-sub), var(--accent))',
              }}
              onMouseMove={(e) => {
                const card = e.currentTarget.children[0];
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.children[0].style.transform = 'rotateX(0deg) rotateY(0deg)';
              }}
            >
              <div
                className="w-full h-full rounded-[2rem] flex flex-col relative overflow-hidden transition-transform duration-300 ease-out"
                style={{ 
                  transformStyle: 'preserve-3d',
                  background: isDark 
                    ? 'linear-gradient(165deg, #2d1228, #381932, #44203e)' 
                    : 'linear-gradient(165deg, #f0d4b0, #eedfc8, #e0c090)'
                }}
              >
                {/* Dot grid texture */}
                <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(var(--fg)_1px,transparent_1px)] [background-size:20px_20px]" />

                {/* Avatar Section */}
                <div 
                  className="flex flex-col items-center pt-10 pb-6 relative"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  {/* Avatar circle with illustration */}
                  <div 
                    className="w-32 h-32 rounded-full overflow-hidden mb-5 relative"
                    style={{ 
                      border: '2px solid var(--accent)',
                      background: isDark 
                        ? 'linear-gradient(135deg, #44203e, #381932)' 
                        : 'linear-gradient(135deg, #eedfc8, #e5d3b8)',
                      boxShadow: '0 8px 32px rgba(201,112,74,0.2)',
                    }}
                  >
                    <AvatarIllustration />
                  </div>

                  {/* Name */}
                  <h3 
                    className="text-center mb-1"
                    style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: '1.6rem', 
                      fontWeight: 700, 
                      color: 'var(--fg)',
                    }}
                  >
                    {portfolio?.name || 'Shaik Abdul Sami'}
                  </h3>

                  {/* Title */}
                  <p className="text-[var(--fg-40)] text-xs uppercase tracking-[0.25em] mb-2">
                    Full Stack Developer
                  </p>

                  {/* Tagline */}
                  <p 
                    className="text-center px-8 mb-4"
                    style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: '0.9rem', 
                      fontStyle: 'italic',
                      color: 'var(--fg-40)',
                      lineHeight: 1.5,
                    }}
                  >
                    "Building things that matter, one line of code at a time."
                  </p>

                  {/* Skill Tags */}
                  <div className="flex flex-wrap justify-center gap-1.5 px-6">
                    {coreSkills.map((skill, i) => (
                      <span 
                        key={i}
                        className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
                        style={{ 
                          border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                          color: 'var(--accent)',
                          backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Row */}
                <div 
                  className="px-8 py-5 flex justify-between items-center"
                  style={{ 
                    borderTop: '1px solid var(--border-sub)', 
                    borderBottom: '1px solid var(--border-sub)',
                    transform: 'translateZ(20px)',
                  }}
                >
                  {[
                    { value: '10+', label: 'Projects' },
                    { value: '2+', label: 'Years' },
                    { value: '5+', label: 'Tech Stack' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <span 
                        className="block text-[var(--fg)]"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}
                      >
                        {stat.value}
                      </span>
                      <span className="text-[var(--fg-40)] text-[0.55rem] uppercase tracking-[0.15em]">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom strip */}
                <div 
                  className="px-8 py-4 flex items-center justify-between"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#22c55e' }} />
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#22c55e' }} />
                    </span>
                    <span className="text-[var(--fg-40)] text-[0.65rem] uppercase tracking-[0.15em]">
                      IIIT Dharwad, India
                    </span>
                  </div>
                  <span 
                    className="text-[0.55rem] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                    style={{ 
                      border: '1px solid var(--accent)', 
                      color: 'var(--accent)',
                      backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)',
                    }}
                  >
                    Open to Work
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio Text Reveal */}
          <div className="space-y-10">
            <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block font-semibold">
                  Discover More
                </span>
              <h2 style={{ fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                <span className="text-[var(--fg)]" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300, display: 'block' }}>About</span>
                <span className="text-[var(--accent)]" style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontWeight: 700, fontStyle: 'italic', display: 'block' }}>Me</span>
              </h2>
              <div className="w-[80px] h-px bg-[var(--accent)] mt-8" />
            </div>

            <blockquote className="pl-6 my-4" style={{ borderLeft: '2px solid var(--accent)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, fontStyle: 'italic', color: 'var(--fg)', lineHeight: 1.5 }}>
                Building things that matter, one line of code at a time.
              </p>
            </blockquote>

            <div ref={bioRef}>
              {bioLines.map((paragraph, i) => (
                <p key={i} className="mb-6" style={{ fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--fg-60)', fontWeight: 400 }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div ref={socialRef} className="flex gap-4">
              {[
                { icon: Github, href: portfolio?.github || '#' },
                { icon: Linkedin, href: portfolio?.linkedin || '#' },
                { icon: Mail, href: `mailto:${portfolio?.email || ''}` }
              ].map((item, idx) => (
                <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-colors"
                  style={{ border: '1px solid var(--border)', backgroundColor: 'var(--fg-10)' }}
                  onMouseEnter={handleSocialEnter} onMouseLeave={handleSocialLeave}
                >
                  <item.icon className="w-5 h-5 text-[var(--fg)]" />
                </a>
              ))}
            </div>

            <div ref={badgesRef} className="flex flex-wrap gap-4 pt-8 border-t" style={{ borderColor: 'var(--border-sub)' }}>
              <span className="px-6 py-3 rounded-full border text-sm uppercase tracking-widest" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--fg)' }}>B.Tech CSE</span>
              <span className="px-6 py-3 rounded-full border text-sm uppercase tracking-widest" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--fg)' }}>IIIT Dharwad</span>
              <span className="px-6 py-3 rounded-full border text-sm uppercase tracking-widest" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>Graduating 2027</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
