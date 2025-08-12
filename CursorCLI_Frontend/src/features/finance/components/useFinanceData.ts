import useSWR from 'swr'

export type NewsItem = { title: string; url: string; publishedAt: string | null; source: string; summaryEn?: string; summaryHi?: string }
export type SourceCount = { source: string; count: number }
export type FinanceResponse = { items: NewsItem[]; sources: SourceCount[]; updatedAt: string }

const fetcher = async (url: string) => {
  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return await r.json()
  } catch (e) {
    // Mock fallback to keep UI functional without backend
    const now = new Date().toISOString()
    const mk = (n: number, scope: string) => Array.from({ length: n }).map((_, i) => ({
      title: `${scope} finance headline ${i + 1}`,
      url: `https://example.com/${scope}/${i + 1}`,
      publishedAt: now,
      source: i % 3 === 0 ? 'gnews' : 'rss',
    }))
    const u = new URL(url, window.location.href)
    const scope = u.searchParams.get('scope') || 'bharat'
    const items = scope === 'bharat' ? mk(60, 'bharat') : mk(18, 'state')
    const sources = [
      { source: 'rss', count: Math.floor(items.length * 0.7) },
      { source: 'gnews', count: items.length - Math.floor(items.length * 0.7) },
    ]
    return { items, sources, updatedAt: now }
  }
}

export function useFinance(scope: 'bharat' | 'state', opts?: { state?: string; lang: 'hi' | 'en' }) {
  const q = new URLSearchParams({ scope })
  if (scope === 'state' && opts?.state) q.set('state', opts.state)
  const url = `/api/finance?${q.toString()}`
  const { data, error, isLoading } = useSWR<FinanceResponse>(url, fetcher, { revalidateOnFocus: true, keepPreviousData: true })
  return { data, error, isLoading }
}

