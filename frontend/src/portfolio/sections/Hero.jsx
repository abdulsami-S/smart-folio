import React, { useEffect, useRef, useContext, useState } from 'react';
import { gsap } from 'gsap';
import { Download, ChevronRight, MapPin, Sparkles, ArrowDown } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { FALLBACK_PROJECTS } from '../data/projects';

/* ─── Magnetic Button ─────────────────────────────────────────── */
const MagneticBtn = ({ children, className, style, href, target, rel }) => {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const isActive = useRef(false);
  const RADIUS = 160; // px — magnetic field radius

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const onMouseMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        isActive.current = true;
        const strength = Math.max(0, 1 - dist / RADIUS); // 0 at edge, 1 at center
        const pullX = dx * 0.65;
        const pullY = dy * 0.65;
        // Button body moves strongly
        gsap.to(wrap, {
          x: pullX,
          y: pullY,
          scale: 1 + strength * 0.12,
          rotateX: (-dy / RADIUS) * 15,
          rotateY: (dx / RADIUS) * 15,
          boxShadow: `0 ${8 + strength * 30}px ${20 + strength * 60}px rgba(201,112,74,${0.15 + strength * 0.35})`,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 600,
        });
        // Inner text moves in opposite direction (creates depth/parallax)
        gsap.to(inner, {
          x: -dx * 0.12,
          y: -dy * 0.12,
          duration: 0.4,
          ease: 'power2.out',
        });
      } else if (isActive.current) {
        isActive.current = false;
        gsap.to(wrap, {
          x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0,
          boxShadow: '0 0 0 rgba(201,112,74,0)',
          duration: 0.7,
          ease: 'elastic.out(1.1, 0.4)',
          transformPerspective: 600,
        });
        gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1.1, 0.4)' });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <a
      ref={wrapRef}
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={{ ...style, display: 'inline-flex', willChange: 'transform' }}
    >
      <span ref={innerRef} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', willChange: 'transform' }}>
        {children}
      </span>
    </a>
  );
};

/* ─── Particle Trail Canvas ───────────────────────────────────── */
const ParticleTrail = ({ isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastX = mouseX, lastY = mouseY;
    let frameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      // More particles on fast movement, min 1 on slow move
      const count = Math.min(Math.floor(speed * 0.4) + 1, 5);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 0.4 + Math.random() * 2.0;
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 6,
          y: mouseY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * vel * 0.5,
          vy: Math.sin(angle) * vel * 0.5 - 0.8,
          life: 1,
          decay: 0.012 + Math.random() * 0.016,  // slower fade = longer trail
          size: 2.5 + Math.random() * 4,
        });
      }
      lastX = mouseX; lastY = mouseY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;  // gentle gravity
        p.vx *= 0.98;  // soft air drag
        p.life -= p.decay;
        const alpha = Math.max(0, p.life);
        const r = Math.max(0, p.size * p.life);
        // Outer soft halo
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
        grd.addColorStop(0,   `rgba(232, 168, 124, ${alpha * 0.95})`);
        grd.addColorStop(0.3, `rgba(201, 112,  74, ${alpha * 0.6})`);
        grd.addColorStop(1,   `rgba(201, 112,  74, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
      frameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 9998,
      }}
    />
  );
};

/* ─── Hero ────────────────────────────────────────────────────── */
const Hero = ({ portfolio }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const heroRef = useRef(null);
  const spotlightRef = useRef(null);
  const nameBlockRef = useRef(null);
  const labelRef = useRef(null);
  const nameRef = useRef(null);
  const introRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsBarRef = useRef(null);

  // Orb parallax refs
  const mouse = useRef({ x: 0, y: 0 });
  const orb1 = useRef({ x: 0, y: 0 });
  const orb2 = useRef({ x: 0, y: 0 });
  const orb3 = useRef({ x: 0, y: 0 });
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  /* ── Unified smooth animation loop ── */
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // Raw mouse target (updated instantly on mousemove)
    const target = { x: 0, y: 0, normX: 0, normY: 0 };
    // Smoothed values (lerped each frame)
    const smooth = {
      spotX: window.innerWidth / 2,  spotY: window.innerHeight / 2,
      orb1x: 0, orb1y: 0,
      orb2x: 0, orb2y: 0,
      orb3x: 0, orb3y: 0,
      tiltX: 0, tiltY: 0,
    };

    const onMouseMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.normX = (e.clientX / window.innerWidth  - 0.5) * 2;
      target.normY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Tilt targets from hero bounds
      const rect = heroEl.getBoundingClientRect();
      target.tiltX = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
      target.tiltY = ((e.clientX - rect.left) / rect.width  - 0.5) *  12;
    };
    heroEl.addEventListener('mousemove', onMouseMove);

    const lerp = (a, b, t) => a + (b - a) * t;
    let frameId;

    const tick = () => {
      // Spotlight — very fast lerp so it feels responsive but not jumpy
      smooth.spotX = lerp(smooth.spotX, target.x, 0.12);
      smooth.spotY = lerp(smooth.spotY, target.y, 0.12);
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${smooth.spotX}px`;
        spotlightRef.current.style.top  = `${smooth.spotY}px`;
      }

      // Orbs — different speeds for parallax depth
      smooth.orb1x = lerp(smooth.orb1x, target.normX * 65, 0.025);
      smooth.orb1y = lerp(smooth.orb1y, target.normY * 50, 0.025);
      smooth.orb2x = lerp(smooth.orb2x, target.normX * -40, 0.018);
      smooth.orb2y = lerp(smooth.orb2y, target.normY * -32, 0.018);
      smooth.orb3x = lerp(smooth.orb3x, target.normX * 28, 0.014);
      smooth.orb3y = lerp(smooth.orb3y, target.normY * 22, 0.014);
      if (orb1Ref.current) orb1Ref.current.style.transform = `translate(calc(-20% + ${smooth.orb1x}px), calc(-50% + ${smooth.orb1y}px))`;
      if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${smooth.orb2x}px, ${smooth.orb2y}px)`;
      if (orb3Ref.current) orb3Ref.current.style.transform = `translate(${smooth.orb3x}px, ${smooth.orb3y}px)`;

      // 3D name tilt — slow, dreamy lerp
      smooth.tiltX = lerp(smooth.tiltX, target.tiltX || 0, 0.04);
      smooth.tiltY = lerp(smooth.tiltY, target.tiltY || 0, 0.04);
      if (nameBlockRef.current) {
        nameBlockRef.current.style.transform =
          `perspective(900px) rotateX(${smooth.tiltX}deg) rotateY(${smooth.tiltY}deg)`;
      }

      frameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      heroEl.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  /* ── GSAP entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo(labelRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1 }, 0.3)
        .fromTo(nameRef.current, { opacity: 0, y: 80, filter: 'blur(20px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3 }, 0.5)
        .fromTo(introRef.current, { opacity: 0, x: 50, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1 }, 0.8)
        .fromTo(buttonsRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1 }, 1.1)
        .fromTo(statsBarRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, 1.4);

      // Floating micro-line animation
      gsap.to('.hero-float-line', {
        y: -8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.4
      });

      // Name gradient shimmer
      gsap.fromTo('.hero-name-accent',
        { backgroundPosition: '0% 50%' },
        { backgroundPosition: '200% 50%', duration: 4, repeat: -1, ease: 'none' }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen w-full flex flex-col overflow-hidden bg-[var(--bg)]"
      style={{ cursor: 'none' }}
      onMouseLeave={() => {
        if (nameBlockRef.current) {
          gsap.to(nameBlockRef.current, {
            rotateX: 0, rotateY: 0,
            duration: 0.8, ease: 'elastic.out(1, 0.5)',
            transformPerspective: 800,
          });
        }
      }}
    >
      {/* ── Cursor spotlight ── */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed"
        style={{
          zIndex: 50,
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: isDark
            ? 'radial-gradient(circle, rgba(201,112,74,0.07) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(201,112,74,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Real cursor dot ── */}
      <CursorDot />

      {/* ── Particle trail canvas ── */}
      <ParticleTrail isDark={isDark} />

      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div ref={orb1Ref} style={{
          position: 'absolute', width: '55vw', height: '55vw',
          top: '50%', left: '45%',
          background: isDark
            ? 'radial-gradient(circle, rgba(201,112,74,0.13) 0%, rgba(56,25,50,0.04) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(201,112,74,0.11) 0%, transparent 80%)',
          borderRadius: '50%', filter: 'blur(50px)',
        }} />
        <div ref={orb2Ref} style={{
          position: 'absolute', width: '28vw', height: '28vw',
          top: '8%', left: '8%',
          background: isDark
            ? 'radial-gradient(circle, rgba(140, 50, 110, 0.11) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(201,112,74,0.09) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(55px)',
        }} />
        <div ref={orb3Ref} style={{
          position: 'absolute', width: '22vw', height: '22vw',
          bottom: '12%', right: '8%',
          background: isDark
            ? 'radial-gradient(circle, rgba(201,112,74,0.09) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(140,50,110,0.07) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }} />
      </div>

      {/* ── Floating decorative lines ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div className="hero-float-line absolute w-px" style={{ height: '120px', left: '8%', top: '20%', background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)', opacity: 0.3 }} />
        <div className="hero-float-line absolute w-px" style={{ height: '80px', left: '50%', top: '10%', background: 'linear-gradient(to bottom, transparent, var(--fg-20), transparent)', opacity: 0.2 }} />
        <div className="hero-float-line absolute w-px" style={{ height: '100px', right: '12%', top: '30%', background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)', opacity: 0.2 }} />
        {/* Dot grid — just 3x3, very subtle */}
        {[...Array(9)].map((_, i) => (
          <div key={i} className="hero-float-line absolute rounded-full" style={{
            width: '3px', height: '3px',
            left: `${15 + (i % 3) * 12}%`,
            top: `${15 + Math.floor(i / 3) * 12}%`,
            backgroundColor: 'var(--accent)',
            opacity: 0.12,
          }} />
        ))}
      </div>

      {/* ── SAMI watermark ── */}
      <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        style={{ zIndex: 0, right: '-1%' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10vw', fontWeight: 700, fontStyle: 'italic',
          color: 'var(--fg-06)', letterSpacing: '-0.02em',
          lineHeight: 0.85, writingMode: 'vertical-rl',
          textOrientation: 'mixed', display: 'block', userSelect: 'none',
        }}>SAMI</span>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative flex flex-col flex-1 justify-center container mx-auto px-6 lg:px-12" style={{ zIndex: 10 }}>
        {/* Label */}
        <p ref={labelRef} className="uppercase mb-6 font-semibold flex items-center gap-4"
          style={{ color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.35em' }}>
          <span className="w-10 h-px bg-[var(--accent)] inline-block" />
          FULL STACK DEVELOPER · AI ENTHUSIAST
        </p>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* LEFT: Name — 3D tilt block */}
          <div
            ref={nameBlockRef}
            style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
          >
            <h1 ref={nameRef} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 9vw, 8.5rem)',
              letterSpacing: '-0.03em', lineHeight: 0.92,
            }}>
              <span style={{ fontWeight: 300, display: 'block' }} className="text-[var(--fg-40)]">Shaik</span>
              <span
                className="hero-name-accent"
                style={{
                  fontWeight: 700, fontStyle: 'italic', display: 'block',
                  background: isDark
                    ? 'linear-gradient(90deg, #fff3e6, #e8a87c, #c9704a, #e8a87c, #fff3e6)'
                    : 'linear-gradient(90deg, #381932, #7a2d5a, #c9704a, #7a2d5a, #381932)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text', color: 'transparent',
                }}
              >
                Abdul Sami
              </span>
            </h1>
            {/* Location */}
            <div className="flex items-center gap-2 mt-5" style={{ color: 'var(--fg-40)' }}>
              <MapPin size={13} />
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.08em' }}>Proddatur, Andhra Pradesh · IIIT Dharwad '27</span>
            </div>
          </div>

          {/* RIGHT: Intro + buttons */}
          <div ref={introRef} className="flex flex-col gap-8">
            <div className="relative pl-6" style={{ borderLeft: '2px solid var(--accent)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={13} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>About me</span>
              </div>
              <p style={{ color: 'var(--fg-60)', fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)', lineHeight: 1.85, fontWeight: 400 }}>
                Hi there! I'm a Computer Science student at{' '}
                <span style={{ color: 'var(--fg)', fontWeight: 600 }}>IIIT Dharwad</span>, passionate about turning ideas into real, working products. I build full-stack web applications and AI-powered systems — from sleek UIs to intelligent backends.
              </p>
              <p className="mt-4" style={{ color: 'var(--fg-40)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                Currently in my{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>4th year</span>{' '}
                — actively seeking opportunities to build, contribute, and grow with ambitious teams.
              </p>
            </div>

            {/* Magnetic Buttons */}
            <div ref={buttonsRef} className="flex flex-wrap gap-4">
              <MagneticBtn
                href="#projects"
                style={{ background: 'linear-gradient(135deg, #c9704a, #9b3d1e)', color: '#fff3e6' }}
                className="group px-7 py-3.5 font-bold rounded-full text-sm uppercase tracking-[0.15em] flex items-center gap-2 cursor-none"
              >
                View Projects <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticBtn>
              <MagneticBtn
                href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                style={{ borderColor: 'var(--border)', color: 'var(--fg)', border: '1px solid' }}
                className="px-7 py-3.5 bg-transparent font-bold rounded-full hover:bg-[var(--fg-06)] transition-all flex items-center gap-2 text-sm uppercase tracking-[0.15em] cursor-none"
              >
                <Download className="w-4 h-4" /> Resume
              </MagneticBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATS BAR ── */}
      <div ref={statsBarRef} className="relative w-full" style={{ zIndex: 10, borderTop: '1px solid var(--border-sub)' }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            {/* Project count */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--fg)', lineHeight: 1 }}>
                  {FALLBACK_PROJECTS.length}
                </span>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-40)', lineHeight: 1.4 }}>
                  Public<br />Projects
                </span>
              </div>
              <div className="w-px h-8 bg-[var(--border-sub)]" />
              {/* Scroll hint */}
              <div className="hidden md:flex items-center gap-2" style={{ color: 'var(--fg-20)' }}>
                <ArrowDown size={14} className="animate-bounce" />
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Scroll to explore</span>
              </div>
            </div>

            {/* Open to work */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--accent)' }}></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: 'var(--accent)' }}></span>
              </span>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>
                Open to Work
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Custom cursor dot (small, visible) ──────────────────────── */
const CursorDot = () => {
  const dotRef = useRef(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cur = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);

    let frameId;
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      cur.current.x = lerp(cur.current.x, pos.current.x, 0.18);
      cur.current.y = lerp(cur.current.y, pos.current.y, 0.18);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cur.current.x - 7}px, ${cur.current.y - 7}px)`;
      }
      frameId = requestAnimationFrame(tick);
    };
    tick();

    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(frameId); };
  }, []);

  return (
    <div ref={dotRef} className="fixed pointer-events-none" style={{
      zIndex: 9999, top: 0, left: 0,
      width: '14px', height: '14px',
      borderRadius: '50%',
      backgroundColor: 'var(--accent)',
      opacity: 0.85,
      mixBlendMode: 'screen',
      boxShadow: '0 0 12px rgba(201, 112, 74, 0.6)',
    }} />
  );
};

export default Hero;
