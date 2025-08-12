import React from 'react'
import AmoghHeader from './components/AmoghHeader'
import { Routes, Route, Navigate } from 'react-router-dom'
import Finance from './pages/Finance'
import Market from './pages/Market'
import Social from './pages/Social'

const App: React.FC = () => {
  return (
    <div className="min-h-dvh bg-[#121212] text-white">
      <AmoghHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={<Navigate to="/hi/finance" replace />} />
          <Route path= "/:lang/finance" element={<Finance />} />
          <Route path= "/:lang/market" element={<Market />} />
          <Route path= "/:lang/social" element={<Social />} />
        </Routes>
      </main>
    </div>
  )
}

export default App 