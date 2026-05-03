import React from 'react';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
import { useCursorMode } from '../components/CustomCursor';

const ProjectItem = ({ project, index }) => {
  const { setCursorMode } = useCursorMode();

  return (
    <div
      className="group relative border-t border-white/10 py-12 md:py-16 transition-colors duration-300 ease-in-out hover:bg-[rgba(0,212,255,0.03)] cursor-pointer overflow-hidden"
      onMouseEnter={() => setCursorMode('view')}
      onMouseLeave={() => setCursorMode('default')}
    >
      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: Number & Title */}
        <div className="flex items-center gap-8 md:w-1/2">
          <span className="text-6xl md:text-8xl font-black text-white/5 transition-colors duration-300 select-none group-hover:text-primary/20">
            0{index + 1}
          </span>
          <div>
            <h3 className="text-3xl md:text-5xl font-black text-white transition-transform duration-300 ease-in-out group-hover:translate-x-4">
              {project.title}
            </h3>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-md transition-colors duration-300 group-hover:text-white/80">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right: Tech & Links */}
        <div className="md:w-1/2 flex flex-col md:items-end w-full relative">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary border border-primary/30 px-3 py-1 rounded-full">
              {project.category}
            </span>
          </div>

          <div className="flex flex-wrap md:justify-end gap-2 mb-8">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="text-xs font-medium bg-white/5 text-white/60 px-3 py-1.5 rounded-md transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Arrow & Actions Container */}
          <div className="flex items-center justify-end w-full relative h-12 overflow-hidden">
            {/* Arrow that slides right */}
            <ArrowRight
              size={32}
              className="text-white/20 transition-all duration-300 ease-in-out group-hover:text-primary group-hover:translate-x-[8px] absolute right-0 group-hover:opacity-0"
            />

            {/* Action Buttons that slide up from bottom */}
            <div className="flex items-center gap-4 absolute right-0 transform translate-y-[20px] opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-[#0a0a0f] border border-white/20 text-white px-4 py-2 rounded-full hover:border-white/50 transition-colors z-20"
                  onMouseEnter={(e) => e.stopPropagation()}
                >
                  <Github size={16} /> Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-primary text-black px-4 py-2 rounded-full hover:bg-[#00b8e6] transition-colors z-20"
                  onMouseEnter={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} /> Live
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="container mx-auto px-6 lg:px-12 mb-20">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
          03 // Work
        </span>
        <h2 className="text-5xl md:text-7xl font-light">
          Featured{' '}
          <span className="font-black text-primary">Projects.</span>
        </h2>
        <div className="w-[100px] h-[1px] bg-primary mt-6" />
      </div>

      <div className="w-full flex flex-col border-b border-white/10">
        {projects.map((project, index) => (
          <ProjectItem key={project._id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
