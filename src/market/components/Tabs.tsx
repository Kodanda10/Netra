import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export const MarketTabs: React.FC<{ tabs: { id:string; labelHi:string; labelEn:string }[]; lang:'hi'|'en'; onChange:(id:string)=>void; active:string }>
  = ({ tabs, lang, onChange, active }) => {
  const reduce = useReducedMotion()
  const spring = { type: 'spring', stiffness: 650, damping: 44, mass: 0.6 } as const
  const containerRef = React.useRef<HTMLDivElement|null>(null)
  const btnRefs = React.useRef<Record<string, HTMLButtonElement|null>>({})
  const [rect, setRect] = React.useState<{left:number;width:number;height:number}|null>(null)

  const measure = React.useCallback(() => {
    const el = btnRefs.current[active]
    const wrap = containerRef.current
    if (el && wrap) {
      const r = el.getBoundingClientRect()
      const w = wrap.getBoundingClientRect()
      setRect({ left: r.left - w.left, width: r.width, height: r.height })
    }
  }, [active])

  React.useEffect(() => { measure() }, [measure, active, tabs.length])
  React.useEffect(() => { const on=()=>measure(); window.addEventListener('resize', on); return ()=>window.removeEventListener('resize', on) }, [measure])

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={lang==='hi'?'शेयर बाजार टैब्स':'Market tabs'}
      className="relative isolate glass-bar inline-flex items-center justify-center gap-2 px-2 py-2 rounded-full overflow-x-auto whitespace-nowrap max-w-full"
    >
      {!reduce && rect && (
        <motion.span
          aria-hidden
          className="absolute z-[1] top-2 bottom-2 rounded-full bg-white/10 shadow-[0_0_18px_rgba(255,184,77,0.22)]"
          style={{ left: 0, width: rect.width }}
          animate={{ x: rect.left }}
          transition={spring}
        />
      )}
      {tabs.map(t => {
        const selected = active===t.id
        return (
          <button
            key={t.id}
            ref={n=>{btnRefs.current[t.id]=n}}
            role="tab"
            aria-selected={String(selected)}
            onClick={()=>onChange(t.id)}
            className={`relative z-[2] inline-flex items-center gap-2 h-12 px-4 rounded-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,184,77,0.45)] ${selected?'text-metallic':'text-white/85 hover:text-white'}`}
          >
            <span className="font-medium tracking-tight">{lang==='hi'? t.labelHi : t.labelEn}</span>
          </button>
        )
      })}
    </div>
  )
}

