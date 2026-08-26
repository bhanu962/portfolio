import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { projectsData } from '../../data/projectsData';

export default function Projects({ playHover, playClick }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePrev = () => {
    if (playClick) playClick();
    setActiveSlide((prev) => (prev === 0 ? projectsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (playClick) playClick();
    setActiveSlide((prev) => (prev === projectsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="projects" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      {/* Section Header with Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#B94B3E]" />
            <span className="text-xs font-bold tracking-widest text-[#B94B3E] uppercase font-mono">
              FEATURED WORK
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Selected projects & applications
          </motion.h2>
        </div>

        {/* Navigation Arrows */}
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={handlePrev}
            onMouseEnter={playHover}
            className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Previous Projects"
            data-cursor="hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            onMouseEnter={playHover}
            className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Next Projects"
            data-cursor="hover"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {projectsData.slice(0, 3).map((project, idx) => {
          const hasLink = Boolean(project.demoUrl);
          const CardComponent = hasLink ? motion.a : motion.div;

          const cardProps = hasLink
            ? {
                href: project.demoUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                onClick: () => {
                  if (playClick) playClick();
                },
                'data-cursor': 'click',
              }
            : {};

          return (
            <CardComponent
              key={project.id}
              {...cardProps}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onMouseEnter={playHover}
              className={`group relative rounded-3xl overflow-hidden cred-card flex flex-col no-underline block ${
                hasLink ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative w-full h-52 bg-slate-950 overflow-hidden border-b border-slate-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                    hasLink ? 'group-hover:scale-105' : ''
                  }`}
                  loading="lazy"
                />

                {/* Top-Right Icon (Only rendered if project has a live link) */}
                {hasLink && (
                  <div className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/95 backdrop-blur-md border border-white/40 text-slate-800 shadow-md group-hover:bg-[#B94B3E] group-hover:text-white transition-all">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Category Pill on Card */}
                <div className="absolute bottom-3.5 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white shadow-md">
                  {project.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3
                      className={`text-xl font-bold font-display text-slate-900 tracking-tight transition-colors ${
                        hasLink ? 'group-hover:text-[#B94B3E]' : ''
                      }`}
                    >
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-mono font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardComponent>
          );
        })}
      </div>

      {/* Pagination Indicators */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {[0, 1, 2, 3].map((dot) => (
          <button
            key={dot}
            onClick={() => setActiveSlide(dot)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeSlide === dot ? 'w-6 bg-[#B94B3E]' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${dot + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
