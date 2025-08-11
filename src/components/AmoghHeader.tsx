"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AmoghHeader() {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [subtitleIndex, setSubtitleIndex] = useState<0 | 1>(0);

  const isHindi = lang === "hi";
  const titleText = "अमोघ"; // Title is rendered via logo image; kept for alt text
  const subHi = "इंटेलिजेंट वित्तीय डैशबोर्ड";
  const subEn = "Intelligent Finance Dashboard";

  // Rotate subtitles: HI -> EN -> HI ...
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSubtitleIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3600);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full overflow-hidden bg-gradient-to-b from-[#0a0a0d] via-[#0b0e18] to-[#0b1120] border-b border-white/10">
      {/* Cinematic background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Language toggle */}
        <div className="absolute right-4 top-2 sm:top-2 flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[10px] sm:text-xs text-white/80 ring-1 ring-white/10 backdrop-blur">
          <button
            onClick={() => setLang("hi")}
            className={`${isHindi ? "bg-white/15 text-white" : "text-white/70 hover:text-white"} rounded-full px-2 py-0.5`}
          >
            हिन्दी
          </button>
          <span className="text-white/30">/</span>
          <button
            onClick={() => setLang("en")}
            className={`${!isHindi ? "bg-white/15 text-white" : "text-white/70 hover:text-white"} rounded-full px-2 py-0.5`}
          >
            EN
          </button>
        </div>

        {/* Title (Cinematic logo image with arrow underline) */}
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="mx-auto select-none pointer-events-none"
            style={{ width: "clamp(164px, 24vw, 320px)" }}
          >
            <picture>
              <source type="image/webp" srcSet="/amogh-logo-header.webp 1x, /amogh-logo-header@2x.webp 2x" />
              <source type="image/png" srcSet="/amogh-logo-header.png 1x, /amogh-logo-header@2x.png 2x" />
              <img
                src="/amogh-logo.png"
                alt={titleText}
                loading="eager"
                decoding="async"
                style={{ width: "100%", height: "auto", filter: "drop-shadow(0 10px 24px rgba(255,140,0,0.14))" }}
              />
            </picture>
          </motion.div>
        </div>

        {/* Subtitle (centered, below arrow) – rotates HI/EN */}
        <div className="relative h-[22px] sm:h-[26px]">
          <AnimatePresence mode="wait">
            {subtitleIndex === 0 ? (
              <motion.p
                key="hi"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="mx-auto pt-2 sm:pt-2 max-w-[720px] text-balance text-center text-[14px] sm:text-[15px] leading-[1.5] font-noto-dev font-medium"
                style={{ color: '#F5F5F5', textShadow: '0 2px 8px rgba(0,0,0,0.55)' }}
              >
                {subHi}
              </motion.p>
            ) : (
              <motion.p
                key="en"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="mx-auto pt-2 sm:pt-2 max-w-[720px] text-balance text-center text-[14px] sm:text-[15px] leading-[1.5] font-inter font-medium"
                style={{ color: '#F5F5F5', textShadow: '0 2px 8px rgba(0,0,0,0.55)' }}
              >
                {subEn}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}

/* Grid background pattern */
function GridPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
} 

/* Subtle particles/glow backdrop */
function ParticleField() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[10%] top-[20%] particle-dot" />
      <div className="absolute left-[30%] top-[40%] particle-dot" />
      <div className="absolute left-[55%] top-[25%] particle-dot" />
      <div className="absolute left-[72%] top-[50%] particle-dot" />
      <div className="absolute left-[20%] top-[70%] particle-dot" />
      <div className="absolute left-[48%] top-[80%] particle-dot" />
    </div>
  );
}