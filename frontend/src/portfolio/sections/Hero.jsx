import React, { useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { Download, ChevronRight } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { FALLBACK_PROJECTS } from '../data/projects';

const Hero = ({ portfolio }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const heroRef = useRef(null);

  const labelRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);
  const decorRef = useRef(null);

  // Mouse-tracking parallax state
  const mouse = useRef({ x: 0, y: 0 });
  const orb1 = useRef({ x: 0, y: 0 });
  const orb2 = useRef({ x: 0, y: 0 });
  const orb3 = useRef({ x: 0, y: 0 });
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  // Mouse parallax animation loop
  useEffect(() => {
    const onMouseMove = (e) => {
      // Normalize mouse to -1..1
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frameId;
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      // Orb 1 — follows cursor strongly (main glow)
      orb1.current.x = lerp(orb1.current.x, mouse.current.x * 80, 0.04);
      orb1.current.y = lerp(orb1.current.y, mouse.current.y * 60, 0.04);

      // Orb 2 — follows cursor in opposite direction (parallax depth)
      orb2.current.x = lerp(orb2.current.x, mouse.current.x * -50, 0.03);
      orb2.current.y = lerp(orb2.current.y, mouse.current.y * -40, 0.03);

      // Orb 3 — subtle follow
      orb3.current.x = lerp(orb3.current.x, mouse.current.x * 35, 0.025);
      orb3.current.y = lerp(orb3.current.y, mouse.current.y * 30, 0.025);

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(calc(-20% + ${orb1.current.x}px), calc(-50% + ${orb1.current.y}px))`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${orb2.current.x}px, ${orb2.current.y}px)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate(${orb3.current.x}px, ${orb3.current.y}px)`;
      }

      frameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(decorRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, delay: 0.1, duration: 2.5, ease: 'power3.out' }
      );
      gsap.fromTo(labelRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, delay: 0.3, duration: 1, ease: 'power4.out' }
      );
      gsap.fromTo(nameRef.current,
        { opacity: 0, y: 80, filter: 'blur(16px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', delay: 0.5, duration: 1.2, ease: 'power4.out' }
      );
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, delay: 0.9, duration: 1, ease: 'power4.out' }
      );
      gsap.fromTo(buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, delay: 1.1, duration: 1, ease: 'power4.out' }
      );
      gsap.fromTo(statsRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, delay: 1.3, duration: 1, ease: 'power4.out' }
      );

      // Subtle floating animation for orbs
      gsap.to('.hero-orb-1', {
        y: -30, x: 15, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to('.hero-orb-2', {
        y: 25, x: -20, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1
      });
      gsap.to('.hero-orb-3', {
        y: -20, x: 10, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative h-screen w-full flex items-center overflow-hidden bg-[var(--bg)]">

      {/* === PREMIUM BACKGROUND === */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>

        {/* Large ambient glow — center-right */}
        <div
          ref={orb1Ref}
          style={{
            width: '60vw',
            height: '60vw',
            top: '50%',
            left: '45%',
            transform: 'translate(-20%, -50%)',
            background: isDark
              ? 'radial-gradient(circle, rgba(201,112,74,0.14) 0%, rgba(56,25,50,0.05) 60%, transparent 80%)'
              : 'radial-gradient(circle, rgba(201,112,74,0.12) 0%, rgba(255,243,230,0.05) 60%, transparent 80%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            transition: 'transform 0.1s linear',
          }}
        />

        {/* Secondary smaller glow — top-left */}
        <div
          ref={orb2Ref}
          style={{
            position: 'absolute',
            width: '30vw',
            height: '30vw',
            top: '10%',
            left: '10%',
            background: isDark
              ? 'radial-gradient(circle, rgba(150, 60, 120, 0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(201,112,74,0.10) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
          }}
        />

        {/* Tertiary glow — bottom-right */}
        <div
          ref={orb3Ref}
          style={{
            position: 'absolute',
            width: '25vw',
            height: '25vw',
            bottom: '5%',
            right: '5%',
            background: isDark
              ? 'radial-gradient(circle, rgba(201,112,74,0.10) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(150, 60, 120, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        {/* Single elegant thin horizontal accent line */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: isDark
              ? 'linear-gradient(90deg, transparent 0%, rgba(201,112,74,0.08) 30%, rgba(201,112,74,0.15) 50%, rgba(201,112,74,0.08) 70%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(201,112,74,0.06) 30%, rgba(201,112,74,0.12) 50%, rgba(201,112,74,0.06) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* Watermark — vertical right, slim column, never overlaps stats */}
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        style={{ zIndex: 0, right: '-2%' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10vw',
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'var(--fg-06)',
            letterSpacing: '-0.02em',
            lineHeight: 0.85,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            display: 'block',
            userSelect: 'none',
          }}
        >
          SAMI
        </span>
      </div>

      {/* Main Content */}
      <div className="relative w-full container mx-auto px-6 lg:px-12" style={{ zIndex: 10 }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">

          {/* Left: Text Block */}
          <div className="max-w-3xl">
            <p
              ref={labelRef}
              className="uppercase mb-8 font-semibold flex items-center gap-4"
              style={{ color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.3em' }}
            >
              <span className="w-12 h-px bg-[var(--accent)] inline-block" />
              FULL STACK DEVELOPER
            </p>

            <h1
              ref={nameRef}
              className="mb-8"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
              }}
            >
              <span style={{ fontWeight: 300, display: 'block' }} className="text-[var(--fg-40)]">Shaik</span>
              <span style={{
                fontWeight: 700,
                fontStyle: 'italic',
                display: 'block',
                background: isDark
                  ? 'linear-gradient(135deg, #fff3e6 0%, #e8a87c 50%, #c9704a 100%)'
                  : 'linear-gradient(135deg, #381932 0%, #7a2d5a 55%, #c9704a 100%)',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Abdul Sami
              </span>
            </h1>

            <div
              ref={subtitleRef}
              className="ml-1 pl-6 mb-12"
              style={{ borderLeft: '2px solid var(--accent)' }}
            >
              <p
                style={{ color: 'var(--fg-60)', fontSize: '1.1rem', lineHeight: 1.7 }}
                className="font-medium max-w-lg"
              >
                Crafting full-stack web applications & AI-powered systems.
                <br />
                <span className="text-[var(--fg-40)]">B.Tech CSE · IIIT Dharwad '27</span>
              </p>
            </div>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#projects"
                style={{ background: 'linear-gradient(135deg, #c9704a, #9b3d1e)', color: '#fff3e6' }}
                className="group relative px-8 py-4 font-bold rounded-full overflow-hidden transition-transform hover:scale-105 text-sm uppercase tracking-[0.15em]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Projects <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
                className="px-8 py-4 bg-transparent border font-bold rounded-full hover:bg-[var(--fg-06)] transition-all flex items-center gap-2 justify-center text-sm uppercase tracking-[0.15em]"
              >
                <Download className="w-4 h-4" /> Resume
              </a>
            </div>
          </div>

          {/* Right: Stats Strip — fixed width so it never squishes or overlaps */}
          <div
            ref={statsRef}
            className="flex lg:flex-col items-center lg:items-end gap-8 lg:gap-10 shrink-0"
            style={{ minWidth: '120px' }}
          >
            <div className="flex flex-col items-center lg:items-end">
              <span
                className="text-[var(--fg)] leading-none"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700 }}
              >
                {FALLBACK_PROJECTS.length}
              </span>
              <span className="text-[var(--fg-40)] mt-1" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Projects
              </span>
            </div>

            <div className="h-px w-10 lg:w-16 lg:h-px bg-[var(--border-sub)]" />

            <div className="flex flex-col items-center lg:items-end">
              <span
                className="text-[var(--fg)] leading-none"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700 }}
              >
                2+
              </span>
              <span className="text-[var(--fg-40)] mt-1" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Years
              </span>
            </div>

            <div className="h-px w-10 lg:w-16 lg:h-px bg-[var(--border-sub)]" />

            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--accent)' }}></span>
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'var(--accent)' }}></span>
              </span>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                Open to Work
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10 }}>
        <div className="w-px h-8 bg-[var(--fg-20)] animate-pulse" />
        <span className="text-[var(--fg-20)]" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Hero;
