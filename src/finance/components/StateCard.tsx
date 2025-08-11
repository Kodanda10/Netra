import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { springs } from '../finance.tokens'
import { NewsList } from './NewsList'
import { SourceTray } from './SourceTray'
import { Landmark } from 'lucide-react'
import '../../finance/finance.css'
const SourcesSidePanel = React.lazy(() => import('./SourcesSidePanel'))

export const StateCard: React.FC<{
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
        initial={reduce ? false : { opacity: 0, x: 20 }}
        animate={reduce ? undefined : { opacity: 1, x: 0 }}
        transition={springs.state as any}
        className="glass-liquid rounded-3xl p-4 md:p-5"
        style={{ backgroundColor: '#121212' }}
      >
        <div className="flex items-center gap-2 mb-2 card-title font-semibold">
          <Landmark className="w-5 h-5 text-white/80" /> {title}
        </div>
        <NewsList items={items.slice(0,3)} height={200} />
        <SourceTray total={sources.reduce((a,b)=>a+b.count,0)} label={sourcesLabel} onOpen={()=>setOpen(true)} />
      </motion.div>
      {open && (
        <React.Suspense fallback={null}>
          <SourcesSidePanel open={open} onClose={()=>setOpen(false)} sources={sources} />
        </React.Suspense>
      )}
    </>
  )
}

