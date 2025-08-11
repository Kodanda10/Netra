import React from 'react'
import '../finance/finance.css'
import { BharatLongCard } from '@/finance/components/BharatLongCard'
import { StateCard } from '@/finance/components/StateCard'
import { useFinanceData } from '@/finance/useFinanceData'
import { t } from '@/finance/i18n'

const EnFinance: React.FC = () => {
  const bharat = useFinanceData('bharat')
  const chh = useFinanceData('state', 'chhattisgarh')
  const otherStates = ['maharashtra','uttar-pradesh'] as const
  return (
    <div className="grid grid-cols-12 gap-6" style={{ backgroundColor: '#121212' }}>
      <div className="col-span-12 xl:col-span-4 2xl:col-span-5">
        <BharatLongCard
          title={t.en.bharat}
          items={bharat.items as any}
          sources={bharat.sourcesOrdered}
          sourcesLabel={t.en.sources(bharat.items.length)}
        />
      </div>
      <div className="col-span-12 xl:col-span-8 2xl:col-span-7 grid md:grid-cols-2 gap-6">
        <StateCard title={'Chhattisgarh'} items={chh.items as any} sources={chh.sourcesOrdered} sourcesLabel={t.en.sources(chh.items.length)} />
        {otherStates.map(s => {
          const d = useFinanceData('state', s)
          const name = s === 'maharashtra' ? 'Maharashtra' : 'Uttar Pradesh'
          return <StateCard key={s} title={name} items={d.items as any} sources={d.sourcesOrdered} sourcesLabel={t.en.sources(d.items.length)} />
        })}
      </div>
    </div>
  )
}

export default EnFinance

