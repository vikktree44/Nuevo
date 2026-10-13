import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

interface MainLogo3DProps {
  onClick: () => void;
}

export default function MainLogo3D({ onClick }: MainLogo3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
      groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.1;
    }
    
    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 0.8;
      ringRef1.current.rotation.z = t * 0.4;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = t * 0.6;
      ringRef2.current.rotation.x = t * 0.3;
    }
    if (ringRef3.current) {
      ringRef3.current.rotation.z = t * 0.7;
      ringRef3.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group 
      ref={groupRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Central sphere - the main logo core */}
        <mesh>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshPhysicalMaterial 
            color="#6366f1"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh scale={0.85}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
        </mesh>

        {/* Orbiting rings */}
        <mesh ref={ringRef1}>
          <torusGeometry args={[1.5, 0.05, 16, 100]} />
          <meshPhysicalMaterial 
            color="#6366f1"
            metalness={1}
            roughness={0}
            emissive="#6366f1"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh ref={ringRef2}>
          <torusGeometry args={[1.8, 0.04, 16, 100]} />
          <meshPhysicalMaterial 
            color="#10b981"
            metalness={1}
            roughness={0}
            emissive="#10b981"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh ref={ringRef3}>
          <torusGeometry args={[2.1, 0.03, 16, 100]} />
          <meshPhysicalMaterial 
            color="#f59e0b"
            metalness={1}
            roughness={0}
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Orbiting particles/spheres */}
        {[...Array(8)].map((_, i) => (
          <OrbitingSphere key={i} index={i} total={8} />
        ))}

        {/* Logo text */}
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          TRAINING ACADEMY
        </Text>

        {/* Click instruction */}
        <Text
          position={[0, -3.2, 0]}
          fontSize={0.2}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          Click to explore courses
        </Text>
      </Float>
    </group>
  );
}

function OrbitingSphere({ index, total }: { index: number; total: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 1.5 + (index % 3) * 0.3;
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const speed = 0.5 + (index % 3) * 0.2;
      meshRef.current.position.x = Math.cos(angle + t * speed) * radius;
      meshRef.current.position.z = Math.sin(angle + t * speed) * radius;
      meshRef.current.position.y = Math.sin(t * 2 + index) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshPhysicalMaterial 
        color={colors[index % 4]}
        emissive={colors[index % 4]}
        emissiveIntensity={2}
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
}
