import React, { useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Trophy, Code2 } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_TIMELINE = [
  {
    _id: 'timeline-1',
    title: 'B.Tech Computer Science & Engineering',
    institution: 'Indian Institute of Information Technology (IIIT), Dharwad',
    duration: '2023 — Present',
    description: 'Currently pursuing my B.Tech in CSE. Focusing on full-stack web development, Artificial Intelligence, and Machine Learning. Building scalable applications and geospatial AI systems.',
    type: 'Education',
  },
  {
    _id: 'timeline-2',
    title: 'Joint Entrance Examination (JEE) Mains',
    institution: 'National Testing Agency',
    duration: '2023',
    description: 'Secured an impressive 95.539 percentile. Achieved a General Rank of 40,772 and an EWS Rank of 8,231, which paved the way for my admission into IIIT Dharwad.',
    type: 'Achievement',
  },
  {
    _id: 'timeline-3',
    title: 'Intermediate (11th & 12th)',
    institution: 'Narayana Shivani Bhavan, Vijayawada',
    duration: '2021 — 2023',
    description: 'Completed my higher secondary education under the Board of Intermediate Education, Andhra Pradesh (BIEAP). Scored a stellar 874/1000.',
    type: 'Education',
  },
  {
    _id: 'timeline-4',
    title: 'Secondary School (10th)',
    institution: 'Narayana High School, Proddatur',
    duration: 'Passed in 2021',
    description: 'Born and raised in Proddatur, Kadapa District, Andhra Pradesh. Completed my schooling under the AP State Board (BSEAP), achieving an outstanding score of 599/600.',
    type: 'Education',
  }
];

const TimelineItem = ({ entry, index, isDark }) => {
  const itemRef = useRef(null);
  const isEven = index % 2 === 0;

  const getIcon = () => {
    switch (entry.type) {
      case 'Education': return <GraduationCap size={20} className="text-[var(--fg)]" />;
      case 'Work': return <Code2 size={20} className="text-[var(--fg)]" />;
      case 'Achievement': return <Trophy size={20} className="text-[var(--fg)]" />;
      default: return <Briefcase size={20} className="text-[var(--fg)]" />;
    }
  };

  useEffect(() => {
    if (!itemRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(itemRef.current, {
        opacity: 0, x: 60, filter: "blur(8px)"
      }, {
        opacity: 1, x: 0, filter: "blur(0px)",
        duration: 1, ease: "power4.out",
        scrollTrigger: { trigger: itemRef.current, start: "top 80%" }
      });
    }, itemRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={`relative flex items-center justify-between md:justify-normal ${isEven ? 'md:flex-row-reverse' : ''} mb-28 last:mb-0`} style={{ perspective: "1000px" }}>
      <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full border-2 z-20 shadow-[0_0_20px_rgba(201,112,74,0.3)] border-[var(--accent)]" style={{ backgroundColor: 'var(--bg-card)' }}>
        {getIcon()}
      </div>
      <div 
        ref={itemRef}
        className="w-[calc(100%-4rem)] ml-auto md:ml-0 md:w-[calc(50%-4rem)] backdrop-blur-xl p-8 rounded-3xl border transition-all duration-500 group cursor-pointer"
        style={{ borderColor: 'var(--border-sub)', backgroundColor: isDark ? 'rgba(68,32,62,0.6)' : 'rgba(238,223,200,0.6)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.backgroundColor = isDark ? 'rgba(79,37,72,0.8)' : 'rgba(229,211,184,0.8)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-sub)'; e.currentTarget.style.backgroundColor = isDark ? 'rgba(68,32,62,0.6)' : 'rgba(238,223,200,0.6)'; }}
      >
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontStyle: 'italic', backgroundColor: 'var(--fg-06)', borderColor: 'var(--border-sub)', color: 'var(--fg)' }}>
            {entry.duration}
          </span>
          <h3 className="text-2xl md:text-3xl mb-2 group-hover:text-[var(--accent)] transition-colors text-[var(--fg)]" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{entry.title}</h3>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--fg-40)] mb-6">{entry.institution}</h4>
          {entry.description && (
            <p className="text-sm text-[var(--fg-60)] leading-relaxed group-hover:text-[var(--fg)] transition-colors">{entry.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Timeline = ({ timeline }) => {
  const lineRef = useRef(null);
  const sectionRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const displayTimeline = (timeline && timeline.length > 0) ? timeline : FALLBACK_TIMELINE;

  useEffect(() => {
    if (!lineRef.current || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.querySelector('.timeline-header'),
        { opacity: 0, y: 60, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" }
        }
      );
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "bottom 80%", scrub: 1 }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-40 relative bg-[var(--bg)]">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="timeline-header mb-28 text-center md:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block font-semibold">04 // Journey</span>
          <h2 style={{ fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            <span className="text-[var(--fg)]" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300, display: 'block' }}>Experience &</span>
            <span className="text-[var(--accent)]" style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontWeight: 700, fontStyle: 'italic', display: 'block' }}>Timeline.</span>
          </h2>
          <div className="w-[80px] h-px bg-[var(--accent)] mt-8 mx-auto md:mx-0"></div>
        </div>
        <div className="relative max-w-5xl mx-auto pt-10">
          <div className="absolute left-7 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-px rounded-full" style={{ backgroundColor: 'var(--border-sub)' }}></div>
          <div ref={lineRef} className="absolute left-7 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-px origin-top rounded-full shadow-[0_0_10px_rgba(201,112,74,0.3)]" style={{ backgroundColor: 'var(--accent)' }}></div>
          <div className="relative z-10">
            {displayTimeline.map((entry, index) => (
              <TimelineItem key={entry._id} entry={entry} index={index} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
