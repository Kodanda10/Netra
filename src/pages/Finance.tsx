import React from 'react'
import '../finance/finance.css'
import { useParams, Navigate } from 'react-router-dom'
import { BharatLongCard } from '@/finance/components/BharatLongCard'
import { StateCard } from '@/finance/components/StateCard'
import StatesGrid from '@/finance/components/StatesGrid'
import { useFinanceData } from '@/finance/useFinanceData'
import { t, Locale } from '@/finance/i18n'
import { mockStatesEn, mockStatesHi } from '@/finance/mockData'

const Finance: React.FC = () => {
  const { lang } = useParams<{ lang: 'hi' | 'en' }>()
  if (!lang || (lang !== 'hi' && lang !== 'en')) return <Navigate to="/hi/finance" replace />

  const bharat = useFinanceData('bharat', undefined, lang)
  const chh = useFinanceData('state', 'chhattisgarh', lang)
  const dict = t[lang as Locale]
  const names: Record<string,string> = lang === 'hi' ? {
    'chhattisgarh':'छत्तीसगढ़', 'maharashtra':'महाराष्ट्र', 'uttar-pradesh':'उत्तर प्रदेश'
  } : { 'chhattisgarh':'Chhattisgarh', 'maharashtra':'Maharashtra', 'uttar-pradesh':'Uttar Pradesh' }

  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-6" style={{ backgroundColor: '#121212' }}>
      <div className="col-span-12 xl:col-span-4 2xl:col-span-5">
        <BharatLongCard
          title={dict.bharat}
          items={bharat.items as any}
          sources={bharat.sourcesOrdered}
          sourcesLabel={dict.sourcesLabel}
        />
      </div>
      <LazyStates lang={lang} names={names} sourcesLabelStr={dict.sourcesLabel} />
    </div>
  )
}

const LazyStates: React.FC<{ lang: 'hi'|'en'; names: Record<string,string>; sourcesLabelStr: string }>
  = ({ lang }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setReady(true); io.disconnect() } }, { rootMargin: '240px' })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  if (!ready) return <div ref={ref} className="col-span-12 xl:col-span-8 2xl:col-span-7" />
  return (
    <div className="col-span-12 xl:col-span-8 2xl:col-span-7">
      <StatesGrid locale={lang} itemsByState={lang==='hi'? (mockStatesHi as any) : (mockStatesEn as any)} limit={4} />
    </div>
  )
}

// StateCardData no longer needed; StatesGrid composes cards dynamically

export default Finance

