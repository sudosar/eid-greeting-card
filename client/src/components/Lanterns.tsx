/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * Lanterns: Ornate Islamic fanous lanterns that sway gently with warm inner glow
 * INTERACTIVE: Lanterns start dim. Tap/click to light them up with a burst of warmth!
 * Uses tight elliptical CSS mask to hide the white/light backgrounds
 * Includes golden chain SVG lines hanging from above
 * MOBILE: Fewer lanterns on small screens, reduced sizes
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LANTERN_1_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-lantern-1-6ZiYH2rjQqBAUDzShcm2rJ.webp";
const LANTERN_2_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-lantern-2-6WSSDv9is6fknfxrZZ2XH3.webp";

interface LanternProps {
  variant: 1 | 2;
  className?: string;
  size?: string;
  swayClass?: string;
  style?: React.CSSProperties;
  showChain?: boolean;
  id: string;
}

function GoldenChain({ height = 40 }: { height?: number }) {
  return (
    <div className="flex justify-center" style={{ marginBottom: -4 }}>
      <svg width="4" height={height} viewBox={`0 0 4 ${height}`} fill="none">
        <line
          x1="2" y1="0" x2="2" y2={height}
          stroke="rgba(212, 168, 67, 0.5)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      </svg>
    </div>
  );
}

/* Burst of sparkles when a lantern is lit */
function LightBurst() {
  const sparkles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 40 + Math.random() * 30;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 0.15,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "40%",
            width: s.size,
            height: s.size,
            background: "radial-gradient(circle, rgba(240, 199, 94, 1) 0%, rgba(255, 220, 120, 0.8) 50%, transparent 100%)",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: s.x,
            y: s.y,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: 0.7,
            delay: s.delay,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Central flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          width: 60,
          height: 60,
          background: "radial-gradient(circle, rgba(240, 199, 94, 0.6) 0%, rgba(240, 199, 94, 0.2) 40%, transparent 70%)",
        }}
        initial={{ opacity: 1, scale: 0.5 }}
        animate={{ opacity: 0, scale: 2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

function Lantern({ variant, className = "", size = "w-24", swayClass = "animate-lantern-sway", style, showChain = true, id }: LanternProps) {
  const url = variant === 1 ? LANTERN_1_URL : LANTERN_2_URL;
  const flickerDuration = `${1 + Math.random() * 1.5}s`;
  const [isLit, setIsLit] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const handleTap = useCallback(() => {
    if (isLit) {
      // Toggle off
      setIsLit(false);
    } else {
      // Light up with burst effect
      setIsLit(true);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 800);
    }
  }, [isLit]);

  return (
    <div
      className={`${swayClass} ${className}`}
      style={style}
      onClick={handleTap}
      role="button"
      aria-label={isLit ? `Lantern ${id} is lit. Tap to dim.` : `Lantern ${id}. Tap to light it up!`}
      tabIndex={0}
    >
      {/* Golden chain hanging from above */}
      {showChain && <GoldenChain height={30} />}

      <motion.div
        className="relative cursor-pointer"
        style={{ animation: `flame-flicker ${flickerDuration} ease-in-out infinite` }}
        whileTap={{ scale: 1.08 }}
      >
        {/* Warm glow halo behind the lantern — intensifies when lit */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/4 rounded-full"
          animate={{
            width: isLit ? "180%" : "130%",
            height: isLit ? "140%" : "100%",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background: isLit
              ? "radial-gradient(ellipse, rgba(240, 199, 94, 0.45) 0%, rgba(232, 148, 58, 0.25) 30%, transparent 55%)"
              : "radial-gradient(ellipse, rgba(240, 199, 94, 0.12) 0%, rgba(232, 148, 58, 0.05) 30%, transparent 55%)",
            animation: isLit ? "glow-pulse 2s ease-in-out infinite" : "none",
            zIndex: 0,
          }}
        />

        {/* Lantern image with tight elliptical mask */}
        <motion.div
          className={`${size} relative`}
          animate={{
            filter: isLit
              ? "brightness(1.8) contrast(1.3) saturate(1.5)"
              : "brightness(0.7) contrast(1.0) saturate(0.6)",
          }}
          transition={{ duration: 0.4 }}
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 40% 46% at 50% 46%, black 55%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 40% 46% at 50% 46%, black 55%, transparent 100%)",
            zIndex: 1,
          }}
        >
          <img
            src={url}
            alt="Islamic lantern"
            className="w-full h-auto object-contain"
            loading="eager"
            draggable={false}
          />
        </motion.div>

        {/* "Tap to light" hint — only shown on unlit lanterns */}
        <AnimatePresence>
          {!isLit && (
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <span className="font-body text-[8px] sm:text-[10px]" style={{ color: "rgba(240, 199, 94, 0.5)" }}>
                tap ✦
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkle burst when lit */}
        <AnimatePresence>
          {showBurst && <LightBurst />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function LanternScene() {
  return (
    <>
      {/* Left foreground lantern — large, close */}
      <Lantern
        id="left-front"
        variant={1}
        size="w-16 sm:w-24 md:w-32 lg:w-40"
        className="absolute top-0 left-[2%] sm:left-[6%] z-20"
        swayClass="animate-lantern-sway"
        style={{ "--sway-duration": "4.5s" } as React.CSSProperties}
      />

      {/* Right foreground lantern — large, close */}
      <Lantern
        id="right-front"
        variant={2}
        size="w-14 sm:w-20 md:w-28 lg:w-36"
        className="absolute top-0 right-[2%] sm:right-[6%] z-20"
        swayClass="animate-lantern-sway-reverse"
        style={{ "--sway-duration": "3.8s" } as React.CSSProperties}
      />

      {/* Left midground lantern — medium — hidden on very small screens */}
      <Lantern
        id="left-mid"
        variant={2}
        size="w-10 sm:w-14 md:w-18 lg:w-22"
        className="absolute top-[5%] left-[15%] sm:left-[20%] z-[15] opacity-75 hidden xs:block sm:block"
        swayClass="animate-lantern-sway"
        style={{ "--sway-duration": "5s" } as React.CSSProperties}
      />

      {/* Right midground lantern — medium — hidden on very small screens */}
      <Lantern
        id="right-mid"
        variant={1}
        size="w-10 sm:w-14 md:w-18 lg:w-22"
        className="absolute top-[3%] right-[13%] sm:right-[18%] z-[15] opacity-75 hidden xs:block sm:block"
        swayClass="animate-lantern-sway-reverse"
        style={{ "--sway-duration": "4.2s" } as React.CSSProperties}
      />

      {/* Center-left background lantern — small, far — hidden on mobile */}
      <Lantern
        id="center-left"
        variant={1}
        size="w-10 sm:w-12 md:w-16"
        className="absolute top-0 left-[35%] z-[12] opacity-50 hidden sm:block"
        swayClass="animate-lantern-sway"
        style={{ "--sway-duration": "5.5s" } as React.CSSProperties}
        showChain={false}
      />

      {/* Center-right background lantern — small, far — hidden on mobile */}
      <Lantern
        id="center-right"
        variant={2}
        size="w-10 sm:w-12 md:w-16"
        className="absolute top-0 right-[32%] z-[12] opacity-50 hidden sm:block"
        swayClass="animate-lantern-sway-reverse"
        style={{ "--sway-duration": "6s" } as React.CSSProperties}
        showChain={false}
      />
    </>
  );
}
