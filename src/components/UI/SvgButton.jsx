import React from 'react';
import { motion } from 'framer-motion';

export default function SvgButton({
  children,
  href,
  onClick,
  onMouseEnter,
  variant = 'primary',
  className = '',
  icon: Icon,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseStyles = `
    group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 
    rounded-xl font-display text-xs sm:text-sm font-semibold tracking-wider uppercase
    bg-transparent hover:bg-transparent text-slate-900 hover:text-[#B94B3E]
    transition-colors duration-300 overflow-visible cursor-pointer select-none
  `;

  const content = (
    <>
      {/* SVG Laser Tracing Border Animation */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Background static line */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="10"
          pathLength="100"
          className="fill-none stroke-slate-300"
          strokeWidth="1.5"
        />

        {/* Highlight animated red/coral laser line */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="10"
          pathLength="100"
          className="hl-line fill-none transition-all duration-700 ease-in-out"
          style={{
            stroke: '#B94B3E',
            strokeWidth: '2',
            strokeDasharray: '25 100',
            strokeDashoffset: '25',
          }}
        />
      </svg>

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2 text-slate-900 group-hover:text-[#B94B3E] transition-colors duration-300">
        {Icon && <Icon className="w-4 h-4 text-slate-700 group-hover:text-[#B94B3E] transition-colors duration-300" />}
        <span>{children}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        whileTap={{ scale: 0.97 }}
        className={`${baseStyles} ${className} svg-laser-btn`}
        data-cursor="hover"
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${className} svg-laser-btn disabled:opacity-50 disabled:cursor-not-allowed`}
      data-cursor="hover"
      {...props}
    >
      {content}
    </motion.button>
  );
}
