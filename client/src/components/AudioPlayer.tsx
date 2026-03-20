/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * AudioPlayer: Background ambient audio that auto-plays on first user interaction
 * Shows a subtle speaker icon in the bottom-left corner
 * Loops a gentle Eid-themed ambient track
 * Auto-plays when user first taps/clicks ANYWHERE on the page
 * MOBILE: Smaller button, adjusted spacing for small screens
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const AUDIO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-ambient_280f4337.mp3";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Hide hint after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play audio on first user interaction ANYWHERE on the page
  useEffect(() => {
    if (hasAutoPlayed) return;

    const handleFirstInteraction = () => {
      const audio = audioRef.current;
      if (!audio || hasAutoPlayed) return;

      audio.play().then(() => {
        setIsPlaying(true);
        setHasAutoPlayed(true);
        setShowHint(false);
      }).catch(() => {
        // Autoplay still blocked in some edge cases
        setHasAutoPlayed(true);
      });
    };

    // Listen on the whole document for any interaction
    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true });
    document.addEventListener("pointerdown", handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("pointerdown", handleFirstInteraction);
    };
  }, [hasAutoPlayed]);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasAutoPlayed(true);
        setShowHint(false);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-2 sm:gap-3">
      {/* Audio toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation(); // Don't trigger the global auto-play listener
          toggleAudio();
        }}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
        style={{
          background: isPlaying
            ? "rgba(240, 199, 94, 0.2)"
            : "rgba(12, 20, 69, 0.7)",
          border: "1px solid rgba(240, 199, 94, 0.35)",
          color: "#F0C75E",
          boxShadow: "0 4px 20px rgba(240, 199, 94, 0.1)",
        }}
        title={isPlaying ? "Mute" : "Play ambient music"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Volume2 size={18} className="sm:w-5 sm:h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VolumeX size={18} className="sm:w-5 sm:h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated sound waves when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              border: "1px solid rgba(240, 199, 94, 0.3)",
            }}
          />
        )}
      </motion.button>

      {/* Hint text — shown briefly, pulses to attract attention */}
      <AnimatePresence>
        {showHint && !isPlaying && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: [0.5, 1, 0.5], x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ opacity: { duration: 2, repeat: Infinity }, x: { duration: 0.4 } }}
            className="font-body text-[10px] sm:text-sm whitespace-nowrap pointer-events-none"
            style={{ color: "rgba(240, 199, 94, 0.6)" }}
          >
            Tap anywhere for music ♪
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
