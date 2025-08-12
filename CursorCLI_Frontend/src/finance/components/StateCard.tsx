import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { springs } from '../finance.tokens'
import { NewsList } from './NewsList'
import { SourceTray } from './SourceTray'
import { Factory, Landmark, Building2, Cpu, Gem, Wheat, Apple, Mountain, Ship, Coffee, Hammer, Castle, Shield, CloudRain, Trees, Music, Umbrella } from 'lucide-react'
import { STATES } from '@/finance/states.config'
import '../../finance/finance.css'
const SourcesSidePanel = React.lazy(() => import('./SourcesSidePanel'))

export const StateCard: React.FC<{
  title: string
  items: { id:string; title:string; summary:string; url:string }[]
  sources:{source:string;count:number}[]
  sourcesLabel: string
  stateId?: string
}> = ({ title, items, sources, sourcesLabel, stateId }) => {
  const iconName = STATES.find(s => s.id === stateId)?.icon
  const Icon = iconName === 'Building2' ? Building2
    : iconName === 'Cpu' ? Cpu
    : iconName === 'Gem' ? Gem
    : iconName === 'Wheat' ? Wheat
    : iconName === 'Apple' ? Apple
    : iconName === 'Mountain' ? Mountain
    : iconName === 'Ship' ? Ship
    : iconName === 'Coffee' ? Coffee
    : iconName === 'Landmark' ? Landmark
    : iconName === 'Hammer' ? Hammer
    : iconName === 'Castle' ? Castle
    : iconName === 'Shield' ? Shield
    : iconName === 'CloudRain' ? CloudRain
    : iconName === 'Trees' ? Trees
    : iconName === 'Music' ? Music
    : iconName === 'Umbrella' ? Umbrella
    : Factory
  const reduce = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 20 }}
        animate={reduce ? undefined : { opacity: 1, x: 0 }}
        transition={springs.state as any}
        className="glass-liquid rounded-3xl p-4 md:p-5"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="flex items-center gap-2 mb-2 card-title font-semibold">
          <Icon className="w-5 h-5 text-white/80 shrink-0" />
          <span className="truncate">{title}</span>
        </div>
        <NewsList items={items.slice(0,3)} height={220} />
        <SourceTray total={new Set(sources.map(s=>s.source)).size} label={sourcesLabel} onOpen={()=>setOpen(true)} />
      </motion.div>
      {open && (
        <React.Suspense fallback={null}>
          <SourcesSidePanel open={open} onClose={()=>setOpen(false)} sources={sources} order={Array.from(new Set(items.map(i=>i.source)))} />
        </React.Suspense>
      )}
    </>
  )
}

