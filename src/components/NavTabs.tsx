import React from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export type TabItem = { id: string; icon: ReactNode; labelHi: string; labelEn: string }
export type Lang = 'hi' | 'en'

const spring = { type: 'spring', stiffness: 420, damping: 42, mass: 0.6 } as const

export const NavTabs: React.FC<{
  tabs: TabItem[]
  lang: Lang
  onChange: (id: string) => void
  initialActiveId?: string
}> = ({ tabs, lang, onChange, initialActiveId }) => {
  const shouldReduce = useReducedMotion()
  const [active, setActive] = React.useState<string>(initialActiveId ?? (tabs[0]?.id || ''))

  React.useEffect(() => {
    if (initialActiveId) setActive(initialActiveId)
  }, [initialActiveId])

  const handle = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = tabs.findIndex((t) => t.id === active)
    if (idx < 0) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handle(tabs[(idx + 1) % tabs.length].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handle(tabs[(idx - 1 + tabs.length) % tabs.length].id)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange?.(active)
    }
  }

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className="glass-bar mx-auto w-full max-w-3xl px-1.5 py-1 overflow-x-auto snap-x"
    >
      <div className="flex items-center gap-1 sm:gap-1.5 h-11 sm:h-12 relative">
        {tabs.map((t) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={t.id}
              onClick={() => handle(t.id)}
              className="relative px-3 sm:px-4 h-full rounded-2xl flex items-center gap-2 snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 text-sm sm:text-base"
            >
              {selected && (
                <motion.div
                  layoutId="activeTab"
                  transition={spring}
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow:
                      '0 0 0 1px rgba(255,255,255,0.12) inset, 0 0 16px rgba(255,184,77,0.28)',
                    background: 'rgba(255,255,255,0.04)'
                  }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  initial={false}
                  animate={selected && !shouldReduce ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 0.16 }}
                  className="grid place-items-center"
                >
                  {t.icon}
                </motion.span>
                <motion.span
                  initial={false}
                  animate={selected && !shouldReduce ? { y: [0, -2, 0] } : { y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={selected ? 'text-metallic' : 'text-white/85'}
                  style={{ lineHeight: 1.15, paddingTop: 2 }}
                >
                  {lang === 'hi' ? t.labelHi : t.labelEn}
                </motion.span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default NavTabs


