import { useEffect, useRef } from 'react';

export default function HeroConstellation3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create lightweight 3D Constellation & Geometric Particles for max FPS
    const particleCount = window.innerWidth < 640 ? 14 : 30;
    const particles = Array.from({ length: particleCount }, (_, idx) => ({
      x: (Math.random() - 0.5) * width * 0.85,
      y: (Math.random() - 0.5) * height * 0.85,
      z: Math.random() * 400,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.4,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.02,
      radius: Math.random() * 1.8 + 1,
      isDiamond: idx % 4 === 0,
      color: Math.random() > 0.45 ? '#75a7ff' : (Math.random() > 0.3 ? '#d5ff6e' : '#a855f7'),
    }));

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) * 0.025;
      mouseY = (e.clientY - rect.top - height / 2) * 0.025;
    };
    window.addEventListener('pointermove', handleMouseMove, { passive: true });

    let isVisible = true;
    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw particle constellation & connecting lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update positions with subtle mouse influence (max 10-15px)
        p.x += p.vx + mouseX * 0.01;
        p.y += p.vy + mouseY * 0.01;
        p.z += p.vz;
        p.rot += p.vrot;

        // Boundary wrap
        if (p.x > width / 2) p.x = -width / 2;
        if (p.x < -width / 2) p.x = width / 2;
        if (p.y > height / 2) p.y = -height / 2;
        if (p.y < -height / 2) p.y = height / 2;
        if (p.z > 400) p.z = 0;
        if (p.z < 0) p.z = 400;

        // 3D perspective projection
        const scale = 400 / (400 + p.z);
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;

        // Draw particle (geometric diamond or circular node)
        if (p.isDiamond) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(p.rot);
          ctx.beginPath();
          const s = p.radius * scale * 2.2;
          ctx.moveTo(0, -s);
          ctx.lineTo(s, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s, 0);
          ctx.closePath();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = Math.min(0.85, scale * 0.8);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, p.radius * scale, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, scale * 0.8);
          ctx.fill();
        }

        // Connect nearby particles with glowing lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const scale2 = 400 / (400 + p2.z);
          const p2x = cx + p2.x * scale2;
          const p2y = cy + p2.y * scale2;
          const dist = Math.hypot(px - p2x, py - p2y);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(p2x, p2y);
            ctx.strokeStyle = '#75a7ff';
            ctx.globalAlpha = (1 - dist / 90) * 0.2;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          render();
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    render();

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-constellation-canvas" aria-hidden="true" />;
}
