import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Terminal,
  FileText,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  Code2,
  Briefcase,
  User,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { projectsData } from '../../data/projectsData';

export default function CommandPalette({
  soundEnabled,
  toggleSound,
  playHover,
  playClick,
  triggerConfetti,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Global Keyboard listener for Ctrl+K / ⌘K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (playClick) playClick();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playClick]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const navigationItems = [
    {
      id: 'nav-home',
      label: 'Home / Hero',
      icon: User,
      category: 'Navigation',
      action: () => {
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      id: 'nav-about',
      label: 'About Me & Education',
      icon: User,
      category: 'Navigation',
      action: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      id: 'nav-skills',
      label: 'Technical Skills & Tools',
      icon: Code2,
      category: 'Navigation',
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      id: 'nav-projects',
      label: 'Featured Projects',
      icon: Briefcase,
      category: 'Navigation',
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      id: 'nav-experience',
      label: 'Experience & Milestones',
      icon: Briefcase,
      category: 'Navigation',
      action: () => {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      id: 'nav-contact',
      label: 'Contact & Hire',
      icon: Send,
      category: 'Navigation',
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      id: 'act-resume',
      label: 'Download Resume PDF',
      icon: FileText,
      category: 'Actions',
      action: () => {
        const link = document.createElement('a');
        link.href = '/assets/Bhanu_Sai_Teja_Narra_Resume.pdf';
        link.download = 'Bhanu_Sai_Teja_Narra_Resume.pdf';
        link.click();
        setIsOpen(false);
      },
    },
    {
      id: 'act-sound',
      label: soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects',
      icon: soundEnabled ? VolumeX : Volume2,
      category: 'Actions',
      action: () => {
        if (toggleSound) toggleSound();
        setIsOpen(false);
      },
    },
    {
      id: 'act-confetti',
      label: 'Trigger Confetti Celebration 🎉',
      icon: Sparkles,
      category: 'Easter Eggs',
      action: () => {
        if (triggerConfetti) triggerConfetti();
        setIsOpen(false);
      },
    },
    {
      id: 'act-github',
      label: 'Open GitHub Profile',
      icon: ExternalLink,
      category: 'Socials',
      action: () => {
        window.open(personalInfo.socials.github, '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'act-linkedin',
      label: 'Open LinkedIn Profile',
      icon: ExternalLink,
      category: 'Socials',
      action: () => {
        window.open(personalInfo.socials.linkedin, '_blank');
        setIsOpen(false);
      },
    },
  ];

  // Also include project shortcuts dynamically
  projectsData.forEach((project) => {
    navigationItems.push({
      id: `proj-${project.id}`,
      label: `Project: ${project.title}`,
      icon: Code2,
      category: 'Projects',
      action: () => {
        if (project.demoUrl) {
          window.open(project.demoUrl, '_blank');
        } else {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
      },
    });
  });

  const filteredItems = query.trim()
    ? navigationItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : navigationItems;

  const handleKeyDownModal = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      if (playHover) playHover();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      if (playHover) playHover();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        if (playClick) playClick();
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <>
      {/* Floating Keyboard Shortcut Pill (Bottom-Right) */}
      <button
        onClick={() => {
          setIsOpen(true);
          if (playClick) playClick();
        }}
        onMouseEnter={playHover}
        className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm hover:border-[#B94B3E]/50 hover:shadow-md transition-all duration-300 text-xs font-mono font-medium text-slate-700 cursor-pointer group"
        aria-label="Open Command Palette"
        data-cursor="hover"
      >
        <Terminal className="w-3.5 h-3.5 text-[#B94B3E] group-hover:rotate-12 transition-transform" />
        <span>Command Menu</span>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-bold">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99990] flex items-start justify-center pt-20 sm:pt-28 px-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[75vh]"
            >
              {/* Header Input Bar */}
              <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3 bg-slate-50/50">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDownModal}
                  placeholder="Type a command or search portfolio..."
                  className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm font-sans"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="overflow-y-auto p-2 space-y-1 flex-1">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-mono">
                    No matching commands found.
                  </div>
                ) : (
                  filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (playClick) playClick();
                          item.action();
                        }}
                        onMouseEnter={() => {
                          setSelectedIndex(index);
                          if (playHover) playHover();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors text-xs font-medium cursor-pointer ${
                          isSelected
                            ? 'bg-[#B94B3E] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.category}
                          </span>
                          {isSelected && <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer Key Hints */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-bold mr-1">
                      ↑
                    </kbd>
                    <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-bold mr-1">
                      ↓
                    </kbd>
                    Navigate
                  </span>
                  <span>
                    <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-bold mr-1">
                      ↵
                    </kbd>
                    Select
                  </span>
                </div>
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-bold mr-1">
                    ESC
                  </kbd>
                  Close
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
