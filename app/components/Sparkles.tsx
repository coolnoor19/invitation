"use client";

import { useEffect, useRef } from "react";

type Props = {
  mode?: "ambient" | "fireworks";
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
  rocket?: boolean;
  targetY?: number;
};

const GOLD_HUES = [42, 46, 38, 350, 30];

export default function Sparkles({ mode = "ambient", className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let spawn = 0;
    const parts: Particle[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const dust = () => {
      parts.push({
        x: Math.random() * w,
        y: h + 10,
        vx: (Math.random() - 0.5) * 12,
        vy: -(14 + Math.random() * 30),
        life: 0,
        max: 6 + Math.random() * 8,
        size: 0.6 + Math.random() * 1.8,
        hue: GOLD_HUES[(Math.random() * GOLD_HUES.length) | 0],
      });
    };

    const rocket = () => {
      parts.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h,
        vx: (Math.random() - 0.5) * 40,
        vy: -(h * (0.9 + Math.random() * 0.4)),
        life: 0,
        max: 3,
        size: 2,
        hue: GOLD_HUES[(Math.random() * GOLD_HUES.length) | 0],
        rocket: true,
        targetY: h * (0.15 + Math.random() * 0.3),
      });
    };

    const burst = (x: number, y: number, hue: number) => {
      const n = 70;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const s = 60 + Math.random() * 110;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          max: 1.2 + Math.random() * 0.9,
          size: 1.2 + Math.random() * 1.4,
          hue: hue + (Math.random() - 0.5) * 14,
        });
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // fade previous frame for trails while keeping the canvas transparent
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = mode === "fireworks" ? "rgba(0,0,0,0.22)" : "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      spawn -= dt;
      if (spawn <= 0) {
        if (mode === "fireworks") {
          rocket();
          spawn = 0.7 + Math.random() * 0.9;
        } else {
          dust();
          spawn = reduce ? 0.6 : 0.09;
        }
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.rocket) {
          if (p.y <= (p.targetY ?? 0)) {
            burst(p.x, p.y, p.hue);
            parts.splice(i, 1);
            continue;
          }
        } else if (mode === "fireworks") {
          p.vy += 70 * dt;
          p.vx *= 0.985;
        } else {
          p.vx += Math.sin(p.life * 1.5 + p.x) * 0.15;
        }

        if (p.life >= p.max) {
          parts.splice(i, 1);
          continue;
        }

        const t = p.life / p.max;
        const alpha = p.rocket ? 1 : mode === "ambient" ? Math.sin(t * Math.PI) * 0.9 : 1 - t;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, ${p.rocket ? 80 : 65}%, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mode]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
