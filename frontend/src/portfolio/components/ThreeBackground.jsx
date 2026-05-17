import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

/* ─── THORNE-STYLE DENSE WAVE PARTICLE CLOUD ────────────────────────────────
 * Dense curved wave on right side, sparse ambient on left
 * Matches Thorne.com's dramatic particle formation exactly
 * ──────────────────────────────────────────────────────────────────────────── */

const INSTANCE_COUNT = 2200;

const COLORS = [
  { color: new THREE.Color(0xc9704a), threshold: 0.50 },
  { color: new THREE.Color(0xe8a87c), threshold: 0.80 },
  { color: new THREE.Color(0xd4855a), threshold: 0.95 },
  { color: new THREE.Color(0xfff3e6), threshold: 1.00 },
];

function pickColor(rand) {
  for (let i = 0; i < COLORS.length; i++) {
    if (rand < COLORS[i].threshold) return COLORS[i].color;
  }
  return COLORS[0].color;
}

const ThreeBackground = ({ isDark = true }) => {
  const mountRef    = useRef(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;';
    mount.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    const scene  = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x2d1228, 0.006);

    const camera = new THREE.PerspectiveCamera(
      55, window.innerWidth / window.innerHeight, 0.1, 300
    );
    camera.position.z = 60;

    const world = new THREE.Group();
    scene.add(world);

    /* ── Lighting for 3D sphere depth ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xe8a87c, 1.2);
    dirLight.position.set(15, 20, 10);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0xc9704a, 0.4);
    rimLight.position.set(-10, -5, -10);
    scene.add(rimLight);

    /* ── InstancedMesh ── */
    const sphereGeo = new THREE.SphereGeometry(0.11, 7, 7);
    const BASE_OPACITY = isDark ? 0.78 : 0.55;

    const pMat = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: BASE_OPACITY,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh  = new THREE.InstancedMesh(sphereGeo, pMat, INSTANCE_COUNT);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      let x, y, z, sizeMul;
      const bucket = Math.random();

      if (bucket < 0.45) {
        /* ── DENSE WAVE CORE — right side, Thorne's signature formation ──
         * Curved band sweeping from bottom-center to top-right
         * High density = particles packed tightly = dramatic wave look */
        const t       = (Math.random() - 0.3) * Math.PI * 1.4;
        const waveR   = 22 + Math.random() * 18; // ring thickness 22–40
        const spread  = 8 + Math.random() * 10;  // tight spread
        x = Math.cos(t) * waveR + 18 + (Math.random() - 0.5) * spread;
        y = Math.sin(t) * waveR * 0.7 + (Math.random() - 0.5) * spread;
        z = (Math.random() - 0.5) * 22 - 5;
        // Dense wave particles: mostly small, some medium
        sizeMul = Math.random() < 0.15
          ? 1.4 + Math.random() * 0.5   // 15%: medium accent
          : 0.25 + Math.random() * 0.9; // 85%: small tight dots
      } else if (bucket < 0.65) {
        /* ── SECONDARY CLUSTER — upper right, sparser ── */
        const t     = Math.random() * Math.PI * 2;
        const r     = 10 + Math.random() * 20;
        x = Math.cos(t) * r + 25 + (Math.random() - 0.5) * 15;
        y = Math.sin(t) * r * 0.6 + 8 + (Math.random() - 0.5) * 12;
        z = (Math.random() - 0.5) * 20 - 8;
        sizeMul = 0.2 + Math.random() * 0.8;
      } else if (bucket < 0.85) {
        /* ── AMBIENT SCATTER — full screen, sparse ──
         * These give the "floating in space" feel on left/top/bottom */
        x = (Math.random() - 0.5) * 130;
        y = (Math.random() - 0.5) * 85;
        z = (Math.random() - 0.5) * 35 - 12;
        sizeMul = 0.15 + Math.random() * 0.6; // tiny ambient dots
      } else {
        /* ── EDGE PARTICLES — defines outer boundary ── */
        const theta  = Math.random() * Math.PI * 2;
        const phi    = Math.acos(2 * Math.random() - 1);
        const r      = 38 + Math.random() * 10;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta) * 0.6;
        z = r * Math.cos(phi) * 0.4 - 10;
        sizeMul = 0.15 + Math.random() * 0.4; // very small edge dots
      }

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(sizeMul);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, pickColor(Math.random()));
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate  = true;
    world.add(mesh);

    /* ── Events ── */
    const onMouseMove = (e) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseTarget.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── Section change ── */
    const onSectionChange = () => {
      gsap.to(world.rotation, { y: '+=0.35', duration: 1.8, ease: 'power2.inOut' });
      gsap.to(pMat, {
        opacity: Math.min(BASE_OPACITY + 0.18, 1.0),
        duration: 0.35, ease: 'power2.out',
        onComplete: () => gsap.to(pMat, {
          opacity: BASE_OPACITY, duration: 1.4, ease: 'power2.inOut',
        }),
      });
    };
    window.addEventListener('sectionChange', onSectionChange);

    /* ── Animation loop ── */
    const smoothMouse = { x: 0, y: 0 };
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow constant rotation — cloud drifts gently
      world.rotation.y += 0.0004;

      // Mouse parallax
      smoothMouse.x += (mouseTarget.current.x - smoothMouse.x) * 0.025;
      smoothMouse.y += (mouseTarget.current.y - smoothMouse.y) * 0.025;
      world.rotation.y += smoothMouse.x * 0.00025;
      world.rotation.x  = smoothMouse.y * -0.06;

      // Scroll drift
      world.position.y = -window.scrollY * 0.006 + Math.sin(t * 0.12) * 0.6;

      // Subtle breathing
      world.scale.setScalar(Math.sin(t * 0.18) * 0.010 + 1.0);

      renderer.render(scene, camera);
    };
    animate();

    /* ── Cleanup ── */
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('sectionChange', onSectionChange);
      cancelAnimationFrame(animId);
      sphereGeo.dispose();
      pMat.dispose();
      mesh.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}
    />
  );
};

export default ThreeBackground;