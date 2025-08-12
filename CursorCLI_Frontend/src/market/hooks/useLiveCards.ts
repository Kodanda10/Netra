import React from 'react'

export type LiveCard = { label: string; value: string; changePct: number; ts: string; verified?: boolean }

const mock = {
  bse: { label: 'BSE Sensex', value: '75,012.30', changePct: +0.52, ts: new Date().toISOString(), verified: true },
  nse: { label: 'NSE Nifty', value: '22,845.10', changePct: -0.18, ts: new Date().toISOString(), verified: true },
  fx:  { label: 'USD / INR', value: '₹83.50', changePct: +0.06, ts: new Date().toISOString(), verified: true }
}

export function useLiveCards(locale: 'hi'|'en' = 'hi') {
  const [data, setData] = React.useState({ bse: mock.bse, nse: mock.nse, fx: mock.fx })
  React.useEffect(() => {
    const id = setInterval(() => {
      setData((d) => ({
        bse: { ...d.bse, value: d.bse.value, changePct: d.bse.changePct + (Math.random()-0.5)*0.1, ts: new Date().toISOString() },
        nse: { ...d.nse, value: d.nse.value, changePct: d.nse.changePct + (Math.random()-0.5)*0.1, ts: new Date().toISOString() },
        fx:  { ...d.fx,  value: d.fx.value,  changePct: d.fx.changePct  + (Math.random()-0.5)*0.05, ts: new Date().toISOString() },
      }))
    }, 60_000)
    return () => clearInterval(id)
  }, [])
  return data
}

