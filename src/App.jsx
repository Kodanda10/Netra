import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, RefreshCw, TrendingUp, TrendingDown, Globe2, DollarSign, Building2, Newspaper, Twitter, Facebook, Activity, Sun, Moon } from 'lucide-react'
import { formatDistanceToNow, subMinutes } from 'date-fns'
import './index.css'

const baseCard = 'backdrop-blur-md rounded-xl shadow-lg border'
const glassCard = `${baseCard}`

function GoldParticles() {
  const dots = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    top: `${18 + Math.random() * 60}%`,
    left: `${20 + Math.random() * 60}%`,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 6,
    driftX: (Math.random() * 12 - 6),
    driftY: (Math.random() * 10 - 5),
  }))
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-visible">
      {dots.map(d => (
        <motion.span
          key={d.id}
          className="particle-dot"
          style={{ top: d.top, left: d.left }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0.15, 0.6, 0.15], x: d.driftX, y: d.driftY }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function Header({ theme, setTheme, lang, setLang }) {
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const toggleLang = () => setLang(lang === 'hi' ? 'en' : 'hi')

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="glass-header relative rounded-2xl px-4 sm:px-8 py-8 md:py-10 overflow-visible">
          <GoldParticles />
          <div className="flex items-center justify-end gap-2 absolute right-4 top-4 z-10">
            <button onClick={toggleLang} className={`${baseCard} px-3 py-1.5 text-sm rounded-lg border-[color:var(--card-border)]`} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--fg)' }} aria-label="Toggle language">{lang === 'hi' ? 'EN' : 'हिं'}</button>
            <button onClick={toggleTheme} className={`${baseCard} px-3 py-1.5 text-sm rounded-lg border-[color:var(--card-border)]`} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--fg)' }} aria-label="Toggle theme">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
          </div>

          <div className="flex flex-col items-center text-center select-none relative z-0">
            <motion.h1 className="hindi-title-fix font-amita text-[44px] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[116px] font-black bg-clip-text text-transparent gold-metallic animate-shimmer text-glow tracking-wide" initial={{ opacity: 0, y: 10, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, type: 'spring', stiffness: 140, damping: 18 }}>
              अमोघ
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p key={lang} className={`${lang === 'hi' ? 'font-noto-dev' : 'font-inter'} text-white/90 text-lg sm:text-xl md:text-2xl mt-2`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.45 }}>
                {lang === 'hi' ? 'इंटेलीजेंट वित्तीय डैशबोर्ड' : 'Intelligent Finance Dashboard'}
              </motion.p>
            </AnimatePresence>

            <motion.div className="relative w-40 sm:w-56 md:w-72 h-4 mt-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
              <div className="absolute inset-y-1 left-0 right-6 rounded-full arrow-bar" />
              <motion.svg
                className="absolute right-0 top-0 h-4 w-6 z-10"
                viewBox="0 0 24 16"
                fill="none"
                initial={{ opacity: 0.9, y: 0 }}
                animate={{ opacity: [0.9, 1, 0.9], y: [0, -1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <defs>
                  <linearGradient id="arrowGold" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFD700"/>
                    <stop offset="100%" stopColor="#FFA500"/>
                  </linearGradient>
                </defs>
                <path d="M2 8 L18 8" stroke="url(#arrowGold)" strokeWidth="4" strokeLinecap="round" />
                <path className="arrow-head" d="M12 2 L22 8 L12 14 Z" fill="url(#arrowGold)" stroke="#7a5200" strokeWidth="1" />
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  )
}

function StickyFilters({ onRefresh }) {
  return (
    <div className="sticky top-[168px] md:top-[196px] z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="w-5 h-5 opacity-70 flex-none" />
            <input placeholder={"Filter by keyword, sector, state…"} className="bg-transparent placeholder-white/40 outline-none w-full" style={{ color: 'var(--fg)' }} />
          </div>
          <div className="flex items-center gap-2">
            <button className={`${baseCard} px-3 py-1.5 text-sm rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2`} style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <SlidersHorizontal className="w-4 h-4" /> Advanced Filters
            </button>
            <button onClick={onRefresh} className={`${baseCard} px-3 py-1.5 text-sm rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2`} style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
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
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }} className={`p-4 ${glassCard} border-[color:var(--card-border)]`} style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <Icon className="w-5 h-5 opacity-80" />
          </div>
          <span className="opacity-70 text-sm">{label}</span>
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

function Skeleton({ className = '' }) { return <div className={`animate-pulse rounded-md ${className}`} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} /> }

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
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('hi')

  useEffect(() => { document.body.setAttribute('data-theme', theme) }, [theme])

  const onRefresh = () => {}

  return (
    <div className="min-h-dvh">
      <Header theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />
      <StickyFilters onRefresh={onRefresh} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatPanel label={lang === 'hi' ? 'एफडीआई वार्षिक' : 'FDI YoY'} value={lang === 'hi' ? '₹12.3B' : '$12.3B'} trend={3.4} icon={DollarSign} />
          <StatPanel label={lang === 'hi' ? 'निर्यात' : 'Exports'} value={lang === 'hi' ? '₹41.6B' : '$41.6B'} trend={-1.1} icon={Globe2} />
          <StatPanel label={lang === 'hi' ? 'एमपीआई विनिर्माण' : 'Manufacturing PMI'} value="56.2" trend={2.2} icon={Building2} />
          <StatPanel label={lang === 'hi' ? 'मार्केट ब्रेड्थ' : 'Market Breadth'} value={lang === 'hi' ? '61% बढ़त' : '61% Adv'} trend={1.6} icon={Activity} />
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
