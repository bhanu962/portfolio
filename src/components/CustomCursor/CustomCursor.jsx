import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const trailSpringConfig = { damping: 20, stiffness: 180, mass: 0.8 };

  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const trailX = useSpring(mouseX, trailSpringConfig);
  const trailY = useSpring(mouseY, trailSpringConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const handleElementHover = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const type = target.getAttribute('data-cursor');
        setCursorVariant(type);
        if (type === 'view') {
          setCursorText('VIEW');
        } else if (type === 'click') {
          setCursorText('OPEN');
        } else {
          setCursorText('');
        }
      } else {
        const isInteractive = e.target.closest('a, button, input, textarea, select, [role="button"]');
        if (isInteractive) {
          setCursorVariant('hover');
          setCursorText('');
        } else {
          setCursorVariant('default');
          setCursorText('');
        }
      }
    };

    window.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementHover);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#B94B3E] pointer-events-none shadow-sm"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorVariant === 'hover' ? 1.4 : cursorVariant === 'view' ? 0 : 1,
          opacity: cursorVariant === 'view' ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Lagging Ring / View Badge */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none flex items-center justify-center transition-colors duration-200 ${
          cursorVariant === 'view'
            ? 'w-14 h-14 bg-slate-900 text-white font-mono text-[9px] font-bold tracking-widest shadow-lg'
            : cursorVariant === 'hover'
            ? 'w-10 h-10 border border-[#B94B3E] bg-red-50/50'
            : 'w-7 h-7 border border-slate-400/50'
        }`}
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorVariant === 'hover' ? 1.15 : cursorVariant === 'view' ? 1 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {cursorText && (
          <span className="text-white font-mono tracking-wider font-semibold">
            {cursorText}
          </span>
        )}
      </motion.div>
    </div>
  );
}
