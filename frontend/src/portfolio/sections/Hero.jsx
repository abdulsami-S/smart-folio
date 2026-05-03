import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ─── SLOT MACHINE DIGIT REEL ─── */
const SlotDigit = ({ target, delay = 0 }) => {
  const reelRef = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!reelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(reelRef.current);
    return () => observer.disconnect();
  }, [triggered]);

  return (
    <span
      ref={reelRef}
      style={{
        display: 'inline-block',
        height: '1.1em',
        overflow: 'hidden',
        lineHeight: '1.1em',
        position: 'relative',
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: triggered
            ? `translateY(calc(${target} * -1.1em))`
            : 'translateY(0)',
          transition: triggered
            ? `transform 1.2s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`
            : 'none',
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} style={{ height: '1.1em', display: 'block' }}>
            {n}
          </span>
        ))}
      </span>
    </span>
  );
};

const SlotCounter = ({ value, label }) => {
  const digits = String(value).split('').map(Number);
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-baseline">
        {digits.map((d, i) => (
          <SlotDigit key={i} target={d} delay={i * 0.15} />
        ))}
        <span className="ml-0.5">+</span>
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-white/50 mt-2 font-semibold">
        {label}
      </span>
    </div>
  );
};

/* ─── SCROLL-LINKED WORD REVEAL ─── */
const ScrollWords = ({ text }) => {
  const containerRef = useRef(null);
  const words = text.split(' ');
  const wordRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // progress: 0 when section top hits bottom of viewport, 1 when it passes top
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));

      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const threshold = 0.1 + i * 0.06;
        if (progress >= threshold) {
          el.style.clipPath = 'inset(0 0% 0 0)';
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 8px' }}>
      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => (wordRefs.current[i] = el)}
          style={{
            clipPath: 'inset(0 100% 0 0)',
            transition: 'clip-path 0.6s ease',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.1rem',
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

/* ─── MAGNETIC BALL ─── */
const MagneticBall = () => {
  const heroRef = useRef(null);
  const ballRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  const animate = useCallback(() => {
    if (isHovering.current) {
      pos.current.x += (target.current.x * 0.3 - pos.current.x) * 0.08;
      pos.current.y += (target.current.y * 0.3 - pos.current.y) * 0.08;
    } else {
      pos.current.x += (0 - pos.current.x) * 0.04;
      pos.current.y += (0 - pos.current.y) * 0.04;
    }

    if (ballRef.current) {
      ballRef.current.style.transform = `translate(calc(-50% + ${pos.current.x}px), calc(-50% + ${pos.current.y}px))`;
    }
    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    heroRef.current = hero;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rawX = e.clientX - cx;
      const rawY = e.clientY - cy;
      target.current.x = Math.max(-200, Math.min(200, rawX));
      target.current.y = Math.max(-150, Math.min(150, rawY));
    };

    const onEnter = () => { isHovering.current = true; };
    const onLeave = () => { isHovering.current = false; };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseenter', onEnter);
    hero.addEventListener('mouseleave', onLeave);

    const raf = requestAnimationFrame(animate);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseenter', onEnter);
      hero.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [animate]);

  return (
    <div
      ref={ballRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,212,255,0.05) 50%, transparent 70%)',
        border: '1px solid rgba(0,212,255,0.3)',
        boxShadow:
          '0 0 60px rgba(0,212,255,0.2), inset 0 0 30px rgba(0,212,255,0.1)',
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none',
        zIndex: 5,
        willChange: 'transform',
      }}
    />
  );
};

/* ─── HERO SECTION ─── */
const Hero = ({ portfolio }) => {
  return (
    <section
      id="hero"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Volumetric Light Ray Background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] h-[100vh] volumetric-ray pointer-events-none opacity-80 mix-blend-screen"
        style={{ clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)' }}
      />

      {/* Magnetic Ball */}
      <MagneticBall />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent z-10 pointer-events-none" />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          marginTop: '-80px',
        }}
      >
        {/* 1. Label */}
        <div
          style={{
            color: '#00d4ff',
            fontSize: '0.85rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            animation: 'fadeIn 0.8s ease forwards 0.3s',
            opacity: 0,
          }}
        >
          FULL STACK DEVELOPER
        </div>

        {/* 2. Name */}
        <h1
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background:
              'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'fadeUp 1s ease forwards 0.5s',
            opacity: 0,
          }}
        >
          Shaik Abdul Sami
        </h1>

        {/* 3. Subtitle — Scroll-linked word reveal */}
        <div
          style={{
            animation: 'fadeIn 0.8s ease forwards 1s',
            opacity: 0,
          }}
        >
          <ScrollWords text="Full Stack Developer · IIIT Dharwad '27" />
        </div>

        {/* 4. Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            animation: 'fadeUp 0.8s ease forwards 1.2s',
            opacity: 0,
          }}
        >
          <button
            className="hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0ea5e9)',
              color: '#000',
              fontWeight: 700,
              padding: '14px 32px',
              borderRadius: '50px',
              boxShadow: '0 0 30px rgba(0,212,255,0.3)',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow =
                '0 0 50px rgba(0,212,255,0.6)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow =
                '0 0 30px rgba(0,212,255,0.3)')
            }
          >
            View Projects
          </button>

          <button
            className="transition-all duration-300"
            style={{
              background: 'transparent',
              border: '1.5px solid rgba(0,212,255,0.5)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '50px',
              fontWeight: 600,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#00d4ff';
              e.currentTarget.style.boxShadow =
                '0 0 20px rgba(0,212,255,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Download Resume
          </button>
        </div>

        {/* 5. Stats Row — Slot Machine Counters */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl border-t border-white/10 pt-12">
          <SlotCounter value={10} label="Projects Built" />
          <SlotCounter value={2} label="Years Coding" />
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(0,212,255,0.8)]" />
              OPEN
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/50 mt-2 font-semibold">
              To Internships
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 rotate-90 mb-10 origin-bottom">
          Scroll
        </span>
        <div className="w-[1px] h-20 bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-primary"
            animate={{ top: ['-50%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
