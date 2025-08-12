import React from 'react'
// NOTE: react-virtuoso can be sensitive in certain preview builds.
// For the local CursorCLI_Frontend preview, render a simple list to avoid runtime issues.
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '../finance.tokens'

export const NewsList: React.FC<{ items: { id?:string; title:string; summary?:string; url?:string }[]; height?: number }>
  = ({ items, height = 480 }) => {
  const reduce = useReducedMotion()
  const safe = Array.isArray(items) ? items.slice(0, 50) : []
  return (
    <div className="rounded-2xl overflow-hidden" style={{ maxHeight: Math.min(height, 420), overflowY: 'auto' }}>
      {safe.map((it, idx) => (
        <motion.a
          key={it.id ?? String(idx)}
          href={it.url ?? '#'}
          target={it.url ? '_blank' : undefined}
          rel={it.url ? 'noopener' : undefined}
          initial={reduce ? false : fadeUp.hidden}
          animate={reduce ? undefined : fadeUp.show}
          transition={{ duration: 0.18 }}
          className="block px-3 py-3 hover:bg-white/5 rounded-xl"
        >
          <div className="text-[15px] leading-tight news-headline">{it.title}</div>
          {it.summary ? (
            <div className="text-[13px] news-body mt-1 line-clamp-2">{it.summary}</div>
          ) : null}
          <div className="hairline mt-3" />
        </motion.a>
      ))}
    </div>
  )
}

