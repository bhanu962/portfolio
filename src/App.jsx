import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { useSoundEffects } from './hooks/useSoundEffects';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import ConfettiBurst from './components/Confetti/ConfettiBurst';
import AnimatedBackground from './components/Background/AnimatedBackground';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Experience from './components/Experience/Experience';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const { soundEnabled, toggleSound, playHover, playClick, playSuccess } = useSoundEffects();

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-[#B94B3E] selection:text-white overflow-x-hidden font-sans">
      {/* Initial Futuristic Loading Screen */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Celebratory Fullscreen Confetti Animation Triggered ONLY AFTER the main page is opened and fully revealed */}
      {loaded && <ConfettiBurst />}

      {/* Multi-Layer Animated Canvas & Geometric Background */}
      <AnimatedBackground />

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          playHover={playHover}
          playClick={playClick}
        />

        {/* Sections */}
        <main className="flex-grow">
          <Hero playHover={playHover} playClick={playClick} />
          <About playHover={playHover} playClick={playClick} />
          <Skills playHover={playHover} playClick={playClick} />
          <Projects playHover={playHover} playClick={playClick} />
          <Experience playHover={playHover} playClick={playClick} />
          <Contact
            playHover={playHover}
            playClick={playClick}
            playSuccess={playSuccess}
          />
        </main>

        {/* Footer */}
        <Footer playHover={playHover} playClick={playClick} />
      </div>
    </div>
  );
}
