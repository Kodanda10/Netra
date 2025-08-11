import { useMemo } from 'react'
import { mockBharat, mockStates } from './mockData'

export function useFinanceData(scope: 'bharat' | 'state', stateId?: string) {
  const data = useMemo(() => {
    const items = scope === 'bharat' ? mockBharat : (mockStates[stateId ?? 'chhattisgarh'] || [])
    const sourcesOrdered: string[] = []
    for (const it of items) {
      if (!sourcesOrdered.includes(it.source)) sourcesOrdered.push(it.source)
    }
    return {
      items,
      sourcesOrdered: sourcesOrdered.map(s => ({ source: s, count: items.filter(i => i.source === s).length })),
      updatedAt: new Date().toISOString(),
    }
  }, [scope, stateId])

  return { ...data, isLoading: false }
}

