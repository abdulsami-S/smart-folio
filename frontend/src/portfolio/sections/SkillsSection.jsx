import React, { useEffect, useRef, useState, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeContext } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

/* ─── Devicon slug map — skill name → devicon class string ─────────────────── */
const DEVICON_MAP = {
  "Flask":             "devicon-flask-original colored",
  "Node.js":           "devicon-nodejs-plain colored",
  "REST APIs":         "devicon-fastapi-plain colored",
  "Scikit-learn":      "devicon-scikitlearn-plain colored",
  "GeoPandas":         "devicon-pandas-plain colored",
  "NumPy":             "devicon-numpy-plain colored",
  "Pandas":            "devicon-pandas-plain colored",
  "Rasterio":          "devicon-python-plain colored",
  "MySQL":             "devicon-mysql-original colored",
  "SQLite":            "devicon-sqlite-plain colored",
  "Firebase":          "devicon-firebase-plain colored",
  "React.js":          "devicon-react-original colored",
  "Leaflet.js":        "devicon-leaflet-plain colored",
  "Vanilla JS":        "devicon-javascript-plain colored",
  "Responsive Design": "devicon-css3-plain colored",
  "Python":            "devicon-python-plain colored",
  "JavaScript":        "devicon-javascript-plain colored",
  "C++":               "devicon-cplusplus-plain colored",
  "SQL":               "devicon-mysql-original colored",
  "HTML5":             "devicon-html5-plain colored",
  "CSS3":              "devicon-css3-plain colored",
  "Git":               "devicon-git-plain colored",
  "GitHub":            "devicon-github-original colored",
  "VS Code":           "devicon-vscode-plain colored",
  "Postman":           "devicon-postman-plain colored",
  "Linux":             "devicon-linux-plain colored",
};

const skillData = [
  {
    category: "Backend",
    description: "Robust server-side systems and REST APIs built for scale and performance.",
    services: ["Flask", "Node.js", "REST APIs"],
  },
  {
    category: "Data & ML",
    description: "Machine learning pipelines and geospatial analysis for real-world AI applications.",
    services: ["Scikit-learn", "GeoPandas", "NumPy", "Pandas", "Rasterio"],
  },
  {
    category: "Databases",
    description: "Data storage and management across relational and real-time systems.",
    services: ["MySQL", "SQLite", "Firebase"],
  },
  {
    category: "Frontend",
    description: "Modern responsive interfaces built with React and vanilla JavaScript.",
    services: ["React.js", "Leaflet.js", "Vanilla JS", "Responsive Design"],
  },
  {
    category: "Languages",
    description: "Core programming languages for web apps, ML models and systems.",
    services: ["Python", "JavaScript", "C++", "SQL", "HTML5", "CSS3"],
  },
  {
    category: "Tools",
    description: "Professional development workflow, version control and deployment.",
    services: ["Git", "GitHub", "VS Code", "Postman", "Linux"],
  }
];

const Skills = () => {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile]       = useState(false);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  /* ── Responsive check ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ── Horizontal pin-scroll (desktop only) ─────────────────────────────────── */
  useEffect(() => {
    if (isMobile) {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === sectionRef.current) t.kill();
      });
      return;
    }

    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const totalScroll = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + totalScroll,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(Math.round(self.progress * 5), 5);
            setActiveIndex(idx);
          }
        }
      });

      gsap.fromTo(section.querySelector('.fixed-header'), {
        opacity: 0, y: 60, filter: "blur(8px)"
      }, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });
    }, sectionRef);

    return () => { ctx.revert(); };
  }, [isMobile]);

  /* ── Staggered bottom-to-top pill entrance when active card changes ────────── */
  useEffect(() => {
    const activeCard = document.querySelector('.skills-card-active');
    if (!activeCard) return;
    const pills = activeCard.querySelectorAll('.skill-pill');
    gsap.fromTo(
      pills,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.15 }
    );
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`relative bg-[var(--bg)] ${isMobile ? 'py-20 px-4' : 'h-screen overflow-hidden'}`}
    >
      {/* HEADER */}
      <div className={`fixed-header ${isMobile ? 'mb-12' : 'absolute top-12 left-20 z-20 pointer-events-none'}`}>
        <p className="text-[var(--accent)] text-[0.8rem] tracking-[0.2em] font-bold uppercase mb-2">
          TECH STACK
        </p>
        <h2 className="text-[var(--fg)]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', lineHeight: 1, letterSpacing: '-0.02em' }}>
          <span style={{ fontWeight: 300 }}>Core </span>
          <span style={{ fontWeight: 700, fontStyle: 'italic', color: 'var(--accent)' }}>Arsenal.</span>
        </h2>
      </div>

      {/* TRACK */}
      <div
        ref={trackRef}
        className={`${isMobile ? 'flex flex-col gap-6 w-full' : 'flex flex-row items-center gap-[24px] h-full will-change-transform'}`}
        style={{ padding: isMobile ? '0' : '0 calc(50vw - 210px)' }}
      >
        {skillData.map((skill, i) => {
          const isActive = isMobile ? true : activeIndex === i;

          return (
            <div
              key={i}
              className={`
                shrink-0 rounded-[20px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                flex flex-col relative overflow-hidden
                ${isMobile ? 'w-full' : 'w-[420px] h-auto'}
                ${isActive
                  ? (isDark
                    ? 'bg-gradient-to-br from-[#4f2548] via-[#44203e] to-[#2d1228] shadow-[0_40px_100px_rgba(201,112,74,0.15)] skills-card-active'
                    : 'bg-gradient-to-br from-[#eedfc8] via-[#e5d3b8] to-[#dcb79a] shadow-[0_40px_100px_rgba(201,112,74,0.15)] skills-card-active')
                  : 'bg-[var(--bg-card)]'}
              `}
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isActive ? 'var(--accent)' : 'var(--border-sub)',
                transform: isActive && !isMobile ? 'scale(1.04) translateY(-8px)' : 'none',
                /* Compact height on inactive — just enough for number + title */
                minHeight: isActive ? '380px' : 'auto',
              }}
            >
              <div className="flex flex-col justify-between h-full p-8">

                {/* ── Number + Category title only ─────────────────────────── */}
                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span
                      className="leading-none select-none"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '3rem',
                        fontWeight: 700,
                        fontStyle: 'italic',
                        color: isActive ? 'var(--fg-20)' : 'var(--fg-06)',
                        transition: 'color 0.5s ease',
                      }}
                    >
                      0{i + 1}
                    </span>
                    <h3
                      className="text-[var(--fg)] transition-all duration-500"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        fontStyle: 'italic',
                        lineHeight: 1.1,
                      }}
                    >
                      {skill.category}
                    </h3>
                  </div>
                </div>

                {/* ── Expandable details — hidden on inactive cards ─────────── */}
                <div
                  className={`transition-all duration-500 overflow-hidden ${isActive ? 'opacity-100 max-h-[400px]' : 'opacity-0 max-h-0 pointer-events-none'}`}
                >
                  {/* Accent line */}
                  <div
                    className="h-[2px] mb-5 transition-all duration-500"
                    style={{
                      width: isActive ? '60px' : '30px',
                      backgroundColor: isActive ? 'var(--accent)' : 'var(--border-sub)',
                    }}
                  />
                  {/* Description */}
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--fg-60)', fontWeight: 400 }}>
                    {skill.description}
                  </p>
                </div>

                {/* ── Tech Stack pills — hidden on inactive cards ───────────── */}
                <div
                  className={`transition-all duration-500 overflow-hidden ${isActive ? 'opacity-100 max-h-[400px]' : 'opacity-0 max-h-0 pointer-events-none'}`}
                >
                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-sub)' }} />
                    <span
                      className="text-[0.55rem] font-bold uppercase tracking-[0.25em]"
                      style={{ color: isActive ? 'var(--accent)' : 'var(--fg-40)' }}
                    >
                      Stack
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-sub)' }} />
                  </div>

                  {/* Icon-only pills with hover tooltip */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {skill.services.map((s, idx) => (
                      <div
                        key={idx}
                        className="skill-pill"
                        style={{
                          position: 'relative',
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          cursor: 'default',
                          transition: 'all 0.2s ease',
                          backdropFilter: 'blur(8px)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--accent)';
                          e.currentTarget.style.backgroundColor = 'rgba(201,112,74,0.15)';
                          e.currentTarget.querySelector('.pill-tooltip').style.opacity = '1';
                          e.currentTarget.querySelector('.pill-tooltip').style.transform = 'translateX(-50%) translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)';
                          e.currentTarget.querySelector('.pill-tooltip').style.opacity = '0';
                          e.currentTarget.querySelector('.pill-tooltip').style.transform = 'translateX(-50%) translateY(0px)';
                        }}
                      >
                        {DEVICON_MAP[s] && (
                          <i
                            className={DEVICON_MAP[s]}
                            style={{ fontSize: 22, lineHeight: 1 }}
                          />
                        )}
                        {/* Hover tooltip */}
                        <div
                          className="pill-tooltip"
                          style={{
                            position: 'absolute',
                            bottom: '110%',
                            left: '50%',
                            transform: 'translateX(-50%) translateY(0px)',
                            backgroundColor: '#1a0d17',
                            color: 'var(--fg)',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            whiteSpace: 'nowrap',
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid var(--border)',
                            opacity: 0,
                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                            pointerEvents: 'none',
                            zIndex: 10,
                          }}
                        >
                          {s}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
