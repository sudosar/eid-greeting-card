/*
 * InteractiveMoon: Tappable crescent moon overlay positioned over the background moon
 * Tap to trigger a radiant glow pulse + sparkle burst effect
 * Uses a transparent SVG crescent shape as the clickable hitbox
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tryPlayAudio } from "./audioContext";

function MoonSparkles() {
  const sparkles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 60 + Math.random() * 50;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 0.2,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "50%",
            width: s.size,
            height: s.size,
            background:
              "radial-gradient(circle, rgba(255, 235, 170, 1) 0%, rgba(240, 199, 94, 0.8) 50%, transparent 100%)",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: s.x,
            y: s.y,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{
            duration: 0.9,
            delay: s.delay,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Central radiant flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 120,
          height: 120,
          background:
            "radial-gradient(circle, rgba(255, 235, 170, 0.5) 0%, rgba(240, 199, 94, 0.2) 40%, transparent 70%)",
        }}
        initial={{ opacity: 1, scale: 0.3 }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export function InteractiveMoon() {
  const [isGlowing, setIsGlowing] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [sparkleKey, setSparkleKey] = useState(0);

  const handleTap = useCallback(() => {
    tryPlayAudio();
    setIsGlowing((prev) => !prev);
    setShowSparkles(true);
    setSparkleKey((k) => k + 1);
    setTimeout(() => setShowSparkles(false), 1000);
  }, []);

  return (
    <div
      className="absolute z-[16] cursor-pointer"
      style={{
        /* Position over the crescent moon in the background image */
        bottom: "12%",
        left: "50%",
        transform: "translateX(-65%)",
        width: "min(35vw, 320px)",
        height: "min(50vh, 450px)",
      }}
      onClick={handleTap}
      role="button"
      aria-label={
        isGlowing
          ? "Crescent moon is glowing. Tap to dim."
          : "Crescent moon. Tap to make it glow!"
      }
      tabIndex={0}
    >
      {/* Glow halo behind the moon */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          opacity: isGlowing ? 1 : 0,
        }}
        transition={{ duration: 0.6 }}
        style={{
          background:
            "radial-gradient(ellipse at 40% 45%, rgba(240, 199, 94, 0.35) 0%, rgba(255, 220, 120, 0.15) 30%, transparent 60%)",
          filter: "blur(15px)",
        }}
      />

      {/* Pulsing glow ring when active */}
      <AnimatePresence>
        {isGlowing && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(ellipse at 40% 45%, rgba(240, 199, 94, 0.2) 0%, transparent 50%)",
              filter: "blur(20px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Sparkle burst on tap */}
      <AnimatePresence>
        {showSparkles && <MoonSparkles key={sparkleKey} />}
      </AnimatePresence>

      {/* Subtle "tap" hint */}
      <AnimatePresence>
        {!isGlowing && (
          <motion.div
            className="absolute bottom-[15%] left-[30%] whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
          >
            <span
              className="font-body text-[9px] sm:text-[11px]"
              style={{ color: "rgba(240, 199, 94, 0.4)" }}
            >
              tap the moon ☽
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
