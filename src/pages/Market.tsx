import React from 'react'
import '../finance/finance.css'
import { useParams, Navigate } from 'react-router-dom'
import { tMarket, type MarketLocale } from '@/market/i18n'
import { useLiveCards } from '@/market/hooks/useLiveCards'
import { LiveCard } from '@/market/components/LiveCard'
import { useMockStocks } from '@/market/hooks/useMockStocks'
import { Heatmap } from '@/market/components/Heatmap'
import { TopList } from '@/market/components/TopList'
import { TreemapHeat } from '@/market/components/Treemap'
import { MarketTabs } from '@/market/components/Tabs'

const Market: React.FC = () => {
  const { lang } = useParams<{ lang: 'hi' | 'en' }>()
  if (!lang || (lang !== 'hi' && lang !== 'en')) return <Navigate to="/hi/finance" replace />
  const dict = tMarket[lang as MarketLocale]
  const live = useLiveCards(lang)
  const stocks = useMockStocks()
  const [tab, setTab] = React.useState<'overview'|'gainers'|'losers'|'heatmap'>('overview')
  const treedata = stocks.slice(0,50).map(s => ({ name: s.symbol, size: Math.abs(s.price*s.changePct)+50, changePct: s.changePct }))
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiveCard title={dict.bse} value={live.bse.value} changePct={live.bse.changePct} verified />
        <LiveCard title={dict.nse} value={live.nse.value} changePct={live.nse.changePct} verified />
        <LiveCard title={dict.usdInr} value={live.fx.value} changePct={live.fx.changePct} verified />
      </div>
      <div className="flex justify-center">
        <MarketTabs
          tabs={[{id:'overview',labelHi:'सारांश',labelEn:'Overview'},{id:'gainers',labelHi:'शीर्ष बढ़त',labelEn:'Top Gainers'},{id:'losers',labelHi:'शीर्ष गिरावट',labelEn:'Top Losers'},{id:'heatmap',labelHi:'हीटमैप',labelEn:'Heatmap'}]}
          lang={lang}
          active={tab}
          onChange={(id)=>setTab(id as any)}
        />
      </div>
      {tab==='overview' && (
        <section className="space-y-4">
          <h2 className="card-title text-lg">{lang==='hi' ? 'निफ्टी-50 हीटमैप' : 'Nifty-50 Heatmap'}</h2>
          <TreemapHeat data={treedata} />
        </section>
      )}
      {tab==='gainers' && (
        <section className="space-y-4">
          <h2 className="card-title text-lg">{lang==='hi' ? 'शीर्ष बढ़त' : 'Top Gainers'}</h2>
          <TopList items={[...stocks].sort((a,b)=>b.changePct-a.changePct)} />
        </section>
      )}
      {tab==='losers' && (
        <section className="space-y-4">
          <h2 className="card-title text-lg">{lang==='hi' ? 'शीर्ष गिरावट' : 'Top Losers'}</h2>
          <TopList items={[...stocks].sort((a,b)=>a.changePct-b.changePct)} />
        </section>
      )}
      {tab==='heatmap' && (
        <section className="space-y-4">
          <h2 className="card-title text-lg">{lang==='hi' ? 'हीटमैप' : 'Heatmap'}</h2>
          <Heatmap items={stocks.map(s=>({symbol:s.symbol, changePct:s.changePct}))} />
        </section>
      )}
    </div>
  )
}

export default Market

