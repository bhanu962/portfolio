import { useState, useEffect, useRef } from 'react';

// Character picking: 80% 'x' (slightly bigger), remainder '+', '*', '·'
const getNextSymbol = () => {
  const rand = Math.random();
  if (rand < 0.8) {
    return {
      char: 'x',
      size: 13,
      weight: 500,
    };
  }
  if (rand < 0.9) {
    return {
      char: '+',
      size: 11,
      weight: 400,
    };
  }
  if (rand < 0.96) {
    return {
      char: '*',
      size: 11,
      weight: 400,
    };
  }
  return {
    char: '·',
    size: 12,
    weight: 600,
  };
};

// Project theme palette: Deep slate (#0F172A), brand coral (#B94B3E), light coral (#E06051), and slate (#334155)
const THEME_COLORS = [
  '#0F172A',
  '#0F172A',
  '#1E293B',
  '#B94B3E', // Primary Coral
  '#0F172A',
  '#E06051', // Light Coral
  '#334155',
];

export default function MouseTrail() {
  const [trail, setTrail] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const lastPosRef = useRef({ x: -100, y: -100, time: 0 });
  const timeoutsRef = useRef(new Set());
  const cursorDotRef = useRef(null);

  useEffect(() => {
    // Hide default cursor on desktop when mouse is moving
    document.body.classList.add('hide-cursor');

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;

      if (!hasMoved) setHasMoved(true);

      // 1. Position the zero-lag 6px main dot immediately in hardware transform
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        cursorDotRef.current.style.opacity = '1';
      }

      const now = performance.now();
      const last = lastPosRef.current;
      const distance = Math.hypot(x - last.x, y - last.y);

      // 2. Spawn a new character every 16px of mouse movement
      if (distance >= 16 || last.time === 0) {
        lastPosRef.current = { x, y, time: now };

        const symbolInfo = getNextSymbol();
        const color = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
        const id = `${now}-${Math.random().toString(36).slice(2, 6)}`;

        // 2-3px subtle organic jitter offset
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

        // Queue: Keep last 22-25 points in state
        setTrail((prev) => {
          const trimmed = prev.length >= 24 ? prev.slice(prev.length - 23) : prev;
          return [...trimmed, newPoint];
        });

        // 1.2s (1200ms) removal timer matching CSS fade
        const timeoutId = setTimeout(() => {
          setTrail((prev) => prev.filter((p) => p.id !== id));
          timeoutsRef.current.delete(timeoutId);
        }, 1200);

        timeoutsRef.current.add(timeoutId);
      }
    };

    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest('a, button, [data-cursor], input, textarea, select, [role="button"]');
      setIsHovered(Boolean(isInteractive));
    };

    const handleMouseLeave = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = '1';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('hide-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      timeoutsRef.current.forEach((tId) => clearTimeout(tId));
      timeoutsRef.current.clear();
    };
  }, [hasMoved]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* 1. Trail of 15-25 tiny monospace symbols ('x', '+', '*', '·') that stay in place and fade over 1.2s */}
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
            textShadow:
              point.color === '#B94B3E' || point.color === '#E06051'
                ? '0 0 4px rgba(185, 75, 62, 0.45)'
                : 'none',
          }}
        >
          {point.char}
        </span>
      ))}

      {/* 2. Main 6px Cursor Dot with Zero Lag */}
      <div
        ref={cursorDotRef}
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 -ml-[3px] -mt-[3px] pointer-events-none select-none will-change-transform transition-opacity duration-150"
      >
        <div
          className={`w-[6px] h-[6px] rounded-full transition-all duration-150 ease-out ${
            isHovered
              ? 'scale-150 bg-[#B94B3E] shadow-[0_0_8px_rgba(185,75,62,0.8)]'
              : 'scale-100 bg-[#0F172A]'
          }`}
        />
      </div>
    </div>
  );
}
