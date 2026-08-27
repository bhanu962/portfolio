import { useState, useEffect } from 'react';

export default function ClickShockwave() {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Don't trigger on clicks inside inputs or textareas
      if (e.target.closest('input, textarea, select')) return;

      const { clientX: x, clientY: y } = e;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;

      // Pick brand coral or dark slate
      const color = Math.random() > 0.3 ? '#B94B3E' : '#0F172A';

      const newRipple = { id, x, y, color };

      setRipples((prev) => [...prev.slice(-8), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 550);
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99998] overflow-hidden select-none">
      {ripples.map((r) => (
        <div
          key={r.id}
          className="fixed top-0 left-0 pointer-events-none select-none"
          style={{
            transform: `translate3d(${r.x}px, ${r.y}px, 0)`,
          }}
        >
          {/* Inner expanding laser ring */}
          <div
            className="absolute -top-3 -left-3 w-6 h-6 rounded-full border border-[#B94B3E] animate-click-shockwave pointer-events-none"
            style={{ borderColor: r.color }}
          />

          {/* Secondary concentric diamond shockwave */}
          <div
            className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-[2px] border border-[#E06051]/70 animate-click-diamond pointer-events-none"
          />

          {/* 4 Micro starburst sparks */}
          {[
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
          ].map((dir, i) => (
            <div
              key={i}
              className="absolute -top-1 -left-1 w-2 h-2 pointer-events-none animate-click-spark"
              style={{
                '--dx': `${dir.dx * 22}px`,
                '--dy': `${dir.dy * 22}px`,
              }}
            >
              <svg width={8} height={8} viewBox="0 0 24 24" fill={r.color}>
                <path d="M12 0 Q12 12 0 12 Q12 12 12 24 Q12 12 24 12 Q12 12 12 0 Z" />
              </svg>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
