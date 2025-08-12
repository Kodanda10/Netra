import React from 'react'
import { Stock } from '@/market/hooks/useMockStocks'

export const TopList: React.FC<{ items: Stock[] }>
  = ({ items }) => {
  const [sort, setSort] = React.useState<{ key: 'symbol'|'price'|'change'|'volume'; dir: 1|-1 }>({ key: 'change', dir: -1 })
  const sorted = React.useMemo(() => {
    const arr = [...items]
    arr.sort((a,b) => {
      switch (sort.key) {
        case 'price': return sort.dir*(a.price-b.price)
        case 'volume': return sort.dir*(a.volume-b.volume)
        case 'change': return sort.dir*(a.changePct-b.changePct)
        default: return sort.dir*(a.symbol.localeCompare(b.symbol))
      }
    })
    return arr
  }, [items, sort])
  const hdr = (k: 'symbol'|'price'|'change'|'volume', label: string) => (
    <button onClick={()=>setSort(s=> ({ key: k, dir: s.key===k? (s.dir===1?-1:1):1 }))} className="text-left text-xs text-white/70">
      {label}{sort.key===k? (sort.dir===1?' ▲':' ▼'):''}
    </button>
  )
  return (
    <div className="glass-liquid rounded-3xl p-4 overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-white/70">
          <tr>
            <th className="py-2 pr-4">{hdr('symbol', 'Symbol')}</th>
            <th className="py-2 pr-4">{hdr('price', 'Price')}</th>
            <th className="py-2 pr-4">{hdr('change', 'Change %')}</th>
            <th className="py-2 pr-4">{hdr('volume', 'Volume')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0,20).map(s => (
            <tr key={s.symbol} className="border-t border-white/10">
              <td className="py-2 pr-4 text-white/90">{s.symbol}</td>
              <td className="py-2 pr-4 text-white/90">₹{s.price.toFixed(2)}</td>
              <td className={`py-2 pr-4 ${s.changePct>=0? 'text-green-400':'text-red-400'}`}>{s.changePct>=0?'+':''}{s.changePct.toFixed(2)}%</td>
              <td className="py-2 pr-4 text-white/80">{s.volume.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

