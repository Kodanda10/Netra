import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Globe } from 'lucide-react'

export const NewsCard: React.FC<{ title: string; url: string; source?: string; timeAgo?: string }>
  = ({ title, url, source, timeAgo }) => {
  const reduce = useReducedMotion()
  return (
    <motion.a
      href={url} target="_blank" rel="noopener"
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="block px-3 py-2 rounded-xl hover:bg-white/6 focus-ring"
    >
      <div className="text-sm leading-tight text-white/90">{title}</div>
      <div className="text-xs text-white/70 mt-1 inline-flex items-center gap-1">
        <Globe className="w-3.5 h-3.5" />
        {source}{timeAgo ? ` • ${timeAgo}` : ''}
      </div>
    </motion.a>
  )
}

