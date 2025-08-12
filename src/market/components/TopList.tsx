import React from 'react'
import { Stock } from '@/market/hooks/useMockStocks'

export const TopList: React.FC<{ items: Stock[] }>
  = ({ items }) => {
  return (
    <div className="glass-liquid rounded-3xl p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.slice(0,24).map(s => (
          <div key={s.symbol} className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/70">{s.symbol}</div>
            <div className="text-white font-medium">₹{s.price.toFixed(2)}</div>
            <div className={s.changePct>=0? 'text-green-400 text-xs':'text-red-400 text-xs'}>{s.changePct>=0?'+':''}{s.changePct.toFixed(2)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

