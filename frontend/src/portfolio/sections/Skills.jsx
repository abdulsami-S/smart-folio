import React, { useMemo } from 'react';

/* ─── FLIP TITLE (Antimatter AI style) ─── */
const FlipTitle = ({ text }) => (
  <div
    style={{
      overflow: 'hidden',
      height: '1.2em',
      lineHeight: '1.2em',
      position: 'relative',
    }}
    className="card-title-wrap"
  >
    <span
      className="block transition-transform duration-400 group-hover:-translate-y-full"
      style={{ transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)' }}
    >
      {text}
    </span>
    <span
      className="block text-primary transition-transform duration-400 group-hover:-translate-y-full"
      style={{
        transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
        position: 'absolute',
        top: '100%',
        left: 0,
      }}
    >
      {text}
    </span>
  </div>
);

const SkillCard = ({ category, index, skills }) => {
  const borderColors = [
    'border-l-primary',
    'border-l-secondary',
    'border-l-accent',
    'border-l-blue-500',
    'border-l-rose-500',
    'border-l-amber-500',
  ];
  const borderColor = borderColors[index % borderColors.length];

  return (
    <div
      className={`bg-[#0a0a0f] border border-white/5 border-l-4 ${borderColor} rounded-xl p-8 group relative overflow-hidden transition-all duration-[400ms] ease-in-out hover:bg-gradient-to-br hover:from-[#11111a] hover:to-[#0a0a0f] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
    >
      {/* Category Number */}
      <div className="absolute top-6 right-6 text-[10px] font-black text-white/20 tracking-[0.2em] transition-colors duration-[400ms] group-hover:text-white/40">
        0{index + 1}
      </div>

      {/* Antimatter-style flip title */}
      <h3 className="text-2xl font-bold mb-2 text-white">
        <FlipTitle text={category} />
      </h3>
      <p className="text-sm text-white/40 mb-8">{skills.length} Technologies</p>

      {/* Subtle line that expands on hover */}
      <div
        className={`h-[2px] w-12 bg-white/10 mb-8 transition-all duration-[400ms] ease-in-out group-hover:w-full group-hover:bg-current ${borderColor.replace('border-l-', 'text-')}`}
      />

      {/* Skills List (Revealed on hover with staggered delays) */}
      <div className="space-y-4 max-h-0 opacity-0 translate-y-[10px] group-hover:translate-y-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-[400ms] ease-in-out overflow-hidden">
        {skills.map((skill, i) => (
          <div
            key={skill._id}
            className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] ease-in-out"
            style={{ transitionDelay: `${i * 0.05}s` }}
          >
            <span className="text-sm font-medium text-white/80">
              {skill.name}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-1.5 h-1.5 rounded-full ${
                    level <= skill.proficiency ? 'bg-white/80' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View Details Label (Fades out on hover) */}
      <div className="text-xs uppercase tracking-widest text-primary font-bold transition-opacity duration-[400ms] ease-in-out opacity-100 group-hover:opacity-0 absolute bottom-8">
        Hover to view
      </div>
    </div>
  );
};

const Skills = ({ skills }) => {
  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  return (
    <section id="skills" className="py-32 relative z-10">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-4 block">
            02 // Expertise
          </span>
          <h2 className="text-5xl md:text-7xl font-black">
            Core <span className="text-secondary">Arsenal.</span>
          </h2>
          <div className="w-[100px] h-[1px] bg-secondary mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, catSkills], index) => (
            <SkillCard
              key={category}
              category={category}
              index={index}
              skills={catSkills}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
