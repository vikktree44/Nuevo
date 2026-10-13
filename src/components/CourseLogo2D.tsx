interface Course {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface CourseLogo2DProps {
  course: Course;
}

export default function CourseLogo2D({ course }: CourseLogo2DProps) {
  const shapes: Record<string, JSX.Element> = {
    code: (
      <div className="shape-2d shape-cube" style={{ '--shape-color': course.color } as React.CSSProperties}>
        <div className="shape-face front" />
        <div className="shape-face back" />
        <div className="shape-face left" />
        <div className="shape-face right" />
        <div className="shape-face top" />
        <div className="shape-face bottom" />
      </div>
    ),
    chart: (
      <div className="shape-2d shape-diamond" style={{ '--shape-color': course.color } as React.CSSProperties}>
        <div className="diamond-inner" />
      </div>
    ),
    brain: (
      <div className="shape-2d shape-sphere" style={{ '--shape-color': course.color } as React.CSSProperties}>
        <div className="sphere-ring ring-1" />
        <div className="sphere-ring ring-2" />
        <div className="sphere-ring ring-3" />
        <div className="sphere-core" />
      </div>
    ),
    shield: (
      <div className="shape-2d shape-octa" style={{ '--shape-color': course.color } as React.CSSProperties}>
        <div className="octa-face face-1" />
        <div className="octa-face face-2" />
        <div className="octa-face face-3" />
        <div className="octa-face face-4" />
      </div>
    ),
  };

  return (
    <div className="course-logo-2d">
      <div className="logo-glow" style={{ '--glow-color': course.color } as React.CSSProperties} />
      {shapes[course.icon] || shapes.code}
    </div>
  );
}
