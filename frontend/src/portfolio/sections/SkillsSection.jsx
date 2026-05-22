import React, { useEffect, useRef, useState, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeContext } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

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
  { category: "Backend",   description: "Robust server-side systems and REST APIs built for scale and performance.",                          services: ["Flask","Node.js","REST APIs"] },
  { category: "Data & ML", description: "Machine learning pipelines and geospatial analysis for real-world AI applications.",                 services: ["Scikit-learn","GeoPandas","NumPy","Pandas","Rasterio"] },
  { category: "Databases", description: "Data storage and management across relational and real-time systems.",                               services: ["MySQL","SQLite","Firebase"] },
  { category: "Frontend",  description: "Modern responsive interfaces built with React and vanilla JavaScript.",                              services: ["React.js","Leaflet.js","Vanilla JS","Responsive Design"] },
  { category: "Languages", description: "Core programming languages for web apps, ML models and systems.",                                   services: ["Python","JavaScript","C++","SQL","HTML5","CSS3"] },
  { category: "Tools",     description: "Professional development workflow, version control and deployment.",                                 services: ["Git","GitHub","VS Code","Postman","Linux"] },
];

const Skills = ({ skills }) => {
  const sectionRef   = useRef(null);
  const trackRef     = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile]       = useState(false);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const displaySkills = React.useMemo(() => {
    if (!skills || skills.length === 0) {
      return skillData;
    }

    // Group the visible skills by category
    const grouped = skills.reduce((acc, s) => {
      if (s.visible !== false) {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s.name);
      }
      return acc;
    }, {});

    // For categories that we have descriptions for, map them
    const categoryDescriptions = {
      "Backend": "Robust server-side systems and REST APIs built for scale and performance.",
      "Data & ML": "Machine learning pipelines and geospatial analysis for real-world AI applications.",
      "Databases": "Data storage and management across relational and real-time systems.",
      "Frontend": "Modern responsive interfaces built with React and vanilla JavaScript.",
      "Languages": "Core programming languages for web apps, ML models and systems.",
      "Tools": "Professional development workflow, version control and deployment."
    };

    // Return the mapped list
    return Object.entries(grouped)
      .map(([category, services]) => ({
        category,
        description: categoryDescriptions[category] || `Technical skills and tools specialized in ${category}.`,
        services
      }))
      .sort((a, b) => {
        // Keep the original order of default categories
        const order = ["Backend", "Data & ML", "Databases", "Frontend", "Languages", "Tools"];
        const idxA = order.indexOf(a.category);
        const idxB = order.indexOf(b.category);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.category.localeCompare(b.category);
      });
  }, [skills]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) {
      ScrollTrigger.getAll().forEach(t => { if (t.vars.trigger === sectionRef.current) t.kill(); });
      return;
    }
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const totalScroll = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      // ── Horizontal scroll — scrub:0.4 (was 1) = snappier, faster feel ──
      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + totalScroll,
          scrub: 0.4,          // ← was 1 — now 60% faster response
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const maxIdx = Math.max(0, displaySkills.length - 1);
            const idx = Math.min(Math.round(self.progress * maxIdx), maxIdx);
            setActiveIndex(idx);
          },
        },
      });

      // Header entrance
      gsap.fromTo(section.querySelector('.fixed-header'),
        { opacity:0, y:60, filter:'blur(8px)' },
        { opacity:1, y:0, filter:'blur(0px)',
          duration: 0.7,       // ← was 1 — faster
          ease: 'power4.out',
          scrollTrigger: { trigger:section, start:'top 75%', toggleActions:'play none none reverse' },
        }
      );

      // sectionChange event for ThreeBackground
      ScrollTrigger.create({
        trigger: section, start: 'top 60%',
        onEnter: () => window.dispatchEvent(new CustomEvent('sectionChange')),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, displaySkills]);

  // ── Pill entrance — duration 0.25 (was 0.4), stagger 0.04 (was 0.06) ──
  useEffect(() => {
    const activeCard = document.querySelector('.skills-card-active');
    if (!activeCard) return;
    const pills = activeCard.querySelectorAll('.skill-pill');
    gsap.fromTo(pills,
      { y:20, opacity:0 },
      { y:0, opacity:1,
        duration: 0.25,        // ← was 0.4
        stagger: 0.04,         // ← was 0.06
        ease: 'power3.out',
        delay: 0.08,           // ← was 0.15
      }
    );
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`relative ${isMobile ? 'py-20 px-4' : 'h-screen overflow-hidden'}`}
      style={{ zIndex:1, backgroundColor:'transparent' }}
    >
      {/* HEADER */}
      <div className={`fixed-header ${isMobile ? 'mb-12' : 'absolute top-12 left-20 z-20 pointer-events-none'}`}>
        <p className="text-[var(--accent)] text-[0.8rem] tracking-[0.2em] font-bold uppercase mb-2">TECH STACK</p>
        <h2 className="text-[var(--fg)]" style={{ fontFamily:'var(--font-display)',fontSize:'clamp(2rem,4vw,3.5rem)',lineHeight:1,letterSpacing:'-0.02em' }}>
          <span style={{ fontWeight:300 }}>Core </span>
          <span style={{ fontWeight:700,fontStyle:'italic',color:'var(--accent)' }}>Arsenal.</span>
        </h2>
      </div>

      {/* TRACK */}
      <div
        ref={trackRef}
        className={`${isMobile ? 'flex flex-col gap-6 w-full' : 'flex flex-row items-center gap-[24px] h-full will-change-transform'}`}
        style={{ padding: isMobile ? '0' : '0 calc(50vw - 210px)' }}
      >
        {displaySkills.map((skill, i) => {
          const isActive = isMobile ? true : activeIndex === i;
          return (
            <div
              key={i}
              className={`shrink-0 rounded-[20px] flex flex-col relative overflow-hidden
                ${isMobile ? 'w-full' : 'w-[420px] h-auto'}
                ${isActive ? 'shadow-[0_40px_100px_rgba(201,112,74,0.15)] skills-card-active' : ''}
              `}
              style={{
                borderWidth:'1px', borderStyle:'solid',
                borderColor: isActive ? 'var(--accent)' : 'var(--border-sub)',
                // ── transition 0.3s (was 0.5s) = snappier card switch ──
                transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
                transform: isActive && !isMobile ? 'scale(1.04) translateY(-8px)' : 'none',
                backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
                backgroundColor: isActive
                  ? (isDark ? 'rgba(79,37,72,0.85)' : 'rgba(238,223,200,0.85)')
                  : (isDark ? 'rgba(68,32,62,0.65)' : 'rgba(238,223,200,0.65)'),
                minHeight: isActive ? '380px' : 'auto',
              }}
            >
              <div className="flex flex-col justify-between h-full p-8">

                {/* Number + title */}
                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span style={{ fontFamily:'var(--font-display)',fontSize:'3rem',fontWeight:700,fontStyle:'italic',color: isActive ? 'var(--fg-20)' : 'var(--fg-06)',transition:'color 0.3s ease' }}
                      className="leading-none select-none">
                      0{i+1}
                    </span>
                    <h3 className="text-[var(--fg)]" style={{ fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:700,fontStyle:'italic',lineHeight:1.1,transition:'all 0.3s' }}>
                      {skill.category}
                    </h3>
                  </div>
                </div>

                {/* Expandable details */}
                <div className={`overflow-hidden ${isActive ? 'opacity-100 max-h-[400px]' : 'opacity-0 max-h-0 pointer-events-none'}`}
                  style={{ transition:'all 0.3s ease' }}> {/* ← was 0.5s */}
                  <div className="h-[2px] mb-5" style={{ width: isActive ? '60px' : '30px', backgroundColor: isActive ? 'var(--accent)' : 'var(--border-sub)', transition:'all 0.3s ease' }} />
                  <p style={{ fontSize:'0.95rem',lineHeight:1.75,color:'var(--fg-60)',fontWeight:400 }}>{skill.description}</p>
                </div>

                {/* Pills */}
                <div className={`overflow-hidden ${isActive ? 'opacity-100 max-h-[400px]' : 'opacity-0 max-h-0 pointer-events-none'}`}
                  style={{ transition:'all 0.3s ease' }}> {/* ← was 0.5s */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ backgroundColor:'var(--border-sub)' }} />
                    <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em]" style={{ color: isActive ? 'var(--accent)' : 'var(--fg-40)' }}>Stack</span>
                    <div className="h-px flex-1" style={{ backgroundColor:'var(--border-sub)' }} />
                  </div>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:10 }}>
                    {skill.services.map((s, idx) => (
                      <div key={idx} className="skill-pill" style={{ position:'relative',width:44,height:44,borderRadius:12,backgroundColor:'rgba(0,0,0,0.4)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'default',transition:'all 0.15s ease',backdropFilter:'blur(8px)' }} // ← transition 0.15s was 0.2s
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
                        {DEVICON_MAP[s] && <i className={DEVICON_MAP[s]} style={{ fontSize:22,lineHeight:1 }} />}
                        <div className="pill-tooltip" style={{ position:'absolute',bottom:'110%',left:'50%',transform:'translateX(-50%) translateY(0px)',backgroundColor:'#1a0d17',color:'var(--fg)',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.05em',whiteSpace:'nowrap',padding:'4px 8px',borderRadius:6,border:'1px solid var(--border)',opacity:0,transition:'opacity 0.15s ease, transform 0.15s ease',pointerEvents:'none',zIndex:10 }}>
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