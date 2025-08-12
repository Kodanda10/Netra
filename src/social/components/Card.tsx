import React from 'react'
import { motion } from 'framer-motion'
import { Info, RotateCw, ChevronDown, SquareDashed, Download, Maximize2, Calendar } from 'lucide-react'

export const Card: React.FC<{
  title?: string
  subtitle?: string
  size?: 'sm'|'tall'
  className?: string
  children?: React.ReactNode
  toolbar?: boolean
  timeRangeText?: string
}>
  = ({ title, subtitle, size='sm', className='', children, toolbar=true, timeRangeText }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-2xl bg-white/6 backdrop-blur-xl border border-white/10 shadow-[0_6px_30px_rgb(0_0_0/0.3)] overflow-hidden ${className}`}
      style={{ gridRow: size==='tall'? 'span 2 / span 2' : 'span 1 / span 1' }}
      whileHover={{ y: -2 }}
    >
      {(title || toolbar) && (
        <div className="h-[42px] flex items-center justify-between px-3 py-2 border-b border-white/10">
          <div>
            {title && <div className="text-[13px] font-medium text-white/90">{title}</div>}
            {subtitle && <div className="text-[10px] uppercase tracking-wide text-white/50 -mt-0.5">{subtitle}</div>}
          </div>
          {toolbar && (
            <div className="hidden sm:flex items-center gap-2 text-white/60">
              <Info size={14} />
              <RotateCw size={14} />
              <ChevronDown size={14} />
              <SquareDashed size={14} />
              <Download size={14} />
              <Maximize2 size={14} />
              {timeRangeText && <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-white/70"><Calendar size={12} />{timeRangeText}</span>}
            </div>
          )}
        </div>
      )}
      <div className="p-3 h-[calc(100%-42px)]">{children}</div>
    </motion.section>
  )
}

export default Card

