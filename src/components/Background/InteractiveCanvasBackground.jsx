import { useEffect, useRef } from 'react';

export default function InteractiveCanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 20 : 34;
    const maxDist = 110;
    const maxDistSq = maxDist * maxDist;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Mouse tracking with soft radius
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 110,
      radiusSq: 110 * 110,
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle definitions
    const particles = [];
    const colors = [
      'rgba(185, 75, 62, 0.35)', // Coral #B94B3E
      'rgba(224, 96, 81, 0.30)', // Soft Coral
      'rgba(56, 189, 248, 0.25)', // Sky Blue
      'rgba(148, 163, 184, 0.25)', // Slate
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1.2,
        color: colors[i % colors.length],
        baseRadius: Math.random() * 1.5 + 1.2,
      });
    }

    // Animation Loop
    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw connecting lines in single batched path
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'rgba(185, 75, 62, 0.12)';
      ctx.beginPath();

      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke();

      // 2. Update & draw particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        // Soft mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const mouseDistSq = dx * dx + dy * dy;

        if (mouseDistSq < mouse.radiusSq && mouseDistSq > 0) {
          const mouseDist = Math.sqrt(mouseDistSq);
          const force = (1 - mouseDist / mouse.radius) * 0.025;
          p.x += dx * force;
          p.y += dy * force;
          p.radius = p.baseRadius * 1.35;
        } else {
          p.radius = p.baseRadius;
        }

        // Draw particle node
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Tab visibility handling: pause when hidden to save CPU/battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 gpu-layer"
    />
  );
}
