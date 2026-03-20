/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * GeometricBorder: SVG-based Islamic geometric pattern borders
 * Subtle gold lines that frame the card edges
 */

import { motion } from "framer-motion";

export function GeometricCorners() {
  return (
    <>
      {/* Top-left corner ornament */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute top-4 left-4 z-30 pointer-events-none"
      >
        <CornerOrnament className="w-16 sm:w-24 md:w-32 h-auto" />
      </motion.div>

      {/* Top-right corner ornament */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        className="absolute top-4 right-4 z-30 pointer-events-none"
        style={{ transform: "scaleX(-1)" }}
      >
        <CornerOrnament className="w-16 sm:w-24 md:w-32 h-auto" />
      </motion.div>

      {/* Bottom-left corner ornament */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-4 left-4 z-30 pointer-events-none"
        style={{ transform: "scaleY(-1)" }}
      >
        <CornerOrnament className="w-16 sm:w-24 md:w-32 h-auto" />
      </motion.div>

      {/* Bottom-right corner ornament */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
        className="absolute bottom-4 right-4 z-30 pointer-events-none"
        style={{ transform: "scale(-1, -1)" }}
      >
        <CornerOrnament className="w-16 sm:w-24 md:w-32 h-auto" />
      </motion.div>
    </>
  );
}

function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer arc */}
      <path
        d="M5 5 L5 50 Q5 80 25 95 Q45 110 80 115 L115 115"
        stroke="rgba(240, 199, 94, 0.3)"
        strokeWidth="1"
        fill="none"
      />
      {/* Inner arc */}
      <path
        d="M10 10 L10 45 Q10 70 27 83 Q44 96 72 100 L110 110"
        stroke="rgba(240, 199, 94, 0.2)"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Geometric star at corner */}
      <g transform="translate(8, 8)">
        <path
          d="M0 8 L3 3 L8 0 L13 3 L16 8 L13 13 L8 16 L3 13 Z"
          stroke="rgba(240, 199, 94, 0.4)"
          strokeWidth="0.8"
          fill="rgba(240, 199, 94, 0.05)"
        />
        <path
          d="M8 2 L10 6 L14 8 L10 10 L8 14 L6 10 L2 8 L6 6 Z"
          stroke="rgba(240, 199, 94, 0.3)"
          strokeWidth="0.6"
          fill="rgba(240, 199, 94, 0.08)"
        />
      </g>
      {/* Small decorative dots along the arc */}
      <circle cx="5" cy="30" r="1.5" fill="rgba(240, 199, 94, 0.25)" />
      <circle cx="15" cy="60" r="1.2" fill="rgba(240, 199, 94, 0.2)" />
      <circle cx="35" cy="85" r="1.2" fill="rgba(240, 199, 94, 0.2)" />
      <circle cx="60" cy="100" r="1.5" fill="rgba(240, 199, 94, 0.25)" />
      <circle cx="90" cy="112" r="1.2" fill="rgba(240, 199, 94, 0.2)" />
    </svg>
  );
}

export function TopBorderLine() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 h-[2px] z-30"
      style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(240, 199, 94, 0.3) 30%, rgba(240, 199, 94, 0.5) 50%, rgba(240, 199, 94, 0.3) 70%, transparent 95%)",
      }}
    />
  );
}

export function BottomBorderLine() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
      className="absolute bottom-0 left-0 right-0 h-[2px] z-30"
      style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(240, 199, 94, 0.3) 30%, rgba(240, 199, 94, 0.5) 50%, rgba(240, 199, 94, 0.3) 70%, transparent 95%)",
      }}
    />
  );
}
