import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * IntroScreen — plays once per tab session (sessionStorage gate).
 * SVG </> icon drawn live with stroke-dashoffset, name letters fly in,
 * then the whole screen slides upward to reveal the portfolio.
 *
 * @param {function} onComplete — called when animation finishes
 */
const IntroScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const svgRef       = useRef(null);
  const taglineRef   = useRef(null);
  const nameRef      = useRef(null);

  useEffect(() => {
    // ── Session gate ─────────────────────────────────────────
    if (sessionStorage.getItem('intro_shown')) {
      onComplete();
      return;
    }

    const paths   = svgRef.current.querySelectorAll('path');
    const letters = nameRef.current.querySelectorAll('.intro-letter');

    // Prepare SVG stroke-draw state
    paths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
      path.style.fill = 'none';
    });

    // ── Master timeline ───────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('intro_shown', 'true');
        onComplete();
      },
    });

    // 1. Draw each SVG path stroke — one by one
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 0.35,
      stagger: 0.18,
      ease: 'power2.inOut',
    }, 0.1)

    // 2. Subtle scale pulse on the icon after drawing
    .to(svgRef.current, {
      scale: 1.08,
      duration: 0.25,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    }, '>-0.1')

    // 3. Tagline fades in
    .fromTo(taglineRef.current,
      { opacity: 0, y: 10, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
      '>-0.1'
    )

    // 4. Name letters fly in — staggered
    .fromTo(letters,
      { opacity: 0, y: 28, rotateX: -60, filter: 'blur(8px)' },
      {
        opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
        duration: 0.55, stagger: 0.055, ease: 'power4.out',
        transformOrigin: 'center bottom',
        transformPerspective: 500,
      },
      '>-0.15'
    )

    // 5. Hold — let it breathe
    .to({}, { duration: 0.9 })

    // 6. Slide the entire intro screen upward off-screen
    .to(containerRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
    });

  }, [onComplete]);

  // Name split into spans
  const NAME = 'Abdul Sami';
  const chars = NAME.split('').map((ch, i) =>
    ch === ' '
      ? <span key={i} className="intro-letter" style={{ display: 'inline-block', width: '0.5em' }}>&nbsp;</span>
      : <span key={i} className="intro-letter" style={{ display: 'inline-block' }}>{ch}</span>
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.6rem',
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      {/* ── Code icon  </>  ── */}
      <svg
        ref={svgRef}
        viewBox="0 0 130 72"
        width="110"
        height="62"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* Left bracket  < */}
        <path
          d="M 34 8 L 6 36 L 34 64"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Slash  / */}
        <path
          d="M 72 6 L 50 66"
          stroke="var(--fg)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Right bracket  > */}
        <path
          d="M 96 8 L 124 36 L 96 64"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ── Tagline ── */}
      <p
        ref={taglineRef}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--fg-40)',
          margin: '-0.6rem 0 0',
          opacity: 0,
        }}
      >
        Full Stack Developer &nbsp;·&nbsp; AI Enthusiast
      </p>

      {/* ── Name ── */}
      <div
        ref={nameRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
          fontWeight: 700,
          fontStyle: 'italic',
          letterSpacing: '-0.02em',
          color: 'var(--fg)',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--fg) 0%, var(--accent) 60%, var(--fg) 100%)',
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
