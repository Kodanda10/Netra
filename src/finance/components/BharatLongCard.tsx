import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { springs } from '../finance.tokens'
import { NewsList } from './NewsList'
import { SourceTray } from './SourceTray'
import { SourcesSidePanel } from './SourcesSidePanel'
import '../../finance/finance.css'

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
        className="glass-border rounded-3xl p-4 md:p-6"
        style={{ backgroundColor: '#121212' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold text-metallic flex items-center gap-2">
            <img src="/flag-india-static.svg" alt="India" className="w-5 h-5" />
            {title}
          </div>
        </div>
        <NewsList items={items} height={520} />
        <SourceTray total={sources.reduce((a,b)=>a+b.count,0)} label={sourcesLabel} onOpen={()=>setOpen(true)} />
      </motion.div>
      <SourcesSidePanel open={open} onClose={()=>setOpen(false)} sources={sources} />
    </>
  )
}

