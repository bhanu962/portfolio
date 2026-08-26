import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';

export default function Footer({ playHover, playClick }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    if (playClick) playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-slate-200 bg-white/85 backdrop-blur-xl py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <a
            href="#home"
            onClick={scrollToTop}
            onMouseEnter={playHover}
            className="flex items-center gap-2 group cursor-pointer select-none bg-transparent"
            data-cursor="click"
          >
            {/* Transparent Icon Logo Box */}
            <div className="w-7 h-7 rounded-lg border border-[#B94B3E]/40 flex items-center justify-center bg-transparent group-hover:border-[#B94B3E] transition-all">
              <span className="font-display font-extrabold text-[11px] tracking-tight text-[#B94B3E]">
                BN
              </span>
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-slate-900 group-hover:text-[#B94B3E] transition-colors">
              {personalInfo.name}
            </span>
          </a>
          <p className="text-xs text-slate-500 font-mono">
            © {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.
          </p>
        </div>

        {/* Center: Live Time */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B94B3E] animate-pulse" />
            <span>HYD, IN — {time || '12:00:00 AM'} IST</span>
          </div>
        </div>

        {/* Right: Back to Top */}
        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            onMouseEnter={playHover}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all group cursor-pointer"
            title="Back to Top"
            data-cursor="hover"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
