import React from 'react'
import { motion } from 'framer-motion'
import { Info, RotateCw, ChevronDown, SquareDashed, Download, Maximize2, Calendar } from 'lucide-react'
import '@/styles/tokens.css'

export const GlassCard: React.FC<{
  title: string
  subtitle?: string
  timeRange?: string
  className?: string
  children?: React.ReactNode
  rows?: 1|2
}>=({ title, subtitle, timeRange, className='', children, rows=1 })=>{
  return (
    <motion.section
      initial={{opacity:0,y:10}}
      animate={{opacity:1,y:0}}
      transition={{duration:.28}}
      className={`glass rounded-2xl overflow-hidden ${className}`}
      style={{ gridRow: rows===2?'span 2 / span 2':'span 1 / span 1' }}
      whileHover={{ y:-2 }}
    >
      <div className="h-[42px] flex items-center justify-between px-3 border-b border-[var(--border)]">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--sub)] -mb-0.5">{subtitle}</div>
          <div className="text-[15px] font-medium text-[var(--txt)]">{title}</div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-white/60">
          <Info size={14}/><RotateCw size={14}/><ChevronDown size={14}/><SquareDashed size={14}/><Download size={14}/><Maximize2 size={14}/>
          {timeRange && <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-[var(--sub)]"><Calendar size={12}/>{timeRange}</span>}
        </div>
      </div>
      <div className="p-3 h-[calc(100%-42px)]">{children}</div>
    </motion.section>
  )
}

export default GlassCard


