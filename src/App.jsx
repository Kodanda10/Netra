import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, RefreshCw, TrendingUp, TrendingDown, Globe2, DollarSign, Building2, Newspaper, Twitter, Facebook, Activity } from 'lucide-react'
import { formatDistanceToNow, subMinutes } from 'date-fns'
import './index.css'

const glassCard = 'backdrop-blur-md bg-black/30 border border-white/10 rounded-xl shadow-lg'

function StickyFilters({ onRefresh }) {
  return (
    <div className="sticky top-0 z-40">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 ${glassCard}`}>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-white/70" />
            <input
              placeholder="Filter by keyword, sector, state…"
              className="bg-transparent placeholder-white/40 text-white/90 outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className={`px-3 py-1.5 text-sm ${glassCard} hover:bg-white/10 transition-colors flex items-center gap-2`}>
              <SlidersHorizontal className="w-4 h-4" /> Advanced Filters
            </button>
            <button onClick={onRefresh} className={`px-3 py-1.5 text-sm ${glassCard} hover:bg-white/10 transition-colors flex items-center gap-2`}>
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatPanel({ label, value, trend, icon: Icon }) {
  const isUp = trend >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className={`p-4 ${glassCard}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5">
            <Icon className="w-5 h-5 text-white/80" />
          </div>
          <span className="text-white/70 text-sm">{label}</span>
        </div>
        <div className={`text-sm ${isUp ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1`}>
          {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
    </motion.div>
  )
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/10 rounded-md ${className}`} />
}

function useInfiniteFeed() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(0)

  useEffect(() => {
    // initial load
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const page = pageRef.current + 1
    pageRef.current = page

    const newItems = Array.from({ length: 10 }).map((_, i) => {
      const minutesAgo = page * 10 + i
      return {
        id: `${page}-${i}`,
        title: `Market update ${page}-${i}`,
        source: ['Twitter', 'Mint', 'ET', 'Bloomberg'][i % 4],
        time: subMinutes(new Date(), minutesAgo)
      }
    })

    setItems(prev => [...prev, ...newItems])
    if (page >= 8) setHasMore(false)
    setLoading(false)
  }

  return { items, loading, hasMore, loadMore }
}

function InfiniteFeed() {
  const { items, loading, hasMore, loadMore } = useInfiniteFeed()
  const sentinelRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    }, { rootMargin: '400px' })

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className={`space-y-3`}>
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            className={`p-4 ${glassCard}`}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-white/60">{formatDistanceToNow(item.time, { addSuffix: true })}</div>
            </div>
            <div className="mt-1 text-sm text-white/70 flex items-center gap-2">
              <Newspaper className="w-4 h-4" /> {item.source}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-6" />}
    </div>
  )
}

function StockGrid() {
  const stocks = useMemo(() => (
    Array.from({ length: 8 }).map((_, i) => ({
      symbol: ['TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL', 'ITC', 'LT'][i],
      price: (1000 + i * 37).toFixed(2),
      change: (i % 2 === 0 ? 1 : -1) * (Math.random() * 2 + 0.5),
    }))
  ), [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stocks.map((s, idx) => (
        <motion.div
          key={s.symbol}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
          className={`p-4 ${glassCard}`}
        >
          <div className="flex items-center justify-between">
            <div className="text-white/80 font-semibold">{s.symbol}</div>
            <Activity className="w-4 h-4 text-white/60" />
          </div>
          <div className="mt-3 text-2xl">₹{s.price}</div>
          <div className={`mt-1 text-sm ${s.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%</div>
        </motion.div>
      ))}
    </div>
  )
}

function FDIWidgets() {
  const cards = [
    { title: 'FDI Inflows (Qtr)', value: '$2.4B', icon: DollarSign },
    { title: 'Top State', value: 'Maharashtra', icon: Globe2 },
    { title: 'Top Sector', value: 'Manufacturing', icon: Building2 },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
          className={`p-4 ${glassCard}`}
        >
          <div className="text-sm text-white/70">{c.title}</div>
          <div className="mt-2 text-3xl font-semibold">{c.value}</div>
        </motion.div>
      ))}
    </div>
  )
}

function SocialSection() {
  const items = [
    { platform: 'Twitter', icon: Twitter, handle: '@netra', note: 'Realtime alerts' },
    { platform: 'Facebook', icon: Facebook, handle: 'Netra HQ', note: 'Community' },
  ]
  return (
    <div className={`p-4 ${glassCard}`}>
      <div className="text-white/80 font-medium">Social</div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            className={`p-3 ${glassCard}`}
          >
            <div className="flex items-center gap-3">
              <s.icon className="w-5 h-5" />
              <div>
                <div className="font-medium">{s.platform}</div>
                <div className="text-xs text-white/60">{s.handle} — {s.note}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const onRefresh = () => {
    // placeholder for refetch
  }

  return (
    <div className="min-h-dvh">
      <StickyFilters onRefresh={onRefresh} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatPanel label="FDI YoY" value="$12.3B" trend={3.4} icon={DollarSign} />
          <StatPanel label="Exports" value="$41.6B" trend={-1.1} icon={Globe2} />
          <StatPanel label="Manufacturing PMI" value="56.2" trend={2.2} icon={Building2} />
          <StatPanel label="Market Breadth" value="61% Adv" trend={1.6} icon={Activity} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`p-4 ${glassCard}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Stocks</div>
                <div className="text-xs text-white/60">Realtime snapshot</div>
              </div>
              <div className="mt-4"><StockGrid /></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`p-4 ${glassCard}`}
            >
              <div className="text-lg font-semibold">Infinite Feed</div>
              <div className="mt-3"><InfiniteFeed /></div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`p-4 ${glassCard}`}
            >
              <div className="text-lg font-semibold">FDI</div>
              <div className="mt-3"><FDIWidgets /></div>
            </motion.div>

            <SocialSection />
          </div>
        </section>

        <section className="pb-24" />
      </main>
    </div>
  )
}
