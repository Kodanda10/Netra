import React from 'react'
import '../finance/finance.css'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { brandLogos, mockInsights, seriesByPlatform, unifiedFeed } from '@/social/mock'
import DashboardGrid from '@/social/components/DashboardGrid'
import Card from '@/social/components/Card'
import { brandLogos } from '@/social/mock'

type Post = { id:string; platform:'fb'|'ig'|'x'; text:string; ts:string; likes:number; comments?:number; shares?:number }

const COLORS = ['#60a5fa', '#34d399', '#f472b6']

function useMockSocial(){
  const followers = { fb: 12450, ig: 28900, x: mockInsights.x.followers }
  const engagement = { likes: 1243, comments: 334, shares: 208 }
  const series = seriesByPlatform
  const feed = unifiedFeed
  return { followers, engagement, series, feed }
}

const Social: React.FC = () => {
  const { lang } = useParams<{ lang:'hi'|'en' }>()
  if (!lang || (lang!=='hi' && lang!=='en')) return <Navigate to="/hi/finance" replace />
  const t = lang==='hi'
    ? { title:'सोशल मीडिया', overview:'समेकित अवलोकन', timelines:'टाइमलाइन', followers:'कुल फॉलोअर्स', engagement:'एंगेजमेंट', refresh:'रिफ्रेश' }
    : { title:'Social Media', overview:'Overview', timelines:'Timelines', followers:'Total Followers', engagement:'Engagement', refresh:'Refresh' }
  const { followers, engagement, series, feed } = useMockSocial()
  const totalFollowers = followers.fb + followers.ig + followers.x
  const pieData = [ { name:'Likes', value: engagement.likes }, { name:'Comments', value: engagement.comments }, { name:'Shares', value: engagement.shares } ]
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="card-title text-xl font-semibold">{t.title}</h1>
        <button className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white/85">{t.refresh}</button>
      </header>
      {/* Three big rows like reference: X, Facebook, Instagram */}
      <DashboardGrid>
        {/* X row */}
        <Card className="col-span-12 md:col-span-2 row-span-2" size="tall" title="X" subtitle="Twitter">
          <div className="h-full flex items-center justify-center">
            <img src={brandLogos.x} alt="X" className="w-24 h-24" />
          </div>
        </Card>
        <Card className="col-span-12 md:col-span-4" title="Overview" subtitle="Twitter" timeRangeText="May 11 – Jun 8">
          <div className="grid grid-cols-3 gap-2">
            {[{l:'Tweets',v:152},{l:'Following',v:185},{l:'Followers',v:94},{l:'Listed',v:0},{l:'Favorites',v:169},{l:'Mentions',v:9}].map((k)=>(
              <div key={k.l} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-white/60 text-[11px] uppercase">{k.l}</div>
                <div className="text-white text-lg font-semibold">{k.v}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="col-span-12 md:col-span-3" title="Mentions" subtitle="Twitter">
          <div className="h-[140px] bg-white/5 rounded-xl" />
        </Card>
        <Card className="col-span-12 md:col-span-3 row-span-2" size="tall" title="Top Tweets by Favorites" subtitle="Twitter">
          <ul className="space-y-2">
            {Array.from({length:6}).map((_,i)=>(
              <li key={i} className="flex items-center gap-2">
                <span className="text-white/60 text-xs w-4">{i+1}</span>
                <span className="flex-1 line-clamp-1 text-white/85 text-sm">Sample tweet text {i+1}…</span>
                <div className="w-28 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                <span className="text-white/70 text-xs">{20+i}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Facebook row */}
        <Card className="col-span-12 md:col-span-2 row-span-2" size="tall" title="Facebook" subtitle="Pages">
          <div className="h-full flex items-center justify-center">
            <img src={brandLogos.facebook} alt="Facebook" className="w-20 h-20" />
          </div>
        </Card>
        <Card className="col-span-12 md:col-span-4" title="Facebook Pages" subtitle="Reach">
          <div className="h-[140px] bg-white/5 rounded-xl" />
          <div className="mt-2 flex flex-wrap gap-2 justify-end text-[12px] text-white/80">
            {['Reach 390 ↑51%','Views 279 ↓5%','Engaged 52 ↑27%','Clicks 14 ↑250%','Likes 4 ↓33%'].map((t,i)=>(<span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{t}</span>))}
          </div>
        </Card>
        <Card className="col-span-12 md:col-span-3" title="Facebook Pages" subtitle="Engaged">
          <div className="h-[140px] bg-white/5 rounded-xl" />
        </Card>
        <Card className="col-span-12 md:col-span-3 row-span-2" size="tall" title="Top Posts by Engaged Users" subtitle="Facebook">
          <ul className="space-y-2">
            {Array.from({length:6}).map((_,i)=>(
              <li key={i} className="flex items-center gap-2">
                <span className="text-white/60 text-xs w-4">{i+1}</span>
                <span className="flex-1 line-clamp-1 text-white/85 text-sm">Top post text {i+1}…</span>
                <div className="w-28 h-2 bg-purple-500/70 rounded-full" />
                <span className="text-white/70 text-xs">{12+i}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Instagram row */}
        <Card className="col-span-12 md:col-span-2" title="Instagram" subtitle="Summary">
          <div className="h-full flex items-center justify-center">
            <img src={brandLogos.instagram} alt="Instagram" className="w-20 h-20" />
          </div>
        </Card>
        <Card className="col-span-12 md:col-span-4" title="Instagram" subtitle="Photos/Followers/Following">
          <div className="grid grid-cols-3 gap-2">
            {[{l:'Photos',v:14},{l:'Followers',v:82},{l:'Following',v:275}].map((k)=>(
              <div key={k.l} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-white/60 text-[11px] uppercase">{k.l}</div>
                <div className="text-white text-lg font-semibold">{k.v}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="col-span-12 md:col-span-2" title="Followers" subtitle="Instagram">
          <div className="h-[140px] bg-white/5 rounded-xl" />
        </Card>
        <Card className="col-span-12 md:col-span-2" title="Following" subtitle="Instagram">
          <div className="h-[140px] bg-white/5 rounded-xl" />
        </Card>
        <Card className="col-span-12 md:col-span-2" title="Photos" subtitle="Instagram">
          <div className="h-[140px] bg-white/5 rounded-xl" />
        </Card>
      </DashboardGrid>

      {/* Legacy compact insights retained below if needed */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 hidden">
        <motion.div className="glass-liquid rounded-3xl p-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
          <div className="text-sm text-white/70 mb-2">{t.followers}</div>
          <div className="text-2xl font-semibold">{totalFollowers.toLocaleString('en-IN')}</div>
          <div className="mt-3 text-white/70 text-sm">FB {followers.fb.toLocaleString('en-IN')} · IG {followers.ig.toLocaleString('en-IN')} · X {followers.x.toLocaleString('en-IN')}</div>
        </motion.div>
        <motion.div className="glass-liquid rounded-3xl p-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
          <div className="text-sm text-white/70 mb-2">{t.engagement}</div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={2}>
                  {pieData.map((entry, index) => (<Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ background:'rgba(0,0,0,.8)', border:'1px solid rgba(255,255,255,.1)', color:'#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div className="glass-liquid rounded-3xl p-4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
          <div className="text-sm text-white/70 mb-2">Growth</div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series.x}>
                <CartesianGrid stroke="#ffffff22" vertical={false} />
                <XAxis dataKey="t" tick={{ fill: '#ffffff8a', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#ffffff22' }} />
                <YAxis tick={{ fill: '#ffffff8a', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#ffffff22' }} />
                <Tooltip contentStyle={{ background:'rgba(0,0,0,.8)', border:'1px solid rgba(255,255,255,.1)', color:'#fff' }} />
                <Line type="monotone" dataKey="v" stroke="#34d399" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      <section className="space-y-3">
        <h2 className="card-title text-lg">{t.timelines}</h2>
        <div className="grid gap-3">
          {feed.map(p => (
            <motion.article key={p.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="glass-liquid rounded-2xl p-3">
              <div className="text-xs text-white/70 mb-1 flex items-center gap-2">
                <img src={brandLogos[p.platform]} alt={p.platform} className="w-4 h-4" />
                <span>{p.platform.toUpperCase()} · {new Date(p.ts).toLocaleString()}</span>
              </div>
              <div className="news-headline">{p.text}</div>
              <div className="text-white/70 text-xs mt-1">❤ {p.likes} · 💬 {p.comments} · ↗ {p.shares}</div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Social

