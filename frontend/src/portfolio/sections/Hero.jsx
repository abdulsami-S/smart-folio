import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Download, ChevronRight } from 'lucide-react';

const Hero = ({ portfolio }) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  // References for GSAP
  const labelRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3000 particles in sphere formation
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2.8 + (Math.random() - 0.5) * 0.3;
      positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xe8f4ff,
      size: 0.015,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 6;

    // Mouse tracking for magnetic tilt
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      // Auto rotate
      particles.rotation.y += 0.003;
      particles.rotation.x += 0.001;
      // Magnetic mouse tilt (smooth lerp)
      particles.rotation.y += (mouse.x * 0.3 - particles.rotation.y) * 0.02;
      particles.rotation.x += (mouse.y * 0.2 - particles.rotation.x) * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, delay: 0.3, duration: 1, ease: "power4.out" }
      );

      gsap.fromTo(nameRef.current,
        { opacity: 0, y: 60, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", delay: 0.5, duration: 1, ease: "power4.out" }
      );

      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, delay: 0.9, duration: 1, ease: "power4.out" }
      );

      gsap.fromTo(buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, delay: 1.1, duration: 1, ease: "power4.out" }
      );

      gsap.fromTo(statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, delay: 1.3, duration: 1, ease: "power4.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-[var(--bg-primary)]">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        <h1 
          style={{
            fontSize: '28vw',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.025)',
            letterSpacing: '-0.05em',
            margin: 0,
            lineHeight: 1
          }}
        >
          SAMI
        </h1>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>
        <p 
          ref={labelRef}
          style={{ color: '#00d4ff', fontSize: '0.8rem', letterSpacing: '0.3em' }}
          className="uppercase mb-6 font-semibold"
        >
          FULL STACK DEVELOPER
        </p>

        <h1 
          ref={nameRef}
          style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', letterSpacing: '-0.03em', lineHeight: 1 }}
          className="mb-6 flex flex-wrap justify-center gap-x-4"
        >
          <span style={{ fontWeight: 300 }} className="text-white">Shaik</span>
          <span style={{ fontWeight: 800, fontStyle: 'italic', background: 'linear-gradient(135deg, #00d4ff, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Abdul
          </span>
          <span style={{ fontWeight: 800 }} className="text-white">Sami</span>
        </h1>

        <p 
          ref={subtitleRef}
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem' }}
          className="max-w-2xl mx-auto mb-10 font-medium"
        >
          Full Stack Developer · IIIT Dharwad '27
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mb-16">
          <a
            href="#projects"
            className="group relative px-8 py-4 bg-gradient-to-r from-[#00d4ff] to-[#4f46e5] text-white font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Projects <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          
          <a
            href="/resume.pdf" // Default fallback
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent border border-[rgba(255,255,255,0.2)] text-white font-bold rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-all flex items-center gap-2 justify-center"
          >
            <Download className="w-5 h-5" /> Download Resume
          </a>
        </div>

        {/* Stats */}
        <div 
          ref={statsRef}
          className="flex items-center justify-center gap-6 sm:gap-10 text-sm sm:text-base font-bold text-[rgba(255,255,255,0.6)]"
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-xl">10+</span>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>PROJECTS</span>
          </div>
          <div className="h-8 w-px bg-[rgba(255,255,255,0.1)]"></div>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl">2+</span>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>YEARS CODING</span>
          </div>
          <div className="h-8 w-px bg-[rgba(255,255,255,0.1)]"></div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }} className="text-white">OPEN</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
