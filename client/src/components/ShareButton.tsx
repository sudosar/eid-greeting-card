/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * ShareButton: Floating share menu with WhatsApp share and copy-link
 * Appears as a subtle golden icon in the bottom-right corner
 * Expands on click to reveal share options
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, MessageCircle, Link, Check, X } from "lucide-react";
import { toast } from "sonner";

export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl = window.location.href;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        style: {
          background: "rgba(12, 20, 69, 0.95)",
          color: "#E8DCC8",
          border: "1px solid rgba(240, 199, 94, 0.3)",
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentUrl]);

  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent(`Eid Mubarak! 🌙✨ ${currentUrl}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  }, [currentUrl]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Share options — shown when open */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* WhatsApp */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md transition-all hover:scale-105"
              style={{
                background: "rgba(37, 211, 102, 0.2)",
                border: "1px solid rgba(37, 211, 102, 0.4)",
                color: "#25D366",
              }}
              title="Share on WhatsApp"
            >
              <MessageCircle size={18} />
              <span className="font-body text-sm">WhatsApp</span>
            </motion.button>

            {/* Copy Link */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md transition-all hover:scale-105"
              style={{
                background: "rgba(240, 199, 94, 0.15)",
                border: "1px solid rgba(240, 199, 94, 0.35)",
                color: "#F0C75E",
              }}
              title="Copy link"
            >
              {copied ? <Check size={18} /> : <Link size={18} />}
              <span className="font-body text-sm">{copied ? "Copied!" : "Copy Link"}</span>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
        style={{
          background: isOpen
            ? "rgba(240, 199, 94, 0.25)"
            : "rgba(12, 20, 69, 0.7)",
          border: "1px solid rgba(240, 199, 94, 0.4)",
          color: "#F0C75E",
          boxShadow: "0 4px 20px rgba(240, 199, 94, 0.15)",
        }}
        title={isOpen ? "Close" : "Share this greeting"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Share2 size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
