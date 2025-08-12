import React from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
const LazyRive = React.lazy(() => import('@rive-app/react-canvas').then(m => ({ default: m.RiveComponent })))

export type TabItem = { id: string; icon?: ReactNode; labelHi: string; labelEn: string }
export type Lang = 'hi' | 'en'

export type RiveAsset = { src: string; artboard?: string; stateMachine?: string }

const spring = { type: 'spring', stiffness: 650, damping: 44, mass: 0.6 } as const

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
  const barRef = React.useRef<HTMLDivElement|null>(null)
  const btnRefs = React.useRef<Record<string, HTMLButtonElement|null>>({})
  const [rect, setRect] = React.useState<{left:number;width:number;height:number}|null>(null)

  // Rive is heavy; keep lazily loaded via React.lazy to split into a separate chunk

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

  const measure = React.useCallback(() => {
    const el = btnRefs.current[active]
    const wrap = barRef.current
    if (el && wrap) {
      const r = el.getBoundingClientRect()
      const w = wrap.getBoundingClientRect()
      setRect({ left: r.left - w.left, width: r.width, height: r.height })
    }
  }, [active])

  React.useEffect(() => { measure() }, [measure, active, tabs.length])
  React.useEffect(() => { const on=()=>measure(); window.addEventListener('resize', on); return ()=>window.removeEventListener('resize', on) }, [measure])

  return (
    <div className={clsx('w-full flex justify-center px-4', className)}>
      {/* Small phones: segmented grid */}
      <div className="seg-only grid grid-cols-4 gap-1 p-1 rounded-full glass-bar" role="tablist" aria-label="Amogh sections (compact)" onKeyDown={onKeyDown}>
        {tabs.map((t) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={String(selected)}
              tabIndex={selected ? 0 : -1}
              onClick={() => handle(t.id)}
              className={clsx(
                'h-9 text-[12px] px-2 min-w-0 truncate flex items-center justify-center gap-1 rounded-full',
                selected ? 'bg-white/10 text-metallic' : 'text-white/85 hover:bg-white/5'
              )}
            >
              {/* icon (small) if provided */}
              {t.icon ? <span className="inline-flex items-center justify-center" aria-hidden>{t.icon}</span> : null}
              <span className={clsx('font-medium tracking-tight', lang === 'hi' ? 'leading-[1.15] pt-[2px]' : undefined)}>
                {lang === 'hi' ? t.labelHi : t.labelEn}
              </span>
            </button>
          )
        })}
      </div>

      {/* Default bar */}
      <div
        role="tablist"
        aria-label="Amogh sections"
        onKeyDown={onKeyDown}
        className={clsx(
          'seg-hide',
          'glass-bar',
          'inline-flex items-center justify-center gap-2',
          'px-2 py-2 rounded-full',
          'overflow-x-auto whitespace-nowrap max-w-full'
        )}
        ref={barRef}
      >
        {!shouldReduce && rect && (
          <motion.span
            aria-hidden
            className="absolute top-2 bottom-2 rounded-full bg-white/10 shadow-[0_0_18px_rgba(255,184,77,0.22)]"
            style={{ left: 0, width: rect.width }}
            animate={{ x: rect.left }}
            transition={spring}
          />
        )}
        {tabs.map((t) => {
          const selected = t.id === active
          const rive = riveAssets?.[t.id]
          return (
            <button
              key={t.id}
              ref={n => { btnRefs.current[t.id] = n }}
              data-testid={`tab-${t.id}`}
              role="tab"
              aria-selected={String(selected)}
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
              {/* measured indicator above replaces layoutId pill for seamless slide */}

              <motion.span
                aria-hidden
                initial={false}
                animate={selected && !shouldReduce ? { scale: [1, 1.06, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="flex items-center justify-center"
              >
                {rive ? (
                  <span className="w-[22px] h-[22px]">
                    <React.Suspense fallback={null}>
                      {/* @ts-expect-error runtime okay */}
                      <LazyRive
                        src={rive.src}
                        artboard={rive.artboard}
                        stateMachines={rive.stateMachine ? [rive.stateMachine] : undefined}
                        autoplay
                      />
                    </React.Suspense>
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


