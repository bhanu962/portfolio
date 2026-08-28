import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import SvgButton from '../UI/SvgButton';
import Magnetic from '../UI/Magnetic';
import { personalInfo } from '../../data/personalInfo';
import { playWelcomeAudio } from '../../utils/speech';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar({ soundPlaying, toggleAudio, playHover, playClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const sections = navLinks.map((l) => l.href.substring(1));

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrolled(scrollY > 30);

          const scrollPosition = scrollY + 250;
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.offsetTop <= scrollPosition) {
              setActiveSection(sections[i]);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (playClick) playClick();
    setMobileMenuOpen(false);

    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
            : 'py-5 bg-transparent'
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo with 100% Transparent Background */}
          <Magnetic strength={0.25} radius={80}>
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 group cursor-pointer bg-transparent select-none"
              data-cursor="home"
            >
              {/* Transparent Icon Logo Box */}
              <div className="w-8 h-8 rounded-lg border-1.5 border-[#B94B3E]/40 flex items-center justify-center bg-transparent group-hover:border-[#B94B3E] transition-all">
                <span className="font-display font-extrabold text-xs tracking-tight text-[#B94B3E]">
                  BN
                </span>
              </div>

              <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-slate-900 group-hover:text-[#B94B3E] transition-colors">
                {personalInfo.name}
              </span>
            </motion.a>
          </Magnetic>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100/80 border border-slate-200/60 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <Magnetic key={link.name} strength={0.2} radius={60}>
                  <motion.a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    onMouseEnter={playHover}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-1.5 text-xs font-medium tracking-wide transition-all rounded-full ${
                      isActive
                        ? 'text-slate-900 font-semibold bg-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                    data-cursor="hover"
                  >
                    {link.name}
                  </motion.a>
                </Magnetic>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Magnetic strength={0.25} radius={60}>
              <motion.button
                onClick={() => {
                  if (playClick) playClick();
                  if (toggleAudio) toggleAudio();
                }}
                onMouseEnter={playHover}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  soundPlaying
                    ? 'bg-[#B94B3E]/10 border-[#B94B3E]/40 text-[#B94B3E] shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                }`}
                title={soundPlaying ? 'Click to stop audio' : 'Click to play welcome audio'}
                aria-label="Toggle Sound"
                data-cursor="hover"
              >
                {soundPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#B94B3E]" />
                    {/* Live Animated Waveform Equalizer Bars */}
                    <div className="flex items-center gap-[2px] h-3">
                      <span className="w-[2.5px] h-full bg-[#B94B3E] rounded-full animate-equalizer-1" />
                      <span className="w-[2.5px] h-full bg-[#B94B3E] rounded-full animate-equalizer-2" />
                      <span className="w-[2.5px] h-full bg-[#B94B3E] rounded-full animate-equalizer-3" />
                      <span className="w-[2.5px] h-full bg-[#B94B3E] rounded-full animate-equalizer-4" />
                    </div>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-mono font-semibold">PLAY AUDIO</span>
                  </>
                )}
              </motion.button>
            </Magnetic>

            {/* Let's Talk SvgButton */}
            <Magnetic strength={0.2} radius={80}>
              <SvgButton
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                onMouseEnter={playHover}
                variant="primary"
                icon={ArrowUpRight}
                className="!py-2 !px-5 !text-xs"
              >
                Let's talk
              </SvgButton>
            </Magnetic>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                if (toggleAudio) toggleAudio();
              }}
              className={`p-2 rounded-full border transition-all ${
                soundPlaying
                  ? 'bg-[#B94B3E]/10 border-[#B94B3E]/40 text-[#B94B3E]'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
              aria-label="Toggle Audio"
            >
              {soundPlaying ? <Volume2 className="w-4 h-4 text-[#B94B3E]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (playClick) playClick();
              }}
              className="p-2 rounded-lg bg-slate-100 text-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#B94B3E]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl md:hidden pt-28 px-8 flex flex-col justify-between pb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-xl font-bold font-display tracking-tight flex items-center justify-between py-3 border-b border-slate-100 ${
                    activeSection === link.href.substring(1) ? 'text-[#B94B3E]' : 'text-slate-800'
                  }`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <span>{link.name}</span>
                  {activeSection === link.href.substring(1) && (
                    <span className="w-2 h-2 rounded-full bg-[#B94B3E]" />
                  )}
                </motion.a>
              ))}
            </div>

            <div className="mt-8">
              <SvgButton
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                variant="primary"
                className="w-full !py-3.5 text-center"
              >
                Let's talk
              </SvgButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
