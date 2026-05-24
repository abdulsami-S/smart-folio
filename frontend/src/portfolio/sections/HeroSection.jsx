import React, { useEffect, useRef, useContext, useState } from 'react';
import { gsap } from 'gsap';
import { Download, ChevronRight, MapPin, Sparkles, ArrowDown } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { FALLBACK_PROJECTS } from '../data/projects';

/* ─── ANTIGRAVITY CHAR SPLIT ── */
const AntigravityText = ({ text, className, style, as: Tag = 'span', delay = 0 }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const spans = el.querySelectorAll('.ag-char');
    spans.forEach((span, i) => {
      const randomY   = -8 - Math.random() * 18;
      const randomX   = (Math.random() - 0.5) * 10;
      const randomRot = (Math.random() - 0.5) * 6;
      const randomDur = 2.5 + Math.random() * 2.5;
      const randomDelay = delay + i * 0.04 + Math.random() * 0.3;
      gsap.fromTo(span,
        { opacity: 0, y: -40, rotationZ: (Math.random() - 0.5) * 20, filter: 'blur(8px)' },
        { opacity: 1, y: 0, rotationZ: 0, filter: 'blur(0px)', duration: 1.1, delay: randomDelay, ease: 'power3.out' }
      );
      gsap.to(span, { y: randomY, x: randomX, rotationZ: randomRot, duration: randomDur, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: randomDelay + 1.2 });
    });
    return () => { gsap.killTweensOf(spans); };
  }, [text, delay]);
  return (
    <Tag ref={containerRef} className={className} style={{ ...style, display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <span key={i} className="ag-char" style={{ display: 'inline-block', willChange: 'transform', minWidth: char === ' ' ? '0.35em' : undefined }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
};

/* ─── FLOATING HEADING ── */
const FloatingHeading = ({ words, className, style, delay = 0, isDark = true }) => {
  const ref = useRef(null);
  const textColor = isDark ? '#f5d78ed9' : 'rgba(56, 25, 50, 0.30)';
  
  useEffect(() => {
    const spans = ref.current?.querySelectorAll('.fg-word');
    if (!spans?.length) return;
    spans.forEach((span, i) => {
      gsap.fromTo(span,
        { opacity: 0, y: 60, filter: 'blur(16px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3, delay: delay + i * 0.14, ease: 'power4.out' }
      );
      gsap.to(span, { y: -10 - i * 4, rotationZ: (Math.random() - 0.5) * 1.5, duration: 3 + i * 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: delay + i * 0.14 + 1.5 });
    });
    return () => gsap.killTweensOf(spans);
  }, [words, delay]);
  
  return (
    <span ref={ref} className={className} style={{ ...style, display: 'inline-flex', flexWrap: 'wrap', gap: '0.22em' }}>
      {words.map((word, i) => (
        <span key={i} className="fg-word" style={{ display: 'inline-block', willChange: 'transform', color: textColor }}>
          {word}
        </span>
      ))}
    </span>
  );
};

/* ─── SWIPE BUTTON ───────────────────────────────────────────────────────────
 * Premium swipe-fill interaction on hover.
 * Maintains idle float and asymmetric border-radius styling.
 * ──────────────────────────────────────────────────────────────────────────── */
const SwipeBtn = ({ children, className, style, href, target, rel, variant = 'primary' }) => {
  const wrapRef  = useRef(null);
  const contentRef = useRef(null);
  const idleTweenRef = useRef(null);
  
  const isPrimary = variant === 'primary';
  const baseBg = isPrimary ? 'linear-gradient(135deg, #c9704a, #9b3d1e)' : 'transparent';
  const borderColor = isPrimary ? 'rgba(232,168,124,0.3)' : 'rgba(201,112,74,0.5)';
  
  // For primary, swipe in a reversed gradient for a vibrant shift. For outline, fill with standard gradient.
  const swipeBg = isPrimary ? 'linear-gradient(135deg, #9b3d1e, #c9704a)' : 'linear-gradient(135deg, #c9704a, #9b3d1e)';
  
  const defaultTextColor = isPrimary ? '#fff3e6' : 'var(--fg)';
  const hoverTextColor = '#fff3e6'; // Both variants go/stay light on hover due to backgrounds
  
  const boxShadow = isPrimary ? '0 8px 24px rgba(201,112,74,0.3)' : 'none';
  const hoverBoxShadow = isPrimary ? '0 12px 32px rgba(201,112,74,0.5)' : '0 8px 24px rgba(201,112,74,0.3)';
  
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    
    // Idle float
    idleTweenRef.current = gsap.to(wrap, {
      y: isPrimary ? -6 : -4,
      duration: 1.8 + Math.random() * 0.8,
      repeat: -1, yoyo: true, ease: 'sine.inOut',
      delay: isPrimary ? 0 : 0.6,
    });
    
    return () => {
      if (idleTweenRef.current) idleTweenRef.current.kill();
    };
  }, [isPrimary]);

  const handleEnter = () => {
    // Kill the idle tween to avoid animation fighting
    if (idleTweenRef.current) {
      idleTweenRef.current.kill();
      idleTweenRef.current = null;
    }

    if (wrapRef.current) gsap.to(wrapRef.current, { boxShadow: hoverBoxShadow, borderColor: 'rgba(232,168,124,0.5)', duration: 0.3 });
    if (!isPrimary && contentRef.current) gsap.to(contentRef.current, { color: hoverTextColor, duration: 0.3 });
  };

  const handleMouseMove = (e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Magnetic pull strength (max 14px translation)
    const strength = 14;
    const xMove = (x / (rect.width / 2)) * strength;
    const yMove = (y / (rect.height / 2)) * strength;

    gsap.to(wrap, {
      x: xMove,
      y: yMove,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        x: xMove * 0.35,
        y: yMove * 0.35,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  const handleLeave = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Smooth elastic spring back to center
    gsap.to(wrap, {
      x: 0,
      y: 0,
      boxShadow: boxShadow,
      borderColor: borderColor,
      duration: 0.8,
      ease: 'elastic.out(1.1, 0.4)',
      overwrite: 'auto',
      onComplete: () => {
        // Resume idle float
        if (!idleTweenRef.current && wrapRef.current) {
          idleTweenRef.current = gsap.to(wrapRef.current, {
            y: isPrimary ? -6 : -4,
            duration: 1.8 + Math.random() * 0.8,
            repeat: -1, yoyo: true, ease: 'sine.inOut'
          });
        }
      }
    });

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        color: !isPrimary ? defaultTextColor : undefined,
        duration: 0.8,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto'
      });
    }
  };

  return (
    <a ref={wrapRef} href={href} target={target} rel={rel}
      onMouseEnter={handleEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      className={`group relative inline-flex items-center gap-[0.6rem] overflow-hidden cursor-none transition-colors duration-300 ${className}`}
      style={{
        padding: '14px 32px',
        background: baseBg,
        border: `1px solid ${borderColor}`,
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        boxShadow: boxShadow,
        ...style
      }}
    >
      {/* Swipe background layer */}
      <span 
        className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{ background: swipeBg }} 
      />
      
      {/* Content wrapper */}
      <span ref={contentRef} className="relative z-10 flex items-center gap-inherit transition-transform duration-300 group-hover:scale-[1.02]" style={{ color: defaultTextColor }}>
        {children}
      </span>
    </a>
  );
};

/* ─── PARTICLE TRAIL ── */
const ParticleTrail = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [], lastX = window.innerWidth/2, lastY = window.innerHeight/2, frameId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMove = (e) => {
      const speed = Math.sqrt((e.clientX-lastX)**2 + (e.clientY-lastY)**2);
      if (speed > 4) for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.push({ x: e.clientX+(Math.random()-0.5)*5, y: e.clientY+(Math.random()-0.5)*5, vx: Math.cos(angle)*0.4, vy: -0.8-Math.random()*1.2, life: 1, decay: 0.025+Math.random()*0.025, size: 0.8+Math.random()*1.6 });
      }
      lastX = e.clientX; lastY = e.clientY;
    };
    window.addEventListener('mousemove', onMove);
    const tick = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles = particles.filter(p => p.life > 0);
      for (const p of particles) {
        p.x+=p.vx; p.y+=p.vy; p.vx*=0.98; p.vy*=0.99; p.life-=p.decay;
        const a = Math.max(0,p.life), r = Math.max(0,p.size*p.life);
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*2);
        g.addColorStop(0,`rgba(232,168,124,${a*0.9})`);
        g.addColorStop(0.4,`rgba(201,112,74,${a*0.4})`);
        g.addColorStop(1,`rgba(201,112,74,0)`);
        ctx.beginPath(); ctx.arc(p.x,p.y,r*2,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      }
      frameId = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener('resize',resize); window.removeEventListener('mousemove',onMove); cancelAnimationFrame(frameId); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:9998 }} />;
};

/* ─── SKETCH DIVIDER ── */
const SketchDivider = ({ className }) => (
  <div className={className} style={{ width:'100%',overflow:'hidden',opacity:0.25 }}>
    <svg viewBox="0 0 1200 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%',height:'24px' }}>
      <path d="M0 12 C80 4, 160 20, 240 12 S400 4, 480 12 S640 20, 720 12 S880 4, 960 12 S1120 20, 1200 12" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 6" />
    </svg>
  </div>
);

/* ─── CURSOR DOT ── */
const CursorDot = () => {
  const dotRef = useRef(null), ringRef = useRef(null);
  const pos = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
  const cur = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
  const ring = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
  
  const ringScale = useRef(1);
  const dotScale = useRef(1);

  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);

    const onOver = (e) => {
      const target = e.target.closest('a') || e.target.closest('button');
      if (target) {
        ringScale.current = 1.6;
        dotScale.current = 0.3;
        if (ringRef.current) ringRef.current.style.borderColor = 'var(--accent)';
      }
    };

    const onOut = (e) => {
      const target = e.target.closest('a') || e.target.closest('button');
      if (target) {
        ringScale.current = 1.0;
        dotScale.current = 1.0;
        if (ringRef.current) ringRef.current.style.borderColor = 'rgba(201,112,74,0.4)';
      }
    };

    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);

    let fid;
    const lerp = (a, b, t) => a + (b - a) * t;
    let currentRingScale = 1;
    let currentDotScale = 1;

    const tick = () => {
      cur.current.x = lerp(cur.current.x, pos.current.x, 0.2);
      cur.current.y = lerp(cur.current.y, pos.current.y, 0.2);
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.08);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.08);

      currentRingScale = lerp(currentRingScale, ringScale.current, 0.15);
      currentDotScale = lerp(currentDotScale, dotScale.current, 0.15);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cur.current.x - 5}px, ${cur.current.y - 5}px) scale(${currentDotScale})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px) scale(${currentRingScale})`;
      }
      fid = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(fid);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="fixed pointer-events-none" style={{ zIndex:9997,top:0,left:0,width:'36px',height:'36px',borderRadius:'50%',border:'1px solid rgba(201,112,74,0.4)', transition: 'border-color 0.3s ease' }} />
      <div ref={dotRef} className="fixed pointer-events-none" style={{ zIndex:9999,top:0,left:0,width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'var(--accent)',opacity:0.9,mixBlendMode:'screen',boxShadow:'0 0 14px rgba(201,112,74,0.8)', transition: 'background-color 0.3s ease' }} />
    </>
  );
};

/* ─── HERO SECTION ── */
const Hero = ({ portfolio }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const heroRef    = useRef(null);
  const labelRef   = useRef(null);
  const introRef   = useRef(null);
  const buttonsRef = useRef(null);
  const statsBarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo(labelRef.current,   { opacity:0,x:-40 }, { opacity:1,x:0,duration:1 }, 0.3)
        .fromTo(introRef.current,   { opacity:0,x:50,filter:'blur(10px)' }, { opacity:1,x:0,filter:'blur(0px)',duration:1.1 }, 1.2)
        .fromTo(buttonsRef.current,  { opacity:0,y:30 }, { opacity:1,y:0,duration:1 }, 1.5)
        .fromTo(statsBarRef.current, { opacity:0,y:30 }, { opacity:1,y:0,duration:0.9 }, 1.8);
      gsap.fromTo('.hero-label-line', { scaleX:0 }, { scaleX:1,duration:1,delay:0.5,ease:'power3.out',transformOrigin:'left' });
      gsap.fromTo('.hero-name-accent', { backgroundPosition:'0% 50%' }, { backgroundPosition:'200% 50%',duration:5,repeat:-1,ease:'none' });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative h-screen w-full flex flex-col overflow-hidden"
      style={{ cursor:'none', zIndex:1, backgroundColor:'transparent' }}>

      <CursorDot />
      <ParticleTrail />

      {/* SAMI watermark */}
      <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block" style={{ zIndex:1,right:'-1%' }}>
        <span style={{ fontFamily:'var(--font-display)',fontSize:'10vw',fontWeight:700,fontStyle:'italic',color:'var(--fg-06)',letterSpacing:'-0.02em',lineHeight:0.85,writingMode:'vertical-rl',textOrientation:'mixed',display:'block',userSelect:'none' }}>SAMI</span>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative flex flex-col flex-1 justify-center container mx-auto px-6 lg:px-12" style={{ zIndex:10 }}>

        {/* Label */}
        <p ref={labelRef} className="uppercase mb-6 font-semibold flex items-center gap-4"
          style={{ color:'var(--accent)',fontSize:'0.7rem',letterSpacing:'0.35em',opacity:0 }}>
          <span className="hero-label-line w-10 h-px bg-[var(--accent)] inline-block" style={{ transformOrigin:'left' }} />
          FULL STACK DEVELOPER · AI ENTHUSIAST
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* LEFT: Name */}
          <div style={{ willChange:'transform',transformStyle:'preserve-3d' }}>
            <h1 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(3.5rem, 9vw, 8.5rem)',letterSpacing:'-0.03em',lineHeight:0.92 }}>
              <span style={{ fontWeight:300,display:'block',color:'var(--fg-40)' }}>
                <AntigravityText text="Shaik" delay={0.3} />
              </span>
              <span className="hero-name-accent" style={{ fontWeight:700,fontStyle:'italic',display:'block' }}>
                <FloatingHeading words={['Abdul','Sami']} delay={0.55} isDark={isDark} />
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-6" style={{ color:'var(--fg-40)' }}>
              <MapPin size={13} />
              <span style={{ fontSize:'0.78rem',letterSpacing:'0.08em' }}>Proddatur, Andhra Pradesh ·</span>
            </div>
            <SketchDivider className="mt-6" />
          </div>

          {/* RIGHT: Intro + Buttons */}
          <div ref={introRef} className="flex flex-col gap-8" style={{ opacity:0 }}>
            <div className="relative pl-6" style={{ borderLeft:'2px solid var(--accent)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={13} style={{ color:'var(--accent)' }} />
                <span style={{ fontSize:'0.62rem',letterSpacing:'0.3em',textTransform:'uppercase',color:'var(--accent)',fontWeight:700 }}>About me</span>
              </div>
              <p style={{ color:'var(--fg-60)',fontSize:'clamp(0.95rem, 1.1vw, 1.05rem)',lineHeight:1.85,fontWeight:400 }}>
                Hi there! I'm a Computer Science student at{' '}
                <span style={{ color:'var(--fg)',fontWeight:600 }}>IIIT Dharwad</span>, passionate about turning ideas into real, working products. I build full-stack web applications and AI-powered systems — from sleek UIs to intelligent backends.
              </p>
              <p className="mt-4" style={{ color:'var(--fg-40)',fontSize:'0.88rem',lineHeight:1.7 }}>
                Currently in my <span style={{ color:'var(--accent)',fontWeight:600 }}>4th year</span> — actively seeking opportunities to build, contribute, and grow with ambitious teams.
              </p>
            </div>

            {/* ── CTA BUTTONS ── */}
            <div ref={buttonsRef} className="flex flex-wrap gap-5" style={{ opacity:0 }}>

              {/* Primary — View Projects */}
              <SwipeBtn
                href="#projects"
                variant="primary"
                style={{ borderRadius: '4px 16px 4px 16px' }}
              >
                View Projects
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </SwipeBtn>

              {/* Outline — Resume */}
              <SwipeBtn
                href="/resume.pdf"
                target="_blank" 
                rel="noopener noreferrer"
                variant="outline"
                style={{ borderRadius: '16px 4px 16px 4px' }}
              >
                <Download size={14} className="transition-transform group-hover:-translate-y-1" />
                Resume
              </SwipeBtn>
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div ref={statsBarRef} className="relative w-full" style={{ zIndex:10,borderTop:'1px solid var(--border-sub)',opacity:0 }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span style={{ fontFamily:'var(--font-display)',fontSize:'2.2rem',fontWeight:700,color:'var(--fg)',lineHeight:1 }}>{FALLBACK_PROJECTS.length}</span>
                <span style={{ fontSize:'0.58rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--fg-40)',lineHeight:1.4 }}>Public<br/>Projects</span>
              </div>
              <div className="w-px h-8 bg-[var(--border-sub)]" />
              <div className="hidden md:flex items-center gap-2" style={{ color:'var(--fg-20)' }}>
                <ArrowDown size={14} className="animate-bounce" />
                <span style={{ fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase' }}>Scroll to explore</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor:'var(--accent)' }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor:'var(--accent)' }} />
              </span>
              <span style={{ fontSize:'0.65rem',letterSpacing:'0.2em',color:'var(--accent)',textTransform:'uppercase',fontWeight:600 }}>Open to Work</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;