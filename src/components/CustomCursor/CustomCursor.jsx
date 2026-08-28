import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// Website Brand Palette (Primary Coral, Light Coral, Deep Crimson, Deep Slate, Charcoal Slate)
const WEBSITE_PALETTE = [
  '#B94B3E', // Signature Primary Coral
  '#E06051', // Vibrant Light Coral
  '#9E382D', // Deep Crimson Coral
  '#0F172A', // Deep Slate / Black
  '#1E293B', // Charcoal Slate
  '#334155', // Medium Slate
];

// Solid Gemini-style 4-pointed sparkle stars
const GEMINI_STAR = '✦';

const getRandomStar = () => {
  const size = Math.round(13 + Math.random() * 9);
  const color = WEBSITE_PALETTE[Math.floor(Math.random() * WEBSITE_PALETTE.length)];
  const rotation = Math.floor(Math.random() * 360);
  return {
    char: GEMINI_STAR,
    size,
    weight: 800,
    color,
    rotation,
  };
};

export default function CustomCursor() {
  const [trail, setTrail] = useState([]);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isCircleFaded, setIsCircleFaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const lastPosRef = useRef({ x: -100, y: -100, time: 0 });
  const timeoutsRef = useRef(new Set());
  const isTouchActiveRef = useRef(false);
  const fadeTimeoutRef = useRef(null);
  const circleFadeTimeoutRef = useRef(null);

  // Framer Motion Spring Values for fluid cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast spring for cursor pointer (ultra crisp, zero lag)
  const pointerSpringConfig = { damping: 36, stiffness: 780, mass: 0.1 };
  const pointerX = useSpring(mouseX, pointerSpringConfig);
  const pointerY = useSpring(mouseY, pointerSpringConfig);

  // Synchronize active cursor color globally for click sparks
  useEffect(() => {
    document.documentElement.style.setProperty('--cursor-color', '#B94B3E');
    if (typeof window !== 'undefined') {
      window.__activeCursorColor = '#B94B3E';
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('hide-cursor');
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

      // Spawn sparkling star trail only behind the movement path (never on the cursor)
      if (last.time > 0 && distance >= 22) {
        const starInfo = getRandomStar();
        const id = `${now}-${Math.random().toString(36).slice(2, 6)}`;

        // Spawn safely in the trailing wake at the previous location left behind
        const spawnX = last.x + (Math.random() - 0.5) * 6;
        const spawnY = last.y + (Math.random() - 0.5) * 6;

        const newPoint = {
          id,
          x: spawnX,
          y: spawnY,
          ...starInfo,
        };

        setTrail((prev) => {
          const trimmed = prev.length >= 20 ? prev.slice(prev.length - 19) : prev;
          return [...trimmed, newPoint];
        });

        const timeoutId = setTimeout(() => {
          setTrail((prev) => prev.filter((p) => p.id !== id));
          timeoutsRef.current.delete(timeoutId);
        }, 750);

        timeoutsRef.current.add(timeoutId);
        lastPosRef.current = { x, y, time: now };
      } else if (last.time === 0) {
        lastPosRef.current = { x, y, time: now };
      }
    };

    const triggerCircleFade = () => {
      setIsCircleFaded(true);
      if (circleFadeTimeoutRef.current) {
        clearTimeout(circleFadeTimeoutRef.current);
      }
      // Fade circle back in after snappy 260ms (zero lag, right as click sparks settle)
      circleFadeTimeoutRef.current = setTimeout(() => {
        setIsCircleFaded(false);
      }, 260);
    };

    // Mouse Event Handlers
    const handleMouseMove = (e) => {
      processPointerMove(e.clientX, e.clientY);
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
      triggerCircleFade();
    };

    const handleMouseUp = () => setIsMouseDown(false);

    // Mobile / Touch Event Handlers
    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        isTouchActiveRef.current = true;
        const touch = e.touches[0];
        setIsMouseDown(true);
        triggerCircleFade();
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
      }, 900);
    };

    const handleMouseOver = (e) => {
      const isInteractive = Boolean(
        e.target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor], [onclick], .cursor-pointer, .group'
        )
      );
      setIsHoveringLink(isInteractive);
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
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.documentElement.classList.remove('hide-cursor');
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
      if (circleFadeTimeoutRef.current) clearTimeout(circleFadeTimeoutRef.current);
    };
  }, [isVisible]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* 1. Sparkling Star Mouse Trail in Website Accent Colors */}
      {trail.map((point) => (
        <span
          key={point.id}
          className="star-trail-point fixed select-none pointer-events-none will-change-transform"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            color: point.color,
            fontSize: `${point.size}px`,
            fontWeight: point.weight,
            lineHeight: 1,
            textShadow: `0 0 8px ${point.color}80, 0 0 16px ${point.color}40`,
            '--initial-rot': `${point.rotation}deg`,
            fontFamily: "'Outfit', 'Inter', sans-serif",
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'geometricPrecision',
          }}
        >
          {point.char}
        </span>
      ))}

      {/* 2. Interactive Arrowhead Cursor:
             - Normal State: Transparent inside with Website Accent Gradient Border
             - Clickable State: Accent Circle Ring (fades for 1s on click) + White Inside + Accent Border */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-10"
        style={{
          x: pointerX,
          y: pointerY,
          transformOrigin: '14px 14px',
          translateX: '-14px',
          translateY: '-14px',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isMouseDown ? 0.88 : isHoveringLink ? 1.12 : 1,
          rotate: isMouseDown ? -6 : isHoveringLink ? -3 : 0,
        }}
        transition={{
          scale: { duration: 0.15, ease: 'easeOut' },
          rotate: { duration: 0.15, ease: 'easeOut' },
        }}
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_3px_12px_rgba(185,75,62,0.45)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] filter transition-all duration-150"
        >
          <defs>
            {/* Website Signature Coral Accent Gradient */}
            <linearGradient id="cursorBorderAccentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FA5252" />
              <stop offset="35%" stopColor="#E03131" />
              <stop offset="70%" stopColor="#B94B3E" />
              <stop offset="100%" stopColor="#9E382D" />
            </linearGradient>
          </defs>

          {/* Clickable Target Arc - Positioned at Back of Tip (Fades for 1 second upon click) */}
          {isHoveringLink && (
            <motion.path
              d="M 15.4 17.6 A 5.7 5.7 0 1 1 17.6 15.4"
              fill="none"
              stroke="url(#cursorBorderAccentGradient)"
              strokeWidth="2.0"
              strokeLinecap="round"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: isMouseDown ? 0.85 : 1,
                opacity: isCircleFaded ? 0 : 1,
              }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{
                opacity: { duration: isCircleFaded ? 0.1 : 0.22, ease: 'easeOut' },
                scale: { duration: 0.14, ease: 'easeOut' },
              }}
            />
          )}

          {/* Transparent Arrowhead Body with Website Accent Border (100% Transparent Over Every Element) */}
          <g>
            <path
              d="M 14.0 14.0 
                 C 13.5 13.5, 14.3 12.8, 14.9 13.1 
                 L 37.8 21.6 
                 C 38.6 21.9, 38.6 23.0, 37.8 23.4 
                 L 27.6 27.6 
                 L 23.4 37.8 
                 C 23.0 38.6, 21.9 38.6, 21.6 37.8 
                 L 13.1 14.9 
                 C 12.8 14.3, 13.5 13.5, 14.0 14.0 Z"
              fill="none"
              stroke="url(#cursorBorderAccentGradient)"
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
