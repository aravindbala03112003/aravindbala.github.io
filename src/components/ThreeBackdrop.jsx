import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useRef } from 'react';

function Orb({ position, color, speed }) {
  const mesh = useRef();
  useFrame((state) => { if (mesh.current) mesh.current.rotation.y = state.clock.getElapsedTime() * speed; });
  return <Float speed={2} rotationIntensity={.55} floatIntensity={1.2}><Sphere ref={mesh} position={position} args={[1, 48, 48]}><MeshDistortMaterial color={color} distort={.38} speed={2} transparent opacity={.35} roughness={.1} /></Sphere></Float>;
}
export default function ThreeBackdrop() { return <div className="three-backdrop" aria-hidden="true"><Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}><ambientLight intensity={1.4} /><pointLight position={[4, 2, 3]} intensity={14} color="#75a7ff" /><Orb position={[1.55, .6, 0]} color="#648dff" speed={.12} /><Orb position={[-1.8, -.8, -1]} color="#9f72ff" speed={-.08} /></Canvas></div>; }
