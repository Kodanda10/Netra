import React from 'react'

export type BarItem = { id:string; text:string; value:number }

export const BarList: React.FC<{ items: BarItem[] }>
  = ({ items }) => (
  <ul className="space-y-2">
    {items.map((it, i) => (
      <li key={it.id} className="flex items-center gap-2">
        <span className="text-white/60 text-xs w-4">{i+1}</span>
        <span className="flex-1 line-clamp-1 text-white/85 text-sm">{it.text}</span>
        <div className="w-28 h-2 bg-purple-500/70 rounded-full" style={{ width: `${Math.min(100, it.value)}%` }} />
        <span className="text-white/70 text-xs">{it.value}</span>
      </li>
    ))}
  </ul>
)

export default BarList


