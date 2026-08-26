import { useEffect, useRef } from 'react';

export default function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = width < 768;

    // Mouse coordinates for Antigravity wave repulsion
    let mouse = {
      x: -1000,
      y: -1000,
      radius: isMobile ? 120 : 220,
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

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Google Antigravity Particle Field (Dashes + Micro-dots)
    const particleCount = isMobile ? 65 : 140;
    let particles = [];

    const brandColors = [
      '#1A73E8', // Antigravity Google Blue
      '#4285F4', // Light Blue
      '#6366F1', // Indigo
      '#0EA5E9', // Sky Blue
      '#64748B', // Slate
      '#334155', // Deep Slate
    ];

    class AntigravityParticle {
      constructor(initialX, initialY) {
        this.x = initialX !== undefined ? initialX : Math.random() * width;
        this.y = initialY !== undefined ? initialY : Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;

        // Is it a dash or a dot?
        this.isDash = Math.random() > 0.45;
        this.length = this.isDash ? Math.random() * 7 + 4 : 0;
        this.thickness = Math.random() * 1.6 + 0.8;
        this.angle = Math.random() * Math.PI * 0.4 - Math.PI * 0.2; // Slight upward slant

        // Antigravity upward lift velocity
        this.vx = (Math.random() - 0.4) * 0.35;
        this.vy = -(Math.random() * 0.45 + 0.15); // Constant subtle upward drift

        this.color = brandColors[Math.floor(Math.random() * brandColors.length)];
        this.alpha = Math.random() * 0.55 + 0.25;
        this.spin = (Math.random() - 0.5) * 0.015;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';

        if (this.isDash) {
          ctx.beginPath();
          ctx.moveTo(-this.length / 2, 0);
          ctx.lineTo(this.length / 2, 0);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.thickness * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      update() {
        if (!prefersReducedMotion) {
          this.x += this.vx;
          this.y += this.vy;
          this.angle += this.spin;

          // Wrap around top to bottom (continuous liftoff)
          if (this.y < -20) {
            this.y = height + 20;
            this.x = Math.random() * width;
          }
          if (this.x < -20) this.x = width + 20;
          if (this.x > width + 20) this.x = -20;

          // Antigravity Mouse Repulsion Wave
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 4.5;
            this.y -= Math.sin(angle) * force * 4.5;
          }
        }
        this.draw();
      }
    }

    function initParticles() {
      particles = [];
      // Distribute particles with a natural density cluster toward the left/sides like the Antigravity design
      for (let i = 0; i < particleCount; i++) {
        let x;
        if (i < particleCount * 0.45) {
          x = Math.random() * (width * 0.35);
        } else {
          x = Math.random() * width;
        }
        particles.push(new AntigravityParticle(x, Math.random() * height));
      }
    }

    initParticles();

    // Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle orbital trajectory curves on the left
      ctx.save();
      ctx.beginPath();
      ctx.arc(width * 0.08, height * 0.45, width * 0.28, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(26, 115, 232, 0.03)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      particles.forEach((p) => p.update());
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
