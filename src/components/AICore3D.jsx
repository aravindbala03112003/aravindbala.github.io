import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AICore3D() {
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
      50,
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
    renderer.toneMappingExposure = 1.3;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Group for the entire model
    const group = new THREE.Group();
    scene.add(group);
    modelRef.current = group;

    // ====== LIGHTING SETUP ======
    // Main cyan light (front)
    const mainLight = new THREE.DirectionalLight(0x00d4ff, 2);
    mainLight.position.set(3, 4, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // Rim light (violet, back)
    const rimLight = new THREE.DirectionalLight(0x8b00ff, 1.2);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Fill light (electric blue)
    const fillLight = new THREE.DirectionalLight(0x0099ff, 0.7);
    fillLight.position.set(0, -3, 4);
    scene.add(fillLight);

    // Ambient glow
    const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.35);
    scene.add(ambientLight);

    // Point light inside for internal glow
    const pointLight = new THREE.PointLight(0x00ffff, 1.5, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // ====== MATERIALS ======
    // Premium glass material
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xccffff,
      metalness: 0.15,
      roughness: 0.18,
      transparent: true,
      opacity: 0.88,
      envMapIntensity: 2.2,
    });

    // Chrome material
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0ff,
      metalness: 0.98,
      roughness: 0.04,
      envMapIntensity: 2.8,
    });

    // Holographic AI core (highly emissive)
    const coreEmissiveMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      metalness: 0.4,
      roughness: 0.15,
      emissive: 0x00ffff,
      emissiveIntensity: 1.2,
    });

    // ====== CREATE MAIN GLASS ORB ======
    // Primary sphere (glass container)
    const mainSphereGeom = new THREE.IcosahedronGeometry(1.4, 8);
    const mainSphere = new THREE.Mesh(mainSphereGeom, glassMaterial);
    mainSphere.castShadow = true;
    mainSphere.receiveShadow = true;
    group.add(mainSphere);

    // Chrome ring/equator around sphere
    const torusGeom = new THREE.TorusGeometry(1.5, 0.12, 16, 100);
    const equatorRing = new THREE.Mesh(torusGeom, chromeMaterial);
    equatorRing.rotation.x = Math.PI * 0.3;
    group.add(equatorRing);

    // Second chrome ring (tilted)
    const equatorRing2 = new THREE.Mesh(torusGeom, chromeMaterial);
    equatorRing2.rotation.z = Math.PI * 0.4;
    group.add(equatorRing2);

    // ====== INNER CORE STRUCTURE ======
    // Ultra-glowing center core
    const coreGeom = new THREE.IcosahedronGeometry(0.5, 6);
    const core = new THREE.Mesh(coreGeom, coreEmissiveMaterial);
    core.scale.set(1, 1, 1);
    group.add(core);

    // Crystalline inner structures
    const innerCrystal1Geom = new THREE.OctahedronGeometry(0.4, 2);
    const innerCrystal1 = new THREE.Mesh(innerCrystal1Geom, coreEmissiveMaterial);
    innerCrystal1.scale.set(0.8, 1.1, 0.8);
    innerCrystal1.rotation.x = Math.PI * 0.25;
    innerCrystal1.position.set(0, 0.1, 0);
    group.add(innerCrystal1);

    // Inner sphere with holographic gradient appearance
    const innerSphereGeom = new THREE.IcosahedronGeometry(1.2, 6);
    const innerSphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      metalness: 0.3,
      roughness: 0.25,
      emissive: 0x0099ff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.3,
      side: THREE.FrontSide,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeom, innerSphereMaterial);
    group.add(innerSphere);

    // ====== ORBITING GEOMETRIC FORMS ======
    const createOrbitalObject = (geometry, material, radius, speed, color) => {
      const obj = new THREE.Mesh(geometry, material);
      obj.userData.radius = radius;
      obj.userData.speed = speed;
      obj.userData.angle = Math.random() * Math.PI * 2;
      obj.userData.verticalSpeed = (Math.random() - 0.5) * 0.002;
      return obj;
    };

    const orbitingObjects = [];

    // Cyan crystalline orbiters
    for (let i = 0; i < 3; i++) {
      const octGeom = new THREE.OctahedronGeometry(0.18, 2);
      const octMaterial = new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        metalness: 0.6,
        roughness: 0.3,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.7,
      });
      const orbiter = createOrbitalObject(octGeom, octMaterial, 2 + i * 0.3, 0.4 + i * 0.15, 0x00d4ff);
      group.add(orbiter);
      orbitingObjects.push(orbiter);
    }

    // Violet crystalline orbiters
    for (let i = 0; i < 3; i++) {
      const tetraGeom = new THREE.TetrahedronGeometry(0.16, 1);
      const tetraMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b00ff,
        metalness: 0.65,
        roughness: 0.25,
        emissive: 0x8b00ff,
        emissiveIntensity: 0.6,
      });
      const orbiter = createOrbitalObject(tetraGeom, tetraMaterial, 2.3 + i * 0.35, 0.5 + i * 0.1, 0x8b00ff);
      group.add(orbiter);
      orbitingObjects.push(orbiter);
    }

    // ====== HOLOGRAPHIC OUTER SHELL ======
    const holographicGeom = new THREE.IcosahedronGeometry(1.8, 5);
    const holographicMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.7,
      roughness: 0.4,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.2,
    });
    const holographicShell = new THREE.Mesh(holographicGeom, holographicMaterial);
    group.add(holographicShell);

    // ====== VOLUMETRIC LIGHT RAYS ======
    const rayCount = 6;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const rayGeom = new THREE.BoxGeometry(0.08, 2.5, 0.08);
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00d4ff : 0x8b00ff,
        transparent: true,
        opacity: 0.15,
      });
      const ray = new THREE.Mesh(rayGeom, rayMaterial);
      ray.position.x = Math.cos(angle) * 1.6;
      ray.position.z = Math.sin(angle) * 1.6;
      ray.rotation.y = angle;
      group.add(ray);
    }

    // ====== ENERGY RINGS ======
    const createEnergyRing = (radius, color, opacity, rotationAxis) => {
      const ringGeom = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 256; i++) {
        const angle = (i / 256) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
      }
      ringGeom.setFromPoints(points);
      const ringMaterial = new THREE.LineBasicMaterial({
        color: color,
        linewidth: 3,
        transparent: true,
        opacity: opacity,
      });
      const ring = new THREE.Line(ringGeom, ringMaterial);
      return { mesh: ring, axis: rotationAxis };
    };

    const energyRings = [
      createEnergyRing(1.8, 0x00d4ff, 0.5, { x: 0, y: 1, z: 0 }),
      createEnergyRing(2.2, 0x8b00ff, 0.35, { x: 0.4, y: 0, z: 0.4 }),
      createEnergyRing(2.6, 0x0099ff, 0.25, { x: 0, y: 0.3, z: 1 }),
    ];

    energyRings.forEach((ring) => {
      group.add(ring.mesh);
    });

    // ====== GLOW LAYER ======
    const glowGeom = new THREE.IcosahedronGeometry(1.5, 4);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.12,
    });
    const glow = new THREE.Mesh(glowGeom, glowMaterial);
    group.add(glow);

    // ====== ANIMATION LOOP WITH INTERSECTION OBSERVER ======
    let isVisible = true;
    const animate = () => {
      if (!isVisible) return;
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate main model
      group.rotation.y += 0.002;
      group.rotation.z = Math.sin(Date.now() * 0.0002) * 0.1;

      // Rotate inner sphere
      innerSphere.rotation.y -= 0.005;
      innerSphere.rotation.z += 0.003;

      // Animate core pulsing
      const corePulse = 1 + Math.sin(Date.now() * 0.003) * 0.15;
      core.scale.set(corePulse, corePulse, corePulse);

      // Animate inner crystal rotation
      innerCrystal1.rotation.x += 0.008;
      innerCrystal1.rotation.y += 0.005;

      // Animate orbiting objects
      orbitingObjects.forEach((obj) => {
        obj.userData.angle += obj.userData.speed * 0.003;
        obj.userData.verticalOffset = (obj.userData.verticalOffset || 0) + obj.userData.verticalSpeed;
        obj.position.x = Math.cos(obj.userData.angle) * obj.userData.radius;
        obj.position.z = Math.sin(obj.userData.angle) * obj.userData.radius;
        obj.position.y = Math.sin(obj.userData.angle * 0.7) * 0.8 + (obj.userData.verticalOffset || 0);
        obj.rotation.x += 0.006;
        obj.rotation.z -= 0.004;
      });

      // Rotate energy rings
      energyRings.forEach((ring) => {
        ring.mesh.rotation.x += ring.axis.x * 0.004;
        ring.mesh.rotation.y += ring.axis.y * 0.005;
        ring.mesh.rotation.z += ring.axis.z * 0.003;
      });

      // Rotate chrome rings
      equatorRing.rotation.x += 0.003;
      equatorRing2.rotation.z -= 0.002;

      // Animate glow pulse
      glow.scale.x = 1 + Math.sin(Date.now() * 0.0025) * 0.12;
      glow.scale.y = 1 + Math.sin(Date.now() * 0.0025) * 0.12;
      glow.scale.z = 1 + Math.sin(Date.now() * 0.0025) * 0.12;

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
