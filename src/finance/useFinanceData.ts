import { useMemo } from 'react'
import { mockBharatEn, mockBharatHi, mockStatesEn, mockStatesHi } from './mockData'

export function useFinanceData(scope: 'bharat' | 'state', stateId?: string, lang: 'hi' | 'en' = 'en') {
  const data = useMemo(() => {
    const items = scope === 'bharat'
      ? (lang === 'hi' ? mockBharatHi : mockBharatEn)
      : ((lang === 'hi' ? mockStatesHi : mockStatesEn)[stateId ?? 'chhattisgarh'] || [])
    const sourcesOrdered: { source: string; count: number }[] = []
    for (const it of items as any[]) {
      if (!sourcesOrdered.find(s => s.source === (it as any).source)) {
        const count = (items as any[]).filter(i => i.source === (it as any).source).length
        sourcesOrdered.push({ source: (it as any).source, count })
      }
    }
    return {
      items: items as any[],
      sourcesOrdered,
      updatedAt: new Date().toISOString(),
    }
  }, [scope, stateId, lang])

  return { ...data, isLoading: false, error: undefined as undefined | Error }
}

