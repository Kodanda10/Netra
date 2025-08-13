import React from 'react'
import { brandLogos, mockInsights, seriesByPlatform, type Platform } from '@/social/mock'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export const PlatformRow: React.FC<{ platform: Platform; title: string }>
  = ({ platform, title }) => {
  const series = seriesByPlatform[platform]
  const insights = mockInsights[platform as keyof typeof mockInsights] as any
  return (
    <div className="grid grid-cols-12 gap-3">
      {/* Logo Card */}
      <section className="col-span-12 md:col-span-2 glass-liquid rounded-3xl p-6 flex items-center justify-center">
        <img src={brandLogos[platform]} alt={title} className="w-20 h-20 object-contain" />
      </section>

      {/* Overview */}
      <section className="col-span-12 md:col-span-4 glass-liquid rounded-3xl p-4">
        <div className="text-sm text-white/70 mb-2">Overview</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {Object.entries(insights).slice(0,6).map(([k,v])=> (
            <div key={k} className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="text-[11px] text-white/60 uppercase tracking-wide">{k}</div>
              <div className="text-white font-semibold">{typeof v==='number'? v.toLocaleString('en-IN') : String(v)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trend Line */}
      <section className="col-span-12 md:col-span-3 glass-liquid rounded-3xl p-4">
        <div className="text-sm text-white/70 mb-2">Trend</div>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid stroke="#ffffff22" vertical={false} />
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ background:'rgba(0,0,0,.8)', border:'1px solid rgba(255,255,255,.1)', color:'#fff' }} />
              <Line type="monotone" dataKey="v" stroke="#60a5fa" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Quick cards */}
      <section className="col-span-12 md:col-span-3 grid grid-cols-3 gap-3">
        {['A','B','C'].map((x,i)=> (
          <div key={i} className="glass-liquid rounded-2xl p-3">
            <div className="text-xs text-white/70">Metric {i+1}</div>
            <div className="text-lg font-semibold">{Math.floor(Math.random()*100)}</div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default PlatformRow



