import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import MainLogo3D from './components/MainLogo3D';
import CourseLogo2D from './components/CourseLogo2D';
import LogoBreakdown from './components/LogoBreakdown';
import './App.css';

export default function App() {
  const [isExploded, setIsExploded] = useState(false);
  const [activeCourse, setActiveCourse] = useState<number | null>(null);

  const courses = [
    { id: 1, name: 'Web Development', color: '#6366f1', icon: 'code' },
    { id: 2, name: 'Data Science', color: '#10b981', icon: 'chart' },
    { id: 3, name: 'AI & ML', color: '#f59e0b', icon: 'brain' },
    { id: 4, name: 'Cybersecurity', color: '#ef4444', icon: 'shield' },
  ];

  return (
    <div className="app-container">
      {/* Background gradient */}
      <div className="bg-gradient" />
      
      {/* Header */}
      <header className="header">
        <h1 className="title">Training Academy</h1>
        <p className="subtitle">Explore our courses in 3D</p>
      </header>

      {/* Main 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          className="three-canvas"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6366f1" />
            <pointLight position={[5, -5, 5]} intensity={0.3} color="#10b981" />
            
            {!isExploded ? (
              <MainLogo3D 
                onClick={() => setIsExploded(true)} 
              />
            ) : (
              <LogoBreakdown 
                courses={courses}
                activeCourse={activeCourse}
                onCourseClick={setActiveCourse}
              />
            )}
            
            <OrbitControls 
              enableZoom={true} 
              enablePan={false}
              autoRotate={!isExploded}
              autoRotateSpeed={2}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      {/* Controls */}
      <div className="controls">
        <button 
          className={`btn ${isExploded ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setIsExploded(!isExploded)}
        >
          {isExploded ? '← Back to Main Logo' : 'Explore Courses →'}
        </button>
      </div>

      {/* Course Info Panel */}
      {activeCourse !== null && (
        <div className="course-panel">
          <CourseLogo2D course={courses[activeCourse - 1]} />
          <div className="course-info">
            <h3>{courses[activeCourse - 1].name}</h3>
            <p>Click to learn more about this training program</p>
          </div>
        </div>
      )}

      {/* Course cards below */}
      {isExploded && (
        <div className="course-grid">
          {courses.map((course) => (
            <div 
              key={course.id}
              className={`course-card ${activeCourse === course.id ? 'active' : ''}`}
              onClick={() => setActiveCourse(activeCourse === course.id ? null : course.id)}
              style={{ '--card-color': course.color } as React.CSSProperties}
            >
              <div className="card-icon">
                <CourseIcon type={course.icon} color={course.color} />
              </div>
              <h4>{course.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseIcon({ type, color }: { type: string; color: string }) {
  const icons: Record<string, JSX.Element> = {
    code: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    brain: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3 6l-4 4-4-4c-1.5-1.5-3-3.5-3-6a7 7 0 0 1 7-7z" />
        <circle cx="12" cy="9" r="2" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 2l8 4v6c0 5.5-3.8 10-8 12-4.2-2-8-6.5-8-12V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  };
  return icons[type] || icons.code;
}
