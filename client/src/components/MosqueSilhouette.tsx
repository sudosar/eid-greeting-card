/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * MosqueSilhouette: Dark mosque skyline at the bottom of the scene
 * Subtle, atmospheric — not dominating the composition
 * MOBILE: Reduced height on small screens to leave room for text
 */

import { motion } from "framer-motion";

const MOSQUE_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-mosque-silhouette-gDRyBoWYgEeyiJmGW3CHvm.webp";

export function MosqueSilhouette() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      className="absolute bottom-0 left-0 right-0 z-[8] pointer-events-none max-h-[25vh] sm:max-h-[35vh]"
    >
      {/* Warm glow behind the mosque from horizon */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 sm:h-32"
        style={{
          background: "linear-gradient(to top, rgba(74, 32, 64, 0.25) 0%, rgba(45, 27, 105, 0.1) 50%, transparent 100%)",
        }}
      />
      <img
        src={MOSQUE_URL}
        alt="Mosque silhouette skyline"
        className="w-full h-auto object-cover object-bottom max-h-[25vh] sm:max-h-[35vh]"
        style={{
          opacity: 0.45,
          filter: "brightness(0.3) saturate(0.6)",
          mixBlendMode: "screen",
        }}
        loading="eager"
      />
    </motion.div>
  );
}
