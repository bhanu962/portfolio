import { useRef, useState } from 'react';

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(185, 75, 62, 0.12)',
  tilt = true,
  ...props
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoords({ x, y });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      setRotate({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    if (tilt) {
      setRotate({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: tilt
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
          : 'none',
      }}
      {...props}
    >
      {/* 1. Dynamic Radial Mouse Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* 2. Refractive Laser Border Glow on Hover */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-20 rounded-[inherit]"
        style={{
          opacity,
          background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(185, 75, 62, 0.4), transparent 60%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1.5px',
        }}
      />

      {children}
    </div>
  );
}
