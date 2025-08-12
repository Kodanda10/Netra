import React from 'react'
import { motion } from 'framer-motion'

export const LiveCard: React.FC<{
  title: string
  value: string
  changePct: number
  verified?: boolean
  tooltip?: string
}>
  = ({ title, value, changePct, verified, tooltip }) => {
  const up = changePct >= 0
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="glass-liquid rounded-3xl p-4 w-full min-h-[140px]"
      title={tooltip}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="card-title text-[15px] font-semibold">{title}</h3>
        {verified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white/70">Live</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-white">{value}</div>
        <div className={up ? 'text-green-400' : 'text-red-400'}>{up? '+':''}{changePct.toFixed(2)}%</div>
      </div>
    </motion.section>
  )
}

