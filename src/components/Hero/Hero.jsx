import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Laptop } from 'lucide-react';
import { Github, Linkedin, Instagram } from '../Icons/SocialIcons';
import SvgButton from '../UI/SvgButton';
import MagneticText from '../UI/MagneticText';
import Magnetic from '../UI/Magnetic';
import TextScramble from '../UI/TextScramble';
import { SiPython, SiJavascript, SiReact, SiNodedotjs, SiMysql } from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { personalInfo } from '../../data/personalInfo';
import { speakWelcome } from '../../utils/speech';

const dynamicPhrases = [
  'Full Stack Developer',
  'Computer Science Engineer',
  'MERN Stack Developer',
  'Problem Solver & Builder',
];

const quickTechs = [
  {
    name: 'Java',
    icon: <FaJava className="w-3.5 h-3.5 text-[#ED8B00]" />,
  },
  {
    name: 'Python',
    icon: <SiPython className="w-3.5 h-3.5 text-[#3776AB]" />,
  },
  {
    name: 'JavaScript',
    icon: <SiJavascript className="w-3.5 h-3.5 text-[#F7DF1E] bg-slate-900 rounded-xs" />,
  },
  {
    name: 'React.js',
    icon: <SiReact className="w-3.5 h-3.5 text-[#61DAFB]" />,
  },
  {
    name: 'Node.js',
    icon: <SiNodedotjs className="w-3.5 h-3.5 text-[#5FA04E]" />,
  },
  {
    name: 'SQL',
    icon: <SiMysql className="w-3.5 h-3.5 text-[#4479A1]" />,
  },
];

const socialDockItems = [
  { name: 'GitHub', href: personalInfo.socials.github, icon: Github },
  { name: 'LinkedIn', href: personalInfo.socials.linkedin, icon: Linkedin },
  { name: 'Instagram', href: personalInfo.socials.instagram, icon: Instagram },
];

function TypingHeadline() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState(dynamicPhrases[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullPhrase = dynamicPhrases[phraseIndex];
    const typingSpeed = isDeleting ? 28 : 62;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < fullPhrase.length) {
          setCurrentText(fullPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2400);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(fullPhrase.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % dynamicPhrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, phraseIndex]);

  return (
    <div className="h-14 sm:h-18 lg:h-20 w-full flex items-center justify-center text-center overflow-hidden">
      <span className="text-gradient-coral inline text-2xl sm:text-4xl lg:text-[44px] font-bold font-display tracking-tight leading-tight">
        {currentText}
        <span
          className="inline-block w-[3px] sm:w-[4px] h-[0.78em] ml-1.5 bg-[#B94B3E] align-baseline rounded-xs animate-pulse shadow-[0_0_8px_#B94B3E]"
          style={{ verticalAlign: '-0.04em' }}
        />
      </span>
    </div>
  );
}

export default function Hero({ playHover, playClick, soundPlaying, toggleAudio }) {
  const handleDownloadCV = () => {
    if (playClick) playClick();
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-16 px-6 md:px-12 overflow-hidden"
    >
      {/* Main Hero Center Container */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center z-10">
        
        {/* 1. Top Availability & Role Status Pill */}
        <Magnetic strength={0.2} radius={100}>
          <motion.div
            onClick={() => {
              if (playClick) playClick();
              if (toggleAudio) toggleAudio();
            }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm mb-6 cursor-pointer hover:border-[#B94B3E]/40 hover:shadow-xs transition-all select-none group"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={playHover}
            title="Click to hear voice welcome"
            data-cursor="hover"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-semibold tracking-wide text-slate-700 group-hover:text-[#B94B3E] transition-colors">
              <TextScramble text="Narra Bhanu Sai Teja • Computer Science Engineer" triggerOnHover={true} />
            </span>
          </motion.div>
        </Magnetic>

        {/* 2. Zero Layout-Shift Headline: Fixed-Height Container */}
        <motion.div
          className="w-full max-w-4xl flex flex-col items-center justify-center text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Primary Static Lead Title with Magnetic Text Attraction */}
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold font-display tracking-tight text-slate-950 leading-tight">
            <MagneticText
              text="Welcome to Bhanu Narra's Portfolio"
              strength={0.3}
              radius={110}
            />
          </h1>

          {/* Physically Locked Fixed-Height Container for the Animated Typing Line */}
          <TypingHeadline />
        </motion.div>

        {/* 3. Refined Bio Subtitle - Permanently Fixed in Place */}
        <motion.p
          className="max-w-2xl text-slate-600 text-base sm:text-lg leading-relaxed mb-6 px-4 font-normal text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {personalInfo.bio}
        </motion.p>

        {/* 4. Interactive Quick Tech Badges Row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-8 px-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {quickTechs.map((tech) => (
            <Magnetic key={tech.name} strength={0.22} radius={80}>
              <span
                onMouseEnter={playHover}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200/90 text-xs font-mono font-medium text-slate-700 shadow-xs hover:border-[#B94B3E]/40 hover:text-[#B94B3E] transition-all cursor-default"
              >
                <span>{tech.icon}</span>
                <TextScramble text={tech.name} triggerOnHover={true} />
              </span>
            </Magnetic>
          ))}
        </motion.div>

        {/* 5. Action Buttons with SVG Border Laser Animation */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {/* Primary Projects Button */}
          <Magnetic strength={0.2} radius={90}>
            <SvgButton
              href="#projects"
              variant="primary"
              icon={Laptop}
              className="w-44 justify-center text-center"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              Projects
            </SvgButton>
          </Magnetic>

          {/* Secondary Download CV Button - Downloads Resume PDF */}
          <Magnetic strength={0.2} radius={90}>
            <SvgButton
              href="/assets/Bhanu_Sai_Teja_Narra_Resume.pdf"
              download="Bhanu_Sai_Teja_Narra_Resume.pdf"
              variant="secondary"
              icon={Download}
              className="w-44 justify-center text-center"
              onMouseEnter={playHover}
              onClick={handleDownloadCV}
            >
              Resume
            </SvgButton>
          </Magnetic>
        </motion.div>

        {/* 6. Clean Social Icons Row */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {socialDockItems.map((social) => {
            const Icon = social.icon;
            return (
              <Magnetic key={social.name} strength={0.25} radius={60}>
                <motion.a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={playHover}
                  onClick={playClick}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-[#B94B3E] hover:border-[#B94B3E]/40 hover:shadow-sm transition-all"
                  aria-label={social.name}
                  title={social.name}
                  data-cursor="hover"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              </Magnetic>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="mt-12 sm:mt-14 flex flex-col items-center gap-1.5 z-10 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        onClick={() => {
          if (playClick) playClick();
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
        data-cursor="hover"
      >
        <div className="w-5 h-8 rounded-full border-2 border-slate-300 p-1 flex justify-center">
          <motion.div
            className="w-1 h-2 bg-slate-500 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
