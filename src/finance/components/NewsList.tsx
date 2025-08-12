import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '../finance.tokens'

export const NewsList: React.FC<{ items: { id:string; title:string; summary:string; url:string }[]; height?: number }>
  = ({ items, height = 480 }) => {
  const reduce = useReducedMotion()
  return (
    <div className="rounded-2xl overflow-hidden">
      <Virtuoso
        style={{ height: Math.min(height, 420) }}
        data={items}
        itemContent={(idx, it) => (
          <motion.a
            key={it.id}
            href={it.url}
            target="_blank" rel="noopener"
            initial={reduce ? false : fadeUp.hidden}
            animate={reduce ? undefined : fadeUp.show}
            transition={{ duration: 0.18 }}
            className="block px-3 py-3 hover:bg-white/5 rounded-xl"
          >
            <div className="text-[15px] leading-tight news-headline">{it.title}</div>
            <div className="text-[13px] news-body mt-1 line-clamp-2">{it.summary}</div>
            <div className="hairline mt-3" />
          </motion.a>
        )}
      />
    </div>
  )
}

