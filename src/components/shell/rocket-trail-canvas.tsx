"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  colorIndex: number;
};

const MAX_PARTICLES = 160;
const COLORS = ["#d19686", "#a55c4e", "#e6bcaf", "#ba7a69"];

export function RocketTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let particles: Particle[] = [];
    let pointerDown = false;
    let lastSpawn = 0;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function addParticle(x: number, y: number, vx: number, vy: number) {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      particles.push({
        x,
        y,
        vx,
        vy,
        life: 0,
        maxLife: 450 + Math.random() * 250,
        size: Math.random() * 2.5 + 1.5,
        colorIndex: Math.floor(Math.random() * COLORS.length),
      });
    }

    function spawnBurst(x: number, y: number) {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.3;
        addParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 0.3);
      }
    }

    function spawnTrail(x: number, y: number, dx: number, dy: number) {
      const baseAngle = Math.atan2(dy, dx) + Math.PI;
      for (let i = 0; i < 3; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * 0.8;
        const speed = Math.random() * 0.8 + 0.3;
        addParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed);
      }
    }

    function onPointerDown(e: PointerEvent) {
      pointerDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
      spawnBurst(e.clientX, e.clientY);
    }
    function onPointerMove(e: PointerEvent) {
      if (!pointerDown) return;
      const now = performance.now();
      if (now - lastSpawn < 16) return;
      lastSpawn = now;
      spawnTrail(e.clientX, e.clientY, e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onPointerUp() {
      pointerDown = false;
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    let lastFrame = performance.now();
    function tick(now: number) {
      const dt = now - lastFrame;
      lastFrame = now;
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles = particles.filter((p) => p.life < p.maxLife);
      for (const p of particles) {
        p.life += dt;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01;
        const t = p.life / p.maxLife;
        const len = p.size * (1 - t * 0.5);
        const angle = Math.atan2(p.vy, p.vx);

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(angle);
        ctx!.globalAlpha = Math.max(1 - t, 0);
        ctx!.fillStyle = COLORS[p.colorIndex];
        ctx!.beginPath();
        ctx!.ellipse(0, 0, len * 1.8, len * 0.6, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-20" />;
}
