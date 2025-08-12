import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getIcon } from '../finance.config'
import { NewsList } from './NewsList'
import { SourceTray } from './SourceTray'
import { useSidePanel } from './useSidePanel'
import { SourcesSidePanel } from './SourcesSidePanel'

export const StateCard: React.FC<{
  title: string
  iconName: 'Landmark' | 'TrendingUp' | 'Newspaper'
  items: { title: string; url: string; source?: string; timeAgo?: string }[]
  sources: { source: string; count: number }[]
  viewAllLabel: string
}>
  = ({ title, iconName, items, sources, viewAllLabel }) => {
  const Icon = getIcon(iconName)
  const reduce = useReducedMotion()
  const panel = useSidePanel()
  return (
    <>
      <motion.div
        layoutId="cardFrame"
        initial={reduce ? false : { opacity: 0, x: 18 }}
        animate={reduce ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.24 }}
        className="glass-card p-4 md:p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-white/80" />
          <div className="font-semibold text-white/90">{title}</div>
        </div>
        <NewsList items={items.slice(0, 10)} height={240} />
        <SourceTray sources={sources} onOpenAll={() => panel.setOpen(true)} viewAllLabel={viewAllLabel} />
      </motion.div>
      <SourcesSidePanel open={panel.open} onClose={() => panel.setOpen(false)} sources={sources} panelRef={panel.panelRef} />
    </>
  )
}

