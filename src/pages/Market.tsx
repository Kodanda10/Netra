import React from 'react'
import '../finance/finance.css'
import { useParams, Navigate } from 'react-router-dom'
import { tMarket, type MarketLocale } from '@/market/i18n'
import { useLiveCards } from '@/market/hooks/useLiveCards'
import { LiveCard } from '@/market/components/LiveCard'

const Market: React.FC = () => {
  const { lang } = useParams<{ lang: 'hi' | 'en' }>()
  if (!lang || (lang !== 'hi' && lang !== 'en')) return <Navigate to="/hi/finance" replace />
  const dict = tMarket[lang as MarketLocale]
  const live = useLiveCards(lang)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiveCard title={dict.bse} value={live.bse.value} changePct={live.bse.changePct} verified />
        <LiveCard title={dict.nse} value={live.nse.value} changePct={live.nse.changePct} verified />
        <LiveCard title={dict.usdInr} value={live.fx.value} changePct={live.fx.changePct} verified />
      </div>
      {/* TODO: Heatmap and stock grid sections go here (mock for now) */}
    </div>
  )
}

export default Market

