import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * IntroScreen — Minimal luxury brand reveal.
 *
 * Sequence (~4.3s total):
 *  0.5s  → Thin horizontal line draws open from center (like a curtain parting)
 *  1.2s  → "Welcome to Sami's Portfolio" rises up from below, fades in
 *  1.8s  → Accent underline glows in from left to right
 *  2.1s  → "Full Stack Developer" label lifts and fades in
 *  2.9s  → Hold — deliberate stillness, brand poise
 *  3.7s  → Everything fades out together → onComplete fires
 *
 * Plays on every page load (no sessionStorage).
 */
const IntroScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const topLineRef = useRef(null);
  const headlineRef = useRef(null);
  const underlineRef = useRef(null);
  const subtitleRef = useRef(null);

  const stableComplete = useCallback(onComplete, []);

  useEffect(() => {
    const container = containerRef.current;
    const topLine = topLineRef.current;
    const headline = headlineRef.current;
    const underline = underlineRef.current;
    const subtitle = subtitleRef.current;

    if (!container || !topLine || !headline || !underline || !subtitle) return;

    // Set all elements invisible before animation starts
    gsap.set(topLine, { scaleX: 0, opacity: 0, transformOrigin: 'center center' });
    gsap.set(headline, { y: 30, opacity: 0 });
    gsap.set(underline, { scaleX: 0, opacity: 0, transformOrigin: 'left center' });
    gsap.set(subtitle, { y: 12, opacity: 0 });
    gsap.set(container, { opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => stableComplete(),
    });

    // 0.5s — Thin line opens from center outward
    tl.to(topLine, {
      scaleX: 1, opacity: 1,
      duration: 0.8, ease: 'power3.inOut',
    }, 0.5);

    // 1.2s — Headline rises and fades in
    tl.to(headline, {
      y: 0, opacity: 1,
      duration: 0.9, ease: 'power3.out',
    }, 1.2);

    // 1.8s — Accent underline draws in left → right
    tl.to(underline, {
      scaleX: 1, opacity: 1,
      duration: 0.55, ease: 'power2.inOut',
    }, 1.8);

    // 2.1s — Subtitle lifts and fades in
    tl.to(subtitle, {
      y: 0, opacity: 1,
      duration: 0.65, ease: 'power2.out',
    }, 2.1);

    // 2.9s — Hold — intentional pause
    tl.to({}, { duration: 0.8 }, 2.9);

    // 3.7s — Unified fade out
    tl.to(container, {
      opacity: 0,
      duration: 0.55, ease: 'power2.inOut',
    }, 3.7);

    return () => tl.kill();
  }, [stableComplete]);

  return (
    <div
      ref={containerRef}
      id="intro-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Decorative line — draws open from center like an elegant curtain */}
      <div
        ref={topLineRef}
        style={{
          width: '40vw',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, var(--accent) 20%, var(--accent) 80%, transparent 100%)',
          boxShadow: '0 0 20px 5px rgba(201,112,74,0.5), 0 0 40px 10px rgba(201,112,74,0.25)',
          marginBottom: '2.2rem',
          willChange: 'transform, opacity',
        }}
      />

      {/* Main headline */}
      <div
        ref={headlineRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
          fontWeight: 600,
          fontStyle: 'italic',
          letterSpacing: '0.01em',
          color: 'var(--fg)',
          lineHeight: 1,
          marginBottom: '1rem',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        Welcome to Sami's Portfolio
      </div>

      {/* Accent underline — grows left to right */}
      <div
        ref={underlineRef}
        style={{
          width: '280px',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          boxShadow: '0 0 10px 2px rgba(201,112,74,0.35)',
          marginBottom: '1.5rem',
          willChange: 'transform, opacity',
        }}
      />

      {/* Subtitle */}
      <div
        ref={subtitleRef}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.65rem, 1.4vw, 0.8rem)',
          fontWeight: 500,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--fg-60)',
          willChange: 'transform, opacity',
        }}
      >
        Full Stack Developer
      </div>
    </div>
  );
};

export default IntroScreen;
