/*
 * FIREWORKS CELEBRATION — Golden fireworks burst when all 6 lanterns are lit
 * Creates a spectacular celebratory effect with multiple firework bursts,
 * golden sparkles, and a congratulatory message.
 */

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FireworkBurst {
  id: number;
  x: number;
  y: number;
  delay: number;
  particles: {
    id: number;
    angle: number;
    distance: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
  }[];
}

function createBurst(id: number): FireworkBurst {
  const x = 15 + Math.random() * 70; // 15-85% of screen width
  const y = 10 + Math.random() * 50; // 10-60% of screen height
  const particleCount = 16 + Math.floor(Math.random() * 12);
  const colors = [
    "rgba(240, 199, 94, 1)",    // gold
    "rgba(255, 220, 120, 1)",   // light gold
    "rgba(232, 148, 58, 1)",    // amber
    "rgba(255, 255, 200, 1)",   // cream
    "rgba(212, 168, 67, 1)",    // deep gold
    "rgba(240, 199, 94, 0.8)",  // soft gold
  ];

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3,
    distance: 60 + Math.random() * 100,
    size: 2 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.2,
    duration: 0.6 + Math.random() * 0.6,
  }));

  return { id, x, y, delay: id * 0.4 + Math.random() * 0.3, particles };
}

function FireworkBurstComponent({ burst }: { burst: FireworkBurst }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: burst.delay }}
    >
      {/* Central flash */}
      <motion.div
        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 8,
          height: 8,
          background: "radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(240, 199, 94, 0.8) 40%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 8, 0], opacity: [1, 0.8, 0] }}
        transition={{ delay: burst.delay, duration: 0.5, ease: "easeOut" }}
      />

      {/* Particles */}
      {burst.particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance + 30, // gravity pull
            opacity: [1, 1, 0],
            scale: [1, 0.8, 0.2],
          }}
          transition={{
            delay: burst.delay + p.delay,
            duration: p.duration,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Trailing sparkles */}
      {burst.particles.filter((_, i) => i % 3 === 0).map((p) => (
        <motion.div
          key={`trail-${p.id}`}
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 1.5,
            height: 1.5,
            background: "rgba(255, 255, 200, 0.8)",
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [
              Math.cos(p.angle) * p.distance * 0.3,
              Math.cos(p.angle) * p.distance * 0.6,
              Math.cos(p.angle) * p.distance * 0.8,
            ],
            y: [
              Math.sin(p.angle) * p.distance * 0.3,
              Math.sin(p.angle) * p.distance * 0.6 + 10,
              Math.sin(p.angle) * p.distance * 0.8 + 25,
            ],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            delay: burst.delay + p.delay + 0.15,
            duration: p.duration * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
}

interface FireworksProps {
  show: boolean;
  onComplete?: () => void;
}

export function Fireworks({ show, onComplete }: FireworksProps) {
  const [visible, setVisible] = useState(false);

  const bursts = useMemo(() => {
    if (!show) return [];
    return Array.from({ length: 7 }, (_, i) => createBurst(i));
  }, [show]);

  useEffect(() => {
    if (show) {
      setVisible(true);
      // Auto-hide after the animation completes
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Subtle golden overlay flash */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(240, 199, 94, 0.05)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Firework bursts */}
          {bursts.map((burst) => (
            <FireworkBurstComponent key={burst.id} burst={burst} />
          ))}

          {/* Celebration text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.8] }}
            transition={{ delay: 1.5, duration: 2.5, times: [0, 0.2, 0.7, 1] }}
          >
            <div className="text-center">
              <p
                className="font-arabic text-3xl sm:text-4xl md:text-5xl"
                style={{
                  color: "#F0C75E",
                  textShadow: "0 0 30px rgba(240, 199, 94, 0.5), 0 0 60px rgba(240, 199, 94, 0.3)",
                }}
              >
                ✨ مبارك عليكم ✨
              </p>
              <p
                className="font-display text-sm sm:text-base tracking-[0.15em] uppercase mt-2"
                style={{
                  color: "rgba(232, 220, 200, 0.8)",
                  textShadow: "0 0 20px rgba(240, 199, 94, 0.3)",
                }}
              >
                All lanterns lit!
              </p>
            </div>
          </motion.div>

          {/* Falling golden confetti */}
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: -10,
                width: 4 + Math.random() * 6,
                height: 4 + Math.random() * 6,
                background: i % 3 === 0
                  ? "rgba(240, 199, 94, 0.8)"
                  : i % 3 === 1
                    ? "rgba(255, 220, 120, 0.7)"
                    : "rgba(232, 148, 58, 0.7)",
                borderRadius: i % 2 === 0 ? "50%" : "2px",
              }}
              initial={{ y: -20, opacity: 0, rotate: 0 }}
              animate={{
                y: window.innerHeight + 20,
                opacity: [0, 1, 1, 0.5, 0],
                rotate: Math.random() * 720 - 360,
              }}
              transition={{
                delay: 1 + Math.random() * 2,
                duration: 2 + Math.random() * 2,
                ease: "easeIn",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
