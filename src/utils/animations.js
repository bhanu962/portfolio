export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: custom * 0.15,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const letterReveal = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      delay: 0.4 + i * 0.04,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 15px rgba(0, 210, 255, 0.2)',
      '0 0 35px rgba(168, 85, 247, 0.5)',
      '0 0 15px rgba(0, 210, 255, 0.2)',
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
