import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFinance } from '../../src/features/finance/components/useFinanceData'

describe('useFinance', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', (url: string) => {
      const now = new Date().toISOString()
      const body = JSON.stringify({
        items: [
          { title: 'a', url: 'https://e/1', source: 'rss', publishedAt: now },
          { title: 'b', url: 'https://e/2', source: 'gnews', publishedAt: now },
        ],
        sources: [ { source: 'rss', count: 1 }, { source: 'gnews', count: 1 } ],
        updatedAt: now,
      })
      return Promise.resolve(new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } }))
    })
  })

  it('returns data with items and sources', async () => {
    const { result } = renderHook(() => useFinance('bharat', { lang: 'en' }))
    await waitFor(() => expect(result.current.data).toBeTruthy())
    expect(result.current.data?.items.length).toBe(2)
    expect(result.current.data?.sources.length).toBe(2)
  })
})




