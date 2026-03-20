/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * AudioPlayer: Background ambient audio that plays on first user interaction
 * Shows a subtle speaker icon in the bottom-left corner
 * Loops a gentle Eid-themed ambient track
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
  const [hasInteracted, setHasInteracted] = useState(false);
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

  // Hide hint after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
        setShowHint(false);
      }).catch(() => {
        // Autoplay blocked — user needs to interact
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  // Try to auto-play on first user interaction anywhere on the page
  useEffect(() => {
    if (hasInteracted) return;

    const handleFirstInteraction = () => {
      // Don't auto-play, just mark that user has interacted
      setHasInteracted(true);
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-2 sm:gap-3">
      {/* Audio toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAudio}
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

      {/* Hint text — shown briefly */}
      <AnimatePresence>
        {showHint && !isPlaying && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            className="font-body text-[10px] sm:text-sm whitespace-nowrap pointer-events-none"
            style={{ color: "rgba(240, 199, 94, 0.5)" }}
          >
            Tap for music
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
