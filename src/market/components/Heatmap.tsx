import React from 'react'

export const Heatmap: React.FC<{ items: { symbol:string; changePct:number }[] }>
  = ({ items }) => {
  const grid = items.slice(0,50)
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {grid.map((s, i) => {
        const g = s.changePct
        const bg = g > 0 ? `rgba(16,185,129,${Math.min(0.85, 0.2 + Math.abs(g)/5)})` : `rgba(239,68,68,${Math.min(0.85, 0.2 + Math.abs(g)/5)})`
        return (
          <div key={i} className="rounded-xl p-2 text-[11px] text-white/90 text-center" style={{ background: bg }}>
            <div className="font-semibold">{s.symbol}</div>
            <div>{g>0?'+':''}{g.toFixed(2)}%</div>
          </div>
        )
      })}
    </div>
  )
}

