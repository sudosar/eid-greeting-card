/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * AudioPlayer: Background ambient audio UI control
 * Uses shared audioContext for playback — any interaction on the page triggers audio
 * Shows a subtle speaker icon in the bottom-left corner
 * MOBILE: Smaller button, adjusted spacing for small screens
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { toggleAudio, isAudioPlaying, onAudioStateChange } from "./audioContext";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Subscribe to audio state changes from the shared context
  useEffect(() => {
    // Sync initial state
    setIsPlaying(isAudioPlaying());

    const unsubscribe = onAudioStateChange((playing) => {
      setIsPlaying(playing);
      if (playing) setShowHint(false);
    });

    return unsubscribe;
  }, []);

  // Hide hint after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = useCallback(() => {
    toggleAudio();
    // State will be updated via the onAudioStateChange listener
  }, []);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-2 sm:gap-3">
      {/* Audio toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
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
