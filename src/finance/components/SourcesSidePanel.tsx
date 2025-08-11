import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { layoutIds } from '../finance.tokens'

export const SourcesSidePanel: React.FC<{ open:boolean; onClose:()=>void; sources:{source:string;count:number}[] }>
  = ({ open, onClose, sources }) => {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
          <motion.div className="absolute inset-0 bg-black/50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.14}} onClick={onClose} />
          <motion.div layoutId={layoutIds.sourcePanel} className="absolute top-0 left-0 h-full w-[380px] glass-liquid rounded-r-3xl bg-transparent p-4 overflow-y-auto"
            initial={{x:-24, opacity:0}} animate={{x:0, opacity:1}} exit={{x:-24, opacity:0}} transition={{duration:0.24}}>
            <div className="text-lg font-semibold text-metallic mb-3">Sources</div>
            <div className="space-y-1">
              {sources.map(s => (
                <div key={s.source} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5">
                  <span className="text-white/85 text-sm">{s.source}</span>
                  <span className="text-white/60 text-xs">{s.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

