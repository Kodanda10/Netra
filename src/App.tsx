import React from 'react'
import AmoghHeader from './components/AmoghHeader'

const App: React.FC = () => {
  return (
    <div className="min-h-dvh bg-[#121212] text-white">
      <AmoghHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-white/60 text-sm">Dashboard content…</div>
      </main>
    </div>
  )
}

export default App 