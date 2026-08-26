import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { experienceData } from '../../data/experienceData';

export default function Experience({ playHover }) {
  const containerRef = useRef(null);

  // Track scroll progress within this specific timeline section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 70%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center flex flex-col items-center mb-16">
        <motion.div
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#B94B3E]" />
          <span className="text-xs font-bold tracking-widest text-[#B94B3E] uppercase font-mono">
            EXPERIENCE & EDUCATION
          </span>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Career trajectory & milestones
        </motion.h2>
      </div>

      {/* Timeline Container */}
      <div ref={containerRef} className="relative max-w-4xl mx-auto">
        {/* Central Static Background Track Line */}
        <div className="absolute top-0 bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-0.5 bg-slate-200 rounded-full" />

        {/* Dynamic Highlighted Colored Progress Line (Fills down as you scroll) */}
        <motion.div
          className="absolute top-0 left-4 md:left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-[#B94B3E] via-[#E06051] to-[#B94B3E] rounded-full shadow-[0_0_10px_#B94B3E] z-10 origin-top"
          style={{ height: lineHeight }}
        />

        <div className="flex flex-col gap-10 sm:gap-12 relative z-20">
          {experienceData.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={item.year + item.role}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Node Dot with Animated Pulse on Active View */}
                <motion.div
                  className="absolute left-4 md:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-[#B94B3E] flex items-center justify-center shadow-md z-30"
                  whileInView={{ scale: [0.8, 1.15, 1] }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B94B3E] animate-pulse" />
                </motion.div>

                {/* Card */}
                <div
                  onMouseEnter={playHover}
                  className={`w-full md:w-[calc(50%-35px)] pl-10 md:pl-0 ${
                    isEven ? 'md:pl-0 md:pr-4' : 'md:pl-4'
                  }`}
                  data-cursor="hover"
                >
                  <div className="cred-card p-6 rounded-2xl relative">
                    {/* Year Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-[#B94B3E] font-mono text-xs font-bold">
                        {item.year}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {item.type}
                      </span>
                    </div>

                    {/* Role Title */}
                    <h3 className="text-lg font-bold font-display text-slate-900 mb-1 tracking-tight">
                      {item.role}
                    </h3>

                    {/* Company */}
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-3">
                      <span>{item.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#B94B3E]" />
                        {item.location}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3 font-normal">
                      {item.description}
                    </p>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
