import { motion } from 'framer-motion';
import InteractiveCanvasBackground from './InteractiveCanvasBackground';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#FAFAFA]">
      {/* 1. Subtle High-Tech Dot Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `radial-gradient(#94A3B8 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 40%, transparent 95%)',
        }}
      />

      {/* 2. Soft Breathing Aurora Light Orbs */}
      {/* Top Center Coral Aura */}
      <motion.div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-red-200/25 via-orange-100/20 to-transparent rounded-full blur-[140px]"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 0.85, 0.6],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Left Ambient Glow */}
      <motion.div
        className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-gradient-to-r from-red-100/30 to-amber-100/20 rounded-full blur-[150px]"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Bottom Right Sky Glow */}
      <motion.div
        className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-gradient-to-l from-sky-100/25 via-red-50/20 to-transparent rounded-full blur-[160px]"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 3. Interactive Floating Constellation & Kinetic Particle Layer */}
      <InteractiveCanvasBackground />
    </div>
  );
}
