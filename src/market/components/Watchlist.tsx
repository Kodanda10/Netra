import React from 'react'
import { Stock } from '@/market/hooks/useMockStocks'

type Item = { symbol: string; note?: string; alertAbove?: number; alertBelow?: number }

function useLocalState<T>(key: string, initial: T){
  const [state, setState] = React.useState<T>(() => {
    try { const v = localStorage.getItem(key); return v? JSON.parse(v): initial } catch { return initial }
  })
  React.useEffect(() => { localStorage.setItem(key, JSON.stringify(state)) }, [key, state])
  return [state, setState] as const
}

export const Watchlist: React.FC<{ universe: Stock[] }>
  = ({ universe }) => {
  const [items, setItems] = useLocalState<Item[]>('watchlist:v1', [])
  const [q, setQ] = React.useState('')
  const matches = React.useMemo(() => q? universe.filter(s => s.symbol.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase())).slice(0,8) : [], [q, universe])
  const add = (sym: string) => { if (!items.some(i => i.symbol===sym)) setItems([...items, { symbol: sym }]) }
  const remove = (sym: string) => setItems(items.filter(i => i.symbol !== sym))
  const update = (sym: string, patch: Partial<Item>) => setItems(items.map(i => i.symbol===sym? { ...i, ...patch }: i))
  return (
    <section className="glass-liquid rounded-3xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search stocks (e.g., RELIANCE)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/20" />
        <button className="px-3 py-2 rounded-lg bg-white/10 text-sm">Add</button>
      </div>
      {!!matches.length && (
        <div className="mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {matches.map(m => (
            <button key={m.symbol} onClick={()=>{ add(m.symbol); setQ('') }} className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/10">
              {m.symbol} · <span className="text-white/60">{m.name}</span>
            </button>
          ))}
        </div>
      )}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-white/70">
            <tr>
              <th className="py-2 pr-3 text-left">Symbol</th>
              <th className="py-2 pr-3 text-left">Note</th>
              <th className="py-2 pr-3 text-left">Alert ≥</th>
              <th className="py-2 pr-3 text-left">Alert ≤</th>
              <th className="py-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.symbol} className="border-t border-white/10">
                <td className="py-2 pr-3 text-white/90">{it.symbol}</td>
                <td className="py-2 pr-3">
                  <input value={it.note ?? ''} onChange={e=>update(it.symbol,{note:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs" />
                </td>
                <td className="py-2 pr-3">
                  <input type="number" value={it.alertAbove ?? ''} onChange={e=>update(it.symbol,{alertAbove: e.target.value===''? undefined : Number(e.target.value)})} className="w-28 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs" />
                </td>
                <td className="py-2 pr-3">
                  <input type="number" value={it.alertBelow ?? ''} onChange={e=>update(it.symbol,{alertBelow: e.target.value===''? undefined : Number(e.target.value)})} className="w-28 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs" />
                </td>
                <td className="py-2 pr-3 text-right">
                  <button onClick={()=>remove(it.symbol)} className="text-xs text-white/70 hover:text-white">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

