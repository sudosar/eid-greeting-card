/*
 * Shared audio context for the Eid greeting card.
 * Any component can call tryPlayAudio() to attempt audio playback.
 * The audio will only start once (on the first successful play call).
 * This ensures that no matter which element the user taps first
 * (lantern, sky, share button, etc.), the audio will start.
 */

const AUDIO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-ambient-v2_6f17c4ff.mp3";

let audio: HTMLAudioElement | null = null;
let hasPlayed = false;
let listeners: Array<(playing: boolean) => void> = [];

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
  }
  return audio;
}

// Preload immediately
getAudio();

export function tryPlayAudio(): void {
  if (hasPlayed) return;
  const a = getAudio();
  a.play()
    .then(() => {
      hasPlayed = true;
      notifyListeners(true);
    })
    .catch(() => {
      // Silently fail — will retry on next interaction
    });
}

export function toggleAudio(): boolean {
  const a = getAudio();
  if (a.paused) {
    a.play()
      .then(() => {
        hasPlayed = true;
        notifyListeners(true);
      })
      .catch(() => {});
    return true; // will be playing
  } else {
    a.pause();
    notifyListeners(false);
    return false; // paused
  }
}

export function isAudioPlaying(): boolean {
  return audio ? !audio.paused : false;
}

export function hasAudioPlayed(): boolean {
  return hasPlayed;
}

export function onAudioStateChange(listener: (playing: boolean) => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners(playing: boolean): void {
  listeners.forEach((l) => l(playing));
}

// Also set up a global capture-phase listener as a fallback
// This catches any click/tap on the page
function setupGlobalListener(): void {
  const handler = () => {
    tryPlayAudio();
    if (hasPlayed) {
      document.removeEventListener("click", handler, true);
      document.removeEventListener("touchend", handler, true);
      document.removeEventListener("pointerup", handler, true);
    }
  };
  document.addEventListener("click", handler, true);
  document.addEventListener("touchend", handler, true);
  document.addEventListener("pointerup", handler, true);
}

// Set up global listener when module loads
if (typeof document !== "undefined") {
  setupGlobalListener();
}
