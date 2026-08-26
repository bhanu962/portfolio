import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import bgPatternAnimation from '../../assets/bg-pattern.json';

export default function LottieBackground() {
  const centerContainerRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let centerAnim = null;
    let leftAnim = null;
    let rightAnim = null;

    if (centerContainerRef.current) {
      centerAnim = lottie.loadAnimation({
        container: centerContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: bgPatternAnimation,
      });
    }

    if (leftContainerRef.current) {
      leftAnim = lottie.loadAnimation({
        container: leftContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: bgPatternAnimation,
      });
    }

    if (rightContainerRef.current) {
      rightAnim = lottie.loadAnimation({
        container: rightContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: bgPatternAnimation,
      });
    }

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (centerAnim) centerAnim.destroy();
      if (leftAnim) leftAnim.destroy();
      if (rightAnim) rightAnim.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
      {/* Center Main Geometric Animated Pattern - Subtle Elegant Watermark */}
      <div
        ref={centerContainerRef}
        className="w-[650px] h-[650px] sm:w-[950px] sm:h-[950px] opacity-[0.16] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        }}
      />

      {/* Top Left Floating Pattern Cluster */}
      <div
        ref={leftContainerRef}
        className="absolute -top-28 -left-28 w-[450px] h-[450px] opacity-[0.09] transition-transform duration-1000 ease-out hidden lg:block"
        style={{
          transform: `translate(${-mouseOffset.x * 0.6}px, ${-mouseOffset.y * 0.6}px)`,
        }}
      />

      {/* Bottom Right Floating Pattern Cluster */}
      <div
        ref={rightContainerRef}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] opacity-[0.09] transition-transform duration-1000 ease-out hidden lg:block"
        style={{
          transform: `translate(${-mouseOffset.x * 0.8}px, ${-mouseOffset.y * 0.8}px)`,
        }}
      />
    </div>
  );
}
