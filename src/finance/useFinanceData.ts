import { useMemo } from 'react'
import { mockBharatEn, mockBharatHi, mockStatesEn, mockStatesHi } from './mockData'

export function useFinanceData(scope: 'bharat' | 'state', stateId?: string, lang: 'hi' | 'en' = 'en') {
  const data = useMemo(() => {
    const items = scope === 'bharat'
      ? (lang === 'hi' ? mockBharatHi : mockBharatEn)
      : ((lang === 'hi' ? mockStatesHi : mockStatesEn)[stateId ?? 'chhattisgarh'] || [])
    const sourcesOrdered: string[] = []
    for (const it of items) {
      if (!sourcesOrdered.includes(it.source)) sourcesOrdered.push(it.source)
    }
    return {
      items,
      sourcesOrdered: sourcesOrdered.map(s => ({ source: s, count: items.filter(i => i.source === s).length })),
      updatedAt: new Date().toISOString(),
    }
  }, [scope, stateId, lang])

  return { ...data, isLoading: false }
}

