/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * Home: Full-screen immersive Eid greeting card
 *
 * TEXT LAYOUT (designed around the background crescent moon):
 *   TOP ZONE (4-10vh): "Dear Name" + decorative divider — above the crescent
 *   CRESCENT ZONE (~38vh): Arabic "عيد مبارك" — INSIDE the crescent's inner curve
 *   BOTTOM ZONE (~63vh): "EID MUBARAK" + blessing + prayer — below the crescent
 *
 * LAYERS: Background sky → Stars → Mosque → Bokeh → Interactive Sky → Arch → Lanterns → Text zones → Moon/Minarets → UI
 * INTERACTIVE: Tap lanterns, moon, minarets, sky for visual effects + haptic feedback
 * FIREWORKS: Golden fireworks when all 6 lanterns are lit
 */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BokehParticles,
  TwinklingStars,
  FloatingLightParticles,
  InteractiveSkyLayer,
} from "@/components/Particles";
import { LanternScene, registerAllLitCallback } from "@/components/Lanterns";
import { GreetingTop, GreetingArabic, GreetingBottom } from "@/components/GreetingText";
import {
  GeometricCorners,
  TopBorderLine,
  BottomBorderLine,
} from "@/components/GeometricBorder";
import { MosqueSilhouette } from "@/components/MosqueSilhouette";
import { ArchFrame } from "@/components/ArchFrame";
import { ShareButton } from "@/components/ShareButton";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Fireworks } from "@/components/Fireworks";
import { InteractiveMoon } from "@/components/InteractiveMoon";
import { InteractiveMinarets } from "@/components/InteractiveMinarets";

const HERO_BG_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-hero-bg-9kzzBonp6V77Ew3fAkrPXW.webp";

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #0C1445 0%, #2D1B69 60%, #4A2040 100%)",
      }}
    >
      {/* Crescent moon icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M40 10C30 10 22 18 22 30C22 42 30 50 40 50C35 50 25 45 20 38C15 31 15 22 20 15C25 8 35 5 40 10Z"
            fill="rgba(240, 199, 94, 0.8)"
          />
          <circle cx="42" cy="15" r="2" fill="rgba(240, 199, 94, 0.6)" />
          <circle cx="48" cy="22" r="1.5" fill="rgba(240, 199, 94, 0.5)" />
        </svg>
      </motion.div>

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-display text-sm tracking-[0.3em] uppercase mb-4"
        style={{ color: "rgba(232, 220, 200, 0.5)" }}
      >
        Preparing your greeting
      </motion.p>

      {/* Tap to begin hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="font-body text-xs tracking-widest mt-6"
        style={{ color: "rgba(240, 199, 94, 0.4)" }}
      >
        tap anywhere to begin
      </motion.p>

      {/* Progress bar */}
      <div
        className="w-48 h-[2px] rounded-full overflow-hidden mt-4"
        style={{ backgroundColor: "rgba(240, 199, 94, 0.1)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, rgba(240, 199, 94, 0.3), rgba(240, 199, 94, 0.8))",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksTriggered, setFireworksTriggered] = useState(false);

  // Preload the hero background image
  useEffect(() => {
    const img = new Image();
    img.src = HERO_BG_URL;
  }, []);

  // Register the all-lanterns-lit callback
  useEffect(() => {
    registerAllLitCallback(() => {
      if (!fireworksTriggered) {
        setFireworksTriggered(true);
        setShowFireworks(true);
      }
    });
  }, [fireworksTriggered]);

  const handleLoadingComplete = useCallback(() => {
    setShowContent(true);
  }, []);

  const handleFireworksComplete = useCallback(() => {
    setShowFireworks(false);
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#0C1445" }}
    >
      <AnimatePresence mode="wait">
        {!showContent && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative w-full h-full"
        >
          {/* Layer 0: Background twilight sky */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${HERO_BG_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Layer 0.5: Subtle overlay for better text contrast */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "radial-gradient(ellipse at center 40%, rgba(12, 20, 69, 0.15) 0%, rgba(12, 20, 69, 0.4) 60%, rgba(12, 20, 69, 0.6) 100%)",
            }}
          />

          {/* Layer 1: Twinkling stars */}
          <TwinklingStars count={50} />

          {/* Layer 2: Mosque silhouette at bottom */}
          <MosqueSilhouette />

          {/* Layer 3: Bokeh particles */}
          <BokehParticles count={18} />

          {/* Layer 4: Floating light particles rising up */}
          <FloatingLightParticles count={10} />

          {/* Layer 4.5: Interactive sky — tap for sparkle bursts */}
          <InteractiveSkyLayer />

          {/* Layer 5: Arch frame overlay */}
          <ArchFrame />

          {/* Layer 6: Lanterns at various depths — tappable to light up */}
          <LanternScene />

          {/* Layer 7: Geometric corner ornaments and border lines */}
          <GeometricCorners />
          <TopBorderLine />
          <BottomBorderLine />

          {/* ═══════════════════════════════════════════════════════
              TEXT ZONES — Three separate zones positioned around the crescent
              ═══════════════════════════════════════════════════════ */}

          {/* TOP ZONE: "Dear Name" — above the crescent (5vh from top) */}
          <div
            className="absolute left-0 right-0 z-30 flex justify-center pointer-events-none"
            style={{ top: "5vh" }}
          >
            <GreetingTop />
          </div>

          {/* CRESCENT ZONE: Arabic "عيد مبارك" — INSIDE the crescent's inner curve.
              On mobile, the crescent inner curve center is around 42-45vh.
              Positioning at 43vh places the Arabic text right inside the empty space. */}
          <div
            className="absolute left-0 right-0 z-30 flex justify-center pointer-events-none"
            style={{ top: "43vh" }}
          >
            <GreetingArabic />
          </div>

          {/* BOTTOM ZONE: "EID MUBARAK" + blessing + prayer — below the crescent.
              Tightened to 62vh to reduce gap from Arabic text. */}
          <div
            className="absolute left-0 right-0 z-30 flex justify-center pointer-events-none"
            style={{ top: "62vh" }}
          >
            <GreetingBottom />
          </div>

          {/* Vignette overlay for depth */}
          <div
            className="absolute inset-0 z-[35] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(12, 20, 69, 0.6) 100%)",
            }}
          />

          {/* Layer 9: Interactive crescent moon overlay — tap for glow effect */}
          <InteractiveMoon />

          {/* Layer 9.5: Interactive minaret hotspots — tap to illuminate */}
          <InteractiveMinarets />

          {/* UI Controls — above vignette */}
          <AudioPlayer />
          <ShareButton />

          {/* Subtle "Create Your Own" link at bottom center */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50"
          >
            <a
              href="/create"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[10px] sm:text-xs tracking-wide transition-all duration-300 hover:scale-105"
              style={{
                color: "rgba(240, 199, 94, 0.6)",
                background: "rgba(12, 20, 69, 0.5)",
                border: "1px solid rgba(240, 199, 94, 0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Your Own
            </a>
          </motion.div>

          {/* Fireworks celebration — triggered when all lanterns are lit */}
          <Fireworks
            show={showFireworks}
            onComplete={handleFireworksComplete}
          />
        </motion.div>
      )}
    </div>
  );
}
