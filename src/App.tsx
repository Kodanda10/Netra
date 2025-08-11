import React from 'react'
import AmoghHeader from './components/AmoghHeader'
import NavTabs, { type TabItem } from './components/NavTabs'
import { Newspaper, TrendingUp, Share2, Landmark } from 'lucide-react'

const App: React.FC = () => {
  return (
    <div className="min-h-dvh bg-[#121212] text-white">
      <AmoghHeader />
      <div className="mt-2 sm:mt-3 flex justify-center px-4">
        <NavTabs
          tabs={[
            { id: 'news', icon: <Newspaper size={20} />, labelHi: 'वित्तीय समाचार', labelEn: 'Finance News' } as TabItem,
            { id: 'stocks', icon: <TrendingUp size={20} />, labelHi: 'शेयर बाजार', labelEn: 'Stock Market' } as TabItem,
            { id: 'social', icon: <Share2 size={20} />, labelHi: 'सोशल मीडिया', labelEn: 'Social Media' } as TabItem,
            { id: 'fdi', icon: <Landmark size={20} />, labelHi: 'एफडीआई', labelEn: 'FDI' } as TabItem,
          ]}
          lang={'hi'}
          onChange={() => {}}
        />
      </div>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-white/60 text-sm">Dashboard content…</div>
      </main>
    </div>
  )
}

export default App 