import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroScene3D() {
  const containerRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch (_) {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = null;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);

      const handleContextLost = (e) => {
        e.preventDefault();
        console.warn('HeroScene3D WebGL context lost; switching to fallback');
        setWebGLSupported(false);
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    } catch (e) {
      console.warn('WebGL Renderer failed to initialize:', e);
      setWebGLSupported(false);
      return;
    }

    // ====== LIGHTING ======
    const ambientLight = new THREE.AmbientLight(0x0c1b33, 1.2);
    scene.add(ambientLight);

    // Key Light (Cyan)
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Rim/Back Light (Neon Lime)
    const rimLight = new THREE.DirectionalLight(0xd5ff6e, 2.2);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // Accent Light (Electric Violet)
    const violetLight = new THREE.DirectionalLight(0xa855f7, 2.4);
    violetLight.position.set(-3, 4, 3);
    scene.add(violetLight);

    // Internal Core Glow PointLight
    const corePointLight = new THREE.PointLight(0x38bdf8, 3.5, 8);
    corePointLight.position.set(0, 0, 0);
    scene.add(corePointLight);

    // ====== 3D OBJECTS GROUP ======
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Futuristic Crystal Core (Icosahedron)
    const coreGeometry = new THREE.IcosahedronGeometry(1.4, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x11284d,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    rootGroup.add(coreMesh);

    // 2. Wireframe Lattice Overlay (Geodesic shell)
    const wireGeometry = new THREE.IcosahedronGeometry(1.42, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x75a7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    rootGroup.add(wireMesh);

    // 3. Inner Quantum Pulsing Core
    const innerGeometry = new THREE.OctahedronGeometry(0.7, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xd5ff6e,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    rootGroup.add(innerMesh);

    // 4. Kinetic Orbital Gimbal Rings
    // Ring 1 (Primary horizontal/inclined torus)
    const ring1Geom = new THREE.TorusGeometry(2.35, 0.022, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.95,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    rootGroup.add(ring1);

    // Ring 2 (Secondary counter-rotating ring)
    const ring2Geom = new THREE.TorusGeometry(2.8, 0.018, 16, 90);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.7,
      metalness: 0.9,
      roughness: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    rootGroup.add(ring2);

    // Ring 3 (Outer delicate ring with ticks)
    const ring3Geom = new THREE.TorusGeometry(3.3, 0.012, 12, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xd5ff6e,
      transparent: true,
      opacity: 0.4,
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.x = Math.PI / 2.2;
    rootGroup.add(ring3);

    // 5. Floating Orbital Satellites (Mini energy nodes)
    const satelliteGroup = new THREE.Group();
    rootGroup.add(satelliteGroup);

    const satGeom = new THREE.OctahedronGeometry(0.12, 0);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xd5ff6e });
    const satMesh1 = new THREE.Mesh(satGeom, satMat);
    satMesh1.position.set(2.35, 0, 0);
    ring1.add(satMesh1);

    const satMesh2 = new THREE.Mesh(satGeom, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    satMesh2.position.set(0, 2.8, 0);
    ring2.add(satMesh2);

    // 6. Volumetric Spatial Particle Field
    const particleCount = window.innerWidth < 768 ? 60 : 130;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      particleScales[i] = Math.random() * 0.04 + 0.02;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x75a7ff,
      size: 0.075,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlePoints);

    // ====== INTERACTIVE POINTER & TOUCH LISTENER ======
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.2;
      targetY = y * 1.2;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        targetX = x * 1.4;
        targetY = y * 1.4;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // ====== RESIZE HANDLER ======
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ====== INTERSECTION OBSERVER (0% GPU when offscreen) ======
    let isVisible = true;
    let animationFrameId = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ====== ANIMATION LOOP ======
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      if (!prefersReducedMotion) {
        // Core rotation
        coreMesh.rotation.y = elapsedTime * 0.28;
        coreMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2;
        wireMesh.rotation.y = elapsedTime * 0.28;
        wireMesh.rotation.x = coreMesh.rotation.x;

        // Inner pulsing core
        innerMesh.rotation.y = -elapsedTime * 0.45;
        innerMesh.rotation.z = Math.cos(elapsedTime * 0.3) * 0.3;
        const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.08;
        innerMesh.scale.set(pulse, pulse, pulse);

        // Orbital rings counter-rotation
        ring1.rotation.z = elapsedTime * 0.35;
        ring2.rotation.y = -elapsedTime * 0.28;
        ring3.rotation.z = elapsedTime * 0.15;

        // Subtle particle drift
        particlePoints.rotation.y = elapsedTime * 0.03;
        particlePoints.rotation.x = elapsedTime * 0.015;

        // Overall root tilt response with organic autonomous idle sway
        const idleSwayX = Math.sin(elapsedTime * 0.45) * 0.12;
        const idleSwayY = Math.cos(elapsedTime * 0.35) * 0.08;
        rootGroup.rotation.y = (mouseX + idleSwayX) * 0.65;
        rootGroup.rotation.x = (-mouseY + idleSwayY) * 0.65;

        // Gentle floating respiration
        rootGroup.position.y = Math.sin(elapsedTime * 1.1) * 0.14;
      }

      try {
        renderer.render(scene, camera);
      } catch (err) {
        console.warn('HeroScene3D render error, fallback enabled:', err);
        setWebGLSupported(false);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        return;
      }
    };

    animate();

    // ====== CLEANUP ======
    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      // Dispose Three.js resources
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      ring3Geom.dispose();
      ring3Mat.dispose();
      satGeom.dispose();
      satMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="hero-3d-scene-fallback" aria-hidden="true">
        <div className="fallback-orb fallback-orb-cyan" />
        <div className="fallback-orb fallback-orb-lime" />
        <div className="fallback-ring fallback-ring-outer" />
        <div className="fallback-ring fallback-ring-inner" />
        <div className="fallback-core" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="hero-3d-scene-container"
      aria-hidden="true"
    />
  );
}
