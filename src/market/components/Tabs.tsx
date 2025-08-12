import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export const MarketTabs: React.FC<{ tabs: { id:string; labelHi:string; labelEn:string }[]; lang:'hi'|'en'; onChange:(id:string)=>void; active:string }>
  = ({ tabs, lang, onChange, active }) => {
  const reduce = useReducedMotion()
  const spring = { type: 'spring', stiffness: 520, damping: 42, mass: 0.62 } as const
  return (
    <div className="glass-liquid rounded-full p-1 inline-flex gap-1">
      {tabs.map(t => {
        const selected = active===t.id
        return (
          <button key={t.id} onClick={()=>onChange(t.id)}
            className={`relative overflow-hidden px-3 py-1.5 rounded-full text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,184,77,0.45)] ${selected?'text-white':'text-white/80 hover:bg-white/5'}`}
          >
            {selected && (
              <motion.span
                layoutId="marketTabPill"
                transition={spring}
                className="absolute inset-0 -z-10 rounded-full bg-white/10 shadow-[0_0_18px_rgba(255,184,77,0.22)]"
                style={{ willChange: 'transform,opacity' }}
              />
            )}
            <motion.span
              initial={false}
              animate={selected && !reduce ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.18 }}
              className="relative z-10"
            >
              {lang==='hi'? t.labelHi : t.labelEn}
            </motion.span>
          </button>
        )
      })}
    </div>
  )
}

