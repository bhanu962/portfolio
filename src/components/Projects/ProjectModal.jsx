import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Github } from '../Icons/SocialIcons';
import SvgButton from '../UI/SvgButton';

export default function ProjectModal({ project, onClose, playClick }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl z-10 my-auto border border-slate-200 flex flex-col"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              if (playClick) playClick();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-white/90 hover:text-white hover:bg-slate-900 transition-all border border-white/20 shadow-md"
            aria-label="Close modal"
            data-cursor="click"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {/* Project Preview Image Header - Full 16:9 Aspect Ratio with Zero Cropping */}
            <div className="relative w-full aspect-[16/9] bg-slate-950 overflow-hidden border-b border-slate-200">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-contain bg-slate-950"
                loading="eager"
              />

              {/* Category Pill */}
              <div className="absolute top-3.5 left-4 z-20 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white shadow-md">
                {project.category}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 flex flex-col gap-5">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-1.5 tracking-tight">
                  {project.title}
                </h3>
                <p className="text-[#B94B3E] font-mono text-xs font-semibold mb-3">
                  {project.subtitle}
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                  {project.description}
                </p>
              </div>

              {/* Metrics */}
              {project.stats && (
                <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-slate-100 bg-slate-50/70 rounded-2xl px-3 sm:px-4">
                  {Object.entries(project.stats).map(([key, val]) => (
                    <div key={key} className="flex flex-col items-center text-center">
                      <span className="font-display text-sm sm:text-base font-bold text-slate-900">
                        {val}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech Stack Tags */}
              <div>
                <span className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-wider block mb-2">
                  Tech Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-xs font-mono font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 pb-1">
                <SvgButton
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  variant="primary"
                  icon={ExternalLink}
                  className="w-full sm:flex-1 !py-3"
                >
                  Live preview
                </SvgButton>

                <SvgButton
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  variant="secondary"
                  icon={Github}
                  className="w-full sm:w-auto !py-3"
                >
                  Source code
                </SvgButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
