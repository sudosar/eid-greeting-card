/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * GreetingText: Split-layout bilingual Eid Mubarak greeting
 *
 * LAYOUT (designed around the background crescent moon):
 *   TOP ZONE (above crescent): Personalized "Dear Name" + decorative divider
 *   CRESCENT ZONE (inside moon curve): Arabic "عيد مبارك"
 *   BOTTOM ZONE (below crescent): "EID MUBARAK" + blessing + Arabic prayer + year
 *
 * PERSONALIZATION:
 *   ?name=Ahmed       → "Dear Ahmed," in the top zone
 *   ?msg=From+the+Ali+family → custom message in the bottom zone
 *
 * MOBILE: Responsive text sizes, readable on 320px+ screens
 */

import { useMemo } from "react";
import { motion } from "framer-motion";

function useUrlParams(): { name: string | null; msg: string | null } {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const msg = params.get("msg");
    return {
      name: name ? decodeURIComponent(name).trim() : null,
      msg: msg ? decodeURIComponent(msg).trim() : null,
    };
  }, []);
}

/* ─── TOP ZONE: Name & decorative divider (above the crescent) ─── */
export function GreetingTop() {
  const { name } = useUrlParams();

  return (
    <div className="flex flex-col items-center text-center pointer-events-none">
      {/* Decorative top divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="w-20 sm:w-28 md:w-40 h-[1px] mb-2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(240, 199, 94, 0.6), transparent)",
        }}
      />

      {/* Personalized "Dear Name" line — increased font size */}
      {name && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="font-body text-xl sm:text-2xl md:text-3xl"
          style={{
            color: "rgba(232, 220, 200, 0.85)",
            letterSpacing: "0.04em",
            textShadow:
              "0 2px 12px rgba(12, 20, 69, 0.9), 0 0 20px rgba(12, 20, 69, 0.6)",
          }}
        >
          Dear{" "}
          <span style={{ color: "#F0C75E", fontWeight: 600 }}>{name}</span>,
        </motion.p>
      )}

      {/* If no name, show a small decorative star instead */}
      {!name && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-gentle-float"
          >
            <path
              d="M12 2L14.09 8.26L20.18 8.26L15.18 12.14L17.27 18.4L12 14.74L6.73 18.4L8.82 12.14L3.82 8.26L9.91 8.26L12 2Z"
              fill="rgba(240, 199, 94, 0.6)"
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
}

/* ─── CRESCENT ZONE: Arabic "عيد مبارك" (inside the moon's inner curve) ─── */
export function GreetingArabic() {
  return (
    <div className="flex flex-col items-center text-center pointer-events-none">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        className="font-arabic text-5xl sm:text-6xl md:text-7xl lg:text-8xl animate-text-glow leading-none"
        style={{
          color: "#F0C75E",
          direction: "rtl",
          fontWeight: 700,
          textShadow:
            "0 2px 16px rgba(12, 20, 69, 1), 0 0 40px rgba(12, 20, 69, 0.8), 0 0 60px rgba(240, 199, 94, 0.15)",
        }}
      >
        عيد مبارك
      </motion.h1>
    </div>
  );
}

/* ─── BOTTOM ZONE: English title + blessing + prayer + year (below the crescent) ─── */
export function GreetingBottom() {
  const { name, msg } = useUrlParams();

  return (
    <div
      className="flex flex-col items-center text-center px-6 sm:px-10 py-2 rounded-2xl max-w-[90vw] sm:max-w-lg pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(12, 20, 69, 0.8) 0%, rgba(12, 20, 69, 0.5) 50%, transparent 85%)",
      }}
    >
      {/* Small decorative star */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        className="mb-0.5"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-gentle-float sm:w-4 sm:h-4"
        >
          <path
            d="M12 2L14.09 8.26L20.18 8.26L15.18 12.14L17.27 18.4L12 14.74L6.73 18.4L8.82 12.14L3.82 8.26L9.91 8.26L12 2Z"
            fill="rgba(240, 199, 94, 0.6)"
          />
        </svg>
      </motion.div>

      {/* English greeting — increased font size by 1 step */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.3, ease: "easeOut" }}
        className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] sm:tracking-[0.15em] uppercase"
        style={{
          color: "#E8DCC8",
          textShadow:
            "0 2px 12px rgba(12, 20, 69, 0.9), 0 0 30px rgba(12, 20, 69, 0.7), 0 0 20px rgba(240, 199, 94, 0.2)",
        }}
      >
        Eid Mubarak
      </motion.h2>

      {/* Subtitle / blessing — increased font size by 1 step */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
        className="font-body text-base sm:text-lg md:text-xl mt-1 max-w-[85vw] sm:max-w-md leading-relaxed"
        style={{
          color: "rgba(232, 220, 200, 0.75)",
          textShadow: "0 1px 8px rgba(12, 20, 69, 0.8)",
        }}
      >
        {name
          ? `May this blessed occasion bring peace, happiness, and prosperity to you and your family, ${name}`
          : "May this blessed occasion bring peace, happiness, and prosperity to you and your loved ones"}
      </motion.p>

      {/* Custom message */}
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
          className="font-body text-base sm:text-lg md:text-xl mt-1 italic max-w-[80vw] sm:max-w-sm"
          style={{
            color: "rgba(240, 199, 94, 0.7)",
            letterSpacing: "0.02em",
          }}
        >
          — {msg}
        </motion.p>
      )}

      {/* Arabic blessing — increased font size by 1 step */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: msg ? 2.1 : 1.9, ease: "easeOut" }}
        className="font-arabic text-lg sm:text-2xl md:text-3xl mt-1"
        style={{
          color: "rgba(240, 199, 94, 0.65)",
          direction: "rtl",
          fontWeight: 500,
        }}
      >
        تقبّل الله منّا ومنكم
      </motion.p>

      {/* Decorative bottom divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: msg ? 2.4 : 2.2, ease: "easeOut" }}
        className="w-20 sm:w-28 md:w-40 h-[1px] mt-1.5"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(240, 199, 94, 0.6), transparent)",
        }}
      />

      {/* Year / occasion label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: msg ? 2.7 : 2.5, ease: "easeOut" }}
        className="font-display text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-0.5"
        style={{
          color: "rgba(232, 220, 200, 0.4)",
        }}
      >
        Eid al-Fitr 1447 AH
      </motion.p>
    </div>
  );
}

/* ─── Legacy export for backward compatibility ─── */
export function GreetingText() {
  return (
    <div className="flex flex-col items-center">
      <GreetingTop />
      <div className="mt-[25vh]">
        <GreetingArabic />
      </div>
      <div className="mt-[15vh]">
        <GreetingBottom />
      </div>
    </div>
  );
}
