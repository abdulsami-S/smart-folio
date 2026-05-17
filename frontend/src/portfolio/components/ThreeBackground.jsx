import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─── SAKAZUKI.IO-STYLE THREE.JS 3D PARTICLE BACKGROUND ─────────────────────
 * Premium constellation particle field with:
 *  - 320 floating particles with weighted color distribution
 *  - Dynamic constellation lines connecting nearby particles
 *  - 3 wireframe geometric shapes (icosahedron, torus, octahedron)
 *  - Smooth mouse-driven parallax on the entire scene
 *  - Additive blending for soft glow aesthetic
 *  - Full cleanup on unmount
 *
 * Color weights:
 *   #c9704a (4x) — dominant warm copper
 *   #e8a87c (3x) — light peach accent
 *   #d4855a (2x) — mid-tone terracotta
 *   #9b3d1e (1x) — deep sienna
 *   #fff3e6 (1x rare) — cream sparkle
 *
 * Palette: #381932 bg, project accent colors
 * ──────────────────────────────────────────────────────────────────────────── */

/* Weighted color pool — each hex repeated by its weight factor */
const COLOR_POOL = [
  0xc9704a, 0xc9704a, 0xc9704a, 0xc9704a,   // 4x weight
  0xe8a87c, 0xe8a87c, 0xe8a87c,               // 3x weight
  0xd4855a, 0xd4855a,                          // 2x weight
  0x9b3d1e,                                    // 1x weight
  0xfff3e6,                                    // 1x rare
];

const ThreeBackground = ({ isDark }) => {
  const mountRef = useRef(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Scene, Camera, Renderer ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 200
    );
    camera.position.z = 55;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Master group — everything rotates together for parallax ── */
    const world = new THREE.Group();
    scene.add(world);

    /* ══════════════════════════════════════════════════════════════
       PARTICLES — 320 with per-particle weighted colors
       ══════════════════════════════════════════════════════════════ */
    const P_COUNT = 320;
    const SPREAD = 80;
    const positions = new Float32Array(P_COUNT * 3);
    const colors = new Float32Array(P_COUNT * 3);
    const sizes = new Float32Array(P_COUNT);
    const velocities = [];

    for (let i = 0; i < P_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;

      velocities.push({
        x: (Math.random() - 0.5) * 0.014,
        y: (Math.random() - 0.5) * 0.014 + 0.006,  // slight upward drift (antigravity)
        z: (Math.random() - 0.5) * 0.007,
      });

      // Pick from weighted color pool
      const color = new THREE.Color(COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)]);
      colors[i * 3]     = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Slight size variation — rare cream particles are a touch bigger
      sizes[i] = color.getHex() === 0xfff3e6
        ? 0.22 + Math.random() * 0.08
        : 0.10 + Math.random() * 0.12;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: isDark ? 0.18 : 0.14,
      transparent: true,
      opacity: isDark ? 0.8 : 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });

    world.add(new THREE.Points(pGeo, pMat));

    /* ══════════════════════════════════════════════════════════════
       CONSTELLATION LINES
       ══════════════════════════════════════════════════════════════ */
    const MAX_DIST = 7;
    const MAX_LINES = 500;
    const linePos = new Float32Array(MAX_LINES * 6);
    const lineColors = new Float32Array(MAX_LINES * 6);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    lGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    lGeo.setDrawRange(0, 0);

    const lMat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: isDark ? 0.14 : 0.09,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });

    world.add(new THREE.LineSegments(lGeo, lMat));

    /* ══════════════════════════════════════════════════════════════
       WIREFRAME SHAPES — icosahedron, torus, octahedron
       ══════════════════════════════════════════════════════════════ */
    const wMat = (hexColor, op) => new THREE.MeshBasicMaterial({
      color: hexColor, wireframe: true, transparent: true,
      opacity: isDark ? op : op * 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const shapes = [];

    // Large icosahedron — top-right area
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(7, 1), wMat(0xc9704a, 0.13));
    ico.position.set(20, 10, -18);
    shapes.push(ico);

    // Torus — bottom-center-right
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(5.5, 0.35, 10, 36), wMat(0xe8a87c, 0.10)
    );
    torus.position.set(14, -14, -20);
    shapes.push(torus);

    // Octahedron — left area
    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(4.5, 0), wMat(0xd4855a, 0.11));
    octa.position.set(-22, -4, -12);
    shapes.push(octa);

    shapes.forEach(s => world.add(s));

    /* ── Event listeners ── */
    const onMouseMove = (e) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTarget.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    /* ══════════════════════════════════════════════════════════════
       ANIMATION LOOP
       ══════════════════════════════════════════════════════════════ */
    const smoothMouse = { x: 0, y: 0 };
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      const t = clock.getElapsedTime();

      // Smooth mouse parallax on entire scene
      smoothMouse.x += (mouseTarget.current.x - smoothMouse.x) * 0.03;
      smoothMouse.y += (mouseTarget.current.y - smoothMouse.y) * 0.03;
      world.rotation.y =  smoothMouse.x * 0.18;
      world.rotation.x = -smoothMouse.y * 0.12;

      // ── Update particles ──
      const p = pGeo.attributes.position.array;
      const half = SPREAD / 2;
      for (let i = 0; i < P_COUNT; i++) {
        const i3 = i * 3;
        p[i3]     += velocities[i].x;
        p[i3 + 1] += velocities[i].y;
        p[i3 + 2] += velocities[i].z;
        // Wrap around boundaries
        if (p[i3]     >  half) p[i3]     = -half;
        if (p[i3]     < -half) p[i3]     =  half;
        if (p[i3 + 1] >  half) p[i3 + 1] = -half;
        if (p[i3 + 1] < -half) p[i3 + 1] =  half;
        if (p[i3 + 2] >  15)   p[i3 + 2] = -35;
        if (p[i3 + 2] < -35)   p[i3 + 2] =  15;
      }
      pGeo.attributes.position.needsUpdate = true;

      // ── Update constellation lines ──
      let li = 0;
      const lp = lGeo.attributes.position.array;
      const lc = lGeo.attributes.color.array;
      const pc = pGeo.attributes.color.array;

      for (let i = 0; i < P_COUNT && li < MAX_LINES; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < P_COUNT && li < MAX_LINES; j++) {
          const j3 = j * 3;
          const dx = p[i3] - p[j3];
          const dy = p[i3 + 1] - p[j3 + 1];
          const dz = p[i3 + 2] - p[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < MAX_DIST * MAX_DIST) {
            const b = li * 6;
            // positions
            lp[b]     = p[i3];     lp[b + 1] = p[i3 + 1]; lp[b + 2] = p[i3 + 2];
            lp[b + 3] = p[j3];    lp[b + 4] = p[j3 + 1]; lp[b + 5] = p[j3 + 2];
            // colors — average of connected particle colors
            lc[b]     = (pc[i3] + pc[j3]) * 0.5;
            lc[b + 1] = (pc[i3+1] + pc[j3+1]) * 0.5;
            lc[b + 2] = (pc[i3+2] + pc[j3+2]) * 0.5;
            lc[b + 3] = lc[b]; lc[b + 4] = lc[b + 1]; lc[b + 5] = lc[b + 2];
            li++;
          }
        }
      }
      lGeo.setDrawRange(0, li * 2);
      lGeo.attributes.position.needsUpdate = true;
      lGeo.attributes.color.needsUpdate = true;

      // ── Rotate wireframe shapes at different speeds ──
      ico.rotation.x    = t * 0.08;   ico.rotation.y    = t * 0.12;
      torus.rotation.x  = t * 0.06;   torus.rotation.y  = t * 0.10;
      octa.rotation.x   = t * 0.10;   octa.rotation.z   = t * 0.07;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    /* ── Full cleanup on unmount ── */
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);

      // Dispose geometries and materials
      pGeo.dispose(); pMat.dispose();
      lGeo.dispose(); lMat.dispose();
      shapes.forEach(s => { s.geometry.dispose(); s.material.dispose(); });

      // Dispose renderer and remove canvas
      renderer.dispose();
      renderer.forceContextLoss();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeBackground;
