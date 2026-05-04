import React, { useState, useEffect, useRef, useContext } from 'react';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeContext } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const PREVIEWS = [
  {
    icon: '🗺️',
    title: 'GeoSafe AI',
    desc: '~90% Accuracy',
    badge: 'AI / GEOSPATIAL',
  },
  {
    icon: '💎',
    title: 'My-Jewellery',
    desc: 'E-Commerce',
    badge: 'WEB APP',
  },
  {
    icon: '🧠',
    title: 'NLP Benchmark',
    desc: '3 Libraries',
    badge: 'ML / NLP',
  },
  {
    icon: '📅',
    title: 'EventEase',
    desc: 'Real-time',
    badge: 'WEB APP',
  }
];

const ProjectItem = ({ project, index, setHoveredIndex }) => {
  return (
    <div
      className="group relative border-t py-12 transition-colors duration-300 ease-in-out cursor-pointer overflow-hidden px-6"
      style={{ borderColor: 'var(--border-sub)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 5%, transparent)';
        window.__cursorMode = 'view';
        setHoveredIndex(index);
      }}
      onMouseLeave={(e) => {
        window.__cursorMode = 'default';
        e.currentTarget.style.backgroundColor = 'transparent';
        setHoveredIndex(null);
      }}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <span className="text-4xl md:text-6xl font-black transition-colors duration-300 select-none group-hover:text-[var(--accent)] text-[var(--fg-10)]">
            0{index + 1}
          </span>
          <div>
            <h3 className="text-2xl md:text-4xl font-black text-[var(--fg)] transition-transform duration-300 ease-in-out group-hover:translate-x-2">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.techStack.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="text-[0.65rem] font-medium px-2 py-1 rounded-md transition-colors duration-300 uppercase tracking-widest"
                  style={{ backgroundColor: 'var(--fg-06)', color: 'var(--fg-60)' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="relative overflow-hidden w-10 h-10 flex items-center justify-center">
            <ArrowRight
              size={24}
              className="transition-all duration-300 ease-in-out group-hover:text-[var(--accent)] group-hover:translate-x-[8px] absolute text-[var(--fg-20)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = ({ projects }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sectionRef = useRef(null);
  const previewRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelector('.projects-header'),
        { opacity: 0, y: 60, filter: "blur(8px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)", 
          duration: 1, 
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

  useEffect(() => {
    if (previewRef.current && hoveredIndex !== null) {
      gsap.fromTo(previewRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [hoveredIndex]);

  if (!projects || projects.length === 0) return null;

  const currentPreview = hoveredIndex !== null && PREVIEWS[hoveredIndex] 
    ? PREVIEWS[hoveredIndex] 
    : null;

  return (
    <section ref={sectionRef} id="projects" className="py-32 relative z-10 bg-[var(--bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="projects-header mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
            03 // Work
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-[var(--fg)]">
            Selected Work.
          </h2>
          <div className="w-[100px] h-[1px] bg-[var(--accent)] mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-[60px] items-start">
          {/* Left: Project List */}
          <div className="flex flex-col border-b" style={{ borderColor: 'var(--border-sub)' }}>
            {projects.map((project, index) => (
              <ProjectItem 
                key={project._id} 
                project={project} 
                index={index} 
                setHoveredIndex={setHoveredIndex}
              />
            ))}
          </div>

          {/* Right: Sticky Preview Panel */}
          <div className="hidden lg:block sticky top-[120px] h-[500px] rounded-[20px] overflow-hidden border transition-colors duration-500 bg-[var(--bg-card)]" style={{ borderColor: 'var(--border-sub)' }}>
            {currentPreview ? (
              <div 
                ref={previewRef}
                className="w-full h-full flex flex-col items-center justify-center text-center p-8 relative"
                style={{ background: isDark ? 'linear-gradient(145deg, #2d1228, #44203e)' : 'linear-gradient(145deg, #f0d4b0, #e0c090)' }}
              >
                <div className="absolute top-6 left-6">
                  <span 
                    className="text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}
                  >
                    {currentPreview.badge}
                  </span>
                </div>
                
                <span className="text-[5rem] mb-6 drop-shadow-2xl">{currentPreview.icon}</span>
                <h3 className="text-3xl font-black text-[var(--fg)] mb-2">{currentPreview.title}</h3>
                <p className="text-[var(--fg-60)] font-medium">{currentPreview.desc}</p>
                
                <div className="absolute bottom-6 right-6">
                  <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--fg-06)' }}>
                    <ExternalLink size={16} className="text-[var(--fg)]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--fg-20)]">
                <span className="text-4xl mb-4">←</span>
                <p className="font-medium tracking-widest uppercase text-sm">Hover a project</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
