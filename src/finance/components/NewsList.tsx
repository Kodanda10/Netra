import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { motion, useReducedMotion } from 'framer-motion'

export const NewsList: React.FC<{ items: { id:string; title:string; summary:string; url:string }[]; height?: number }>
  = ({ items, height = 480 }) => {
  const reduce = useReducedMotion()
  return (
    <div className="rounded-2xl overflow-hidden">
      <Virtuoso
        style={{ height }}
        data={items}
        itemContent={(idx, it) => (
          <motion.a
            key={it.id}
            href={it.url}
            target="_blank" rel="noopener"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="block px-3 py-3 hover:bg-white/5 rounded-xl"
          >
            <div className="text-[15px] leading-tight text-white/90">{it.title}</div>
            <div className="text-[13px] text-white/65 mt-1 line-clamp-2">{it.summary}</div>
          </motion.a>
        )}
      />
    </div>
  )
}

