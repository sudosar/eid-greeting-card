/*
 * InteractiveMinarets: Tappable hotspot overlays positioned over the mosque minarets
 * Tap a minaret to illuminate it with a warm golden glow effect
 * Uses onPointerDown for reliable mobile + desktop touch handling
 * Includes haptic feedback on tap
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tryPlayAudio } from "./audioContext";
import { triggerHaptic } from "./haptics";

interface MinaretProps {
  id: string;
  left: string;
  width: string;
  height: string;
}

function MinaretGlow() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background:
          "linear-gradient(to top, rgba(240, 199, 94, 0.35) 0%, rgba(240, 199, 94, 0.15) 40%, transparent 80%)",
        filter: "blur(8px)",
      }}
    />
  );
}

function MinaretSparkle() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 40,
    y: -(Math.random() * 60 + 20),
    size: Math.random() * 3 + 1.5,
    delay: Math.random() * 0.15,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "20%",
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(255, 235, 170, 1) 0%, rgba(240, 199, 94, 0.6) 60%, transparent 100%)",
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0 }}
          transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
        />
      ))}
      {/* Warm flash at base */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: "50%",
          bottom: "10%",
          transform: "translateX(-50%)",
          width: "120%",
          height: 30,
          background:
            "radial-gradient(ellipse, rgba(240, 199, 94, 0.5) 0%, transparent 70%)",
        }}
        initial={{ opacity: 1, scaleX: 0.5 }}
        animate={{ opacity: 0, scaleX: 1.5 }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}

function Minaret({ id, left, width, height }: MinaretProps) {
  const [isLit, setIsLit] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [sparkleKey, setSparkleKey] = useState(0);

  const handleTap = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      tryPlayAudio();
      triggerHaptic("light");
      setIsLit((prev) => !prev);
      if (!isLit) {
        setShowSparkle(true);
        setSparkleKey((k) => k + 1);
        setTimeout(() => setShowSparkle(false), 800);
      }
    },
    [isLit]
  );

  return (
    <div
      className="absolute bottom-0"
      style={{
        left,
        width,
        height,
        pointerEvents: "auto",
        touchAction: "none",
        cursor: "pointer",
      }}
      onPointerDown={handleTap}
      role="button"
      aria-label={
        isLit
          ? `Minaret ${id} is illuminated. Tap to dim.`
          : `Minaret ${id}. Tap to illuminate!`
      }
      tabIndex={0}
    >
      {/* Illumination glow */}
      <AnimatePresence>{isLit && <MinaretGlow />}</AnimatePresence>

      {/* Sparkle burst on tap */}
      <AnimatePresence>
        {showSparkle && <MinaretSparkle key={sparkleKey} />}
      </AnimatePresence>
    </div>
  );
}

export function InteractiveMinarets() {
  /*
   * Minaret positions are viewport-relative overlays matching the mosque silhouette.
   * The mosque image has minarets at roughly these horizontal positions:
   * - Far left minaret: ~5%
   * - Left-center minaret: ~22%
   * - Right-center minaret: ~55%
   * - Far right minaret: ~90%
   * Container uses z-40 to sit above the sky layer (z-14) and text layer (z-30)
   */
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-[40]"
      style={{
        height: "30vh",
        pointerEvents: "none",
      }}
    >
      <Minaret id="far-left" left="3%" width="8%" height="85%" />
      <Minaret id="left-center" left="20%" width="7%" height="60%" />
      <Minaret id="right-center" left="52%" width="7%" height="60%" />
      <Minaret id="far-right" left="88%" width="8%" height="85%" />
    </div>
  );
}
