import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { NewsList } from './NewsList'
import { SourceTray } from './SourceTray'
import { useSidePanel } from './useSidePanel'
import { SourcesSidePanel } from './SourcesSidePanel'

export const BharatLongCard: React.FC<{
  title: string
  items: { title: string; url: string; source?: string; timeAgo?: string }[]
  sources: { source: string; count: number }[]
  viewAllLabel: string
}>
  = ({ title, items, sources, viewAllLabel }) => {
  const reduce = useReducedMotion()
  const panel = useSidePanel()
  return (
    <>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 42, mass: 0.6 }}
        className="glass-card p-4 md:p-6 h-full"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold text-metallic">{title}</div>
        </div>
        <NewsList items={items} height={520} />
        <SourceTray sources={sources} onOpenAll={() => panel.setOpen(true)} viewAllLabel={viewAllLabel} />
      </motion.div>
      <SourcesSidePanel open={panel.open} onClose={() => panel.setOpen(false)} sources={sources} panelRef={panel.panelRef} />
    </>
  )
}

