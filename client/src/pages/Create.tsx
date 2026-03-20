/*
 * CREATE YOUR OWN — Personalized Eid Greeting Card Generator
 * A beautiful form page where visitors type a recipient's name and custom message,
 * then get a shareable personalized link with a copy button and QR code.
 * Styled to match the twilight/gold Eid theme.
 */

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const HERO_BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-hero-bg-9kzzBonp6V77Ew3fAkrPXW.webp";

function QRCode({ url }: { url: string }) {
  // Generate QR code using a public API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=0C1445&color=F0C75E&format=svg`;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl overflow-hidden border border-[rgba(240,199,94,0.2)] p-2" style={{ background: "rgba(12, 20, 69, 0.8)" }}>
        <img src={qrUrl} alt="QR Code" className="w-36 h-36 sm:w-44 sm:h-44" />
      </div>
      <p className="font-body text-xs" style={{ color: "rgba(232, 220, 200, 0.4)" }}>
        Scan to open the greeting
      </p>
    </div>
  );
}

function CrescentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
      <path
        d="M40 10C30 10 22 18 22 30C22 42 30 50 40 50C35 50 25 45 20 38C15 31 15 22 20 15C25 8 35 5 40 10Z"
        fill="rgba(240, 199, 94, 0.8)"
      />
      <circle cx="42" cy="15" r="2" fill="rgba(240, 199, 94, 0.6)" />
      <circle cx="48" cy="22" r="1.5" fill="rgba(240, 199, 94, 0.5)" />
    </svg>
  );
}

export default function Create() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [showResult, setShowResult] = useState(false);

  const generatedUrl = useMemo(() => {
    const base = typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname.replace(/\/create\/?$/, "/")}`
      : "/";
    const params = new URLSearchParams();
    if (name.trim()) params.set("name", name.trim());
    if (msg.trim()) params.set("msg", msg.trim());
    const queryStr = params.toString();
    return queryStr ? `${base}?${queryStr}` : base;
  }, [name, msg]);

  const handleGenerate = useCallback(() => {
    if (!name.trim() && !msg.trim()) {
      toast.error("Please enter at least a name or message");
      return;
    }
    setShowResult(true);
  }, [name, msg]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = generatedUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Link copied to clipboard!");
    }
  }, [generatedUrl]);

  const handleWhatsApp = useCallback(() => {
    const text = `Eid Mubarak! I made a special greeting for you: ${generatedUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }, [generatedUrl]);

  const handleReset = useCallback(() => {
    setShowResult(false);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0C1445" }}
    >
      {/* Background image — subtle */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url(${HERO_BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(12, 20, 69, 0.6) 0%, rgba(12, 20, 69, 0.85) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-auto px-5 py-8 sm:py-12"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <CrescentIcon />
          <h1
            className="font-display text-2xl sm:text-3xl tracking-[0.1em] uppercase mt-4"
            style={{ color: "#F0C75E" }}
          >
            Create Your Own
          </h1>
          <p
            className="font-body text-sm sm:text-base mt-2 text-center max-w-sm"
            style={{ color: "rgba(232, 220, 200, 0.6)" }}
          >
            Personalize an Eid greeting card and share it with your loved ones
          </p>
          <div
            className="w-32 h-[1px] mt-4"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(240, 199, 94, 0.5), transparent)",
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            /* FORM */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-5"
            >
              {/* Name input */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-body text-sm tracking-wide"
                  style={{ color: "rgba(232, 220, 200, 0.7)" }}
                >
                  Recipient's Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmed"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-lg font-body text-base outline-none transition-all duration-300 focus:ring-2"
                  style={{
                    background: "rgba(240, 199, 94, 0.08)",
                    border: "1px solid rgba(240, 199, 94, 0.2)",
                    color: "#E8DCC8",
                    caretColor: "#F0C75E",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(240, 199, 94, 0.5)";
                    e.target.style.boxShadow = "0 0 15px rgba(240, 199, 94, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(240, 199, 94, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Message input */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-body text-sm tracking-wide"
                  style={{ color: "rgba(232, 220, 200, 0.7)" }}
                >
                  Your Message <span style={{ color: "rgba(232, 220, 200, 0.35)" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="e.g. From the Ali family"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg font-body text-base outline-none transition-all duration-300"
                  style={{
                    background: "rgba(240, 199, 94, 0.08)",
                    border: "1px solid rgba(240, 199, 94, 0.2)",
                    color: "#E8DCC8",
                    caretColor: "#F0C75E",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(240, 199, 94, 0.5)";
                    e.target.style.boxShadow = "0 0 15px rgba(240, 199, 94, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(240, 199, 94, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Preview text */}
              {(name.trim() || msg.trim()) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg p-4 mt-1"
                  style={{
                    background: "rgba(240, 199, 94, 0.05)",
                    border: "1px solid rgba(240, 199, 94, 0.1)",
                  }}
                >
                  <p className="font-body text-xs mb-2" style={{ color: "rgba(232, 220, 200, 0.4)" }}>
                    Preview
                  </p>
                  <p className="font-arabic text-xl mb-1" style={{ color: "#F0C75E", direction: "rtl" }}>
                    عيد مبارك
                  </p>
                  {name.trim() && (
                    <p className="font-body text-sm" style={{ color: "rgba(232, 220, 200, 0.7)" }}>
                      Dear <span style={{ color: "#F0C75E" }}>{name.trim()}</span>,
                    </p>
                  )}
                  {msg.trim() && (
                    <p className="font-body text-xs italic mt-1" style={{ color: "rgba(240, 199, 94, 0.6)" }}>
                      — {msg.trim()}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Generate button */}
              <motion.button
                onClick={handleGenerate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-lg font-display text-sm sm:text-base tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer mt-2"
                style={{
                  background: "linear-gradient(135deg, rgba(240, 199, 94, 0.9), rgba(212, 168, 67, 0.9))",
                  color: "#0C1445",
                  fontWeight: 700,
                  boxShadow: "0 4px 20px rgba(240, 199, 94, 0.3)",
                }}
              >
                Generate Greeting Card
              </motion.button>

              {/* Back to card link */}
              <a
                href="/"
                className="font-body text-xs text-center mt-2 transition-colors duration-300 hover:underline"
                style={{ color: "rgba(240, 199, 94, 0.5)" }}
              >
                ← Back to greeting card
              </a>
            </motion.div>
          ) : (
            /* RESULT — shareable link + QR code */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Success message */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-center"
              >
                <p className="font-arabic text-3xl mb-2" style={{ color: "#F0C75E", direction: "rtl" }}>
                  عيد مبارك
                </p>
                <p className="font-body text-sm" style={{ color: "rgba(232, 220, 200, 0.7)" }}>
                  Your personalized greeting is ready!
                </p>
              </motion.div>

              {/* QR Code */}
              <QRCode url={generatedUrl} />

              {/* URL display */}
              <div
                className="w-full rounded-lg p-3 flex items-center gap-2 overflow-hidden"
                style={{
                  background: "rgba(240, 199, 94, 0.06)",
                  border: "1px solid rgba(240, 199, 94, 0.15)",
                }}
              >
                <p
                  className="font-body text-xs flex-1 truncate select-all"
                  style={{ color: "rgba(232, 220, 200, 0.7)" }}
                >
                  {generatedUrl}
                </p>
              </div>

              {/* Action buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                {/* Copy Link */}
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-lg font-display text-sm tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, rgba(240, 199, 94, 0.9), rgba(212, 168, 67, 0.9))",
                    color: "#0C1445",
                    fontWeight: 700,
                    boxShadow: "0 4px 15px rgba(240, 199, 94, 0.25)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Link
                </motion.button>

                {/* Share on WhatsApp */}
                <motion.button
                  onClick={handleWhatsApp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-lg font-display text-sm tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: "rgba(37, 211, 102, 0.15)",
                    border: "1px solid rgba(37, 211, 102, 0.3)",
                    color: "#25D366",
                    fontWeight: 600,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </motion.button>
              </div>

              {/* Preview link */}
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs transition-colors duration-300 hover:underline"
                style={{ color: "rgba(240, 199, 94, 0.6)" }}
              >
                Preview your greeting →
              </a>

              {/* Edit / Create another */}
              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleReset}
                  className="font-body text-xs transition-colors duration-300 hover:underline cursor-pointer"
                  style={{ color: "rgba(232, 220, 200, 0.4)" }}
                >
                  ← Edit details
                </button>
                <button
                  onClick={() => { setName(""); setMsg(""); setShowResult(false); }}
                  className="font-body text-xs transition-colors duration-300 hover:underline cursor-pointer"
                  style={{ color: "rgba(232, 220, 200, 0.4)" }}
                >
                  Create another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
