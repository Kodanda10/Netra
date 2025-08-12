import React from 'react'
import '../finance/finance.css'
import { useParams, Navigate } from 'react-router-dom'
import { tMarket, type MarketLocale } from '@/market/i18n'
import { useLiveCards } from '@/market/hooks/useLiveCards'
import { LiveCard } from '@/market/components/LiveCard'
import { useMockStocks } from '@/market/hooks/useMockStocks'
import { Heatmap } from '@/market/components/Heatmap'
import { TopList } from '@/market/components/TopList'

const Market: React.FC = () => {
  const { lang } = useParams<{ lang: 'hi' | 'en' }>()
  if (!lang || (lang !== 'hi' && lang !== 'en')) return <Navigate to="/hi/finance" replace />
  const dict = tMarket[lang as MarketLocale]
  const live = useLiveCards(lang)
  const stocks = useMockStocks()
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiveCard title={dict.bse} value={live.bse.value} changePct={live.bse.changePct} verified />
        <LiveCard title={dict.nse} value={live.nse.value} changePct={live.nse.changePct} verified />
        <LiveCard title={dict.usdInr} value={live.fx.value} changePct={live.fx.changePct} verified />
      </div>
      <section className="space-y-4">
        <h2 className="card-title text-lg">{lang==='hi' ? 'निफ्टी-50 हीटमैप' : 'Nifty-50 Heatmap'}</h2>
        <Heatmap items={stocks.map(s=>({symbol:s.symbol, changePct:s.changePct}))} />
      </section>
      <section className="space-y-4">
        <h2 className="card-title text-lg">{lang==='hi' ? 'टॉप 50 सूची' : 'Top 50 List'}</h2>
        <TopList items={stocks} />
      </section>
    </div>
  )
}

export default Market

