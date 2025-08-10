"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AmoghHeader() {
  const [lang, setLang] = useState<"hi" | "en">("hi");

  const isHindi = lang === "hi";
  const titleText = "अमोघ";
  const subHi = "इंटेलीजेंट वित्तीय डैशबोर्ड";
  const subEn = "Intelligent Finance Dashboard";

  return (
    <header className="relative w-full overflow-hidden bg-[#0C0C0C]">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent)] pointer-events-none">
        <GridPattern />
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-[1200px] px-6 sm:px-8 md:px-10">
        {/* Language toggle */}
        <div className="absolute right-6 top-4 flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10 backdrop-blur">
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

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="pt-4 text-center font-extrabold leading-[1.15] tracking-wide"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            background: "linear-gradient(90deg, #E6F1FF 0%, #B8D8F0 50%, #8CB4E0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 20px rgba(180, 220, 255, 0.25)",
          }}
        >
          {titleText}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
          className="mt-4 text-center text-lg font-medium text-white/85"
        >
          {isHindi ? subHi : subEn}
        </motion.p>

        {/* Arrow Bar (fully visible) */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.2 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
          className="mt-6 flex justify-center"
        >
          <ArrowBar />
        </motion.div>
      </div>
    </header>
  );
}

/* Fixed padding for arrow visibility */
function ArrowBar() {
  return (
    <div className="relative h-3 w-[240px] sm:w-[280px] md:w-[320px] pl-1 pr-6">
      {/* Bar */}
      <div className="absolute inset-y-0 left-0 right-6 rounded-full bg-gradient-to-r from-[#B8D8F0] via-[#8CB4E0] to-[#73A0D6] shadow-[0_0_14px_rgba(140,180,224,0.4)]" />
      {/* Arrowhead */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M4 12h12" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M13 6l7 6-7 6" fill="url(#grad)" />
        <defs>
          <linearGradient id="grad" x1="0" x2="24" y1="12" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B8D8F0" />
            <stop offset="0.5" stopColor="#8CB4E0" />
            <stop offset="1" stopColor="#73A0D6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
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