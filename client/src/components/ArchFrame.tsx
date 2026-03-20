/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * ArchFrame: Ornate Islamic pointed arch frame that borders the scene
 * Creates the "window into a magical world" effect — subtle, not competing with text
 */

import { motion } from "framer-motion";

const ARCH_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-arch-frame-JZaMKRFrVHJvGoCBkKhgxP.webp";

export function ArchFrame() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
      className="absolute inset-0 z-[22] pointer-events-none flex items-center justify-center"
    >
      <img
        src={ARCH_URL}
        alt="Islamic arch frame"
        className="w-full h-full object-contain"
        style={{
          opacity: 0.2,
          mixBlendMode: "screen",
          filter: "brightness(1.1) contrast(0.85) saturate(0.9)",
          WebkitMaskImage: "radial-gradient(ellipse 55% 50% at 50% 50%, black 50%, transparent 90%)",
          maskImage: "radial-gradient(ellipse 55% 50% at 50% 50%, black 50%, transparent 90%)",
        }}
        loading="eager"
      />
    </motion.div>
  );
}
