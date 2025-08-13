import React from 'react'
import '../finance/finance.css'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { brandLogos, mockInsights, seriesByPlatform, unifiedFeed } from '@/social/mock'
import DashboardGrid from '@/social/components/DashboardGrid'
import GlassCard from '@/social/components/ui/GlassCard'
import { Sparkline, AreaMini } from '@/social/components/ui/ChartTheme'
import KPIOverview from '@/social/components/KPIOverview'
import BarList from '@/social/components/BarList'

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
      {/* Three equal-height rows: X, Facebook, Instagram */}
      <div className="grid grid-cols-12 gap-6 px-6 pb-2 [--card-h:300px]">
        {/* Row 1: X single container */}
        <GlassCard className="col-span-12" title="Twitter" subtitle="X" timeRange="May 11 – Jun 8">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-12 lg:col-span-2 flex items-center justify-center">
              <img src={brandLogos.x} alt="X" className="w-24 h-24" />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <KPIOverview items={[
                {label:'Tweets',value:152,deltaPct:2},
                {label:'Following',value:185,deltaPct:1},
                {label:'Followers',value:94,deltaPct:-1},
                {label:'Listed',value:0},
                {label:'Favorites',value:169,deltaPct:3},
                {label:'Mentions',value:9}
              ]} />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <Sparkline data={seriesByPlatform.x} />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <BarList items={Array.from({length:6}).map((_,i)=>({id:String(i),text:`Sample tweet ${i+1}`,value:20+i}))} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-12 gap-6 px-6 pb-2 [--card-h:300px]">
        {/* Row 2: Facebook single container */}
        <GlassCard className="col-span-12" title="Facebook" subtitle="Pages">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-12 lg:col-span-2 flex items-center justify-center">
              <img src={brandLogos.facebook} alt="Facebook" className="w-20 h-20" />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <AreaMini data={seriesByPlatform.facebook} />
              <div className="mt-2 flex flex-wrap gap-2 justify-end text-[12px] text-white/80">
                {['Reach 390 ↑51%','Views 279 ↓5%','Engaged 52 ↑27%','Clicks 14 ↑250%','Likes 4 ↓33%'].map((t,i)=>(<span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{t}</span>))}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <Sparkline data={seriesByPlatform.facebook} color="#5B8CFF" />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <BarList items={Array.from({length:6}).map((_,i)=>({id:String(i),text:`Top post ${i+1}`,value:12+i}))} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-12 gap-6 px-6 pb-6 [--card-h:300px]">
        {/* Row 3: Instagram single container */}
        <GlassCard className="col-span-12" title="Instagram" subtitle="Summary">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-12 lg:col-span-2 flex items-center justify-center">
              <img src={brandLogos.instagram} alt="Instagram" className="w-20 h-20" />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="grid grid-cols-3 gap-2">
                {[{l:'Photos',v:14},{l:'Followers',v:82},{l:'Following',v:275}].map((k)=>(
                  <div key={k.l} className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-white/60 text-[11px] uppercase">{k.l}</div>
                    <div className="text-white text-lg font-semibold">{k.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <Sparkline data={seriesByPlatform.instagram} />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <Sparkline data={seriesByPlatform.instagram} color="#5B8CFF" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Timelines and legacy sections removed per request */}
    </div>
  )
}

export default Social

