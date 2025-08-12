import React from 'react'

export type Stock = { symbol: string; name: string; price: number; changePct: number; volume: number; series: number[] }

function genSeries(len = 20) {
  const arr: number[] = []
  let v = 100
  for (let i=0;i<len;i++) { v += (Math.random()-0.5)*2; arr.push(Number(v.toFixed(2))) }
  return arr
}

const TOP50: Stock[] = Array.from({ length: 50 }).map((_, i) => {
  const symbol = `STK${String(i+1).padStart(2,'0')}`
  const price = Number((80 + Math.random()*400).toFixed(2))
  const changePct = Number(((Math.random()-0.5)*4).toFixed(2))
  const volume = Math.floor(100000 + Math.random()*500000)
  return { symbol, name: `Company ${i+1}`, price, changePct, volume, series: genSeries() }
})

export function useMockStocks() {
  const [data, setData] = React.useState<Stock[]>(TOP50)
  React.useEffect(() => {
    const id = setInterval(() => {
      setData(d => d.map(s => ({
        ...s,
        price: Number((s.price * (1 + (Math.random()-0.5)*0.004)).toFixed(2)),
        changePct: Number((s.changePct + (Math.random()-0.5)*0.2).toFixed(2)),
        volume: Math.max(0, s.volume + Math.floor((Math.random()-0.5)*20000)),
        series: [...s.series.slice(1), Number((s.series[s.series.length-1] + (Math.random()-0.5)*2).toFixed(2))]
      })))
    }, 60_000)
    return () => clearInterval(id)
  }, [])
  return data
}

