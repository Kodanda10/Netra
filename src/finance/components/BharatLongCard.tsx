import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { springs, springFast } from '../finance.tokens'
import { NewsList } from './NewsList'
import { SourceTray } from './SourceTray'
import '../../finance/finance.css'
const SourcesSidePanel = React.lazy(() => import('./SourcesSidePanel'))

export const BharatLongCard: React.FC<{
  title: string
  items: { id:string; title:string; summary:string; url:string }[]
  sources:{source:string;count:number}[]
  sourcesLabel: string
}> = ({ title, items, sources, sourcesLabel }) => {
  const reduce = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12, scale: 0.985 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={springs.bharat as any}
        className="glass-liquid rounded-3xl p-4 md:p-6"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold card-title flex items-center gap-2">
            <img src="/flag-india-static.svg" alt="India" className="w-5 h-5" />
            <span>{title}</span>
          </div>
        </div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.28}}>
          <NewsList items={items} height={520} />
        </motion.div>
        <SourceTray total={new Set(sources.map(s=>s.source)).size} label={sourcesLabel} onOpen={()=>setOpen(true)} />
      </motion.div>
      {open && (
        <React.Suspense fallback={null}>
          <SourcesSidePanel open={open} onClose={()=>setOpen(false)} sources={sources} />
        </React.Suspense>
      )}
    </>
  )
}

