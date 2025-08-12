import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { durations } from './AnimTokens'

export const SourcesSidePanel: React.FC<{
  open: boolean
  onClose: () => void
  sources: { source: string; count: number }[]
  panelRef: React.RefObject<HTMLDivElement>
}>
  = ({ open, onClose, sources, panelRef }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog" aria-label="Sources">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.sidePanelScrim }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            className="absolute top-0 right-0 h-full w-[380px] glass-card p-4 overflow-y-auto"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: durations.sidePanelSlide }}
          >
            <div className="text-lg font-semibold text-metallic mb-2">Sources</div>
            <div className="space-y-2">
              {sources.map(s => (
                <label key={s.source} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/6">
                  <span className="text-sm text-white/85">{s.source}</span>
                  <input type="checkbox" defaultChecked aria-label={`Toggle ${s.source}`} />
                </label>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 focus-ring">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

