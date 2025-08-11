import React from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'

export type TabItem = { id: string; icon?: ReactNode; labelHi: string; labelEn: string }
export type Lang = 'hi' | 'en'

export type RiveAsset = { src: string; artboard?: string; stateMachine?: string }

const spring = { type: 'spring', stiffness: 420, damping: 42, mass: 0.6 } as const

export const NavTabs: React.FC<{
  tabs: TabItem[]
  lang: Lang
  onChange?: (id: string) => void
  initialActiveId?: string
  className?: string
  riveAssets?: Record<string, RiveAsset>
}> = ({ tabs, lang, onChange, initialActiveId, className, riveAssets }) => {
  const shouldReduce = useReducedMotion()
  const [active, setActive] = React.useState<string>(initialActiveId ?? (tabs[0]?.id || ''))

  const [RiveComp, setRiveComp] = React.useState<any>(null)
  React.useEffect(() => {
    let mounted = true
    import('@rive-app/react-canvas')
      .then((m) => mounted && setRiveComp(() => m.RiveComponent))
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

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
    } else if (e.key === 'Home') {
      e.preventDefault()
      handle(tabs[0].id)
    } else if (e.key === 'End') {
      e.preventDefault()
      handle(tabs[tabs.length - 1].id)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange?.(active)
    }
  }

  return (
    <div className={clsx('w-full flex justify-center px-4', className)}>
      <div
        role="tablist"
        aria-label="Amogh sections"
        onKeyDown={onKeyDown}
        className={clsx(
          'glass-bar',
          'inline-flex items-center justify-center gap-2',
          'px-2 py-2 rounded-full',
          'overflow-x-auto whitespace-nowrap max-w-full'
        )}
      >
        {tabs.map((t) => {
          const selected = t.id === active
          const rive = riveAssets?.[t.id]
          return (
            <button
              key={t.id}
              data-testid={`tab-${t.id}`}
              role="tab"
              aria-selected={String(selected)}
              aria-controls={t.id}
              tabIndex={selected ? 0 : -1}
              onClick={() => handle(t.id)}
              className={clsx(
                'relative group',
                'inline-flex items-center gap-2',
                'h-12 px-4 rounded-full select-none',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,184,77,0.45)] focus-visible:ring-offset-0',
                'transition-[opacity,transform] duration-150',
                selected ? 'opacity-100' : 'opacity-85 hover:opacity-100 hover:scale-[1.03]'
              )}
            >
              {selected && (
                <motion.span
                  data-testid="active-indicator"
                  layoutId="activeTabPill"
                  className={clsx('absolute inset-0 -z-10 rounded-full',
                    'bg-[radial-gradient(120%_100%_at_50%_0%,rgba(30,30,30,0.95),rgba(0,0,0,0.9))]',
                    'shadow-[0_0_24px_rgba(255,184,77,0.28)]')}
                  transition={{ type: 'spring', stiffness: 480, damping: 42, mass: 0.6 }}
                />
              )}

              <motion.span
                aria-hidden
                initial={false}
                animate={selected && !shouldReduce ? { scale: [1, 1.06, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="flex items-center justify-center"
              >
                {rive && RiveComp ? (
                  <span className="w-[22px] h-[22px]">
                    <RiveComp
                      src={rive.src}
                      artboard={rive.artboard}
                      stateMachines={rive.stateMachine ? [rive.stateMachine] : undefined}
                      autoplay
                    />
                  </span>
                ) : (
                  t.icon
                )}
              </motion.span>

              <span
                className={clsx(
                  'font-medium tracking-tight',
                  lang === 'hi' ? 'text-[15px] leading-[1.15] pt-[2px]' : 'text-[14px]',
                  selected ? 'text-metallic' : 'text-white/85 group-hover:text-white'
                )}
                style={shouldReduce ? { animation: 'none' } : undefined}
              >
                {lang === 'hi' ? t.labelHi : t.labelEn}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default NavTabs


