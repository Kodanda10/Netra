import React, { useMemo } from 'react'
import { pickDisplayStates, STATES, type Locale } from '@/finance/states.config'
import { StateCard } from './StateCard'

type Props = {
  locale: Locale
  itemsByState: Record<string, Array<any>>
  limit?: number
}

export default function StatesGrid({ locale, itemsByState, limit = 4 }: Props) {
  const newsCounts = useMemo(() => {
    const r: Record<string, number> = {}
    for (const s of STATES) r[s.id] = (itemsByState[s.id]?.length ?? 0)
    return r
  }, [itemsByState])

  const toShow = pickDisplayStates(newsCounts, limit)

  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
      {toShow.map((meta) => (
        <StateCard
          key={meta.id}
          title={locale === 'hi' ? meta.hi : meta.en}
          items={(itemsByState[meta.id] ?? []) as any}
          sources={((itemsByState[meta.id] ?? []) as any).length? Array.from(new Set(((itemsByState[meta.id] ?? []) as any).map((i:any)=>i.source))).map((s:any)=>({source:s,count:((itemsByState[meta.id] ?? []) as any).filter((i:any)=>i.source===s).length})): []}
          sourcesLabel={locale === 'hi' ? 'स्रोत' : 'Sources'}
          stateId={meta.id}
        />
      ))}
    </div>
  )
}

