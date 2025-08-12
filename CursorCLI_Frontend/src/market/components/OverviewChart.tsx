import React from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useMockStocks } from '@/market/hooks/useMockStocks'

type Frame = '1D'|'5D'|'1W'|'1M'|'3M'

function genSeries(base: number, points: number){
  const out: { t: number; v: number }[] = []
  let v = base
  for (let i=0;i<points;i++){ v += (Math.random()-0.5)*2; out.push({ t: i, v: Number(v.toFixed(2)) }) }
  return out
}

export const OverviewChart: React.FC<{ index: 'BSE'|'NSE'|'USDINR' }>
  = ({ index }) => {
  const [frame, setFrame] = React.useState<Frame>('1D')
  const points = frame==='1D'? 96 : frame==='5D'? 5*96 : frame==='1W'? 7*24 : frame==='1M'? 30 : 90
  const base = index==='USDINR'? 83 : index==='BSE'? 75000 : 22800
  const data = React.useMemo(()=> genSeries(base, Math.min(points, 240)), [frame, index])
  const frames: Frame[] = ['1D','5D','1W','1M','3M']
  return (
    <section className="glass-liquid rounded-3xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-white/80">{index}</div>
        <div className="flex gap-1">
          {frames.map(f => (
            <button key={f} onClick={()=>setFrame(f)} className={`px-2 py-1 rounded-md text-xs ${frame===f?'bg-white/10 text-white':'text-white/70 hover:bg-white/5'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#ffffff22" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: '#ffffff8a', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#ffffff22' }} />
            <YAxis tick={{ fill: '#ffffff8a', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#ffffff22' }} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,.8)', border: '1px solid rgba(255,255,255,.1)', color: '#fff' }} />
            <Legend />
            <Line type="monotone" dataKey="v" stroke="#60a5fa" dot={false} strokeWidth={2} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

