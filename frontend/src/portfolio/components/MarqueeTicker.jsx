import React from 'react';

const TECH_STACK = [
  'REACT', 'PYTHON', 'FLASK', 'NODE.JS', 'MONGODB',
  'THREE.JS', 'GSAP', 'SCIKIT-LEARN', 'JAVASCRIPT',
  'TYPESCRIPT', 'GIT', 'LINUX', 'REST APIS', 'FIREBASE'
];

// Duplicate to ensure seamless loop
const ROW_ITEMS = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK];

const MarqueeTicker = () => {
  return (
    <section className="py-16 bg-[var(--bg)] overflow-hidden wrapper relative border-y" style={{ borderColor: 'var(--border-sub)' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marqueeLeft {
          from { transform: translateX(0) }
          to   { transform: translateX(-33.333333%) }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-33.333333%) }
          to   { transform: translateX(0) }
        }
        .track-left  { animation: marqueeLeft 30s linear infinite }
        .track-right { animation: marqueeRight 38s linear infinite }
        .wrapper:hover .track-left,
        .wrapper:hover .track-right {
          animation-play-state: paused
        }
      `}} />
      
      <div className="flex flex-col gap-5 transform -rotate-1 scale-105">
        {/* Top Row (Left) */}
        <div className="flex whitespace-nowrap track-left w-max">
          {ROW_ITEMS.map((tech, i) => (
            <React.Fragment key={i}>
              <span className="text-[0.75rem] uppercase tracking-[0.25em] text-[var(--fg-10)]" style={{ fontFamily: 'var(--font-body)' }}>
                {tech}
              </span>
              <span className="mx-6 text-[0.75rem] text-[var(--fg-10)]">·</span>
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Row (Right) */}
        <div className="flex whitespace-nowrap track-right w-max">
          {ROW_ITEMS.map((tech, i) => (
            <React.Fragment key={i}>
              <span className="text-[0.75rem] uppercase tracking-[0.25em] text-[var(--fg-10)]" style={{ fontFamily: 'var(--font-body)' }}>
                {tech}
              </span>
              <span className="mx-6 text-[0.75rem] text-[var(--fg-10)]">·</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeTicker;
