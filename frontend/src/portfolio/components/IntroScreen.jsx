import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * IntroScreen — Cinematic character-drawing splash (once per tab session).
 *
 * Sequence (~4.5s):
 *  1. Dark screen → glowing dot at bottom
 *  2. Stick-figure character draws itself via SVG stroke animation
 *     (head → eyes → smile → body → arms → legs)
 *  3. Character grows from tiny-at-bottom to large-at-center while drawing
 *  4. Name letters appear scattered, then snap into position
 *  5. Character shrinks above name → compact logo composition
 *  6. Hold → elegant exit
 */
const IntroScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const charWrapRef = useRef(null);
  const svgRef = useRef(null);
  const nameRef = useRef(null);
  const dotRef = useRef(null);

  const stableComplete = useCallback(onComplete, []);

  useEffect(() => {


    const container = containerRef.current;
    const charWrap = charWrapRef.current;
    const svg = svgRef.current;
    const nameEl = nameRef.current;
    const dot = dotRef.current;
    if (!container || !svg || !nameEl) return;

    const drawPaths = svg.querySelectorAll('.dp');
    const eyes = svg.querySelectorAll('.eye');
    const letters = nameEl.querySelectorAll('.il');

    // Prepare stroke-dashoffset for all drawable paths
    drawPaths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, fill: 'none' });
    });

    // Initial states
    gsap.set(charWrap, { y: '35vh', scale: 0.12, opacity: 0 });
    gsap.set(dot, { opacity: 0, scale: 0.5 });
    gsap.set(eyes, { opacity: 0, scale: 0, transformOrigin: 'center' });
    gsap.set(nameEl, { opacity: 0 });

    // Scatter letters randomly
    letters.forEach((l) => {
      gsap.set(l, {
        x: gsap.utils.random(-300, 300),
        y: gsap.utils.random(-200, 200),
        rotation: gsap.utils.random(-180, 180),
        scale: gsap.utils.random(0.3, 1.8),
        opacity: 0,
      });
    });

    // Classify paths by data-order for sequential drawing
    const head = svg.querySelector('[data-part="head"]');
    const smile = svg.querySelector('[data-part="smile"]');
    const body = svg.querySelector('[data-part="body"]');
    const lArm = svg.querySelector('[data-part="larm"]');
    const rArm = svg.querySelector('[data-part="rarm"]');
    const lLeg = svg.querySelector('[data-part="lleg"]');
    const rLeg = svg.querySelector('[data-part="rleg"]');

    // ── Master Timeline ──────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        stableComplete();
      },
    });

    // 0.0s — Glow dot fades in at bottom
    tl.to(dot, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0);

    // 0.1s — Character wrapper fades in
    tl.to(charWrap, { opacity: 1, duration: 0.25, ease: 'power2.in' }, 0.1);

    // 0.2s–1.7s — Character grows from bottom-small to center-large
    tl.to(charWrap, { y: 0, scale: 1, duration: 1.5, ease: 'power2.out' }, 0.2);

    // 0.2s — Head draws (circle)
    tl.to(head, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, 0.2);

    // 0.5s — Eyes pop in
    tl.to(eyes, { opacity: 1, scale: 1, duration: 0.2, stagger: 0.08, ease: 'back.out(3)' }, 0.55);

    // 0.65s — Smile draws
    tl.to(smile, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' }, 0.65);

    // 0.7s — Body draws downward
    tl.to(body, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 0.7);

    // 0.9s — Arms draw outward (staggered)
    tl.to(lArm, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' }, 0.9);
    tl.to(rArm, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' }, 1.0);

    // 1.2s — Legs draw downward (staggered)
    tl.to(lLeg, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' }, 1.2);
    tl.to(rLeg, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' }, 1.3);

    // 0.4s — Glow dot fades out as character appears
    tl.to(dot, { opacity: 0, scale: 3, duration: 0.6, ease: 'power2.in' }, 0.5);

    // 1.8s — Name container visible + letters appear at scattered positions
    tl.set(nameEl, { opacity: 1 }, 1.8);
    tl.to(letters, { opacity: 1, duration: 0.25, stagger: 0.02 }, 1.8);

    // 2.1s — Letters fly/snap to correct positions
    tl.to(letters, {
      x: 0, y: 0, rotation: 0, scale: 1,
      duration: 0.7, stagger: 0.03, ease: 'back.out(1.4)',
    }, 2.1);

    // 2.9s — Character shrinks and moves up to form logo composition
    tl.to(charWrap, {
      scale: 0.35, y: -15, duration: 0.55, ease: 'power3.inOut',
    }, 2.9);

    // 3.5s — Hold the assembled logo
    tl.to({}, { duration: 0.7 });

    // 4.2s — Elegant exit: fade + slide up
    tl.to(container, {
      yPercent: -100, duration: 0.8, ease: 'power4.inOut',
    }, '>');

    return () => tl.kill();
  }, [stableComplete]);

  // ── Name letter spans ──────────────────────────────────────
  const NAME = 'Abdul Sami';
  const chars = NAME.split('').map((ch, i) =>
    ch === ' ' ? (
      <span key={i} className="il" style={{ display: 'inline-block', width: '0.35em' }}>&nbsp;</span>
    ) : (
      <span key={i} className="il" style={{ display: 'inline-block', willChange: 'transform' }}>{ch}</span>
    )
  );

  return (
    <div
      ref={containerRef}
      id="intro-screen"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        backgroundColor: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '0.8rem',
        pointerEvents: 'none', willChange: 'transform', overflow: 'hidden',
      }}
    >
      {/* Glow dot at bottom */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute', bottom: '12%', left: '50%',
          transform: 'translateX(-50%)',
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 30px 12px rgba(201,112,74,0.5), 0 0 60px 20px rgba(201,112,74,0.2)',
        }}
      />

      {/* Character SVG — wrapper handles scale + position */}
      <div
        ref={charWrapRef}
        style={{ willChange: 'transform', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 200 300"
          width="180"
          height="270"
          style={{ overflow: 'visible', filter: 'drop-shadow(0 0 8px rgba(201,112,74,0.45))' }}
          aria-hidden="true"
        >
          {/* Glow filter */}
          <defs>
            <filter id="gl" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g filter="url(#gl)">
            {/* Head — circle */}
            <path className="dp" data-part="head"
              d="M 78,50 A 22,22 0 1,1 122,50 A 22,22 0 1,1 78,50"
              stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
            {/* Eyes */}
            <circle className="eye" cx="91" cy="46" r="2.5" fill="var(--fg)" />
            <circle className="eye" cx="109" cy="46" r="2.5" fill="var(--fg)" />
            {/* Smile */}
            <path className="dp" data-part="smile"
              d="M 92,57 Q 100,65 108,57"
              stroke="var(--fg)" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Body — organic S-curve */}
            <path className="dp" data-part="body"
              d="M 100,72 C 97,98 104,135 99,172"
              stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
            {/* Left arm — reaching out */}
            <path className="dp" data-part="larm"
              d="M 100,102 C 78,92 52,86 32,112"
              stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
            {/* Right arm — waving up */}
            <path className="dp" data-part="rarm"
              d="M 100,102 C 122,82 150,66 170,82"
              stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
            {/* Left leg */}
            <path className="dp" data-part="lleg"
              d="M 99,172 C 93,200 76,240 58,276"
              stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
            {/* Right leg */}
            <path className="dp" data-part="rleg"
              d="M 99,172 C 107,200 124,240 142,276"
              stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Name — letters scattered then assembled */}
      <div
        ref={nameRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
          fontWeight: 700, fontStyle: 'italic',
          letterSpacing: '-0.02em',
          display: 'flex', alignItems: 'center', gap: 0,
          lineHeight: 1, perspective: '600px',
          background: 'linear-gradient(135deg, var(--fg) 0%, var(--accent) 60%, var(--fg) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}
      >
        {chars}
      </div>
    </div>
  );
};

export default IntroScreen;
