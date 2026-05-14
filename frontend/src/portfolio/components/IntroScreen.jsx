import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/* ─── WALKING FIGURE (SVG — profile / side view) ─────────────────────────────
 * CSS-animated silhouette in TRUE PROFILE VIEW walking left → right.
 * Arms swing in natural gait (opposite phase to legs, front-to-back).
 * Warm orange gradient (#e8a87c → #c9704a → #9b3d1e) on cream background.
 * ──────────────────────────────────────────────────────────────────────────── */
const WalkingFigure = () => (
  <div style={{ position: 'relative', width: '120px', height: '160px' }}>
    <style>{`
      /* Body bob — torso gently rises/falls each step */
      @keyframes body-bob {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-4px); }
      }

      /* ── LEGS — swing forward/back in the sagittal (walking) plane ── */
      /* Left leg: starts forward, swings back */
      @keyframes leg-left {
        0%   { transform: rotate(-30deg); }
        50%  { transform: rotate(30deg);  }
        100% { transform: rotate(-30deg); }
      }
      /* Right leg: opposite phase (starts back) */
      @keyframes leg-right {
        0%   { transform: rotate(30deg);  }
        50%  { transform: rotate(-30deg); }
        100% { transform: rotate(30deg);  }
      }

      /* ── ARMS — natural gait: swing opposite to legs ── */
      /* Left arm: starts back when left leg is forward */
      @keyframes arm-left {
        0%   { transform: rotate(25deg);  }
        50%  { transform: rotate(-25deg); }
        100% { transform: rotate(25deg);  }
      }
      /* Right arm: starts forward when right leg is back */
      @keyframes arm-right {
        0%   { transform: rotate(-25deg); }
        50%  { transform: rotate(25deg);  }
        100% { transform: rotate(-25deg); }
      }

      /* ── HEAD — subtle forward-lean bob ── */
      @keyframes head-lean {
        0%, 100% { transform: rotate(-3deg); }
        50%       { transform: rotate(3deg);  }
      }

      /* ── FEET — flatten on ground contact ── */
      @keyframes foot-left {
        0%   { transform: rotate(12deg);  }
        50%  { transform: rotate(-8deg);  }
        100% { transform: rotate(12deg);  }
      }
      @keyframes foot-right {
        0%   { transform: rotate(-8deg);  }
        50%  { transform: rotate(12deg);  }
        100% { transform: rotate(-8deg);  }
      }

      /* Shadow pulses with stride */
      @keyframes shadow-pulse {
        0%, 100% { transform: scaleX(0.8); opacity: 0.18; }
        50%       { transform: scaleX(1.1); opacity: 0.09; }
      }

      .fig-body   { animation: body-bob   0.55s ease-in-out infinite; }
      .fig-leg-l  { animation: leg-left   0.55s ease-in-out infinite; transform-origin: top center; }
      .fig-leg-r  { animation: leg-right  0.55s ease-in-out infinite; transform-origin: top center; }
      .fig-arm-l  { animation: arm-left   0.55s ease-in-out infinite; transform-origin: top center; }
      .fig-arm-r  { animation: arm-right  0.55s ease-in-out infinite; transform-origin: top center; }
      .fig-head   { animation: head-lean  0.55s ease-in-out infinite; transform-origin: bottom center; }
      .fig-foot-l { animation: foot-left  0.55s ease-in-out infinite; transform-origin: top center; }
      .fig-foot-r { animation: foot-right 0.55s ease-in-out infinite; transform-origin: top center; }
      .fig-shadow { animation: shadow-pulse 0.55s ease-in-out infinite; transform-origin: center; }
    `}</style>

    {/*
      ── Profile-view walking figure ──────────────────────────────────────────
      The figure faces RIGHT. All limbs are drawn in the sagittal plane so the
      figure clearly reads as "walking sideways".

      Coordinate layout (viewBox 0 0 120 160):
        Head center : (68, 34)   — offset right to show profile facing right
        Torso       : (54, 55–90)
        Arms attach : shoulder at (60, 58)
        Legs attach : hip at (60, 90)
    */}
    <svg viewBox="0 0 120 160" width="120" height="160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Warm gradient — top light to bottom dark, matches accent palette */}
        <linearGradient id="figGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#e8a87c" stopOpacity="1" />
          <stop offset="60%"  stopColor="#c9704a" stopOpacity="1" />
          <stop offset="100%" stopColor="#9b3d1e" stopOpacity="0.7" />
        </linearGradient>
        {/* Darker back-limb gradient */}
        <linearGradient id="figGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#c9704a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#9b3d1e" stopOpacity="0.5"  />
        </linearGradient>
        <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#c9704a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c9704a" stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse className="fig-shadow" cx="62" cy="152" rx="26" ry="5"
        fill="url(#shadowGrad)" />

      {/* ══ Body group (bobs up/down as a unit) ═══════════════════════════ */}
      <g className="fig-body" style={{ transformOrigin: '62px 85px' }}>

        {/* ── BACK LEG (right leg, rendered behind torso) ── */}
        <g className="fig-leg-r" style={{ transformOrigin: '62px 91px' }}>
          {/* Upper back-leg */}
          <rect x="57" y="90" width="10" height="28" rx="5"
            fill="url(#figGradBack)" opacity="0.72" />
          {/* Lower back-leg */}
          <rect x="57" y="116" width="9" height="22" rx="4"
            fill="#9b3d1e" opacity="0.60" />
          {/* Back foot */}
          <g className="fig-foot-r" style={{ transformOrigin: '61px 138px' }}>
            <rect x="56" y="136" width="20" height="7" rx="3"
              fill="#7a2d0e" opacity="0.65" />
          </g>
        </g>

        {/* ── BACK ARM (left arm, rendered behind torso) ── */}
        {/*
          Arm attaches at shoulder (60, 60). Drawn as two segments
          hanging DOWN and slightly back (profile — no upward raise).
        */}
        <g className="fig-arm-l" style={{ transformOrigin: '60px 60px' }}>
          {/* Upper back-arm — hangs downward from shoulder */}
          <rect x="56" y="59" width="8" height="22" rx="4"
            fill="url(#figGradBack)" opacity="0.68" />
          {/* Forearm segment */}
          <rect x="56" y="79" width="7" height="18" rx="3"
            fill="#9b3d1e" opacity="0.55" />
          {/* Hand */}
          <ellipse cx="59" cy="99" rx="4" ry="5"
            fill="#c9704a" opacity="0.55" />
        </g>

        {/* ── TORSO (profile — slightly angled rectangle) ── */}
        <rect x="52" y="55" width="20" height="38" rx="7"
          fill="url(#figGrad)" />

        {/* ── HEAD (profile — egg shape facing right) ── */}
        <g className="fig-head" style={{ transformOrigin: '66px 32px' }}>
          {/* Skull */}
          <ellipse cx="66" cy="32" rx="13" ry="15"
            fill="#e8a87c" />
          {/* Nose — small protrusion to right, reinforces "facing right" */}
          <ellipse cx="78" cy="34" rx="3.5" ry="2.5"
            fill="#d4855a" />
          {/* Ear — on left side of head (far side in profile) */}
          <ellipse cx="54" cy="32" rx="3" ry="5"
            fill="#c9704a" opacity="0.70" />
          {/* Eye — just a small dot */}
          <ellipse cx="73" cy="29" rx="1.8" ry="1.8"
            fill="#381932" opacity="0.75" />
        </g>

        {/* ── NECK ── */}
        <rect x="60" y="46" width="8" height="12" rx="3"
          fill="#d4855a" />

        {/* ── FRONT ARM (right arm, rendered in front of torso) ── */}
        <g className="fig-arm-r" style={{ transformOrigin: '65px 60px' }}>
          {/* Upper front-arm */}
          <rect x="61" y="59" width="8" height="22" rx="4"
            fill="#c9704a" />
          {/* Forearm */}
          <rect x="62" y="79" width="7" height="18" rx="3"
            fill="#b85e38" />
          {/* Hand */}
          <ellipse cx="65" cy="99" rx="4" ry="5"
            fill="#d4855a" />
        </g>

        {/* ── FRONT LEG (left leg, rendered in front of back leg) ── */}
        <g className="fig-leg-l" style={{ transformOrigin: '62px 91px' }}>
          {/* Upper front-leg */}
          <rect x="57" y="90" width="10" height="28" rx="5"
            fill="url(#figGrad)" />
          {/* Knee highlight */}
          <ellipse cx="62" cy="110" rx="6" ry="4"
            fill="#b85e38" opacity="0.45" />
          {/* Lower front-leg */}
          <rect x="57" y="116" width="9" height="22" rx="4"
            fill="#c9704a" />
          {/* Front foot */}
          <g className="fig-foot-l" style={{ transformOrigin: '62px 138px' }}>
            <rect x="57" y="136" width="22" height="7" rx="3"
              fill="#9b3d1e" />
          </g>
        </g>

      </g>{/* end body group */}
    </svg>
  </div>
);

/* ─── INTRO SCREEN ────────────────────────────────────────────────────────── */
const IntroScreen = ({ onComplete }) => {
  const containerRef   = useRef(null);
  const welcomeRef     = useRef(null);   // welcome text
  const figureRef      = useRef(null);
  const percentRef     = useRef(null);
  const progressRef    = useRef(null);
  const progressBarRef = useRef(null);
  const stableComplete = useCallback(onComplete, []);

  useEffect(() => {
    const container   = containerRef.current;
    const welcomeEl   = welcomeRef.current;
    const figure      = figureRef.current;
    const percentEl   = percentRef.current;
    const progressBar = progressBarRef.current;

    if (!container || !welcomeEl || !figure || !percentEl || !progressBar) return;

    // Start everything hidden
    gsap.set(welcomeEl,   { opacity: 0 });
    gsap.set(figure,      { opacity: 0, y: 20 });
    gsap.set(percentEl,   { opacity: 0 });
    gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(container,   { opacity: 1 });

    // Percentage counter object
    const counter = { val: 0 };

    const tl = gsap.timeline({ onComplete: stableComplete });

    // t=0 — welcome text fades in first
    tl.to(welcomeEl, {
      opacity: 1, duration: 0.5, ease: 'power2.out',
    }, 0);

    // t=0.3s — figure fades in from below
    tl.to(figure, {
      opacity: 1, y: 0,
      duration: 0.7, ease: 'power3.out',
    }, 0.3);

    // t=0.5s — percent counter fades in
    tl.to(percentEl, {
      opacity: 1, duration: 0.4, ease: 'power2.out',
    }, 0.5);

    // t=0.5s → 3.2s — counter ticks 0 → 100
    tl.to(counter, {
      val: 100,
      duration: 2.7,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (percentEl) percentEl.textContent = `${Math.round(counter.val)}%`;
      },
    }, 0.5);

    // Progress bar fills in sync with counter
    tl.to(progressBar, {
      scaleX: 1,
      duration: 2.7,
      ease: 'power1.inOut',
    }, 0.5);

    // t=3.2s — brief hold at 100%
    tl.to({}, { duration: 0.4 }, 3.2);

    // t=3.6s — figure floats up and fades
    tl.to(figure, {
      y: -30, opacity: 0,
      duration: 0.6, ease: 'power2.in',
    }, 3.6);

    // t=3.6s — welcome text + percent + bar fade together
    tl.to([welcomeEl, percentEl, progressRef.current], {
      opacity: 0, duration: 0.4, ease: 'power2.in',
    }, 3.6);

    // t=3.9s — whole screen fades to reveal portfolio
    tl.to(container, {
      opacity: 0,
      duration: 0.55, ease: 'power2.inOut',
    }, 3.9);

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
        backgroundColor: '#fff3e6',          /* cream — always, regardless of theme */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow behind figure — depth cue on cream bg */}
      <div style={{
        position: 'absolute',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,112,74,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Welcome text (fades in first, fades out at end) ── */}
      <div
        ref={welcomeRef}
        style={{
          fontFamily: 'var(--font-body)',                 /* Inter */
          fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
          fontWeight: 400,
          letterSpacing: '0.04em',
          color: '#381932',                               /* dark purple, readable on cream */
          marginBottom: '2rem',
          position: 'relative', zIndex: 1,
          textAlign: 'center',
        }}
      >
        Hello, welcome to Abdul Sami&apos;s portfolio!
      </div>

      {/* ── Walking Figure ── */}
      <div ref={figureRef} style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
        <WalkingFigure />
      </div>

      {/* ── Percentage counter ── */}
      <div
        ref={percentRef}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: '#381932',                               /* dark purple — readable on cream */
          marginBottom: '0.9rem',
          position: 'relative', zIndex: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        0%
      </div>

      {/* ── Progress track + bar ── */}
      <div
        ref={progressRef}
        style={{
          position: 'relative', zIndex: 1,
          width: '80px',
          height: '1px',
          backgroundColor: 'rgba(56,25,50,0.10)',         /* faint purple track on cream */
          overflow: 'hidden',
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #9b3d1e, #c9704a, #e8a87c)',  /* warm orange fill */
            transformOrigin: 'left center',
          }}
        />
      </div>
    </div>
  );
};

export default IntroScreen;