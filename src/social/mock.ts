export type Platform = 'x' | 'facebook' | 'instagram'

export const brandLogos: Record<Platform, string> = {
  x: 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg',
  facebook: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg',
  instagram: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'
}

export const mockInsights = {
  x: { followers: 17540, tweets: 152, mentions: 9, favorites: 169, following: 94 },
  facebook: { reach: 390, views: 279, engaged: 52, clicks: 14, likes: 4 },
  instagram: { photos: 14, followers: 820, following: 275 }
} as const

export function genSeries(n = 24, base = 100) {
  const arr: { t: number; v: number }[] = []
  let v = base
  for (let i = 0; i < n; i++) { v += (Math.random() - 0.5) * 8; arr.push({ t: i, v: Number(v.toFixed(2)) }) }
  return arr
}

export const seriesByPlatform: Record<Platform, { t: number; v: number }[]> = {
  x: genSeries(32, 120), facebook: genSeries(32, 140), instagram: genSeries(32, 160)
}

export type FeedItem = { id: string; platform: Platform; text: string; ts: string; likes: number; comments?: number; shares?: number }

export const unifiedFeed: FeedItem[] = Array.from({ length: 18 }).map((_, i) => {
  const platforms: Platform[] = ['x', 'facebook', 'instagram']
  const p = platforms[i % platforms.length]
  return { id: String(i), platform: p, text: `Mock ${p} post ${i + 1} - market sentiment neutral`, ts: new Date(Date.now() - i * 3600_000).toISOString(), likes: 10 + Math.floor(Math.random() * 120), comments: Math.floor(Math.random() * 20), shares: Math.floor(Math.random() * 10) }
}).sort((a, b) => b.ts.localeCompare(a.ts))



