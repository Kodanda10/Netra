import React from 'react'

export type KPI = { label:string; value:number; deltaPct?:number }

export const KPIOverview: React.FC<{ items: KPI[] }>
  = ({ items }) => (
  <div className="grid grid-cols-3 gap-2 md:gap-3">
    {items.map((k)=> (
      <div key={k.label} className="rounded-xl bg-white/5 border border-[var(--border)] p-3 focus-glow">
        <div className="text-[11px] uppercase tracking-wide text-[var(--sub)]">{k.label}</div>
        <div className="text-[20px] font-semibold text-[var(--txt)]">{k.value.toLocaleString('en-IN')}</div>
        {typeof k.deltaPct==='number' && (
          <div className={`text-[11px] ${k.deltaPct>=0?'delta-up':'delta-down'}`}>{k.deltaPct>=0?'↑':'↓'} {Math.abs(k.deltaPct)}%</div>
        )}
      </div>
    ))}
  </div>
)

export default KPIOverview


