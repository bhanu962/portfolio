import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo } from '../../data/personalInfo';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Dynamic real-time status steps
  const getStatusText = (val) => {
    if (val < 25) return 'INITIALIZING DIGITAL ENVIRONMENT...';
    if (val < 55) return 'LOADING PROJECTS & SYSTEM DATA...';
    if (val < 85) return 'CONFIGURING INTERACTIVE EXPERIENCES...';
    if (val < 100) return 'FINALIZING ASSETS & ANIMATIONS...';
    return 'EXPERIENCE READY';
  };

  useEffect(() => {
    // Total duration around 2.8s for a real, satisfying loading journey
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 400);
          }, 350);
          return 100;
        }

        // Realistic variable speed increments
        let step = Math.floor(Math.random() * 4) + 2;
        if (prev > 75 && prev < 95) step = Math.floor(Math.random() * 3) + 1; // gentle suspense near end
        if (prev >= 95) step = 2;

        return Math.min(prev + step, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(12px)',
            transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* Ambient Background Aura */}
          <div className="absolute w-[450px] h-[450px] bg-red-100/40 rounded-full blur-[120px] pointer-events-none" />

          {/* Central Monogram with Dual Counter-Rotating Laser Orbit Rings */}
          <div className="relative w-24 h-24 flex items-center justify-center mb-6">
            {/* Outer Counter-Clockwise Dashed Ring */}
            <motion.svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1.5"
                strokeDasharray="6 8"
              />
            </motion.svg>

            {/* Inner Clockwise Glowing Laser Arc Ring */}
            <motion.svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke="#B94B3E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="65 190"
              />
            </motion.svg>

            {/* Central Transparent Logo Box */}
            <motion.div
              className="w-14 h-14 rounded-2xl border-1.5 border-[#B94B3E]/50 flex items-center justify-center bg-white/90 shadow-sm backdrop-blur-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-display font-extrabold text-xl tracking-tight text-[#B94B3E]">
                BN
              </span>
            </motion.div>
          </div>

          {/* Name Title */}
          <motion.h2
            className="text-2xl font-bold font-display text-slate-900 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {personalInfo.name}
          </motion.h2>

          {/* Precise Progress Bar */}
          <div className="w-64 sm:w-72 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3 p-0.5 border border-slate-200/80 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#B94B3E] via-[#E06051] to-[#B94B3E] rounded-full shadow-[0_0_10px_rgba(185,75,62,0.4)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>

          {/* Live Progress Percentage & Status Label */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="font-mono text-sm font-bold text-slate-800 tracking-wider">
              {progress}%
            </span>
            <span className="font-mono text-[11px] font-medium text-slate-400 tracking-widest uppercase transition-all duration-300">
              {getStatusText(progress)}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
