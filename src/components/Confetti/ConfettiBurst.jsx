import { useEffect, useRef, useState } from 'react';

export default function ConfettiBurst() {
  const canvasRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Color Palette matching the website
    const colors = [
      '#B94B3E', // Theme Coral
      '#E06051', // Soft Coral
      '#38BDF8', // Celestial Sky Blue
      '#F59E0B', // Amber Gold
      '#818CF8', // Soft Violet
      '#F43F5E', // Rose
      '#10B981', // Emerald Mint
    ];

    const count = Math.min(Math.floor((width * height) / 12000), 75);
    const particles = [];
    const shapes = ['rect', 'rect', 'circle', 'ribbon'];

    // 1. Sky Shower (Top of Screen)
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height * 0.35,
        vx: (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 2.2 + 2.0,
        size: Math.random() * 8 + 5,
        color: colors[i % colors.length],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 4,
        shape: shapes[i % shapes.length],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        wobbleSize: Math.random() * 2.2 + 1.0,
        drag: 0.993,
        gravity: 0.08,
      });
    }

    // 2. Left Lateral Cannon Burst
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * (width * 0.15),
        y: Math.random() * (height * 0.35) + height * 0.05,
        vx: Math.random() * 6 + 3.5,
        vy: (Math.random() - 0.5) * 4 - 2,
        size: Math.random() * 9 + 5,
        color: colors[i % colors.length],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 5,
        shape: shapes[i % shapes.length],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.035,
        wobbleSize: 1.8,
        drag: 0.988,
        gravity: 0.1,
      });
    }

    // 3. Right Lateral Cannon Burst
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: width - Math.random() * (width * 0.15),
        y: Math.random() * (height * 0.35) + height * 0.05,
        vx: -(Math.random() * 6 + 3.5),
        vy: (Math.random() - 0.5) * 4 - 2,
        size: Math.random() * 9 + 5,
        color: colors[i % colors.length],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 5,
        shape: shapes[i % shapes.length],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.035,
        wobbleSize: 1.8,
        drag: 0.988,
        gravity: 0.1,
      });
    }

    const startTime = performance.now();
    const duration = 4000;
    let lastTime = startTime;

    const render = (now) => {
      const elapsed = now - startTime;
      const dt = Math.min((now - lastTime) / 16.666, 2.0);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      let alpha = 1;
      if (elapsed > duration - 1000) {
        const remaining = (duration - elapsed) / 1000;
        alpha = Math.max(0, Math.min(1, remaining * remaining));
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.vx *= Math.pow(p.drag, dt);
        p.vy += p.gravity * dt;
        p.x += (p.vx + Math.sin(p.wobble) * p.wobbleSize) * dt;
        p.y += p.vy * dt;
        p.wobble += p.wobbleSpeed * dt;
        p.rotation += p.vRot * dt;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'ribbon') {
          ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size * 2) / 3);
        }

        ctx.restore();
      }

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        setIsDone(true);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isDone) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[1000] overflow-hidden gpu-layer"
    />
  );
}
