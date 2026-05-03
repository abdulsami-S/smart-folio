import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skillData = [
  {
    category: "Backend",
    description: "Robust server-side systems and REST APIs built for scale and performance.",
    services: ["Flask", "Node.js", "REST APIs"],
    tools: "⚡🔧\n🌐🔗",
  },
  {
    category: "Data & ML",
    description: "Machine learning pipelines and geospatial analysis for real-world AI applications.",
    services: ["Scikit-learn", "GeoPandas", "NumPy", "Pandas", "Rasterio"],
    tools: "🤖📊\n🧠🗺️",
  },
  {
    category: "Databases",
    description: "Data storage and management across relational and real-time systems.",
    services: ["MySQL", "SQLite", "Firebase"],
    tools: "🗄️🔥\n💾📋",
  },
  {
    category: "Frontend",
    description: "Modern responsive interfaces built with React and vanilla JavaScript.",
    services: ["React.js", "Leaflet.js", "Vanilla JS", "Responsive Design"],
    tools: "⚛️🎨\n📱✨",
  },
  {
    category: "Languages",
    description: "Core programming languages for web apps, ML models and systems.",
    services: ["Python", "JavaScript", "C++", "SQL", "HTML5", "CSS3"],
    tools: "🐍⚡\n🔤🖥️",
  },
  {
    category: "Tools",
    description: "Professional development workflow, version control and deployment.",
    services: ["Git", "GitHub", "VS Code", "Postman", "Linux"],
    tools: "🐙💻\n🔨🐧",
  }
];

const Skills = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      // In mobile, just reveal everything, kill trigger if exists
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === sectionRef.current) t.kill();
      });
      return;
    }

    const section = sectionRef.current;
    const track = trackRef.current;

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
      
      // Global Animation Rule for section entrance (if needed)
      // Since it's a pinned section, blur entrance might clash if applied to the whole section.
      // We will apply it to the header instead.
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

    return () => {
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section 
      ref={sectionRef} 
      id="skills"
      className={`relative bg-[var(--bg-primary)] ${isMobile ? 'py-20 px-4' : 'h-screen overflow-hidden'}`}
    >
      {/* HEADER */}
      <div 
        className={`fixed-header ${isMobile ? 'mb-12' : 'absolute top-12 left-20 z-20 pointer-events-none'}`}
      >
        <p className="text-[var(--accent-cyan)] text-[0.8rem] tracking-[0.2em] font-bold uppercase mb-2">
          02 // EXPERTISE
        </p>
        <h2 className="text-white text-[clamp(2rem,4vw,3.5rem)] font-black tracking-tighter leading-tight">
          Core Arsenal.
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
                shrink-0 rounded-[20px] p-[36px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                flex flex-col relative overflow-hidden
                ${isMobile ? 'w-full min-h-[400px]' : 'w-[420px] h-[520px]'}
                ${isActive 
                  ? 'bg-gradient-to-br from-[#3730a3] via-[#4338ca] to-[#4f46e5] border-[rgba(255,255,255,0.2)] shadow-[0_0_0_1px_rgba(99,102,241,0.3),0_40px_100px_rgba(67,56,202,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]' 
                  : 'bg-[#0c0c18] border-[rgba(255,255,255,0.06)] scale-100'}
              `}
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                transform: isActive && !isMobile ? 'scale(1.04) translateY(-8px)' : 'none'
              }}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start w-full">
                <span 
                  className="font-black leading-none"
                  style={{
                    fontSize: '5rem',
                    color: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'
                  }}
                >
                  0{i + 1}
                </span>
                <ArrowUpRight 
                  className={`w-8 h-8 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/20'}`} 
                />
              </div>

              <div className="mt-auto">
                <h3 
                  className={`text-white transition-all duration-500 mb-4`}
                  style={{
                    fontSize: isActive ? '1.6rem' : '1.5rem',
                    fontWeight: isActive ? 700 : 600
                  }}
                >
                  {skill.category}
                </h3>
                
                <div 
                  className={`transition-all duration-500 overflow-hidden ${isActive ? 'opacity-100 max-h-[300px]' : 'opacity-0 max-h-0'}`}
                >
                  <p className="text-[rgba(255,255,255,0.65)] text-[0.9rem] leading-[1.7] mb-6">
                    {skill.description}
                  </p>
                  
                  <div className="w-full h-px bg-[rgba(255,255,255,0.12)] mb-6"></div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[0.65rem] text-white/40 font-bold uppercase tracking-widest mb-3">SERVICES</h4>
                      <ul className="flex flex-col gap-2">
                        {skill.services.map((s, idx) => (
                          <li key={idx} className="text-white text-[0.85rem] font-medium">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[0.65rem] text-white/40 font-bold uppercase tracking-widest mb-3">TOOLS</h4>
                      <div className="whitespace-pre-line text-[1.6rem] leading-[1.4] tracking-widest select-none">
                        {skill.tools}
                      </div>
                    </div>
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
