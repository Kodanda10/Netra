import React from 'react'
import '../finance/finance.css'
import { useParams, Navigate } from 'react-router-dom'
import { BharatLongCard } from '@/finance/components/BharatLongCard'
import StatesGrid from '@/finance/components/StatesGrid'
import { useFinanceData } from '@/finance/useFinanceData'
import { t, Locale } from '@/finance/i18n'

const Finance: React.FC = () => {
  const { lang } = useParams<{ lang: 'hi' | 'en' }>()
  if (!lang || (lang !== 'hi' && lang !== 'en')) return <Navigate to="/hi/finance" replace />

  const bharat = useFinanceData('bharat', undefined, lang)
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
  = ({ lang, names, sourcesLabelStr }) => {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setReady(true); io.disconnect() } }, { rootMargin: '240px' })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  if (!ready) return <div ref={ref} className="col-span-12 xl:col-span-8 2xl:col-span-7" />

  return <StatesContent lang={lang} />
}

const StatesContent: React.FC<{ lang: 'hi'|'en' }> = ({ lang }) => {
  const chhattisgarh = useFinanceData('state', 'chhattisgarh', lang)
  const maharashtra = useFinanceData('state', 'maharashtra', lang)
  const uttarPradesh = useFinanceData('state', 'uttar-pradesh', lang)

  const itemsByState = {
    chhattisgarh: chhattisgarh.items,
    maharashtra: maharashtra.items,
    'uttar-pradesh': uttarPradesh.items,
  }

  const isLoading = chhattisgarh.isLoading || maharashtra.isLoading || uttarPradesh.isLoading
  const error = chhattisgarh.error || maharashtra.error || uttarPradesh.error

  if (isLoading) return <div className="col-span-12 xl:col-span-8 2xl:col-span-7">Loading...</div>
  if (error) return <div className="col-span-12 xl:col-span-8 2xl:col-span-7">Error loading state data.</div>

  return (
    <div className="col-span-12 xl:col-span-8 2xl:col-span-7">
      <StatesGrid locale={lang} itemsByState={itemsByState} limit={4} />
    </div>
  )
}

export default Finance

