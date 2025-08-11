"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AmoghHeader() {
  const [lang, setLang] = useState<"hi" | "en">("hi");

  const isHindi = lang === "hi";
  const titleText = isHindi ? "अमोघ" : "AuthKit";
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
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            backgroundPosition: ["0% 0%", "200% 0%"],
          }}
          transition={{ type: "spring", stiffness: 120, damping: 14, backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" } }}
          className={`pt-4 text-center leading-[1.12] tracking-wide bg-clip-text text-transparent ${
            isHindi
              ? "font-amita font-bold hindi-title-fix animate-shimmer text-glow"
              : "font-inter font-extrabold"
          }`}
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            backgroundImage: isHindi
              ? "linear-gradient(90deg, #6b4e00 0%, #ffe9a3 10%, #b8860b 22%, #fff4bf 35%, #a0740f 48%, #ffd700 62%, #a85e00 78%, #ffcc66 90%, #6b4e00 100%)"
              : "linear-gradient(90deg, #E6F1FF 0%, #B8D8F0 50%, #8CB4E0 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: isHindi ? 700 : undefined,
            textShadow: isHindi
              ? "0 3px 20px rgba(255, 200, 0, 0.22), 0 1px 8px rgba(255, 200, 0, 0.16)"
              : "0 2px 20px rgba(180, 220, 255, 0.25)",
          }}
        >
          {titleText}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
          className={`mt-4 text-center text-lg text-white/85 ${isHindi ? 'font-noto-dev font-semibold' : 'font-inter font-semibold'}`}
        >
          {isHindi ? subHi : subEn}
        </motion.p>

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