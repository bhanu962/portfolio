import { useEffect, useRef } from 'react';

export default function ConfettiBurst() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

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

    // Create dense multi-stream particles
    const count = Math.min(Math.floor((width * height) / 5000), 240);
    const particles = [];
    const shapes = ['rect', 'rect', 'circle', 'ribbon'];

    // 1. Sky Shower (Top of Screen)
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height * 0.4,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2.5 + 2.0,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 4,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        wobbleSize: Math.random() * 2.5 + 1.2,
        drag: 0.992,
        gravity: 0.09,
      });
    }

    // 2. Left Lateral Cannon Burst
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * (width * 0.15),
        y: Math.random() * (height * 0.35) + height * 0.05,
        vx: Math.random() * 7 + 4,
        vy: (Math.random() - 0.5) * 5 - 2,
        size: Math.random() * 11 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 6,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.035,
        wobbleSize: 2.0,
        drag: 0.985,
        gravity: 0.11,
      });
    }

    // 3. Right Lateral Cannon Burst
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: width - Math.random() * (width * 0.15),
        y: Math.random() * (height * 0.35) + height * 0.05,
        vx: -(Math.random() * 7 + 4),
        vy: (Math.random() - 0.5) * 5 - 2,
        size: Math.random() * 11 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 6,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.035,
        wobbleSize: 2.0,
        drag: 0.985,
        gravity: 0.11,
      });
    }

    const startTime = performance.now();
    const duration = 4600; // 4.6 seconds of silky smooth cascade
    let lastTime = startTime;

    const render = (now) => {
      const elapsed = now - startTime;
      const dt = Math.min((now - lastTime) / 16.666, 2.5);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Smooth cubic alpha decay in the last 1.2 seconds
      let alpha = 1;
      if (elapsed > duration - 1200) {
        const remaining = (duration - elapsed) / 1200;
        alpha = Math.max(0, Math.min(1, remaining * remaining)); // Smooth ease-out quad fade
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth Physics
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
          // Curving ribbon tile
          ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
        } else {
          // Elegant rectangular confetti
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size * 2) / 3);
        }

        ctx.restore();
      }

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[1000] overflow-hidden"
    />
  );
}
