import React from 'react'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

type Node = { name: string; size: number; changePct: number }

export const TreemapHeat: React.FC<{ data: Node[] }>
  = ({ data }) => {
  const color = (g: number) => g >= 0
    ? `rgba(16,185,129,${Math.min(0.95, 0.25 + Math.abs(g)/5)})`
    : `rgba(239,68,68,${Math.min(0.95, 0.25 + Math.abs(g)/5)})`
  const nodes = data.map(d => ({ name: d.name, size: d.size, fill: color(d.changePct), changePct: d.changePct }))
  return (
    <div className="glass-liquid rounded-3xl p-3 h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        {/* @ts-ignore */}
        <Treemap data={nodes} dataKey="size" stroke="#111" isAnimationActive>
          {/* @ts-ignore we render labels via customContent */}
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const p: any = payload[0].payload
            return (
              <div className="rounded-lg bg-black/80 text-white/90 px-2 py-1 text-xs border border-white/10">
                {p.name}: {p.changePct>0?'+':''}{p.changePct.toFixed(2)}%
              </div>
            )
          }} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}

