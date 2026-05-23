import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/* ─── MINIMAL WALKING FIGURE (SVG) ──────────────────────────────────────────
 * Clean silhouette walking loop.
 * Adapts dynamically using the site's CSS variable tokens.
 * ──────────────────────────────────────────────────────────────────────────── */
const WalkingFigure = () => (
  <div style={{ position: 'relative', width: '100px', height: '140px' }}>
    <style>{`
      @keyframes body-bob {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-3px); }
      }
      @keyframes leg-left {
        0%   { transform: rotate(-25deg); }
        50%  { transform: rotate(25deg);  }
        100% { transform: rotate(-25deg); }
      }
      @keyframes leg-right {
        0%   { transform: rotate(25deg);  }
        50%  { transform: rotate(-25deg); }
        100% { transform: rotate(25deg);  }
      }
      @keyframes arm-left {
        0%   { transform: rotate(20deg);  }
        50%  { transform: rotate(-20deg); }
        100% { transform: rotate(20deg);  }
      }
      @keyframes arm-right {
        0%   { transform: rotate(-20deg); }
        50%  { transform: rotate(20deg);  }
        100% { transform: rotate(-20deg); }
      }
      @keyframes head-lean {
        0%, 100% { transform: rotate(-2deg); }
        50%       { transform: rotate(2deg);  }
      }

      .fig-body   { animation: body-bob   0.6s ease-in-out infinite; }
      .fig-leg-l  { animation: leg-left   0.6s ease-in-out infinite; transform-origin: top center; }
      .fig-leg-r  { animation: leg-right  0.6s ease-in-out infinite; transform-origin: top center; }
      .fig-arm-l  { animation: arm-left   0.6s ease-in-out infinite; transform-origin: top center; }
      .fig-arm-r  { animation: arm-right  0.6s ease-in-out infinite; transform-origin: top center; }
      .fig-head   { animation: head-lean  0.6s ease-in-out infinite; transform-origin: bottom center; }
    `}</style>

    <svg viewBox="0 0 120 160" width="100" height="140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="figGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="var(--accent-light)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
        <linearGradient id="figGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--accent-dark)" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* ══ Body group ══ */}
      <g className="fig-body" style={{ transformOrigin: '62px 85px' }}>

        {/* BACK LEG */}
        <g className="fig-leg-r" style={{ transformOrigin: '62px 91px' }}>
          <rect x="57" y="90" width="10" height="28" rx="5" fill="url(#figGradBack)" />
          <rect x="57" y="116" width="9" height="22" rx="4" fill="var(--accent-dark)" opacity="0.6" />
        </g>

        {/* BACK ARM */}
        <g className="fig-arm-l" style={{ transformOrigin: '60px 60px' }}>
          <rect x="56" y="59" width="8" height="22" rx="4" fill="url(#figGradBack)" />
        </g>

        {/* TORSO */}
        <rect x="52" y="55" width="20" height="38" rx="7" fill="url(#figGrad)" />

        {/* HEAD */}
        <g className="fig-head" style={{ transformOrigin: '66px 32px' }}>
          <ellipse cx="66" cy="32" rx="13" ry="15" fill="var(--accent-light)" />
          <ellipse cx="78" cy="34" rx="3.5" ry="2.5" fill="var(--accent)" />
          <ellipse cx="73" cy="29" rx="1.8" ry="1.8" fill="var(--accent-dark)" opacity="0.8" />
        </g>

        {/* NECK */}
        <rect x="60" y="46" width="8" height="12" rx="3" fill="var(--accent-light)" />

        {/* FRONT ARM */}
        <g className="fig-arm-r" style={{ transformOrigin: '65px 60px' }}>
          <rect x="61" y="59" width="8" height="22" rx="4" fill="var(--accent-light)" />
          <rect x="62" y="79" width="7" height="18" rx="3" fill="var(--accent)" />
        </g>

        {/* FRONT LEG */}
        <g className="fig-leg-l" style={{ transformOrigin: '62px 91px' }}>
          <rect x="57" y="90" width="10" height="28" rx="5" fill="url(#figGrad)" />
          <rect x="57" y="116" width="9" height="22" rx="4" fill="var(--accent-light)" />
        </g>

      </g>
    </svg>
  </div>
);

/* ─── DECENT & SOPHISTICATED INTRO SCREEN ────────────────────────────────── */
const IntroScreen = ({ onComplete }) => {
  const containerRef   = useRef(null);
  const contentRef     = useRef(null);
  const welcomeRef     = useRef(null);
  const figureRef      = useRef(null);
  const percentRef     = useRef(null);
  const progressRef    = useRef(null);
  const progressBarRef = useRef(null);
  const stableComplete = useCallback(onComplete, []);

  useEffect(() => {
    const container   = containerRef.current;
    const content     = contentRef.current;
    const welcomeEl   = welcomeRef.current;
    const figure      = figureRef.current;
    const percentEl   = percentRef.current;
    const progressBar = progressBarRef.current;

    if (!container || !content || !welcomeEl || !figure || !percentEl || !progressBar) return;

    // Set initial animations states
    gsap.set(welcomeEl,   { opacity: 0, y: 15 });
    gsap.set(figure,      { opacity: 0, scale: 0.96, y: 10 });
    gsap.set(percentEl,   { opacity: 0, y: 10 });
    gsap.set(progressRef.current, { opacity: 0 });
    gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(content,     { opacity: 0 });
    gsap.set(container,   { yPercent: 0 });

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        stableComplete();
      }
    });

    // t=0s — Fade in the content area gently
    tl.to(content, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, 0);

    // t=0.2s — Slide up and fade in welcome text
    tl.to(welcomeEl, {
      opacity: 1, y: 0,
      duration: 0.8, ease: 'power3.out',
    }, 0.2);

    // t=0.4s — Scale and fade in walking figure
    tl.to(figure, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.8, ease: 'power3.out',
    }, 0.4);

    // t=0.6s — Fade in percentage and progress track
    tl.to([percentEl, progressRef.current], {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power3.out',
    }, 0.6);

    // t=0.6s → 3.2s — Percentage ticks 0 → 100
    tl.to(counter, {
      val: 100,
      duration: 2.6,
      ease: 'power2.out',
      onUpdate: () => {
        if (percentEl) percentEl.textContent = Math.round(counter.val);
      },
    }, 0.6);

    // Progress bar fills in sync
    tl.to(progressBar, {
      scaleX: 1,
      duration: 2.6,
      ease: 'power2.out',
    }, 0.6);

    // t=3.2s — Hold at 100% briefly
    tl.to({}, { duration: 0.3 }, 3.2);

    // t=3.5s — Fade out inner content slightly as transition anticipation
    tl.to(content, {
      opacity: 0,
      y: -20,
      duration: 0.55,
      ease: 'power3.inOut',
    }, 3.5);

    // t=3.6s — Smooth, hardware-accelerated slide-up reveal of the home page
    tl.to(container, {
      yPercent: -100,
      duration: 1.15,
      ease: 'power4.inOut',
    }, 3.6);

    return () => {
      tl.kill();
    };
  }, [stableComplete]);

  return (
    <div
      ref={containerRef}
      id="intro-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'var(--bg)', /* Match the site background exactly */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial ambient gradient background matching the site's accent token */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(201, 112, 74, 0.03) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Minimalist Content Layout ── */}
      <div
        ref={contentRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          width: '320px',
        }}
      >
        {/* Welcome greeting */}
        <div style={{ overflow: 'hidden', marginBottom: '2rem', width: '100%' }}>
          <p
            ref={welcomeRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 400,
              letterSpacing: '0.03em',
              color: 'var(--fg)',
              opacity: 0.85,
              textAlign: 'center',
              lineHeight: '1.4',
              margin: 0,
            }}
          >
            Welcome to <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--accent-light)', fontWeight: 500 }}>Abdul Sami&apos;s</span> portfolio
          </p>
        </div>

        {/* Walking Figure centerpiece */}
        <div ref={figureRef} style={{ marginBottom: '2rem' }}>
          <WalkingFigure />
        </div>

        {/* Percentage counter */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '1.2rem' }}>
          <span
            ref={percentRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--fg)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            0
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--accent-light)', opacity: 0.8 }}>%</span>
        </div>

        {/* 1px Minimalist Progress Line */}
        <div
          ref={progressRef}
          style={{
            position: 'relative',
            width: '180px',
            height: '1px',
            backgroundColor: 'var(--fg-10)',
            overflow: 'hidden',
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--accent)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;