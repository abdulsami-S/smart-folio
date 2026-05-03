import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TimelineItem = ({ entry, index }) => {
  const itemRef = useRef(null);
  const isEven = index % 2 === 0;

  const getIcon = () => {
    switch (entry.type) {
      case 'Education': return <GraduationCap size={20} className="text-white" />;
      case 'Work': return <Briefcase size={20} className="text-white" />;
      case 'Achievement': return <Trophy size={20} className="text-white" />;
      default: return <Briefcase size={20} />;
    }
  };

  const getColor = () => {
    switch (entry.type) {
      case 'Education': return 'bg-primary shadow-[0_0_20px_rgba(0,212,255,0.6)] border-primary';
      case 'Work': return 'bg-secondary shadow-[0_0_20px_rgba(6,255,165,0.6)] border-secondary';
      case 'Achievement': return 'bg-accent shadow-[0_0_20px_rgba(168,85,247,0.6)] border-accent';
      default: return 'bg-white/20';
    }
  };

  useEffect(() => {
    gsap.fromTo(itemRef.current,
      { opacity: 0, x: isEven ? 100 : -100, rotateY: isEven ? 15 : -15 },
      {
        opacity: 1, x: 0, rotateY: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: itemRef.current,
          start: "top 85%",
        }
      }
    );
  }, [isEven]);

  return (
    <div className={`relative flex items-center justify-between md:justify-normal ${isEven ? 'md:flex-row-reverse' : ''} mb-24 last:mb-0`} style={{ perspective: "1000px" }}>
      
      {/* Icon Node */}
      <div className={`absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full border-2 z-20 ${getColor()}`}>
        {getIcon()}
      </div>

      {/* Content Card */}
      <div 
        ref={itemRef}
        className={`w-[calc(100%-4rem)] ml-auto md:ml-0 md:w-[calc(50%-4rem)] bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 group relative transform-style-3d cursor-pointer`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
        
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest mb-6">
            {entry.duration}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">{entry.title}</h3>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-6">{entry.institution}</h4>
          
          {entry.description && (
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
              {entry.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Timeline = ({ timeline }) => {
  const lineRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!lineRef.current || !sectionRef.current) return;

    // The glowing line that draws itself
    gsap.fromTo(lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1, // Tie drawing exactly to scroll progress
        }
      }
    );
  }, []);

  if (!timeline || timeline.length === 0) return null;

  return (
    <section id="experience" ref={sectionRef} className="py-32 relative bg-[#030305]">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="mb-24 text-center md:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4 block">04 // Journey</span>
          <h2 className="text-5xl md:text-7xl font-black">
            Experience <span className="font-light text-white/40">&</span> Timeline.
          </h2>
          <div className="w-[100px] h-[1px] bg-accent mt-6 mx-auto md:mx-0"></div>
        </div>

        <div className="relative max-w-5xl mx-auto pt-10">
          {/* Base inactive line */}
          <div className="absolute left-7 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/5 rounded-full"></div>
          
          {/* Animated Glowing Line */}
          <div 
            ref={lineRef}
            className="absolute left-7 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent origin-top rounded-full shadow-[0_0_15px_rgba(0,212,255,0.8)]"
          ></div>

          <div className="relative z-10">
            {timeline.map((entry, index) => (
              <TimelineItem key={entry._id} entry={entry} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
