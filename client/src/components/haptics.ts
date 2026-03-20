/*
 * Haptic feedback utility for interactive elements
 * Uses the Vibration API (supported on Android Chrome, some iOS Safari)
 * Falls back silently on unsupported browsers
 */

type HapticPattern = "light" | "medium" | "heavy" | "sparkle";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 15,
  medium: 30,
  heavy: 50,
  sparkle: [10, 30, 10],
};

export function triggerHaptic(pattern: HapticPattern = "light"): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(patterns[pattern]);
    }
  } catch {
    // Silently ignore — haptics are a nice-to-have
  }
}
