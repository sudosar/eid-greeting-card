/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * GreetingText: Bilingual Eid Mubarak greeting with animated entrance
 * Arabic: Scheherazade New — flowing, elegant Naskh
 * English: Cinzel Decorative — ornate capitals echoing architectural inscriptions
 * Body: EB Garamond — warm, classical serif
 *
 * PERSONALIZATION:
 *   ?name=Ahmed       → "Dear Ahmed," + personalized blessing
 *   ?msg=From+the+Ali+family → custom message line below the blessing
 *   Both can be combined: ?name=Ahmed&msg=From+the+Ali+family
 *
 * MOBILE: Optimized text sizes and spacing for small screens (320px+)
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

export function GreetingText() {
  const { name, msg } = useUrlParams();

  return (
    <div className="relative z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-4 sm:py-8 max-w-full overflow-hidden" style={{ marginTop: '-8vh' }}>
      {/* Decorative top divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="w-24 sm:w-32 md:w-48 h-[1px] mb-3 sm:mb-6"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(240, 199, 94, 0.6), transparent)",
        }}
      />

      {/* Personalized "Dear Name" line — only shown when ?name= is present */}
      {name && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="font-body text-base sm:text-xl md:text-2xl mb-1 sm:mb-3"
          style={{
            color: "rgba(232, 220, 200, 0.85)",
            letterSpacing: "0.04em",
          }}
        >
          Dear <span style={{ color: "#F0C75E", fontWeight: 600 }}>{name}</span>,
        </motion.p>
      )}

      {/* Arabic greeting — عيد مبارك */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        className="font-arabic text-4xl sm:text-5xl md:text-7xl lg:text-8xl animate-text-glow leading-relaxed"
        style={{
          color: "#F0C75E",
          direction: "rtl",
          fontWeight: 700,
          textShadow: "0 2px 12px rgba(12, 20, 69, 0.9), 0 0 30px rgba(12, 20, 69, 0.7)",
        }}
      >
        عيد مبارك
      </motion.h1>

      {/* Small decorative star */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
        className="my-2 sm:my-4"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-gentle-float sm:w-6 sm:h-6">
          <path
            d="M12 2L14.09 8.26L20.18 8.26L15.18 12.14L17.27 18.4L12 14.74L6.73 18.4L8.82 12.14L3.82 8.26L9.91 8.26L12 2Z"
            fill="rgba(240, 199, 94, 0.7)"
          />
        </svg>
      </motion.div>

      {/* English greeting */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
        className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] sm:tracking-[0.15em] uppercase"
        style={{
          color: "#E8DCC8",
          textShadow: "0 0 20px rgba(240, 199, 94, 0.2)",
        }}
      >
        Eid Mubarak
      </motion.h2>

      {/* Subtitle / blessing — personalized when name is present */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
        className="font-body text-sm sm:text-lg md:text-xl mt-3 sm:mt-6 max-w-[85vw] sm:max-w-md leading-relaxed px-2"
        style={{
          color: "rgba(232, 220, 200, 0.75)",
        }}
      >
        {name
          ? `May this blessed occasion bring peace, happiness, and prosperity to you and your family, ${name}`
          : "May this blessed occasion bring peace, happiness, and prosperity to you and your loved ones"}
      </motion.p>

      {/* Custom message — only shown when ?msg= is present */}
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
          className="font-body text-xs sm:text-base md:text-lg mt-2 sm:mt-3 italic max-w-[80vw] sm:max-w-sm"
          style={{
            color: "rgba(240, 199, 94, 0.7)",
            letterSpacing: "0.02em",
          }}
        >
          — {msg}
        </motion.p>
      )}

      {/* Arabic blessing */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: msg ? 2.1 : 1.9, ease: "easeOut" }}
        className="font-arabic text-lg sm:text-2xl md:text-3xl mt-2 sm:mt-4"
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
        className="w-24 sm:w-32 md:w-48 h-[1px] mt-3 sm:mt-6"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(240, 199, 94, 0.6), transparent)",
        }}
      />

      {/* Year / occasion label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: msg ? 2.7 : 2.5, ease: "easeOut" }}
        className="font-display text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-3 sm:mt-4"
        style={{
          color: "rgba(232, 220, 200, 0.4)",
        }}
      >
        Eid al-Fitr 1447 AH
      </motion.p>
    </div>
  );
}
