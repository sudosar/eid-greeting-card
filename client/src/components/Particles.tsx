/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * Particles: Floating golden bokeh circles, twinkling stars, and floating light particles
 * INTERACTIVE: Tap anywhere on the sky to create sparkle bursts
 * Stars shimmer when tapped
 */

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tryPlayAudio } from "./audioContext";
import { triggerHaptic } from "./haptics";

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

interface TapSparkle {
  id: number;
  x: number;
  y: number;
  particles: { angle: number; distance: number; size: number; delay: number }[];
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

/* Interactive layer: tap anywhere on the card to create sparkle bursts */
export function InteractiveSkyLayer() {
  const [sparkles, setSparkles] = useState<TapSparkle[]>([]);
  let nextId = 0;

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Try to play audio on any sky interaction
    tryPlayAudio();
    triggerHaptic("light");

    // Get tap coordinates relative to the container
    let x: number, y: number;
    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const sparkleCount = 6 + Math.floor(Math.random() * 4);
    const newSparkle: TapSparkle = {
      id: Date.now() + nextId++,
      x,
      y,
      particles: Array.from({ length: sparkleCount }, (_, i) => ({
        angle: (i / sparkleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
        distance: 20 + Math.random() * 40,
        size: Math.random() * 4 + 1.5,
        delay: Math.random() * 0.1,
      })),
    };

    setSparkles((prev) => [...prev.slice(-5), newSparkle]); // Keep max 6 active bursts

    // Clean up after animation
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1000);
  }, []);

  return (
    <div
      className="absolute inset-0 z-[14]"
      onClick={handleTap}
      onTouchStart={handleTap}
      style={{ cursor: "pointer" }}
    >
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{ left: sparkle.x, top: sparkle.y }}
          >
            {/* Central golden flash */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: -15,
                top: -15,
                width: 30,
                height: 30,
                background: "radial-gradient(circle, rgba(240, 199, 94, 0.7) 0%, rgba(255, 220, 120, 0.3) 40%, transparent 70%)",
              }}
              initial={{ opacity: 1, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            {/* Radiating sparkle particles */}
            {sparkle.particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  left: -p.size / 2,
                  top: -p.size / 2,
                  background: i % 2 === 0
                    ? "rgba(240, 199, 94, 0.9)"
                    : "rgba(255, 255, 240, 0.9)",
                  boxShadow: `0 0 ${p.size * 2}px ${p.size}px rgba(240, 199, 94, 0.3)`,
                }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(p.angle) * p.distance,
                  y: Math.sin(p.angle) * p.distance,
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{
                  duration: 0.6 + Math.random() * 0.3,
                  delay: p.delay,
                  ease: "easeOut",
                }}
              />
            ))}
            {/* Tiny star shape at center */}
            <motion.div
              className="absolute"
              style={{
                left: -6,
                top: -6,
                width: 12,
                height: 12,
                color: "rgba(240, 199, 94, 0.9)",
              }}
              initial={{ opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 0, scale: 1.5, rotate: 90 }}
              transition={{ duration: 0.5 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
              </svg>
            </motion.div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
