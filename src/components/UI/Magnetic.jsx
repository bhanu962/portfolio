import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function Magnetic({
  children,
  className = '',
  strength = 0.28,
  radius = 120,
}) {
  const ref = useRef(null);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.12 };
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
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
