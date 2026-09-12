import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CrystalHeart3D() {
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
    // camera placed to frame the heart with a clear front view and comfortable zoom
    camera.position.set(0, 0.18, 3.5);
    camera.lookAt(0, 0, 0);
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
    // Main cyan light (front)
    const keyLight = new THREE.DirectionalLight(0x00d4ff, 2);
    keyLight.position.set(3, 4, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    // Rim light (violet)
    const rimLight = new THREE.DirectionalLight(0x8b00ff, 1.2);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xff1493, 0.8);
    fillLight.position.set(0, -2, 4);
    scene.add(fillLight);

    // Ambient glow
    const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.4);
    scene.add(ambientLight);

    // Point light inside heart for inner glow
    const pointLight = new THREE.PointLight(0xff1493, 1.8, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // ====== MATERIALS ======
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xff77af,
      metalness: 0.2,
      roughness: 0.16,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 2.5,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0ff,
      metalness: 0.98,
      roughness: 0.04,
      envMapIntensity: 2.8,
    });

    const coreEmissiveMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4e8f,
      metalness: 0.45,
      roughness: 0.12,
      emissive: 0xff4e8f,
      emissiveIntensity: 1.4,
    });

    const peopleMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.45,
      roughness: 0.45,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.55,
    });

    // ====== CREATE CRYSTAL HEART ======
    // Main heart shape using a proper extruded heart silhouette
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.9);
    heartShape.bezierCurveTo(0.35, 1.05, 0.9, 0.85, 0.9, 0.4);
    heartShape.bezierCurveTo(0.9, -0.1, 0.4, -0.45, 0, -0.85);
    heartShape.bezierCurveTo(-0.4, -0.45, -0.9, -0.1, -0.9, 0.4);
    heartShape.bezierCurveTo(-0.9, 0.85, -0.35, 1.05, 0, 0.9);

    const heartGeom = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.72,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelOffset: 0,
      bevelSegments: 6,
      curveSegments: 64,
    });
    heartGeom.center();

    const heartMesh = new THREE.Mesh(heartGeom, glassMaterial);
    heartMesh.rotation.set(0.04, 0, 0);
    heartMesh.scale.set(1.18, 1.18, 1.18);
    heartMesh.position.set(0, -0.04, 0);

    heartMesh.castShadow = true;
    heartMesh.receiveShadow = true;
    group.add(heartMesh);

    // Subtle chrome ring around heart — reduced size & opacity so it doesn't compete with the heart
    const heartRingGeom = new THREE.TorusGeometry(1.75, 0.06, 12, 64);
    const heartRing = new THREE.Mesh(heartRingGeom, chromeMaterial);
    heartRing.rotation.x = Math.PI * 0.45;
    heartRing.position.set(0, -0.1, -0.24);
    // make the chrome ring less dominant
    heartRing.material = heartRing.material.clone();
    heartRing.material.transparent = true;
    heartRing.material.opacity = 0.08;
    heartRing.material.metalness = 0.64;
    heartRing.material.roughness = 0.26;
    group.add(heartRing);

    // Glowing core inside
    const coreGeom = new THREE.SphereGeometry(0.28, 32, 32);
    const core = new THREE.Mesh(coreGeom, coreEmissiveMaterial);
    core.position.set(0, 0, -0.08);
    group.add(core);

    // ====== CREATE PEOPLE SILHOUETTES ======
    const createPersonSilhouette = (radius, angle) => {
      const group = new THREE.Group();
      
      // Head - sphere (reduced so it doesn't compete with the heart)
      const headGeom = new THREE.SphereGeometry(0.12, 12, 12);
      const head = new THREE.Mesh(headGeom, peopleMaterial);
      head.position.y = 0.28;
      head.scale.set(0.95,0.95,0.95);
      group.add(head);
      
      // Shoulders - capsule (smaller)
      const shoulderGeom = new THREE.CapsuleGeometry(0.14, 0.18, 6, 6);
      const shoulders = new THREE.Mesh(shoulderGeom, peopleMaterial);
      shoulders.position.y = 0.02;
      group.add(shoulders);
      
      // Body/torso - tapered (smaller)
      const torsoGeom = new THREE.ConeGeometry(0.1, 0.28, 8);
      const torso = new THREE.Mesh(torsoGeom, peopleMaterial);
      torso.position.y = -0.2;
      group.add(torso);
      
      // Position around heart in circle
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      group.position.set(x, 0, z);
      
      // Make them face the heart
      group.lookAt(0, 0, 0);
      
      return group;
    };

    // Three people connected by connection lines — moved further outward and reduced in scale so the heart remains the focal point
    const PEOPLE_RADIUS = 3.8;
    const person1 = createPersonSilhouette(PEOPLE_RADIUS, 0);
    const person2 = createPersonSilhouette(PEOPLE_RADIUS, (Math.PI * 2) / 3);
    const person3 = createPersonSilhouette(PEOPLE_RADIUS, (Math.PI * 4) / 3);
    
    group.add(person1);
    group.add(person2);
    group.add(person3);

    // ====== CONNECTION LINES ======
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.28,
      linewidth: 2,
    });

    // Lines from heart to each person
    const line1Geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      person1.position,
    ]);
    const line1 = new THREE.Line(line1Geom, connectionMaterial);
    group.add(line1);

    const line2Geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      person2.position,
    ]);
    const line2 = new THREE.Line(line2Geom, connectionMaterial);
    group.add(line2);

    const line3Geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      person3.position,
    ]);
    const line3 = new THREE.Line(line3Geom, connectionMaterial);
    group.add(line3);

    // ====== ORBIT RING ======
    const orbitGeom = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      // move orbit farther out so it frames the heart rather than intersecting it
      orbitPoints.push(new THREE.Vector3(Math.cos(angle) * 4.6, 0, Math.sin(angle) * 4.6));
    }
    orbitGeom.setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.18,
      linewidth: 1,
    });
    const orbit = new THREE.Line(orbitGeom, orbitMaterial);
    group.add(orbit);

    // ====== SPARK PARTICLES ======
    const sparkCount = 16;
    const sparkParticles = [];
    for (let i = 0; i < sparkCount; i++) {
      // slightly smaller, placed farther out so they accent the composition
      const sparkGeom = new THREE.SphereGeometry(0.06, 10, 10);
      const sparkMaterial = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x00d4ff : 0x8b00ff,
        metalness: 0.55,
        roughness: 0.35,
        emissive: i % 2 === 0 ? 0x00d4ff : 0x8b00ff,
        emissiveIntensity: 0.6,
      });
      const spark = new THREE.Mesh(sparkGeom, sparkMaterial);
      const angle = (i / sparkCount) * Math.PI * 2;
      const radius = 4.2 + Math.random() * 0.6;
      spark.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 0.6) * 0.8,
        Math.sin(angle) * radius
      );
      spark.userData.angle = angle;
      spark.userData.radius = radius;
      spark.userData.speed = 0.4 + Math.random() * 0.2;
      spark.userData.floatSpeed = (Math.random() - 0.5) * 0.003;
      group.add(spark);
      sparkParticles.push(spark);
    }

    // ====== GLOW LAYER ======
    const glowGeom = new THREE.IcosahedronGeometry(1.3, 4);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff1493,
      transparent: true,
      opacity: 0.1,
    });
    const glow = new THREE.Mesh(glowGeom, glowMaterial);
    group.add(glow);

    // ====== ANIMATION LOOP WITH INTERSECTION OBSERVER ======
    let isVisible = true;
    const animate = () => {
      if (!isVisible) return;
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate main model slowly around the Y axis only so the heart stays readable
      group.rotation.y += 0.002;
      group.rotation.x = 0.02;

      // Keep the heart orientation stable for a well-aligned front-facing view
      heartMesh.rotation.set(0.04, 0, 0);

      // Pulse core
      const corePulse = 1 + Math.sin(Date.now() * 0.004) * 0.18;
      core.scale.set(corePulse, corePulse, corePulse);

      // Float people slightly
      person1.position.y = Math.sin(Date.now() * 0.0008) * 0.15;
      person2.position.y = Math.sin(Date.now() * 0.0008 + Math.PI * 0.66) * 0.15;
      person3.position.y = Math.sin(Date.now() * 0.0008 + Math.PI * 1.33) * 0.15;

      // Rotate orbit
      orbit.rotation.z += 0.003;

      // Animate sparks
      sparkParticles.forEach((spark) => {
        spark.userData.angle += spark.userData.speed * 0.004;
        spark.userData.verticalOffset = (spark.userData.verticalOffset || 0) + spark.userData.floatSpeed;
        spark.position.x = Math.cos(spark.userData.angle) * spark.userData.radius;
        spark.position.z = Math.sin(spark.userData.angle) * spark.userData.radius;
        spark.position.y = Math.sin(spark.userData.angle * 0.7) * 0.6 + (spark.userData.verticalOffset || 0);
        spark.rotation.x += 0.008;
        spark.rotation.y += 0.006;
      });

      // Pulse glow
      glow.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      glow.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      glow.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.1;

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
