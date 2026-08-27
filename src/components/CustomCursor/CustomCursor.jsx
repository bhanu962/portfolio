import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// Exact Website Brand Palette (Primary Coral, Light Coral, Dark Coral, Deep Slate, Charcoal Slate)
const WEBSITE_PALETTE = [
  '#B94B3E', // Signature Primary Coral
  '#0F172A', // Deep Slate / Black
  '#E06051', // Vibrant Light Coral
  '#9E382D', // Deep Crimson Coral
  '#1E293B', // Charcoal Slate
  '#334155', // Medium Slate
];

// Dynamic Morphing Animation Modes for the pointer
const POINTER_ANIMATION_MODES = [
  {
    name: 'circle-breath',
    borderRadius: '50%',
    rotate: 0,
    animateScale: [1, 1.3, 1],
    transitionDuration: 1.4,
    symbols: ['x', '+', '*', '·'],
  },
  {
    name: 'diamond-spin',
    borderRadius: '3px',
    rotate: 45,
    animateScale: [1, 1.2, 1],
    transitionDuration: 1.2,
    symbols: ['✦', '✧', 'x', '+'],
  },
  {
    name: 'squircle-pulse',
    borderRadius: '32%',
    rotate: 15,
    animateScale: [0.95, 1.25, 0.95],
    transitionDuration: 1.5,
    symbols: ['{', '}', 'x', '·'],
  },
  {
    name: 'hex-twinkle',
    borderRadius: '4px',
    rotate: 90,
    animateScale: [1, 1.35, 1],
    transitionDuration: 1.1,
    symbols: ['*', '·', '✦', '+'],
  },
  {
    name: 'starburst-morph',
    borderRadius: '50%',
    rotate: 180,
    animateScale: [1.1, 0.9, 1.1],
    transitionDuration: 1.3,
    symbols: ['x', '·', '*', '+'],
  },
];

export default function CustomCursor() {
  const [trail, setTrail] = useState([]);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Dynamic Color & Animation Mode State
  const [currentColor, setCurrentColor] = useState(WEBSITE_PALETTE[0]);
  const [currentMode, setCurrentMode] = useState(POINTER_ANIMATION_MODES[0]);

  const lastPosRef = useRef({ x: -100, y: -100, time: 0 });
  const timeoutsRef = useRef(new Set());
  const currentModeRef = useRef(POINTER_ANIMATION_MODES[0]);
  const isTouchActiveRef = useRef(false);
  const fadeTimeoutRef = useRef(null);

  // Framer Motion Spring Values for ultra-fluid cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast spring for inner dot (crisp, zero lag)
  const dotSpringConfig = { damping: 32, stiffness: 650, mass: 0.15 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  // 1. Synchronously cycle both Colors AND Animation Modes over time (every 1.8s)
  useEffect(() => {
    let modeIndex = 0;
    const interval = setInterval(() => {
      const nextColor = WEBSITE_PALETTE[Math.floor(Math.random() * WEBSITE_PALETTE.length)];
      setCurrentColor(nextColor);

      modeIndex = (modeIndex + 1) % POINTER_ANIMATION_MODES.length;
      const nextMode = POINTER_ANIMATION_MODES[modeIndex];
      currentModeRef.current = nextMode;
      setCurrentMode(nextMode);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const getSymbolForCurrentMode = () => {
    const symbolList = currentModeRef.current.symbols;
    const rand = Math.random();
    if (rand < 0.7) return { char: symbolList[0], size: 19, weight: 800 };
    if (rand < 0.85) return { char: symbolList[1], size: 17, weight: 700 };
    if (rand < 0.95) return { char: symbolList[2], size: 18, weight: 800 };
    return { char: symbolList[3], size: 21, weight: 900 };
  };

  useEffect(() => {
    document.body.classList.add('hide-cursor');

    const processPointerMove = (x, y) => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }

      mouseX.set(x);
      mouseY.set(y);

      if (!isVisible) setIsVisible(true);

      const now = performance.now();
      const last = lastPosRef.current;
      const distance = Math.hypot(x - last.x, y - last.y);

      // Spawn symbol trail every 18px of movement
      if (distance >= 18 || last.time === 0) {
        lastPosRef.current = { x, y, time: now };

        const symbolInfo = getSymbolForCurrentMode();
        const color = WEBSITE_PALETTE[Math.floor(Math.random() * WEBSITE_PALETTE.length)];
        const id = `${now}-${Math.random().toString(36).slice(2, 6)}`;

        // 2-3px subtle organic offset
        const offsetX = (Math.random() - 0.5) * 4;
        const offsetY = (Math.random() - 0.5) * 4;

        const newPoint = {
          id,
          x: x + offsetX,
          y: y + offsetY,
          char: symbolInfo.char,
          size: symbolInfo.size,
          weight: symbolInfo.weight,
          color,
        };

        setTrail((prev) => {
          const trimmed = prev.length >= 24 ? prev.slice(prev.length - 23) : prev;
          return [...trimmed, newPoint];
        });

        const timeoutId = setTimeout(() => {
          setTrail((prev) => prev.filter((p) => p.id !== id));
          timeoutsRef.current.delete(timeoutId);
        }, 1200);

        timeoutsRef.current.add(timeoutId);
      }
    };

    // Mouse Event Handlers
    const handleMouseMove = (e) => {
      processPointerMove(e.clientX, e.clientY);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    // Mobile / Touch Event Handlers
    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        isTouchActiveRef.current = true;
        const touch = e.touches[0];
        setIsMouseDown(true);
        processPointerMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        processPointerMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      isTouchActiveRef.current = false;
      setIsMouseDown(false);
      fadeTimeoutRef.current = setTimeout(() => {
        if (!isTouchActiveRef.current) {
          setIsVisible(false);
        }
      }, 1200);
    };

    const handleMouseOver = (e) => {
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

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Desktop Mouse Listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Mobile Touch Listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      document.body.classList.remove('hide-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);

      timeoutsRef.current.forEach((tId) => clearTimeout(tId));
      timeoutsRef.current.clear();
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [isVisible]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* 1. Razor-Sharp Dotted Monospace Symbol Trail (Follows Mouse & Finger Drag) */}
      {trail.map((point) => (
        <span
          key={point.id}
          className="symbol-trail-point fixed select-none pointer-events-none will-change-transform"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            color: point.color,
            fontSize: `${point.size}px`,
            fontWeight: point.weight,
            fontFamily: "'Space Mono', 'JetBrains Mono', 'Courier New', monospace",
            lineHeight: 1,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'geometricPrecision',
          }}
        >
          {point.char}
        </span>
      ))}

      {/* 2. Crystal-Clear Pointer with Synchronously Morphing Animations & Changing Colors */}
      <motion.div
        className="fixed top-0 left-0 w-3.5 h-3.5 pointer-events-none border border-white/90 shadow-xs will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: currentColor,
          opacity: isVisible ? 1 : 0,
          transition: 'background-color 0.6s ease, border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        animate={{
          borderRadius: currentMode.borderRadius,
          rotate: cursorVariant === 'hover' ? currentMode.rotate + 45 : currentMode.rotate,
          scale:
            cursorVariant === 'hover'
              ? 1.7
              : cursorVariant === 'view' || cursorVariant === 'click'
              ? 0
              : isMouseDown
              ? 0.75
              : currentMode.animateScale,
        }}
        transition={{
          rotate: { duration: 0.6, ease: 'easeOut' },
          scale:
            cursorVariant === 'hover' || isMouseDown
              ? { duration: 0.15 }
              : {
                  duration: currentMode.transitionDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
        }}
      />

      {/* 3. Interactive View / Click Badge (Only on project cards) */}
      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 w-14 h-14 rounded-full pointer-events-none flex items-center justify-center bg-slate-950 text-white font-mono text-[9px] font-bold tracking-widest shadow-xl border border-white/20"
          style={{
            x: dotX,
            y: dotY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18 }}
        >
          <span className="text-white font-mono tracking-wider font-semibold text-[9px]">
            {cursorText}
          </span>
        </motion.div>
      )}
    </div>
  );
}
