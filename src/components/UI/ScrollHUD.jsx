import { useState, useEffect } from 'react';

export default function ScrollHUD() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('HERO');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after slight initial delay
    const timer = setTimeout(() => setIsVisible(true), 800);

    const handleMouseMove = (e) => {
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    };

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setScrollProgress(currentProgress);
      }

      // Track active section
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveSection(sectionId.toUpperCase());
            break;
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  // SVG Circular progress radius
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-slate-700 select-none font-typewriter text-[11px] tracking-tight transition-all duration-300 hover:border-[#B94B3E]/40 hover:shadow-[0_4px_20px_rgba(185,75,62,0.12)]">
      {/* 1. Circular Scroll Progress Meter */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <svg className="w-6 h-6 -rotate-90 transform" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r={radius}
            className="stroke-slate-200"
            strokeWidth="2.5"
            fill="transparent"
          />
          <circle
            cx="14"
            cy="14"
            r={radius}
            className="stroke-[#B94B3E] transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-[8px] font-bold text-slate-800">
          {scrollProgress}%
        </span>
      </div>

      <div className="h-3 w-[1px] bg-slate-200" />

      {/* 2. Active Section Badge */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B94B3E] animate-pulse" />
        <span className="font-semibold text-slate-900 tracking-wider text-[10px]">
          {activeSection}
        </span>
      </div>

      <div className="h-3 w-[1px] bg-slate-200" />

      {/* 3. Live Cursor Coordinates */}
      <div className="text-[10px] text-slate-500 font-mono">
        <span className="text-[#B94B3E] font-semibold">X:</span>{coords.x}{' '}
        <span className="text-[#B94B3E] font-semibold">Y:</span>{coords.y}
      </div>
    </div>
  );
}
