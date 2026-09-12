import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThumbsUp3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Group for the entire model
    const group = new THREE.Group();
    scene.add(group);
    modelRef.current = group;

    // ====== LIGHTING SETUP ======
    // Key light (cyan) - front right
    const keyLight = new THREE.DirectionalLight(0x00d4ff, 1.8);
    keyLight.position.set(4, 3, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.far = 20;
    scene.add(keyLight);

    // Fill light (violet) - back left
    const fillLight = new THREE.DirectionalLight(0x8b00ff, 0.8);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    // Rim light (white) - top
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, 6, 1);
    scene.add(rimLight);

    // Ambient light for depth
    const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.4);
    scene.add(ambientLight);

    // ====== MATERIALS ======
    // Premium glass material with refraction
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xddffff,
      metalness: 0.1,
      roughness: 0.15,
      envMapIntensity: 2,
      transparent: true,
      opacity: 0.92,
      side: THREE.FrontSide,
    });

    // Chrome/metallic edges
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0ff,
      metalness: 0.95,
      roughness: 0.05,
      envMapIntensity: 2.5,
    });

    // Holographic core (glowing)
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0x00ffff,
      emissiveIntensity: 0.8,
    });

    // ====== CREATE THUMBS-UP GEOMETRY ======
    // Main thumb - rounded rectangular prism with glass
    const thumbGeom = new THREE.BoxGeometry(0.8, 2.5, 0.7);
    const thumb = new THREE.Mesh(thumbGeom, glassMaterial);
    thumb.castShadow = true;
    thumb.receiveShadow = true;
    group.add(thumb);

    // Smooth the edges with a cylinder on top (rounded top)
    const thumbTopGeom = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
    const thumbTop = new THREE.Mesh(thumbTopGeom, glassMaterial);
    thumbTop.position.y = 1.35;
    thumbTop.castShadow = true;
    thumbTop.receiveShadow = true;
    group.add(thumbTop);

    // Palm base - larger rounded rectangle
    const palmGeom = new THREE.BoxGeometry(1.6, 1.2, 0.8);
    const palm = new THREE.Mesh(palmGeom, glassMaterial);
    palm.position.y = -1.2;
    palm.castShadow = true;
    palm.receiveShadow = true;
    group.add(palm);

    // Rounded palm edges
    const palmRoundGeom = new THREE.CapsuleGeometry(0.6, 1.6, 8, 12);
    const palmRound = new THREE.Mesh(palmRoundGeom, glassMaterial);
    palmRound.position.y = -1.2;
    palmRound.rotation.z = Math.PI / 2;
    palmRound.castShadow = true;
    palmRound.receiveShadow = true;
    group.add(palmRound);

    // Chrome beveled edges on thumb
    const edgeGeom1 = new THREE.BoxGeometry(0.85, 2.5, 0.08);
    const edge1 = new THREE.Mesh(edgeGeom1, chromeMaterial);
    edge1.position.z = 0.4;
    group.add(edge1);

    const edgeGeom2 = new THREE.BoxGeometry(0.85, 2.5, 0.08);
    const edge2 = new THREE.Mesh(edgeGeom2, chromeMaterial);
    edge2.position.z = -0.4;
    group.add(edge2);

    // Chrome side edge
    const edgeGeom3 = new THREE.BoxGeometry(0.08, 2.5, 0.7);
    const edge3 = new THREE.Mesh(edgeGeom3, chromeMaterial);
    edge3.position.x = 0.46;
    group.add(edge3);

    // Glowing core inside
    const coreGeom = new THREE.SphereGeometry(0.3, 32, 32);
    const core = new THREE.Mesh(coreGeom, coreMaterial);
    core.position.set(0, 0.5, 0);
    core.castShadow = true;
    group.add(core);

    // Holographic reflection sphere
    const reflectionGeom = new THREE.IcosahedronGeometry(3.5, 6);
    const reflectionMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.02,
      side: THREE.BackSide,
    });
    const reflection = new THREE.Mesh(reflectionGeom, reflectionMaterial);
    group.add(reflection);

    // ====== ORBIT RINGS ======
    const createOrbitRing = (radius, color, opacity) => {
      const ringGeom = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
      }
      ringGeom.setFromPoints(points);
      const ringMaterial = new THREE.LineBasicMaterial({
        color: color,
        linewidth: 2,
        transparent: true,
        opacity: opacity,
      });
      return new THREE.Line(ringGeom, ringMaterial);
    };

    const ring1 = createOrbitRing(2, 0x00d4ff, 0.4);
    ring1.rotation.x = Math.PI * 0.3;
    group.add(ring1);

    const ring2 = createOrbitRing(2.5, 0x8b00ff, 0.25);
    ring2.rotation.z = Math.PI * 0.4;
    group.add(ring2);

    const ring3 = createOrbitRing(3, 0x0099ff, 0.15);
    ring3.rotation.y = Math.PI * 0.5;
    group.add(ring3);

    // ====== HOLOGRAPHIC PARTICLES ======
    const particleCount = 12;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const particleGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const particleMaterial = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0x00d4ff : i % 3 === 1 ? 0x8b00ff : 0x0099ff,
        metalness: 0.7,
        roughness: 0.3,
        emissive: i % 3 === 0 ? 0x00d4ff : i % 3 === 1 ? 0x8b00ff : 0x0099ff,
        emissiveIntensity: 0.6,
      });
      const particle = new THREE.Mesh(particleGeom, particleMaterial);
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.2 + Math.random() * 0.5;
      particle.position.set(Math.cos(angle) * radius, Math.sin(angle * 0.5) * 1, Math.sin(angle) * radius);
      particle.userData.angle = angle;
      particle.userData.radius = radius;
      particle.userData.speed = 0.3 + Math.random() * 0.3;
      group.add(particle);
      particles.push(particle);
    }

    // ====== GLOW LAYER ======
    const glowGeom = new THREE.IcosahedronGeometry(1.2, 4);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.15,
      wireframe: false,
    });
    const glow = new THREE.Mesh(glowGeom, glowMaterial);
    group.add(glow);

    // ====== ANIMATION LOOP WITH INTERSECTION OBSERVER ======
    let isVisible = true;
    const animate = () => {
      if (!isVisible) return;
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate main model
      group.rotation.y += 0.003;
      group.rotation.x = Math.sin(Date.now() * 0.0003) * 0.15;

      // Animate rings
      ring1.rotation.x += 0.008;
      ring2.rotation.z -= 0.006;
      ring3.rotation.y += 0.0045;

      // Animate particles in orbits
      particles.forEach((particle, i) => {
        particle.userData.angle += particle.userData.speed * 0.005;
        const verticalOffset = Math.sin(Date.now() * 0.0005 + i) * 0.5;
        particle.position.set(
          Math.cos(particle.userData.angle) * particle.userData.radius,
          Math.sin(particle.userData.angle * 0.7) * 1 + verticalOffset,
          Math.sin(particle.userData.angle) * particle.userData.radius
        );
      });

      // Animate glow pulse
      glow.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.08;
      glow.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.08;
      glow.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.08;

      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          animate();
        } else if (!isVisible && animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
