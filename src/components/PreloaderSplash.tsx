import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  fallbackMs?: number;
  bg?: string;
  skipDelayMs?: number;
  src?: string;
  poster?: string;
  onDone?: () => void;
};

export default function PreloaderSplash({
  fallbackMs = 3600,
  bg = "#121212",
  skipDelayMs = 1500,
  src = "/video/amogh_preloader.mp4",
  poster,
  onDone,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const t1 = window.setTimeout(() => setCanSkip(true), skipDelayMs);
    const t2 = window.setTimeout(() => setVisible(false), fallbackMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [skipDelayMs, fallbackMs]);

  const handleCanPlay = () => {
    try {
      videoRef.current?.play().catch(() => {});
    } catch {}
  };

  const handleEnded = () => {
    setVisible(false);
  };

  const handleSkip = () => {
    setVisible(false);
    try {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    } catch {}
  };

  useEffect(() => {
    if (!visible && onDone) onDone();
  }, [visible, onDone]);

  if (prefersReducedMotion) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: bg }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <div
              className="rounded-2xl"
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: 24,
              }}
            >
              <div
                style={{
                  width: 220,
                  height: 220,
                  backgroundImage: poster ? `url(${poster})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {canSkip && (
                <button
                  onClick={handleSkip}
                  className="mt-3 px-3 py-1 rounded-md text-sm"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  Skip
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: bg }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <div
            className="rounded-2xl"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: 16,
            }}
          >
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              preload="auto"
              muted
              playsInline
              onCanPlay={handleCanPlay}
              onEnded={handleEnded}
              style={{
                width: 260,
                height: 260,
                display: "block",
                borderRadius: 16,
                objectFit: "cover",
                backgroundColor: "transparent",
              }}
            />
            <div
              className="text-center mt-2"
              style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}
              aria-live="polite"
            >
              Initializing market feeds…
            </div>

            {canSkip && (
              <div className="text-center mt-3">
                <button
                  onClick={handleSkip}
                  className="px-3 py-1 rounded-md text-sm"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


