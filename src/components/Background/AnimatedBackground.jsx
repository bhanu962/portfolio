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

      {/* 2. Soft Breathing Aurora Light Orbs (Optimized GPU Radial Gradients) */}
      {/* Top Center Coral Aura */}
      <motion.div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full pointer-events-none gpu-layer"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.09) 0%, rgba(251, 146, 60, 0.05) 45%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.95, 0.7],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Left Ambient Glow */}
      <motion.div
        className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none gpu-layer"
        style={{
          background: 'radial-gradient(circle at center, rgba(185, 75, 62, 0.07) 0%, rgba(245, 158, 11, 0.04) 50%, transparent 70%)',
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Bottom Right Sky Glow */}
      <motion.div
        className="absolute -bottom-24 -right-24 w-[600px] h-[600px] rounded-full pointer-events-none gpu-layer"
        style={{
          background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.07) 0%, rgba(239, 68, 68, 0.04) 50%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.06, 1],
          x: [0, -20, 0],
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
