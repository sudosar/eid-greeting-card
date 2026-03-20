/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * Particles: Floating golden bokeh circles and twinkling stars
 * Creates a dreamy, magical atmosphere throughout the scene
 */

import { useMemo } from "react";

interface BokehParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  driftX: string;
  driftY: string;
  opacity: number;
  endScale: number;
}

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
}

export function BokehParticles({ count = 25 }: { count?: number }) {
  const particles = useMemo<BokehParticle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 12 + 4,
      duration: `${Math.random() * 8 + 6}s`,
      delay: `${Math.random() * 6}s`,
      driftX: `${(Math.random() - 0.5) * 80}px`,
      driftY: `${(Math.random() - 0.5) * 80}px`,
      opacity: Math.random() * 0.3 + 0.15,
      endScale: Math.random() * 0.6 + 0.8,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-bokeh-drift"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(240, 199, 94, ${p.opacity + 0.2}) 0%, rgba(240, 199, 94, ${p.opacity * 0.5}) 40%, transparent 70%)`,
            "--bokeh-duration": p.duration,
            "--bokeh-delay": p.delay,
            "--drift-x": p.driftX,
            "--drift-y": p.driftY,
            "--bokeh-opacity": p.opacity,
            "--end-scale": p.endScale,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function TwinklingStars({ count = 40 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      size: Math.random() * 3 + 1,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-star-twinkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            backgroundColor: "rgba(255, 255, 240, 0.9)",
            boxShadow: `0 0 ${s.size * 2}px ${s.size}px rgba(255, 255, 240, 0.3)`,
            "--twinkle-duration": s.duration,
            "--twinkle-delay": s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function FloatingLightParticles({ count = 15 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 20}%`,
      size: Math.random() * 6 + 2,
      duration: `${Math.random() * 6 + 6}s`,
      delay: `${Math.random() * 8}s`,
      driftX: `${(Math.random() - 0.5) * 60}px`,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(240, 199, 94, 0.8) 0%, rgba(232, 148, 58, 0.4) 50%, transparent 70%)`,
            "--duration": p.duration,
            "--delay": p.delay,
            "--drift-x": p.driftX,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
