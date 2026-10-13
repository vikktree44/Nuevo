import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface Course {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface LogoBreakdownProps {
  courses: Course[];
  activeCourse: number | null;
  onCourseClick: (id: number | null) => void;
}

export default function LogoBreakdown({ courses, activeCourse, onCourseClick }: LogoBreakdownProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const mainGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, []);

  return (
    <group ref={mainGroupRef}>
      {/* Central core that shrank */}
      <mesh scale={1 - animationProgress * 0.5}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial 
          color="#6366f1"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={1 - animationProgress * 0.5}
          emissive="#6366f1"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Course logos that fly out */}
      {courses.map((course, index) => (
        <CourseNode 
          key={course.id}
          course={course}
          index={index}
          total={courses.length}
          progress={animationProgress}
          isActive={activeCourse === course.id}
          onClick={() => onCourseClick(activeCourse === course.id ? null : course.id)}
        />
      ))}

      {/* Connection lines */}
      {courses.map((course, index) => (
        <ConnectionLine 
          key={`line-${course.id}`}
          index={index}
          total={courses.length}
          progress={animationProgress}
          color={course.color}
        />
      ))}
    </group>
  );
}

function CourseNode({ 
  course, 
  index, 
  total, 
  progress, 
  isActive,
  onClick 
}: { 
  course: Course; 
  index: number; 
  total: number; 
  progress: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const targetRadius = 3;
  const currentRadius = progress * targetRadius;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angle) * currentRadius;
      meshRef.current.position.z = Math.sin(angle) * currentRadius;
      meshRef.current.position.y = Math.sin(angle) * currentRadius * 0.3;
      
      // Hover/active scale
      const targetScale = isActive ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Rotation
      meshRef.current.rotation.y = t * 0.5 + index;
      meshRef.current.rotation.x = Math.sin(t * 0.3 + index) * 0.2;
    }
  });

  const shapes = [
    <boxGeometry key="box" args={[0.6, 0.6, 0.6]} />,
    <octahedronGeometry key="octa" args={[0.5, 0]} />,
    <icosahedronGeometry key="ico" args={[0.5, 0]} />,
    <tetrahedronGeometry key="tetra" args={[0.6, 0]} />,
  ];

  return (
    <group ref={meshRef} onClick={onClick}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
        {/* Main shape */}
        <mesh>
          {shapes[index % shapes.length]}
          <meshPhysicalMaterial 
            color={course.color}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            emissive={course.color}
            emissiveIntensity={isActive ? 1 : 0.3}
          />
        </mesh>

        {/* Wireframe outline */}
        <mesh scale={1.3}>
          {shapes[index % shapes.length]}
          <meshBasicMaterial 
            color={course.color}
            wireframe
            transparent
            opacity={isActive ? 0.8 : 0.3}
          />
        </mesh>

        {/* Glow effect */}
        <mesh scale={1.5}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial 
            color={course.color}
            transparent
            opacity={isActive ? 0.2 : 0.05}
          />
        </mesh>

        {/* Course name label */}
        <Text
          position={[0, -1, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {course.name}
        </Text>
      </Float>
    </group>
  );
}

function ConnectionLine({ 
  index, 
  total, 
  progress, 
  color 
}: { 
  index: number; 
  total: number; 
  progress: number;
  color: string;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const targetRadius = 3;
  const currentRadius = progress * targetRadius;

  useFrame(() => {
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position;
      if (positions) {
        positions.setXYZ(0, 0, 0, 0);
        positions.setXYZ(1, 
          Math.cos(angle) * currentRadius,
          Math.sin(angle) * currentRadius * 0.3,
          Math.sin(angle) * currentRadius
        );
        positions.needsUpdate = true;
      }
    }
  });

  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(
      Math.cos(angle) * currentRadius,
      Math.sin(angle) * currentRadius * 0.3,
      Math.sin(angle) * currentRadius
    ),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ 
        color, 
        transparent: true, 
        opacity: progress * 0.5 
      })
    )} />
  );
}
