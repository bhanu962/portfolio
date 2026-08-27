import { useState } from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '../../data/skillsData';
import MagneticText from '../UI/MagneticText';
import Magnetic from '../UI/Magnetic';

import SpotlightCard from '../UI/SpotlightCard';
import TextScramble from '../UI/TextScramble';

function SkillCard({ skill, playHover }) {
  return (
    <SpotlightCard
      className="rounded-2xl cred-card"
      spotlightColor="rgba(185, 75, 62, 0.16)"
      tilt={true}
    >
      <motion.div
        className="p-4 sm:p-5 flex flex-col items-center justify-center gap-3 cursor-pointer w-full h-full"
        onMouseEnter={playHover}
        whileHover={{ y: -4, scale: 1.02 }}
        data-cursor="hover"
      >
        {/* Tech Icon */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-transform group-hover:scale-110">
          {skill.icon}
        </div>

        {/* Tech Name */}
        <span className="text-xs font-semibold font-display text-slate-800 tracking-wide text-center">
          <TextScramble text={skill.name} triggerOnHover={true} />
        </span>
      </motion.div>
    </SpotlightCard>
  );
}

export default function Skills({ playHover }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Languages', 'Frontend', 'Backend', 'Database', 'Core Concepts', 'Tools'];

  const filteredSkills =
    activeCategory === 'All'
      ? skillsData
      : skillsData.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center flex flex-col items-center mb-12">
        <motion.div
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#B94B3E]" />
          <span className="text-xs font-bold tracking-widest text-[#B94B3E] uppercase font-mono">
            TECHNICAL SKILLS
          </span>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <MagneticText text="Technologies & core capabilities" strength={0.3} radius={100} />
        </motion.h2>

        {/* Category Filter Pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mt-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => (
            <Magnetic key={category} strength={0.2} radius={60}>
              <button
                onClick={() => setActiveCategory(category)}
                onMouseEnter={playHover}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeCategory === category
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                data-cursor="hover"
              >
                {category}
              </button>
            </Magnetic>
          ))}
        </motion.div>
      </div>

      {/* Skills Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5"
        layout
      >
        {filteredSkills.map((skill, idx) => (
          <motion.div
            key={skill.name}
            layout
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.03 }}
          >
            <SkillCard skill={skill} playHover={playHover} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
