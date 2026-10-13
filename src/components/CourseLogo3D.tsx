import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface Course {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface CourseLogo3DProps {
  course: Course;
}

export default function CourseLogo3D({ course }: CourseLogo3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
        {/* Main shape based on course */}
        <mesh>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshPhysicalMaterial 
            color={course.color}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            emissive={course.color}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Outer wireframe */}
        <mesh scale={1.2}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshBasicMaterial 
            color={course.color}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}
