import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useSoundEffects } from './hooks/useSoundEffects';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import ConfettiBurst from './components/Confetti/ConfettiBurst';
import AnimatedBackground from './components/Background/AnimatedBackground';
import CustomCursor from './components/CustomCursor/CustomCursor';
import ClickShockwave from './components/UI/ClickShockwave';
import ScrollHUD from './components/UI/ScrollHUD';
import CommandPalette from './components/UI/CommandPalette';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Experience from './components/Experience/Experience';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import NotFound from './components/NotFound/NotFound';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [manualConfetti, setManualConfetti] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });
  const audioRef = useRef(null);
  const { playHover, playClick, playSuccess } = useSoundEffects();

  // 1. Unconditional Hook: Listen to browser navigation popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Unconditional Hook: First-time visit auto-play with reload-skip and automatic mute on end
  useEffect(() => {
    const is404Route =
      currentPath !== '/' &&
      currentPath !== '' &&
      currentPath !== '/index.html' &&
      !currentPath.startsWith('/#');

    if (!loaded || is404Route) return;

    const alreadyPlayed = sessionStorage.getItem('portfolio_audio_played');
    if (alreadyPlayed === 'true') {
      return; // Do NOT play on reload/refresh
    }

    const tryPlay = () => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      const p = audioRef.current.play();
      if (p !== undefined) {
        p.then(() => {
          setSoundPlaying(true);
          sessionStorage.setItem('portfolio_audio_played', 'true');
          removeListeners();
        }).catch((err) => {
          console.log('Autoplay waiting for first gesture:', err);
        });
      }
    };

    // Attempt first-time auto-play
    tryPlay();

    // Fallback if browser requires initial user gesture
    const onGesture = () => {
      tryPlay();
    };

    const removeListeners = () => {
      window.removeEventListener('click', onGesture);
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('keydown', onGesture);
    };

    window.addEventListener('click', onGesture, { passive: true });
    window.addEventListener('pointerdown', onGesture, { passive: true });
    window.addEventListener('touchstart', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture, { passive: true });

    return removeListeners;
  }, [loaded, currentPath]);

  // 3. Unconditional Hook: Smooth Scroll
  useEffect(() => {
    const is404Route =
      currentPath !== '/' &&
      currentPath !== '' &&
      currentPath !== '/index.html' &&
      !currentPath.startsWith('/#');

    if (is404Route) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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
  }, [currentPath]);

  const triggerConfetti = () => {
    setManualConfetti(false);
    setTimeout(() => setManualConfetti(true), 50);
  };

  // Manual toggle for welcome audio
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (soundPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setSoundPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => setSoundPlaying(true))
        .catch((err) => console.log('Audio playback error:', err));
    }
  };

  // Check if current route is 404
  const is404 =
    currentPath !== '/' &&
    currentPath !== '' &&
    currentPath !== '/index.html' &&
    !currentPath.startsWith('/#');

  // Conditional rendering at the bottom after ALL hooks have executed unconditionally
  if (is404) {
    return (
      <NotFound
        onNavigateHome={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-[#B94B3E] selection:text-white overflow-x-hidden font-sans">
      {/* Portfolio Welcome Audio Element - Auto Mutes on Ended */}
      <audio
        ref={audioRef}
        src="/audio.mpeg"
        preload="auto"
        playsInline
        onPlay={() => setSoundPlaying(true)}
        onEnded={() => setSoundPlaying(false)}
        onPause={() => setSoundPlaying(false)}
      />

      {/* Initial Futuristic Loading Screen */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Celebratory Fullscreen Confetti Animation */}
      {(loaded || manualConfetti) && <ConfettiBurst />}

      {/* Neat and Beautiful Custom Cursor & Interactive Symbol Trail */}
      <CustomCursor />

      {/* Global Interactive Click Shockwaves */}
      <ClickShockwave />

      {/* Live Minimalist Coordinate & Scroll Progress HUD */}
      <ScrollHUD />

      {/* Retro-Futuristic Ctrl+K / ⌘K Command Palette & Terminal */}
      <CommandPalette
        soundEnabled={soundPlaying}
        toggleSound={toggleAudio}
        playHover={playHover}
        playClick={playClick}
        triggerConfetti={triggerConfetti}
      />

      {/* Multi-Layer Animated Canvas & Geometric Background */}
      <AnimatedBackground />

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          soundPlaying={soundPlaying}
          toggleAudio={toggleAudio}
          playHover={playHover}
          playClick={playClick}
        />

        {/* Sections */}
        <main className="flex-grow">
          <Hero
            playHover={playHover}
            playClick={playClick}
            soundPlaying={soundPlaying}
            toggleAudio={toggleAudio}
          />
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
