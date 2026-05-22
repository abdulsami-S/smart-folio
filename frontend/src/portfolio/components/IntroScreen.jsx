import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/* ─── WALKING FIGURE (SVG — profile / side view) ─────────────────────────────
 * CSS-animated silhouette in TRUE PROFILE VIEW walking left → right.
 * Arms swing in natural gait (opposite phase to legs, front-to-back).
 * Bright premium gradient stops tailored for the dark loading screen.
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
        0%, 100% { transform: scaleX(0.8); opacity: 0.25; }
        50%       { transform: scaleX(1.1); opacity: 0.12; }
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

    <svg viewBox="0 0 120 160" width="120" height="160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Bright premium gradient — top light to bottom dark */}
        <linearGradient id="figGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffd3b6" stopOpacity="1" />
          <stop offset="60%"  stopColor="#e8a87c" stopOpacity="1" />
          <stop offset="100%" stopColor="#c9704a" stopOpacity="0.8" />
        </linearGradient>
        {/* Darker back-limb gradient */}
        <linearGradient id="figGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#c9704a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#9b3d1e" stopOpacity="0.5"  />
        </linearGradient>
        <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#c9704a" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#c9704a" stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse className="fig-shadow" cx="62" cy="152" rx="26" ry="5" fill="url(#shadowGrad)" />

      {/* ══ Body group ══ */}
      <g className="fig-body" style={{ transformOrigin: '62px 85px' }}>

        {/* ── BACK LEG ── */}
        <g className="fig-leg-r" style={{ transformOrigin: '62px 91px' }}>
          <rect x="57" y="90" width="10" height="28" rx="5" fill="url(#figGradBack)" opacity="0.72" />
          <rect x="57" y="116" width="9" height="22" rx="4" fill="#9b3d1e" opacity="0.60" />
          <g className="fig-foot-r" style={{ transformOrigin: '61px 138px' }}>
            <rect x="56" y="136" width="20" height="7" rx="3" fill="#7a2d0e" opacity="0.65" />
          </g>
        </g>

        {/* ── BACK ARM ── */}
        <g className="fig-arm-l" style={{ transformOrigin: '60px 60px' }}>
          <rect x="56" y="59" width="8" height="22" rx="4" fill="url(#figGradBack)" opacity="0.68" />
          <rect x="56" y="79" width="7" height="18" rx="3" fill="#9b3d1e" opacity="0.55" />
          <ellipse cx="59" cy="99" rx="4" ry="5" fill="#c9704a" opacity="0.55" />
        </g>

        {/* ── TORSO ── */}
        <rect x="52" y="55" width="20" height="38" rx="7" fill="url(#figGrad)" />

        {/* ── HEAD ── */}
        <g className="fig-head" style={{ transformOrigin: '66px 32px' }}>
          <ellipse cx="66" cy="32" rx="13" ry="15" fill="#ffd3b6" />
          <ellipse cx="78" cy="34" rx="3.5" ry="2.5" fill="#e8a87c" />
          <ellipse cx="54" cy="32" rx="3" ry="5" fill="#c9704a" opacity="0.70" />
          <ellipse cx="73" cy="29" rx="1.8" ry="1.8" fill="#381932" opacity="0.75" />
        </g>

        {/* ── NECK ── */}
        <rect x="60" y="46" width="8" height="12" rx="3" fill="#e8a87c" />

        {/* ── FRONT ARM ── */}
        <g className="fig-arm-r" style={{ transformOrigin: '65px 60px' }}>
          <rect x="61" y="59" width="8" height="22" rx="4" fill="#e8a87c" />
          <rect x="62" y="79" width="7" height="18" rx="3" fill="#c9704a" />
          <ellipse cx="65" cy="99" rx="4" ry="5" fill="#ffd3b6" />
        </g>

        {/* ── FRONT LEG ── */}
        <g className="fig-leg-l" style={{ transformOrigin: '62px 91px' }}>
          <rect x="57" y="90" width="10" height="28" rx="5" fill="url(#figGrad)" />
          <ellipse cx="62" cy="110" rx="6" ry="4" fill="#c9704a" opacity="0.45" />
          <rect x="57" y="116" width="9" height="22" rx="4" fill="#ffd3b6" />
          <g className="fig-foot-l" style={{ transformOrigin: '62px 138px' }}>
            <rect x="57" y="136" width="22" height="7" rx="3" fill="#c9704a" />
          </g>
        </g>

      </g>
    </svg>
  </div>
);

/* ─── INTRO SCREEN ────────────────────────────────────────────────────────── */
const IntroScreen = ({ onComplete }) => {
  const containerRef   = useRef(null);
  const cardRef        = useRef(null);
  const welcomeRef     = useRef(null);
  const figureRef      = useRef(null);
  const percentRef     = useRef(null);
  const progressRef    = useRef(null);
  const progressBarRef = useRef(null);
  const stableComplete = useCallback(onComplete, []);

  useEffect(() => {
    const container   = containerRef.current;
    const card        = cardRef.current;
    const welcomeEl   = welcomeRef.current;
    const figure      = figureRef.current;
    const percentEl   = percentRef.current;
    const progressBar = progressBarRef.current;

    if (!container || !card || !welcomeEl || !figure || !percentEl || !progressBar) return;

    // Start everything hidden/offset
    gsap.set(welcomeEl,   { opacity: 0, y: 15 });
    gsap.set(figure,      { opacity: 0, scale: 0.9, y: 15 });
    gsap.set(percentEl,   { opacity: 0, y: 10 });
    gsap.set(progressRef.current, { opacity: 0, y: 10 });
    gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(card,        { opacity: 0, scale: 0.95 });
    
    // Set initial clip path for premium reveal transition
    gsap.set(container, {
      opacity: 1,
      clipPath: 'circle(150% at 50% 50%)',
      WebkitClipPath: 'circle(150% at 50% 50%)',
    });

    // Slow floating animations for background ambient lights
    const anim1 = gsap.to('.ambient-light-1', {
      x: '15vw',
      y: '10vh',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    const anim2 = gsap.to('.ambient-light-2', {
      x: '-12vw',
      y: '-8vh',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        stableComplete();
      }
    });

    // t=0s — Fade & scale in the glassmorphic container
    tl.to(card, {
      opacity: 1, scale: 1,
      duration: 0.8, ease: 'power3.out',
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

    // t=0.6s — Fade & slide in percent + progress bar
    tl.to([percentEl, progressRef.current], {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power3.out',
    }, 0.6);

    // t=0.6s → 3.3s — Percentage ticks 0 → 100
    tl.to(counter, {
      val: 100,
      duration: 2.7,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (percentEl) percentEl.textContent = Math.round(counter.val);
      },
    }, 0.6);

    // Progress bar fills in sync
    tl.to(progressBar, {
      scaleX: 1,
      duration: 2.7,
      ease: 'power2.inOut',
    }, 0.6);

    // t=3.3s — Hold at 100% briefly
    tl.to({}, { duration: 0.4 }, 3.3);

    // t=3.7s — Scale down and fade out the center card (anticipation)
    tl.to(card, {
      scale: 0.92,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut',
    }, 3.7);

    // t=3.9s — Premium clip-path circular contraction (iris transition) to reveal site
    tl.to(container, {
      clipPath: 'circle(0% at 50% 50%)',
      WebkitClipPath: 'circle(0% at 50% 50%)',
      duration: 1.1,
      ease: 'power4.inOut',
    }, 3.9);

    return () => {
      tl.kill();
      anim1.kill();
      anim2.kill();
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
        backgroundColor: '#0c050d',        /* Cinematic deep dark plum background */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Floating dynamic background glow 1 */}
      <div
        className="ambient-light-1"
        style={{
          position: 'absolute',
          top: '5%',
          left: '10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,112,74,0.14) 0%, transparent 75%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating dynamic background glow 2 */}
      <div
        className="ambient-light-2"
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,168,124,0.08) 0%, transparent 75%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Glassmorphic Loader Container ── */}
      <div
        ref={cardRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '3rem 3.5rem',
          borderRadius: '28px',
          border: '1px solid rgba(255, 243, 230, 0.05)',
          background: 'linear-gradient(135deg, rgba(255,243,230,0.03) 0%, rgba(255,243,230,0.01) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative',
          zIndex: 2,
          maxWidth: '90%',
          width: '380px',
        }}
      >
        {/* ── Welcome text ── */}
        <div style={{ overflow: 'hidden', marginBottom: '1.5rem', width: '100%' }}>
          <p
            ref={welcomeRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'rgba(255,243,230,0.85)',
              textAlign: 'center',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            Hello, welcome to <span style={{ color: '#e8a87c', fontWeight: 500 }}>Abdul Sami&apos;s</span> portfolio!
          </p>
        </div>

        {/* ── Walking Figure centerpiece ── */}
        <div ref={figureRef} style={{ marginBottom: '1.8rem' }}>
          <WalkingFigure />
        </div>

        {/* ── Percentage counter ── */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '1rem' }}>
          <span
            ref={percentRef}
            style={{
              fontFamily: 'monospace',
              fontSize: '2.4rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#fff3e6',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            0
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent)' }}>%</span>
        </div>

        {/* ── Progress track + bar ── */}
        <div
          ref={progressRef}
          style={{
            position: 'relative',
            width: '200px',
            height: '2px',
            backgroundColor: 'rgba(255,243,230,0.06)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #9b3d1e, #c9704a, #e8a87c, #ffffff)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;