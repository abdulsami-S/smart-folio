// import React, { useEffect, useRef, useContext, useState } from 'react';
// import { gsap } from 'gsap';
// import { Download, ChevronRight, MapPin, Sparkles, ArrowDown } from 'lucide-react';
// import { ThemeContext } from '../../context/ThemeContext';
// import { FALLBACK_PROJECTS } from '../data/projects';

// /* ─── Magnetic Button ─────────────────────────────────────────────────────────
//  * Subtle magnetic hover effect — the button gently drifts toward the cursor
//  * when within RADIUS pixels. Pull strength is very low (0.10) and translation
//  * is clamped to MAX_DRIFT px so adjacent buttons can never collide.
//  * The inner text moves a tiny counter-direction for a soft parallax feel.
//  * ─────────────────────────────────────────────────────────────────────────── */
// const MagneticBtn = ({ children, className, style, href, target, rel }) => {
//   const wrapRef  = useRef(null); // the outer <a> element that physically moves
//   const innerRef = useRef(null); // inner span — moves opposite for depth illusion
//   const isActive = useRef(false);

//   // Distance (px) from button center at which the magnetic field begins
//   const RADIUS = 80;

//   // Pull multiplier — kept very gentle for a subtle, elegant attraction
//   const PULL_STRENGTH = 0.10;

//   // Hard cap (px) — ensures buttons never drift more than this, preventing overlap
//   const MAX_DRIFT = 15;

//   useEffect(() => {
//     const wrap  = wrapRef.current;
//     const inner = innerRef.current;
//     if (!wrap || !inner) return;

//     const onMouseMove = (e) => {
//       const rect = wrap.getBoundingClientRect();

//       // Distance from cursor to button center
//       const dx   = e.clientX - (rect.left + rect.width  / 2);
//       const dy   = e.clientY - (rect.top  + rect.height / 2);
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       if (dist < RADIUS) {
//         isActive.current = true;

//         // strength: 0 at the edge of the field, 1 at the center
//         const strength = Math.max(0, 1 - dist / RADIUS);

//         // How far the button drifts — clamped so it never exceeds MAX_DRIFT
//         const clamp = (v, max) => Math.max(-max, Math.min(max, v));
//         const pullX = clamp(dx * PULL_STRENGTH, MAX_DRIFT);
//         const pullY = clamp(dy * PULL_STRENGTH, MAX_DRIFT);

//         // Animate button wrapper — very gentle drift + barely-there 3D tilt
//         gsap.to(wrap, {
//           x: pullX,
//           y: pullY,
//           scale: 1 + strength * 0.03,            // very subtle scale bump
//           rotateX: (-dy / RADIUS) * 3,           // barely perceptible tilt
//           rotateY:  (dx / RADIUS) * 3,
//           boxShadow: `0 ${4 + strength * 8}px ${10 + strength * 14}px rgba(201,112,74,${0.06 + strength * 0.12})`,
//           duration: 0.5,
//           ease: 'power2.out',
//           transformPerspective: 600,
//         });

//         // Inner text counter-moves very slightly — subtle depth parallax
//         gsap.to(inner, {
//           x: -dx * 0.02,
//           y: -dy * 0.02,
//           duration: 0.5,
//           ease: 'power2.out',
//         });

//       } else if (isActive.current) {
//         // Cursor left the field — spring back to resting position
//         isActive.current = false;
//         gsap.to(wrap, {
//           x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0,
//           boxShadow: '0 0 0 rgba(201,112,74,0)',
//           duration: 0.7,
//           ease: 'elastic.out(1.1, 0.4)',
//           transformPerspective: 600,
//         });
//         gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1.1, 0.4)' });
//       }
//     };

//     window.addEventListener('mousemove', onMouseMove);
//     return () => window.removeEventListener('mousemove', onMouseMove);
//   }, []);

//   return (
//     <a
//       ref={wrapRef}
//       href={href}
//       target={target}
//       rel={rel}
//       className={className}
//       style={{ ...style, display: 'inline-flex', willChange: 'transform' }}
//     >
//       <span
//         ref={innerRef}
//         style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', willChange: 'transform' }}
//       >
//         {children}
//       </span>
//     </a>
//   );
// };

// /* ─── Particle Trail Canvas ───────────────────────────────────────────────────
//  * Draws a very light, elegant sparkle trail that follows the cursor.
//  * Design decisions for a premium, minimal feel:
//  *  - Max 1 particle per frame — whisper-thin trail, never a fireworks show
//  *  - Tiny particle radius 0.5–1.5px — barely visible dots of light
//  *  - Aggressive decay (0.04–0.07) so particles vanish quickly
//  *  - Spawn only when cursor moves fast enough (> 6px between frames)
//  *  - Compact halo at 1.5× radius — crisp, no bloom
//  * ─────────────────────────────────────────────────────────────────────────── */
// const ParticleTrail = ({ isDark }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx    = canvas.getContext('2d');
//     let particles = [];
//     let lastX = window.innerWidth  / 2;
//     let lastY = window.innerHeight / 2;
//     let frameId;

//     // Keep canvas sized to the full viewport
//     const resize = () => {
//       canvas.width  = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     resize();
//     window.addEventListener('resize', resize);

//     const onMouseMove = (e) => {
//       const dx    = e.clientX - lastX;
//       const dy    = e.clientY - lastY;
//       const speed = Math.sqrt(dx * dx + dy * dy);

//       // Only spawn when cursor is moving briskly (> 6px), max 1 particle
//       const count = speed > 6 ? 1 : 0;

//       for (let i = 0; i < count; i++) {
//         const angle = Math.random() * Math.PI * 2;
//         const vel   = 0.15 + Math.random() * 0.5; // very slow, delicate drift

//         particles.push({
//           x:     e.clientX + (Math.random() - 0.5) * 3,
//           y:     e.clientY + (Math.random() - 0.5) * 3,
//           vx:    Math.cos(angle) * vel * 0.3,
//           vy:    Math.sin(angle) * vel * 0.3 - 0.3, // gentle upward drift
//           life:  1,
//           decay: 0.04 + Math.random() * 0.03, // aggressive fade = short trail
//           size:  0.5 + Math.random() * 1.0,   // tiny: 0.5–1.5px
//         });
//       }

//       lastX = e.clientX;
//       lastY = e.clientY;
//     };
//     window.addEventListener('mousemove', onMouseMove);

//     // Animation loop — update physics and redraw each particle
//     const tick = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Remove dead particles
//       particles = particles.filter(p => p.life > 0);

//       for (const p of particles) {
//         // Physics
//         p.x   += p.vx;
//         p.y   += p.vy;
//         p.vy  += 0.02;   // very light gravity
//         p.vx  *= 0.97;   // air drag
//         p.life -= p.decay;

//         const alpha = Math.max(0, p.life);
//         const r     = Math.max(0, p.size * p.life);

//         // Crisp radial glow — compact 1.5× halo, no bloat
//         const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 1.5);
//         grd.addColorStop(0,   `rgba(232, 168, 124, ${alpha * 0.7})`);
//         grd.addColorStop(0.5, `rgba(201, 112,  74, ${alpha * 0.25})`);
//         grd.addColorStop(1,   `rgba(201, 112,  74, 0)`);

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, r * 1.5, 0, Math.PI * 2);
//         ctx.fillStyle = grd;
//         ctx.fill();
//       }

//       frameId = requestAnimationFrame(tick);
//     };
//     tick();

//     return () => {
//       window.removeEventListener('resize', resize);
//       window.removeEventListener('mousemove', onMouseMove);
//       cancelAnimationFrame(frameId);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: 'fixed', top: 0, left: 0,
//         width: '100%', height: '100%',
//         pointerEvents: 'none',
//         zIndex: 9998,
//       }}
//     />
//   );
// };

// /* ─── Hero ────────────────────────────────────────────────────── */
// const Hero = ({ portfolio }) => {
//   const { theme } = useContext(ThemeContext);
//   const isDark = theme === 'dark';
//   const heroRef = useRef(null);
//   const spotlightRef = useRef(null);
//   const nameBlockRef = useRef(null);
//   const labelRef = useRef(null);
//   const nameRef = useRef(null);
//   const introRef = useRef(null);
//   const buttonsRef = useRef(null);
//   const statsBarRef = useRef(null);

//   // Orb parallax refs
//   const mouse = useRef({ x: 0, y: 0 });
//   const orb1 = useRef({ x: 0, y: 0 });
//   const orb2 = useRef({ x: 0, y: 0 });
//   const orb3 = useRef({ x: 0, y: 0 });
//   const orb1Ref = useRef(null);
//   const orb2Ref = useRef(null);
//   const orb3Ref = useRef(null);

//   /* ── Unified smooth animation loop ── */
//   useEffect(() => {
//     const heroEl = heroRef.current;
//     if (!heroEl) return;

//     // Raw mouse target (updated instantly on mousemove)
//     const target = { x: 0, y: 0, normX: 0, normY: 0 };
//     // Smoothed values (lerped each frame)
//     const smooth = {
//       spotX: window.innerWidth / 2,  spotY: window.innerHeight / 2,
//       orb1x: 0, orb1y: 0,
//       orb2x: 0, orb2y: 0,
//       orb3x: 0, orb3y: 0,
//       tiltX: 0, tiltY: 0,
//     };

//     const onMouseMove = (e) => {
//       target.x = e.clientX;
//       target.y = e.clientY;
//       target.normX = (e.clientX / window.innerWidth  - 0.5) * 2;
//       target.normY = (e.clientY / window.innerHeight - 0.5) * 2;

//       // Tilt targets from hero bounds
//       const rect = heroEl.getBoundingClientRect();
//       target.tiltX = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
//       target.tiltY = ((e.clientX - rect.left) / rect.width  - 0.5) *  12;
//     };
//     heroEl.addEventListener('mousemove', onMouseMove);

//     const lerp = (a, b, t) => a + (b - a) * t;
//     let frameId;

//     const tick = () => {
//       // Spotlight — very fast lerp so it feels responsive but not jumpy
//       smooth.spotX = lerp(smooth.spotX, target.x, 0.12);
//       smooth.spotY = lerp(smooth.spotY, target.y, 0.12);
//       if (spotlightRef.current) {
//         spotlightRef.current.style.left = `${smooth.spotX}px`;
//         spotlightRef.current.style.top  = `${smooth.spotY}px`;
//       }

//       // Orbs — different speeds for parallax depth
//       smooth.orb1x = lerp(smooth.orb1x, target.normX * 65, 0.025);
//       smooth.orb1y = lerp(smooth.orb1y, target.normY * 50, 0.025);
//       smooth.orb2x = lerp(smooth.orb2x, target.normX * -40, 0.018);
//       smooth.orb2y = lerp(smooth.orb2y, target.normY * -32, 0.018);
//       smooth.orb3x = lerp(smooth.orb3x, target.normX * 28, 0.014);
//       smooth.orb3y = lerp(smooth.orb3y, target.normY * 22, 0.014);
//       if (orb1Ref.current) orb1Ref.current.style.transform = `translate(calc(-20% + ${smooth.orb1x}px), calc(-50% + ${smooth.orb1y}px))`;
//       if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${smooth.orb2x}px, ${smooth.orb2y}px)`;
//       if (orb3Ref.current) orb3Ref.current.style.transform = `translate(${smooth.orb3x}px, ${smooth.orb3y}px)`;

//       // 3D name tilt — slow, dreamy lerp
//       smooth.tiltX = lerp(smooth.tiltX, target.tiltX || 0, 0.04);
//       smooth.tiltY = lerp(smooth.tiltY, target.tiltY || 0, 0.04);
//       if (nameBlockRef.current) {
//         nameBlockRef.current.style.transform =
//           `perspective(900px) rotateX(${smooth.tiltX}deg) rotateY(${smooth.tiltY}deg)`;
//       }

//       frameId = requestAnimationFrame(tick);
//     };
//     tick();

//     return () => {
//       heroEl.removeEventListener('mousemove', onMouseMove);
//       cancelAnimationFrame(frameId);
//     };
//   }, []);

//   /* ── GSAP entrance animations ── */
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
//       tl.fromTo(labelRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1 }, 0.3)
//         .fromTo(nameRef.current, { opacity: 0, y: 80, filter: 'blur(20px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3 }, 0.5)
//         .fromTo(introRef.current, { opacity: 0, x: 50, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1 }, 0.8)
//         .fromTo(buttonsRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1 }, 1.1)
//         .fromTo(statsBarRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, 1.4);

//       // Floating micro-line animation
//       gsap.to('.hero-float-line', {
//         y: -8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.4
//       });

//       // Name gradient shimmer
//       gsap.fromTo('.hero-name-accent',
//         { backgroundPosition: '0% 50%' },
//         { backgroundPosition: '200% 50%', duration: 4, repeat: -1, ease: 'none' }
//       );
//     }, heroRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={heroRef}
//       id="hero"
//       className="relative h-screen w-full flex flex-col overflow-hidden bg-[var(--bg)]"
//       style={{ cursor: 'none' }}
//       onMouseLeave={() => {
//         if (nameBlockRef.current) {
//           gsap.to(nameBlockRef.current, {
//             rotateX: 0, rotateY: 0,
//             duration: 0.8, ease: 'elastic.out(1, 0.5)',
//             transformPerspective: 800,
//           });
//         }
//       }}
//     >
//       {/* ── Cursor spotlight ── */}
//       <div
//         ref={spotlightRef}
//         className="pointer-events-none fixed"
//         style={{
//           zIndex: 50,
//           width: '400px',
//           height: '400px',
//           borderRadius: '50%',
//           transform: 'translate(-50%, -50%)',
//           background: isDark
//             ? 'radial-gradient(circle, rgba(201,112,74,0.07) 0%, transparent 65%)'
//             : 'radial-gradient(circle, rgba(201,112,74,0.05) 0%, transparent 65%)',
//           pointerEvents: 'none',
//         }}
//       />

//       {/* ── Real cursor dot ── */}
//       <CursorDot />

//       {/* ── Particle trail canvas ── */}
//       <ParticleTrail isDark={isDark} />

//       {/* ── Ambient orbs ── */}
//       <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
//         <div ref={orb1Ref} style={{
//           position: 'absolute', width: '55vw', height: '55vw',
//           top: '50%', left: '45%',
//           background: isDark
//             ? 'radial-gradient(circle, rgba(201,112,74,0.13) 0%, rgba(56,25,50,0.04) 60%, transparent 80%)'
//             : 'radial-gradient(circle, rgba(201,112,74,0.11) 0%, transparent 80%)',
//           borderRadius: '50%', filter: 'blur(50px)',
//         }} />
//         <div ref={orb2Ref} style={{
//           position: 'absolute', width: '28vw', height: '28vw',
//           top: '8%', left: '8%',
//           background: isDark
//             ? 'radial-gradient(circle, rgba(140, 50, 110, 0.11) 0%, transparent 70%)'
//             : 'radial-gradient(circle, rgba(201,112,74,0.09) 0%, transparent 70%)',
//           borderRadius: '50%', filter: 'blur(55px)',
//         }} />
//         <div ref={orb3Ref} style={{
//           position: 'absolute', width: '22vw', height: '22vw',
//           bottom: '12%', right: '8%',
//           background: isDark
//             ? 'radial-gradient(circle, rgba(201,112,74,0.09) 0%, transparent 70%)'
//             : 'radial-gradient(circle, rgba(140,50,110,0.07) 0%, transparent 70%)',
//           borderRadius: '50%', filter: 'blur(60px)',
//         }} />
//       </div>

//       {/* ── Floating decorative lines ── */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
//         <div className="hero-float-line absolute w-px" style={{ height: '120px', left: '8%', top: '20%', background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)', opacity: 0.3 }} />
//         <div className="hero-float-line absolute w-px" style={{ height: '80px', left: '50%', top: '10%', background: 'linear-gradient(to bottom, transparent, var(--fg-20), transparent)', opacity: 0.2 }} />
//         <div className="hero-float-line absolute w-px" style={{ height: '100px', right: '12%', top: '30%', background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)', opacity: 0.2 }} />
//         {/* Dot grid — just 3x3, very subtle */}
//         {[...Array(9)].map((_, i) => (
//           <div key={i} className="hero-float-line absolute rounded-full" style={{
//             width: '3px', height: '3px',
//             left: `${15 + (i % 3) * 12}%`,
//             top: `${15 + Math.floor(i / 3) * 12}%`,
//             backgroundColor: 'var(--accent)',
//             opacity: 0.12,
//           }} />
//         ))}
//       </div>

//       {/* ── SAMI watermark ── */}
//       <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
//         style={{ zIndex: 0, right: '-1%' }}>
//         <span style={{
//           fontFamily: 'var(--font-display)',
//           fontSize: '10vw', fontWeight: 700, fontStyle: 'italic',
//           color: 'var(--fg-06)', letterSpacing: '-0.02em',
//           lineHeight: 0.85, writingMode: 'vertical-rl',
//           textOrientation: 'mixed', display: 'block', userSelect: 'none',
//         }}>SAMI</span>
//       </div>

//       {/* ── MAIN CONTENT ── */}
//       <div className="relative flex flex-col flex-1 justify-center container mx-auto px-6 lg:px-12" style={{ zIndex: 10 }}>
//         {/* Label */}
//         <p ref={labelRef} className="uppercase mb-6 font-semibold flex items-center gap-4"
//           style={{ color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.35em' }}>
//           <span className="w-10 h-px bg-[var(--accent)] inline-block" />
//           FULL STACK DEVELOPER · AI ENTHUSIAST
//         </p>

//         {/* Two-column grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

//           {/* LEFT: Name — 3D tilt block */}
//           <div
//             ref={nameBlockRef}
//             style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
//           >
//             <h1 ref={nameRef} style={{
//               fontFamily: 'var(--font-display)',
//               fontSize: 'clamp(3.5rem, 9vw, 8.5rem)',
//               letterSpacing: '-0.03em', lineHeight: 0.92,
//             }}>
//               <span style={{ fontWeight: 300, display: 'block' }} className="text-[var(--fg-40)]">Shaik</span>
//               <span
//                 className="hero-name-accent"
//                 style={{
//                   fontWeight: 700, fontStyle: 'italic', display: 'block',
//                   background: isDark
//                     ? 'linear-gradient(90deg, #fff3e6, #e8a87c, #c9704a, #e8a87c, #fff3e6)'
//                     : 'linear-gradient(90deg, #381932, #7a2d5a, #c9704a, #7a2d5a, #381932)',
//                   backgroundSize: '300% auto',
//                   WebkitBackgroundClip: 'text', color: 'transparent',
//                 }}
//               >
//                 Abdul Sami
//               </span>
//             </h1>
//             {/* Location */}
//             <div className="flex items-center gap-2 mt-5" style={{ color: 'var(--fg-40)' }}>
//               <MapPin size={13} />
//               <span style={{ fontSize: '0.78rem', letterSpacing: '0.08em' }}>Proddatur, Andhra Pradesh ·</span>
//             </div>
//           </div>

//           {/* RIGHT: Intro + buttons */}
//           <div ref={introRef} className="flex flex-col gap-8">
//             <div className="relative pl-6" style={{ borderLeft: '2px solid var(--accent)' }}>
//               <div className="flex items-center gap-2 mb-4">
//                 <Sparkles size={13} style={{ color: 'var(--accent)' }} />
//                 <span style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>About me</span>
//               </div>
//               <p style={{ color: 'var(--fg-60)', fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)', lineHeight: 1.85, fontWeight: 400 }}>
//                 Hi there! I'm a Computer Science student at{' '}
//                 <span style={{ color: 'var(--fg)', fontWeight: 600 }}>IIIT Dharwad</span>, passionate about turning ideas into real, working products. I build full-stack web applications and AI-powered systems — from sleek UIs to intelligent backends.
//               </p>
//               <p className="mt-4" style={{ color: 'var(--fg-40)', fontSize: '0.88rem', lineHeight: 1.7 }}>
//                 Currently in my{' '}
//                 <span style={{ color: 'var(--accent)', fontWeight: 600 }}>4th year</span>{' '}
//                 — actively seeking opportunities to build, contribute, and grow with ambitious teams.
//               </p>
//             </div>

//             {/* ── CTA Buttons ── */}
//             {/* gap-10 (2.5rem = 40px) > MAX_DRIFT (15px) — buttons can never touch */}
//             <div ref={buttonsRef} className="flex flex-wrap gap-10">
//               <MagneticBtn
//                 href="#projects"
//                 style={{ background: 'linear-gradient(135deg, #c9704a, #9b3d1e)', color: '#fff3e6' }}
//                 className="group px-7 py-3.5 font-bold rounded-full text-sm uppercase tracking-[0.15em] cursor-none"
//               >
//                 View Projects <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </MagneticBtn>
//               <MagneticBtn
//                 href="/resume.pdf" target="_blank" rel="noopener noreferrer"
//                 style={{ borderColor: 'var(--border)', color: 'var(--fg)', border: '1px solid' }}
//                 className="px-7 py-3.5 bg-transparent font-bold rounded-full hover:bg-[var(--fg-06)] transition-all text-sm uppercase tracking-[0.15em] cursor-none"
//               >
//                 <Download className="w-4 h-4" /> Resume
//               </MagneticBtn>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── BOTTOM STATS BAR ── */}
//       <div ref={statsBarRef} className="relative w-full" style={{ zIndex: 10, borderTop: '1px solid var(--border-sub)' }}>
//         <div className="container mx-auto px-6 lg:px-12">
//           <div className="flex flex-wrap items-center justify-between gap-4 py-5">
//             {/* Project count */}
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-3">
//                 <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--fg)', lineHeight: 1 }}>
//                   {FALLBACK_PROJECTS.length}
//                 </span>
//                 <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-40)', lineHeight: 1.4 }}>
//                   Public<br />Projects
//                 </span>
//               </div>
//               <div className="w-px h-8 bg-[var(--border-sub)]" />
//               {/* Scroll hint */}
//               <div className="hidden md:flex items-center gap-2" style={{ color: 'var(--fg-20)' }}>
//                 <ArrowDown size={14} className="animate-bounce" />
//                 <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Scroll to explore</span>
//               </div>
//             </div>

//             {/* Open to work */}
//             <div className="flex items-center gap-2 shrink-0">
//               <span className="relative flex h-2.5 w-2.5">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--accent)' }}></span>
//                 <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: 'var(--accent)' }}></span>
//               </span>
//               <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>
//                 Open to Work
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// /* ─── Custom cursor dot (small, visible) ──────────────────────── */
// const CursorDot = () => {
//   const dotRef = useRef(null);
//   const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
//   const cur = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

//   useEffect(() => {
//     const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
//     window.addEventListener('mousemove', move);

//     let frameId;
//     const lerp = (a, b, t) => a + (b - a) * t;
//     const tick = () => {
//       cur.current.x = lerp(cur.current.x, pos.current.x, 0.18);
//       cur.current.y = lerp(cur.current.y, pos.current.y, 0.18);
//       if (dotRef.current) {
//         dotRef.current.style.transform = `translate(${cur.current.x - 7}px, ${cur.current.y - 7}px)`;
//       }
//       frameId = requestAnimationFrame(tick);
//     };
//     tick();

//     return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(frameId); };
//   }, []);

//   return (
//     <div ref={dotRef} className="fixed pointer-events-none" style={{
//       zIndex: 9999, top: 0, left: 0,
//       width: '14px', height: '14px',
//       borderRadius: '50%',
//       backgroundColor: 'var(--accent)',
//       opacity: 0.85,
//       mixBlendMode: 'screen',
//       boxShadow: '0 0 12px rgba(201, 112, 74, 0.6)',
//     }} />
//   );
// };

// export default Hero;







import React, { useEffect, useRef, useContext, useState } from 'react';
import { gsap } from 'gsap';
import { Download, ChevronRight, MapPin, Sparkles, ArrowDown } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { FALLBACK_PROJECTS } from '../data/projects';

/* ─── ANTIGRAVITY WORD SPLIT ──────────────────────────────────────────────────
 * Splits text into individual word/char spans so GSAP can animate each
 * independently with floating, drifting "zero-gravity" motion.
 * ──────────────────────────────────────────────────────────────────────────── */
const AntigravityText = ({ text, className, style, as: Tag = 'span', delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const spans = el.querySelectorAll('.ag-char');

    // Each character floats with its own random drift parameters
    spans.forEach((span, i) => {
      const randomY     = -6 - Math.random() * 14;       // upward float distance
      const randomX     = (Math.random() - 0.5) * 8;     // lateral drift
      const randomRot   = (Math.random() - 0.5) * 4;     // subtle tilt
      const randomDur   = 2.5 + Math.random() * 2.5;     // each char has own speed
      const randomDelay = delay + i * 0.04 + Math.random() * 0.3;

      // Entrance: chars fall from above with blur, like gravity switching off
      gsap.fromTo(span,
        { opacity: 0, y: -40, rotationZ: (Math.random() - 0.5) * 20, filter: 'blur(8px)' },
        {
          opacity: 1, y: 0, rotationZ: 0, filter: 'blur(0px)',
          duration: 1.1, delay: randomDelay, ease: 'power3.out',
        }
      );

      // Continuous idle float — each char bobs independently (antigravity drift)
      gsap.to(span, {
        y: randomY,
        x: randomX,
        rotationZ: randomRot,
        duration: randomDur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: randomDelay + 1.2,
      });
    });

    return () => { gsap.killTweensOf(spans); };
  }, [text, delay]);

  return (
    <Tag ref={containerRef} className={className} style={{ ...style, display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="ag-char"
          style={{
            display: 'inline-block',
            willChange: 'transform',
            // preserve spacing for spaces
            minWidth: char === ' ' ? '0.35em' : undefined,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
};

/* ─── ANTIGRAVITY SECTION HEADING ────────────────────────────────────────────
 * Word-level (not char) antigravity — gentler, more editorial feel like
 * the steven.com "Creator Media" heading that drifts softly upward.
 * ──────────────────────────────────────────────────────────────────────────── */
const FloatingHeading = ({ words, className, style, delay = 0, isDark = true }) => {
  const ref = useRef(null);

  // The gradient must be applied directly to each word span (not a parent)
  // because WebkitBackgroundClip:'text' only clips the element's own background,
  // not inherited backgrounds from a parent container.
  const gradient = isDark
    ? 'linear-gradient(90deg, #fff3e6, #e8a87c, #c9704a, #e8a87c, #fff3e6)'
    : 'linear-gradient(90deg, #381932, #7a2d5a, #c9704a, #7a2d5a, #381932)';

  useEffect(() => {
    const spans = ref.current?.querySelectorAll('.fg-word');
    if (!spans?.length) return;

    spans.forEach((span, i) => {
      gsap.fromTo(span,
        { opacity: 0, y: 60, filter: 'blur(16px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 1.3, delay: delay + i * 0.14, ease: 'power4.out',
        }
      );

      gsap.to(span, {
        y: -10 - i * 4,
        rotationZ: (Math.random() - 0.5) * 1.5,
        duration: 3 + i * 0.7,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        delay: delay + i * 0.14 + 1.5,
      });
    });
    return () => gsap.killTweensOf(spans);
  }, [words, delay]);

  return (
    <span ref={ref} className={className} style={{ ...style, display: 'inline-flex', flexWrap: 'wrap', gap: '0.22em' }}>
      {words.map((word, i) => (
        <span
          key={i}
          className="fg-word"
          style={{
            display: 'inline-block',
            willChange: 'transform',
            background: gradient,
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

/* ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
 * Same as original but enhanced with an "escape velocity" effect on hover:
 * the button briefly fights gravity before settling.
 * ──────────────────────────────────────────────────────────────────────────── */
const MagneticBtn = ({ children, className, style, href, target, rel }) => {
  const wrapRef  = useRef(null);
  const innerRef = useRef(null);
  const isActive = useRef(false);
  const RADIUS = 90;
  const PULL_STRENGTH = 0.12;
  const MAX_DRIFT = 18;

  useEffect(() => {
    const wrap  = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    // Idle gravity bob — button floats gently even when not hovered
    gsap.to(wrap, {
      y: -5,
      duration: 2 + Math.random(),
      repeat: -1, yoyo: true, ease: 'sine.inOut',
      delay: Math.random() * 1.5,
    });

    const onMouseMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const dx   = e.clientX - (rect.left + rect.width  / 2);
      const dy   = e.clientY - (rect.top  + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        isActive.current = true;
        const strength = Math.max(0, 1 - dist / RADIUS);
        const clamp = (v, max) => Math.max(-max, Math.min(max, v));
        const pullX = clamp(dx * PULL_STRENGTH, MAX_DRIFT);
        const pullY = clamp(dy * PULL_STRENGTH, MAX_DRIFT);

        gsap.to(wrap, {
          x: pullX, y: pullY,
          scale: 1 + strength * 0.05,
          rotateX: (-dy / RADIUS) * 4,
          rotateY:  (dx / RADIUS) * 4,
          boxShadow: `0 ${8 + strength * 16}px ${20 + strength * 20}px rgba(201,112,74,${0.1 + strength * 0.2})`,
          duration: 0.4, ease: 'power2.out', transformPerspective: 600,
        });
        gsap.to(inner, { x: -dx * 0.025, y: -dy * 0.025, duration: 0.4, ease: 'power2.out' });
      } else if (isActive.current) {
        isActive.current = false;
        // Spring back with slight overshoot — like escaping gravity well
        gsap.to(wrap, {
          x: 0, y: -5, scale: 1, rotateX: 0, rotateY: 0,
          boxShadow: '0 0 0 rgba(201,112,74,0)',
          duration: 0.8, ease: 'elastic.out(1.2, 0.4)', transformPerspective: 600,
        });
        gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1.2, 0.4)' });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <a
      ref={wrapRef} href={href} target={target} rel={rel}
      className={className}
      style={{ ...style, display: 'inline-flex', willChange: 'transform' }}
    >
      <span
        ref={innerRef}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', willChange: 'transform' }}
      >
        {children}
      </span>
    </a>
  );
};

/* ─── PARTICLE TRAIL ──────────────────────────────────────────────────────────
 * Upgraded: particles now shoot upward faster (antigravity — reversed gravity)
 * and have a soft glow that matches the steven.com aesthetic.
 * ──────────────────────────────────────────────────────────────────────────── */
const ParticleTrail = ({ isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let particles = [];
    let lastX = window.innerWidth  / 2;
    let lastY = window.innerHeight / 2;
    let frameId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      const dx    = e.clientX - lastX;
      const dy    = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const count = speed > 4 ? 2 : 0; // 2 particles for richer trail

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x:    e.clientX + (Math.random() - 0.5) * 5,
          y:    e.clientY + (Math.random() - 0.5) * 5,
          vx:   Math.cos(angle) * 0.4,
          vy:   -0.8 - Math.random() * 1.2, // ANTIGRAVITY: always floats UP
          life: 1,
          decay: 0.025 + Math.random() * 0.025,
          size: 0.8 + Math.random() * 1.6,
        });
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);

      for (const p of particles) {
        p.x   += p.vx;
        p.y   += p.vy;        // No gravity pull — particles float UP (antigravity)
        p.vx  *= 0.98;
        p.vy  *= 0.99;        // gentle deceleration
        p.life -= p.decay;

        const alpha = Math.max(0, p.life);
        const r     = Math.max(0, p.size * p.life);

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2);
        grd.addColorStop(0,   `rgba(232, 168, 124, ${alpha * 0.9})`);
        grd.addColorStop(0.4, `rgba(201, 112,  74, ${alpha * 0.4})`);
        grd.addColorStop(1,   `rgba(201, 112,  74, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2, 0, Math.PI * 2);
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

/* ─── FLOATING DEBRIS ─────────────────────────────────────────────────────────
 * Tiny ambient particles that drift upward in the background — the "debris in
 * zero gravity" effect you see on steven.com's hero sections.
 * Pure CSS-animated divs, no canvas, very performant.
 * ──────────────────────────────────────────────────────────────────────────── */
const GravityDebris = () => {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 1.5 + Math.random() * 3.5,
    left: `${5 + Math.random() * 90}%`,
    bottom: `${-10 + Math.random() * 20}%`,
    duration: 6 + Math.random() * 10,
    delay: Math.random() * 8,
    drift: (Math.random() - 0.5) * 60,
    opacity: 0.06 + Math.random() * 0.12,
    shape: Math.random() > 0.6 ? 'square' : 'circle',
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            bottom: p.bottom,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            backgroundColor: 'var(--accent)',
            opacity: p.opacity,
            animation: `debris-float ${p.duration}s ${p.delay}s infinite linear`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes debris-float {
          0%   { transform: translateY(0)   translateX(0)                rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(-110vh) translateX(var(--drift)) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/* ─── SKETCH DIVIDER ──────────────────────────────────────────────────────────
 * SVG rough/wavy divider line — editorial texture like steven.com section
 * breaks. Drawn via GSAP stroke animation on scroll.
 * ──────────────────────────────────────────────────────────────────────────── */
const SketchDivider = ({ className }) => (
  <div className={className} style={{ width: '100%', overflow: 'hidden', opacity: 0.25 }}>
    <svg viewBox="0 0 1200 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '24px' }}>
      <path
        d="M0 12 C80 4, 160 20, 240 12 S400 4, 480 12 S640 20, 720 12 S880 4, 960 12 S1120 20, 1200 12"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 6"
      />
    </svg>
  </div>
);

/* ─── CURSOR DOT ──────────────────────────────────────────────────────────── */
const CursorDot = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cur = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ring = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);

    let frameId;
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      cur.current.x = lerp(cur.current.x, pos.current.x, 0.2);
      cur.current.y = lerp(cur.current.y, pos.current.y, 0.2);
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.08);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.08);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cur.current.x - 5}px, ${cur.current.y - 5}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      frameId = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(frameId); };
  }, []);

  return (
    <>
      {/* Outer ring — lags behind cursor for depth */}
      <div ref={ringRef} className="fixed pointer-events-none" style={{
        zIndex: 9997, top: 0, left: 0,
        width: '36px', height: '36px',
        borderRadius: '50%',
        border: '1px solid rgba(201, 112, 74, 0.4)',
      }} />
      {/* Core dot */}
      <div ref={dotRef} className="fixed pointer-events-none" style={{
        zIndex: 9999, top: 0, left: 0,
        width: '10px', height: '10px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        opacity: 0.9,
        mixBlendMode: 'screen',
        boxShadow: '0 0 14px rgba(201, 112, 74, 0.8)',
      }} />
    </>
  );
};

/* ─── HERO SECTION ────────────────────────────────────────────────────────── */
const Hero = ({ portfolio }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const heroRef      = useRef(null);
  const spotlightRef = useRef(null);
  const labelRef     = useRef(null);
  const introRef     = useRef(null);
  const buttonsRef   = useRef(null);
  const statsBarRef  = useRef(null);

  // Orb parallax refs
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  /* ── Spotlight + Orb parallax loop ── */
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    const target = { x: 0, y: 0, normX: 0, normY: 0 };
    const smooth = {
      spotX: window.innerWidth / 2, spotY: window.innerHeight / 2,
      orb1x: 0, orb1y: 0, orb2x: 0, orb2y: 0, orb3x: 0, orb3y: 0,
    };

    const onMouseMove = (e) => {
      target.x = e.clientX; target.y = e.clientY;
      target.normX = (e.clientX / window.innerWidth  - 0.5) * 2;
      target.normY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    heroEl.addEventListener('mousemove', onMouseMove);

    const lerp = (a, b, t) => a + (b - a) * t;
    let frameId;
    const tick = () => {
      smooth.spotX = lerp(smooth.spotX, target.x, 0.1);
      smooth.spotY = lerp(smooth.spotY, target.y, 0.1);
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${smooth.spotX}px`;
        spotlightRef.current.style.top  = `${smooth.spotY}px`;
      }
      smooth.orb1x = lerp(smooth.orb1x, target.normX * 65, 0.025);
      smooth.orb1y = lerp(smooth.orb1y, target.normY * 50, 0.025);
      smooth.orb2x = lerp(smooth.orb2x, target.normX * -40, 0.018);
      smooth.orb2y = lerp(smooth.orb2y, target.normY * -32, 0.018);
      smooth.orb3x = lerp(smooth.orb3x, target.normX * 28, 0.014);
      smooth.orb3y = lerp(smooth.orb3y, target.normY * 22, 0.014);
      if (orb1Ref.current) orb1Ref.current.style.transform = `translate(calc(-20% + ${smooth.orb1x}px), calc(-50% + ${smooth.orb1y}px))`;
      if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${smooth.orb2x}px, ${smooth.orb2y}px)`;
      if (orb3Ref.current) orb3Ref.current.style.transform = `translate(${smooth.orb3x}px, ${smooth.orb3y}px)`;
      frameId = requestAnimationFrame(tick);
    };
    tick();
    return () => { heroEl.removeEventListener('mousemove', onMouseMove); cancelAnimationFrame(frameId); };
  }, []);

  /* ── GSAP entrance for non-antigravity elements ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(labelRef.current,
        { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1 }, 0.3)
        .fromTo(introRef.current,
          { opacity: 0, x: 50, filter: 'blur(10px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1 }, 1.2)
        .fromTo(buttonsRef.current,
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 1.5)
        .fromTo(statsBarRef.current,
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, 1.8);

      // Hero label line animation
      gsap.fromTo('.hero-label-line',
        { scaleX: 0 }, { scaleX: 1, duration: 1, delay: 0.5, ease: 'power3.out', transformOrigin: 'left' }
      );

      // Name gradient shimmer
      gsap.fromTo('.hero-name-accent',
        { backgroundPosition: '0% 50%' },
        { backgroundPosition: '200% 50%', duration: 5, repeat: -1, ease: 'none' }
      );

      // Stats bar counter animation
      gsap.fromTo('.stat-number',
        { innerText: 0 },
        {
          innerText: FALLBACK_PROJECTS.length,
          duration: 2, delay: 2, snap: { innerText: 1 },
          ease: 'power2.out',
          onUpdate: function () {
            document.querySelectorAll('.stat-number').forEach(el => {
              el.textContent = Math.round(parseFloat(el.getAttribute('data-val')));
            });
          }
        }
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
    >
      {/* ── Cursor spotlight ── */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed"
        style={{
          zIndex: 50, width: '500px', height: '500px',
          borderRadius: '50%', transform: 'translate(-50%, -50%)',
          background: isDark
            ? 'radial-gradient(circle, rgba(201,112,74,0.08) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(201,112,74,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <CursorDot />
      <ParticleTrail isDark={isDark} />

      {/* ── Floating debris (antigravity ambient) ── */}
      <GravityDebris />

      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div ref={orb1Ref} style={{
          position: 'absolute', width: '60vw', height: '60vw',
          top: '50%', left: '45%',
          background: isDark
            ? 'radial-gradient(circle, rgba(201,112,74,0.14) 0%, rgba(56,25,50,0.04) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(201,112,74,0.11) 0%, transparent 80%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }} />
        <div ref={orb2Ref} style={{
          position: 'absolute', width: '30vw', height: '30vw',
          top: '8%', left: '8%',
          background: isDark
            ? 'radial-gradient(circle, rgba(140,50,110,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(201,112,74,0.09) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }} />
        <div ref={orb3Ref} style={{
          position: 'absolute', width: '24vw', height: '24vw',
          bottom: '12%', right: '8%',
          background: isDark
            ? 'radial-gradient(circle, rgba(201,112,74,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(140,50,110,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(65px)',
        }} />
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
      <div
        className="relative flex flex-col flex-1 justify-center container mx-auto px-6 lg:px-12"
        style={{ zIndex: 10 }}
      >
        {/* Label row */}
        <p
          ref={labelRef}
          className="uppercase mb-6 font-semibold flex items-center gap-4"
          style={{ color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: '0.35em', opacity: 0 }}
        >
          <span className="hero-label-line w-10 h-px bg-[var(--accent)] inline-block" style={{ transformOrigin: 'left' }} />
          FULL STACK DEVELOPER · AI ENTHUSIAST
        </p>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* LEFT: Antigravity name block */}
          <div style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 9vw, 8.5rem)',
              letterSpacing: '-0.03em', lineHeight: 0.92,
            }}>
              {/* "Shaik" — individual chars float */}
              <span style={{ fontWeight: 300, display: 'block', color: 'var(--fg-40)' }}>
                <AntigravityText text="Shaik" delay={0.3} />
              </span>
              {/* "Abdul Sami" — word-level float, gradient applied per-word inside FloatingHeading */}
              <span
                className="hero-name-accent"
                style={{ fontWeight: 700, fontStyle: 'italic', display: 'block' }}
              >
                <FloatingHeading words={['Abdul', 'Sami']} delay={0.55} isDark={isDark} />
              </span>
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 mt-6" style={{ color: 'var(--fg-40)' }}>
              <MapPin size={13} />
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                Proddatur, Andhra Pradesh ·
              </span>
            </div>

            {/* Sketch divider — editorial texture */}
            <SketchDivider className="mt-6" />
          </div>

          {/* RIGHT: Intro + buttons */}
          <div ref={introRef} className="flex flex-col gap-8" style={{ opacity: 0 }}>
            <div className="relative pl-6" style={{ borderLeft: '2px solid var(--accent)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={13} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>
                  About me
                </span>
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

            {/* CTA Buttons — floating with magnetic pull */}
            <div ref={buttonsRef} className="flex flex-wrap gap-10" style={{ opacity: 0 }}>
              <MagneticBtn
                href="#projects"
                style={{ background: 'linear-gradient(135deg, #c9704a, #9b3d1e)', color: '#fff3e6' }}
                className="group px-7 py-3.5 font-bold rounded-full text-sm uppercase tracking-[0.15em] cursor-none"
              >
                View Projects <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticBtn>
              <MagneticBtn
                href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                style={{ borderColor: 'var(--border)', color: 'var(--fg)', border: '1px solid' }}
                className="px-7 py-3.5 bg-transparent font-bold rounded-full hover:bg-[var(--fg-06)] transition-all text-sm uppercase tracking-[0.15em] cursor-none"
              >
                <Download className="w-4 h-4" /> Resume
              </MagneticBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATS BAR ── */}
      <div ref={statsBarRef} className="relative w-full" style={{ zIndex: 10, borderTop: '1px solid var(--border-sub)', opacity: 0 }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="stat-number"
                  data-val={FALLBACK_PROJECTS.length}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--fg)', lineHeight: 1 }}
                >
                  {FALLBACK_PROJECTS.length}
                </span>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-40)', lineHeight: 1.4 }}>
                  Public<br />Projects
                </span>
              </div>
              <div className="w-px h-8 bg-[var(--border-sub)]" />
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

export default Hero;