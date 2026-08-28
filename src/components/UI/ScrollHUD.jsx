import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export default function ScrollHUD() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('HERO');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after slight initial delay
    const timer = setTimeout(() => setIsVisible(true), 800);

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  // SVG Circular progress meter dimensions
  const radius = 13.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;
  const isComplete = scrollProgress >= 100;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-slate-700 select-none font-typewriter transition-all duration-300 hover:border-[#B94B3E]/40 hover:shadow-[0_4px_20px_rgba(185,75,62,0.12)]">
      {/* 1. Circular Scroll Progress Meter */}
      <div className="relative flex items-center justify-center w-8 h-8">
        <svg className="w-8 h-8 -rotate-90 transform" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            className="stroke-slate-200"
            strokeWidth="2.4"
            fill="transparent"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            className="stroke-[#B94B3E] transition-all duration-150"
            strokeWidth="2.4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Display Checkmark on 100% completion, otherwise percentage number */}
        {isComplete ? (
          <Check className="absolute w-3.5 h-3.5 text-[#B94B3E] stroke-[3] animate-in zoom-in-75 duration-200" />
        ) : (
          <span className="absolute text-[9.5px] font-bold font-mono text-slate-800 leading-none">
            {scrollProgress}%
          </span>
        )}
      </div>

      <div className="h-4 w-[1px] bg-slate-200" />

      {/* 2. Active Section Badge */}
      <div className="flex items-center gap-2 pr-1.5">
        <span className="w-2 h-2 rounded-full bg-[#B94B3E] animate-pulse" />
        <span className="font-bold text-slate-900 tracking-wider text-[11px]">
          {activeSection}
        </span>
      </div>
    </div>
  );
}
