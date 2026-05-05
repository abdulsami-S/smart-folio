import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * IntroScreen — Premium developer-logo reveal splash.
 *
 * Sequence (~4s):
 *  1. Dark screen → small glowing </> icon at bottom draws via SVG stroke
 *  2. Icon grows upward toward center as it finishes drawing
 *  3. Letters of "Welcome to my Portfolio" appear scattered, then fly & snap into position
 *  4. Everything assembles: icon above, text below — centered logo
 *  5. Hold ~1s → elegant fade-out → homepage
 */
const IntroScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const iconWrapRef = useRef(null);
  const svgRef = useRef(null);
  const textRef = useRef(null);
  const dotRef = useRef(null);

  const stableComplete = useCallback(onComplete, []);

  useEffect(() => {
    const container = containerRef.current;
    const iconWrap = iconWrapRef.current;
    const svg = svgRef.current;
    const textEl = textRef.current;
    const dot = dotRef.current;
    if (!container || !svg || !textEl) return;

    const drawPaths = svg.querySelectorAll('.dp');
    const letters = textEl.querySelectorAll('.il');

    // Prepare stroke-dashoffset for all drawable paths
    drawPaths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    // Initial states
    gsap.set(iconWrap, { y: '38vh', scale: 0.15, opacity: 0 });
    gsap.set(dot, { opacity: 0, scale: 0.5 });
    gsap.set(textEl, { opacity: 0 });

    // Scatter letters randomly
    letters.forEach((l) => {
      gsap.set(l, {
        x: gsap.utils.random(-400, 400),
        y: gsap.utils.random(-250, 250),
        rotation: gsap.utils.random(-180, 180),
        scale: gsap.utils.random(0.2, 2.0),
        opacity: 0,
      });
    });

    // Classify SVG parts
    const leftBracket = svg.querySelector('[data-part="left-bracket"]');
    const rightBracket = svg.querySelector('[data-part="right-bracket"]');
    const slash = svg.querySelector('[data-part="slash"]');

    // ── Master Timeline ──────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('intro_shown', 'true');
        stableComplete();
      },
    });

    // 0.0s — Glow dot fades in at bottom
    tl.to(dot, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0);

    // 0.1s — Icon wrapper fades in
    tl.to(iconWrap, { opacity: 1, duration: 0.25, ease: 'power2.in' }, 0.1);

    // 0.2s–1.6s — Icon grows from bottom-small to center-large
    tl.to(iconWrap, { y: 0, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.2);

    // 0.2s — Left bracket < draws
    tl.to(leftBracket, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 0.2);

    // 0.5s — Slash / draws
    tl.to(slash, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, 0.5);

    // 0.7s — Right bracket > draws
    tl.to(rightBracket, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 0.7);

    // 0.5s — Glow dot fades out as icon takes over
    tl.to(dot, { opacity: 0, scale: 3, duration: 0.6, ease: 'power2.in' }, 0.5);

    // 1.6s — Text container visible + letters appear at scattered positions
    tl.set(textEl, { opacity: 1 }, 1.6);
    tl.to(letters, { opacity: 1, duration: 0.25, stagger: 0.015 }, 1.6);

    // 1.9s — Letters fly/snap to correct positions
    tl.to(letters, {
      x: 0, y: 0, rotation: 0, scale: 1,
      duration: 0.7, stagger: 0.02, ease: 'back.out(1.4)',
    }, 1.9);

    // 2.7s — Icon shrinks slightly and nudges up to form the logo composition
    tl.to(iconWrap, {
      scale: 0.7, y: -10, duration: 0.5, ease: 'power3.inOut',
    }, 2.7);

    // 3.2s — Hold the assembled logo
    tl.to({}, { duration: 1.0 });

    // 4.2s — Elegant exit: fade + slide up
    tl.to(container, {
      yPercent: -100, duration: 0.7, ease: 'power4.inOut',
    }, '>');

    return () => tl.kill();
  }, [stableComplete]);

  // ── Letter spans ───────────────────────────────────────────
  const TEXT = 'Welcome to my Portfolio';
  const chars = TEXT.split('').map((ch, i) =>
    ch === ' ' ? (
      <span key={i} className="il" style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
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
        gap: '1.2rem',
        pointerEvents: 'none', willChange: 'transform', overflow: 'hidden',
      }}
    >
      {/* Glow dot at bottom */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute', bottom: '10%', left: '50%',
          transform: 'translateX(-50%)',
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 30px 12px rgba(201,112,74,0.5), 0 0 60px 20px rgba(201,112,74,0.2)',
        }}
      />

      {/* Developer </> Icon — draws via SVG stroke animation */}
      <div
        ref={iconWrapRef}
        style={{
          willChange: 'transform',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 200 160"
          width="140"
          height="112"
          style={{
            overflow: 'visible',
            filter: 'drop-shadow(0 0 10px rgba(201,112,74,0.4))',
          }}
          aria-hidden="true"
        >
          <defs>
            <filter id="icon-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#icon-glow)">
            {/* < — left angle bracket */}
            <path
              className="dp"
              data-part="left-bracket"
              d="M 70,20 L 20,80 L 70,140"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* / — forward slash */}
            <path
              className="dp"
              data-part="slash"
              d="M 115,15 L 85,145"
              stroke="var(--fg)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* > — right angle bracket */}
            <path
              className="dp"
              data-part="right-bracket"
              d="M 130,20 L 180,80 L 130,140"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </svg>
      </div>

      {/* Text — letters scattered then assembled */}
      <div
        ref={textRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
          fontWeight: 600,
          fontStyle: 'italic',
          letterSpacing: '0.02em',
          display: 'flex', alignItems: 'center', gap: 0,
          lineHeight: 1,
          perspective: '600px',
          background: 'linear-gradient(135deg, var(--fg) 0%, var(--accent) 50%, var(--fg) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {chars}
      </div>
    </div>
  );
};

export default IntroScreen;
