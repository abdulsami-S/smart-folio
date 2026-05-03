import React from 'react';

const techs = [
  'React',
  'Python',
  'Flask',
  'Node.js',
  'MongoDB',
  'Three.js',
  'GSAP',
  'Scikit-learn',
  'JavaScript',
  'TypeScript',
  'Git',
  'Linux',
  'REST APIs',
  'Firebase',
  'GeoPandas',
];

const TechRow = ({ items }) =>
  items.map((tech, i) => (
    <span key={i} className="flex-shrink-0 flex items-center gap-6">
      <span>{tech}</span>
      <span className="text-primary">·</span>
    </span>
  ));

const MarqueeTicker = () => {
  return (
    <div className="py-16 relative z-10 overflow-hidden marquee-wrapper select-none">
      {/* Row 1 — scrolls LEFT */}
      <div className="flex whitespace-nowrap mb-4">
        <div
          className="flex items-center gap-6 marquee-track"
          style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          <TechRow items={techs} />
          <TechRow items={techs} />
        </div>
      </div>

      {/* Row 2 — scrolls RIGHT */}
      <div className="flex whitespace-nowrap">
        <div
          className="flex items-center gap-6 marquee-track-reverse"
          style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          <TechRow items={[...techs].reverse()} />
          <TechRow items={[...techs].reverse()} />
        </div>
      </div>
    </div>
  );
};

export default MarqueeTicker;
