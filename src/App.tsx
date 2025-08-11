import React from 'react'
import AmoghHeader from './components/AmoghHeader'
import { Routes, Route, Navigate } from 'react-router-dom'
import FinancePageHi from './routes/hi/finance/Page'
import FinancePageEn from './routes/en/finance/Page'

const App: React.FC = () => {
  return (
    <div className="min-h-dvh bg-[#121212] text-white">
      <AmoghHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={<Navigate to="/hi/finance" replace />} />
          <Route path="/hi/finance" element={<FinancePageHi />} />
          <Route path="/en/finance" element={<FinancePageEn />} />
        </Routes>
      </main>
    </div>
  )
}

export default App 