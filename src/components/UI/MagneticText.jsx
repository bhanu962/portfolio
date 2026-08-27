import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

function MagneticItem({ children, className = '', strength = 0.35, radius = 120 }) {
  const ref = useRef(null);

  const springConfig = { damping: 14, stiffness: 220, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distance = Math.hypot(clientX - centerX, clientY - centerY);

    if (distance < radius) {
      const pull = (1 - distance / radius) * strength;
      x.set((clientX - centerX) * pull);
      y.set((clientY - centerY) * pull);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block will-change-transform transition-colors duration-150 ${className}`}
    >
      {children}
    </motion.span>
  );
}

export default function MagneticText({
  text,
  children,
  className = '',
  charClassName = '',
  strength = 0.35,
  radius = 120,
  splitBy = 'chars', // 'chars' | 'words'
}) {
  const content = text || (typeof children === 'string' ? children : null);

  if (!content) {
    return <span className={className}>{children}</span>;
  }

  if (splitBy === 'words') {
    const words = content.split(' ');
    return (
      <span className={`inline-flex flex-wrap ${className}`}>
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-flex mr-[0.28em] last:mr-0">
            <MagneticItem
              strength={strength}
              radius={radius}
              className={charClassName}
            >
              {word}
            </MagneticItem>
          </span>
        ))}
      </span>
    );
  }

  // Split by characters while keeping words grouped to avoid unwanted mid-word line breaks
  const words = content.split(' ');
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex whitespace-nowrap mr-[0.25em] last:mr-0">
          {Array.from(word).map((char, cIdx) => (
            <MagneticItem
              key={`${wIdx}-${cIdx}`}
              strength={strength}
              radius={radius}
              className={charClassName}
            >
              {char}
            </MagneticItem>
          ))}
        </span>
      ))}
    </span>
  );
}
