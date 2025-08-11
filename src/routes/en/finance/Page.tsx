import React from 'react'
import '../../../features/finance/styles/finance.css'
import { BharatLongCard } from '../../../features/finance/components/BharatLongCard'
import { StateCard } from '../../../features/finance/components/StateCard'
import { useFinance } from '../../../features/finance/components/useFinanceData'
import { BharatSkeleton, StateSkeleton } from '../../../features/finance/components/Skeletons'
import { states } from '../../../features/finance/finance.config'
import { t } from '../../../features/finance/i18n'

const FinancePageEn: React.FC = () => {
  const { data: bharat, isLoading: loadingBharat } = useFinance('bharat', { lang: 'en' })
  const chh = states.find(s => s.id === 'chhattisgarh')!
  const { data: chhData, isLoading: loadingChh } = useFinance('state', { state: chh.id, lang: 'en' })

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
      <div className="md:col-span-3">
        {loadingBharat || !bharat ? (
          <BharatSkeleton />
        ) : (
          <BharatLongCard
            title={t.en.titleBharat}
            items={bharat.items.map(i => ({ title: i.title, url: i.url, source: i.source }))}
            sources={bharat.sources}
            viewAllLabel={t.en.viewAllSources}
          />
        )}
      </div>
      <div className="md:col-span-2 space-y-4">
        {loadingChh || !chhData ? (
          <StateSkeleton />
        ) : (
          <StateCard
            title={chh.nameEn}
            iconName={chh.icon}
            items={chhData.items.slice(0, 10).map(i => ({ title: i.title, url: i.url, source: i.source }))}
            sources={chhData.sources}
            viewAllLabel={t.en.more}
          />
        )}
        {states.filter(s => s.id !== 'chhattisgarh').map(s => (
          <StateSkeleton key={s.id} />
        ))}
      </div>
    </div>
  )
}

export default FinancePageEn

