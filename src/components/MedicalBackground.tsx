import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  z: number;
  baseY: number;
  vx: number;
  vy: number;
  floatSpeed: number;
  floatRange: number;
  phase: number;
  color: string;
  radius: number;
};

type Pulse = {
  x: number;
  y: number;
  age: number;
  maxAge: number;
};

const COLORS = ['#0ea5e9', '#14b8a6', '#38bdf8', '#06b6d4'];

export default function MedicalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Initialize particles
    const particleCount = Math.min(48, Math.floor((width * height) / 22000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const baseY = Math.random() * height;
      particles.push({
        x: Math.random() * width,
        y: baseY,
        z: Math.random() * 0.8 + 0.2,
        baseY,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        floatSpeed: 0.3 + Math.random() * 0.6,
        floatRange: 20 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[i % COLORS.length],
        radius: 1.5 + Math.random() * 2.5,
      });
    }

    const pulses: Pulse[] = [];
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    let time = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onClick = (e: MouseEvent) => {
      pulses.push({ x: e.clientX, y: e.clientY, age: 0, maxAge: 90 });
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    let raf = 0;

    const render = () => {
      time += 0.016;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const offsetX = (mouse.x - width / 2) * 0.02;
      const offsetY = (mouse.y - height / 2) * 0.02;

      ctx.clearRect(0, 0, width, height);

      // Update + draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y = p.baseY + Math.sin(time * p.floatSpeed + p.phase) * p.floatRange;
        p.baseY += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.baseY < -20) p.baseY = height + 20;
        if (p.baseY > height + 20) p.baseY = -20;
      }

      // Draw connection lines
      const maxDist = 140;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x + offsetX * a.z;
        const ay = a.y + offsetY * a.z;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const bx = b.x + offsetX * b.z;
          const by = b.y + offsetY * b.z;
          const dx = ax - bx;
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      // Draw particles with glow
      for (const p of particles) {
        const px = p.x + offsetX * p.z;
        const py = p.y + offsetY * p.z;
        const pulse = 0.7 + Math.sin(time * 1.5 + p.phase) * 0.3;
        const glowRadius = p.radius * 5 * pulse;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
        grad.addColorStop(0, p.color + '40');
        grad.addColorStop(0.5, p.color + '15');
        grad.addColorStop(1, p.color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85 * pulse;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw pulse waves
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.age++;
        const t = pulse.age / pulse.maxAge;
        const radius = 10 + t * 250;
        const alpha = (1 - t) * 0.4;

        ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
        ctx.lineWidth = 2 * (1 - t * 0.5);
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(20, 184, 166, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        if (pulse.age >= pulse.maxAge) {
          pulses.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Deep Canvas Base */}
      <div className="absolute inset-0 bg-[#030914]" />

      {/* Layer 1: Hospital Ward & Clinical Infrastructure Visual */}
      <div 
        className="absolute inset-0 opacity-[0.09] bg-cover bg-center mix-blend-luminosity filter contrast-125"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80')`
        }}
      />

      {/* Layer 2: High-Care Ambulance & Emergency Dispatch Silhouette */}
      <div 
        className="absolute top-0 right-0 w-3/4 h-2/3 opacity-[0.06] bg-cover bg-no-repeat bg-right-top mix-blend-screen filter saturate-150"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1600&q=80')`
        }}
      />

      {/* Layer 3: Neon Aurora Lights */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-10 left-1/3 w-[650px] h-[650px] bg-indigo-500/10 rounded-full blur-[150px]" />

      {/* Layer 4: Interactive Canvas Neural Grid */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Layer 5: Vignette Shade for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030914] via-transparent to-[#030914]/80 z-20" />
    </div>
  );
}