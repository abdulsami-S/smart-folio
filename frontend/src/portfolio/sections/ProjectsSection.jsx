import React, { useState, useEffect, useRef, useContext } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeContext } from '../../context/ThemeContext';

import { FALLBACK_PROJECTS } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index, isDark }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, {
        opacity: 0, y: 50, filter: "blur(6px)"
      }, {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 0.9, delay: index * 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 85%" }
      });
    });
    return () => ctx.revert();
  }, [index]);

  const fallback = FALLBACK_PROJECTS[index] || FALLBACK_PROJECTS[0];
  const badge = project.badge || fallback.badge;
  const image = project.image || fallback.image;
  const githubLink = project.github || fallback.github;

  return (
    <div
      ref={cardRef}
      className="group relative rounded-[20px] overflow-hidden border transition-all duration-500 cursor-pointer flex flex-col"
      style={{ 
        borderColor: isHovered ? 'var(--accent)' : 'var(--border-sub)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 30px 80px rgba(201,112,74,0.12)' : 'none',
      }}
      onMouseEnter={() => { setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); }}
      onClick={() => githubLink && window.open(githubLink, '_blank', 'noopener,noreferrer')}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        <img src={image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0" style={{ background: isDark ? 'linear-gradient(to top, #2d1228 0%, rgba(45,18,40,0.4) 40%, transparent 100%)' : 'linear-gradient(to top, #fff3e6 0%, rgba(255,243,230,0.4) 40%, transparent 100%)' }} />
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[0.55rem] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-md" style={{ color: '#fff3e6', backgroundColor: 'rgba(201,112,74,0.7)' }}>{badge}</span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <div className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 backdrop-blur-md" style={{ backgroundColor: 'rgba(201,112,74,0.7)' }}>
            <ArrowUpRight size={15} className="text-[#fff3e6]" />
          </div>
        </div>
      </div>
      <div className="p-7 pt-5 flex flex-col flex-1" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-baseline gap-3 mb-3">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, fontStyle: 'italic', color: 'var(--fg-20)' }}>0{index + 1}</span>
          <h3 className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-300" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2vw, 1.6rem)', fontWeight: 700, lineHeight: 1.2 }}>{project.title}</h3>
        </div>
        <p className="text-[var(--fg-60)] text-[0.85rem] leading-relaxed mb-5 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {(project.techStack || []).slice(0, 5).map((tech, i) => (
            <span key={i} className="text-[0.58rem] font-medium px-2 py-0.5 rounded uppercase tracking-[0.12em]" style={{ backgroundColor: 'var(--fg-06)', color: 'var(--fg-40)', border: '1px solid var(--border-sub)' }}>{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects = ({ projects }) => {
  const sectionRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const displayProjects = (projects && projects.length > 0) ? projects.map((p, i) => ({ ...FALLBACK_PROJECTS[i], ...p })) : FALLBACK_PROJECTS;

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.querySelector('.projects-header'), { opacity: 0, y: 60, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power4.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-40 relative z-10 bg-[var(--bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="projects-header mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block font-semibold"> Work</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
              <span className="text-[var(--fg)]" style={{ fontWeight: 300 }}>Selected </span>
              <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Work.</span>
            </h2>
          </div>
          <p className="text-[var(--fg-40)] max-w-sm text-sm leading-relaxed md:text-right">A curated collection of projects spanning AI, full-stack development, and data science.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ gridAutoRows: '1fr' }}>
          {displayProjects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
