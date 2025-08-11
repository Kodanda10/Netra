import React from 'react'
import '../finance/finance.css'
import { useParams, Navigate } from 'react-router-dom'
import { BharatLongCard } from '@/finance/components/BharatLongCard'
import { StateCard } from '@/finance/components/StateCard'
import { useFinanceData } from '@/finance/useFinanceData'
import { t, Locale } from '@/finance/i18n'

const Finance: React.FC = () => {
  const { lang } = useParams<{ lang: 'hi' | 'en' }>()
  if (!lang || (lang !== 'hi' && lang !== 'en')) return <Navigate to="/hi/finance" replace />

  const bharat = useFinanceData('bharat')
  const chh = useFinanceData('state', 'chhattisgarh')
  const otherStates = ['maharashtra','uttar-pradesh'] as const
  const dict = t[lang as Locale]
  const names: Record<string,string> = lang === 'hi' ? {
    'chhattisgarh':'छत्तीसगढ़', 'maharashtra':'महाराष्ट्र', 'uttar-pradesh':'उत्तर प्रदेश'
  } : { 'chhattisgarh':'Chhattisgarh', 'maharashtra':'Maharashtra', 'uttar-pradesh':'Uttar Pradesh' }

  return (
    <div className="grid grid-cols-12 gap-6" style={{ backgroundColor: '#121212' }}>
      <div className="col-span-12 xl:col-span-4 2xl:col-span-5">
        <BharatLongCard
          title={dict.bharat}
          items={bharat.items as any}
          sources={bharat.sourcesOrdered}
          sourcesLabel={dict.sources(bharat.items.length)}
        />
      </div>
      <div className="col-span-12 xl:col-span-8 2xl:col-span-7 grid md:grid-cols-2 gap-6">
        <StateCard title={names['chhattisgarh']} items={chh.items as any} sources={chh.sourcesOrdered} sourcesLabel={dict.sources(chh.items.length)} />
        {otherStates.map(s => {
          const d = useFinanceData('state', s)
          return <StateCard key={s} title={names[s]} items={d.items as any} sources={d.sourcesOrdered} sourcesLabel={dict.sources(d.items.length)} />
        })}
      </div>
    </div>
  )
}

export default Finance

