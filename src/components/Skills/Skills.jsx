import { useState } from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '../../data/skillsData';

function SkillCard({ skill, playHover }) {
  return (
    <motion.div
      className="cred-card rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-3 cursor-pointer"
      onMouseEnter={playHover}
      whileHover={{ y: -4, scale: 1.02 }}
      data-cursor="hover"
    >
      {/* Tech Icon */}
      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
        {skill.icon}
      </div>

      {/* Tech Name */}
      <span className="text-xs font-semibold font-display text-slate-800 tracking-wide text-center">
        {skill.name}
      </span>
    </motion.div>
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
          Technologies & core capabilities
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
            <button
              key={category}
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
