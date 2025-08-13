import React from 'react'
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export const Sparkline: React.FC<{ data:{t:number|string;v:number}[]; color?:string }>
  = ({ data, color = '#4FC3F7' }) => (
  <div className="h-[140px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top:10, right:4, bottom:0, left:0 }}>
        <CartesianGrid stroke="transparent" />
        <XAxis hide dataKey="t" /><YAxis hide />
        <Tooltip contentStyle={{ background:'rgba(15,18,26,.86)', border:'1px solid #202833', color:'#DCE6FF' }} />
        <Line type="monotone" dataKey="v" stroke={color} dot={false} strokeWidth={2} isAnimationActive />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export const AreaMini: React.FC<{ data:{t:number|string;v:number}[]; from?:string; to?:string }>
  = ({ data, from='#FF9A3E', to='#FF5B5B' }) => (
  <div className="h-[140px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top:10, right:4, bottom:0, left:0 }}>
        <defs>
          <linearGradient id="fbArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity={0.6}/>
            <stop offset="100%" stopColor={to} stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <XAxis hide dataKey="t" /><YAxis hide />
        <Tooltip contentStyle={{ background:'rgba(15,18,26,.86)', border:'1px solid #202833', color:'#DCE6FF' }} />
        <Area type="monotone" dataKey="v" stroke={from} fill="url(#fbArea)" isAnimationActive />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)



