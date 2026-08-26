import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Code2, Rocket, Heart, Lightbulb, Code } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const increment = target / (duration / 25);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 25);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function About({ playHover }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'calendar':
        return <Calendar className="w-5 h-5 text-[#B94B3E]" />;
      case 'code':
        return <Code2 className="w-5 h-5 text-[#C54E41]" />;
      case 'rocket':
        return <Rocket className="w-5 h-5 text-[#9E382D]" />;
      default:
        return null;
    }
  };

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Text & Stats */}
        <motion.div
          className="lg:col-span-6 flex flex-col"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Subheading */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B94B3E]" />
            <span className="text-xs font-bold tracking-widest text-[#B94B3E] uppercase font-mono">
              ABOUT ME
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 mb-6 leading-tight">
            Building with passion, precision & modern tools
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-10 font-normal">
            {personalInfo.aboutText}
          </p>

          {/* 3 Statistic Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {personalInfo.stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                onMouseEnter={playHover}
                className="cred-card p-4 rounded-2xl flex flex-col items-start"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                data-cursor="hover"
              >
                <div className="p-2 rounded-xl bg-slate-100 mb-3">
                  {getIcon(stat.icon)}
                </div>

                <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-1 tracking-tight">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>

                <div className="text-xs text-slate-500 font-medium leading-snug">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: High Definition Portrait Photo with Orbit Ring */}
        <motion.div
          className="lg:col-span-6 flex items-center justify-center relative min-h-[440px]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Subtle Light Glow Ring */}
            <div className="absolute inset-0 rounded-full border border-[#B94B3E]/20 bg-gradient-to-tr from-red-50 to-orange-50/60 shadow-xl" />

            {/* Rotating Dashed Orbit Ring */}
            <motion.div
              className="absolute -inset-4 sm:-inset-5 rounded-full border border-dashed border-[#B94B3E]/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            />

            {/* Circular High Definition Portrait Photo Container */}
            <div className="w-full h-full rounded-full overflow-hidden p-2.5 relative z-10">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl bg-slate-100">
                <img
                  src="/assets/bhanu-portrait.jpg"
                  alt="Bhanu Sai Teja Narra"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>

            {/* Floating Badge 1: Top Left */}
            <motion.div
              className="absolute -top-2 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 shadow-md z-20"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              data-cursor="hover"
            >
              <Heart className="w-3.5 h-3.5 text-[#B94B3E] fill-[#B94B3E]" />
              <span className="text-xs font-semibold text-slate-800">
                Passionate Developer
              </span>
            </motion.div>

            {/* Floating Badge 2: Bottom Left */}
            <motion.div
              className="absolute -bottom-2 -left-2 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 shadow-md z-20"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              data-cursor="hover"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-slate-800">
                Problem Solver
              </span>
            </motion.div>

            {/* Floating Badge 3: Right Middle */}
            <motion.div
              className="absolute top-1/2 -right-3 sm:-right-6 -translate-y-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 shadow-md z-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              data-cursor="hover"
            >
              <Code className="w-3.5 h-3.5 text-[#B94B3E]" />
              <span className="text-xs font-semibold text-slate-800">
                Clean Code
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
