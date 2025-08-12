import { motion, useReducedMotion } from 'framer-motion'
import React from 'react'

const HeaderGlow: React.FC = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-36 w-36 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, #FFD700, transparent)' }} />
  </div>
)

const Logo: React.FC = () => (
  <motion.img
    src="/amogh-logo.svg"
    alt="Amogh Logo"
    className="h-12 w-auto sm:h-16 select-none"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, type: 'spring', stiffness: 140, damping: 18 }}
    whileHover={{ scale: 1.05 }}
  />
)

const DashboardHeader: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative flex flex-col items-center gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 120, damping: 20 }}
        >
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="relative">
              <HeaderGlow />
              <Logo />
            </div>
          </div>

          <div className="text-center sm:flex-1 sm:text-center">
            <motion.h1
              className="font-amita text-3xl sm:text-5xl font-bold bg-clip-text text-transparent golden-gradient drop-shadow-[0_0_12px_rgba(255,215,0,0.25)]"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 140, damping: 18, delay: 0.05 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            >
              अमोघ
            </motion.h1>
            <motion.p
              className="font-montserrat text-white/90 text-lg sm:text-2xl mt-1"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 140, damping: 18, delay: 0.12 }}
            >
              Amogh Financial Intelligence
            </motion.p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2">
            <button
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
              aria-label="Theme toggle (stub)"
            >
              Theme
            </button>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default DashboardHeader 