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
    <section className="py-20 bg-[var(--bg-primary)] overflow-hidden wrapper relative border-y border-[rgba(255,255,255,0.05)]">
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
      
      <div className="flex flex-col gap-6 transform -rotate-2 scale-105">
        {/* Top Row (Left) */}
        <div className="flex whitespace-nowrap track-left w-max">
          {ROW_ITEMS.map((tech, i) => (
            <React.Fragment key={i}>
              <span className="text-[0.8rem] uppercase tracking-[0.2em] font-medium" style={{ color: 'rgba(255,255,255,0.18)' }}>
                {tech}
              </span>
              <span className="mx-6 text-[0.8rem]" style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
            </React.Fragment>
          ))}
        </div>

        {/* Bottom Row (Right) */}
        <div className="flex whitespace-nowrap track-right w-max">
          {ROW_ITEMS.map((tech, i) => (
            <React.Fragment key={i}>
              <span className="text-[0.8rem] uppercase tracking-[0.2em] font-medium" style={{ color: 'rgba(255,255,255,0.18)' }}>
                {tech}
              </span>
              <span className="mx-6 text-[0.8rem]" style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeTicker;
