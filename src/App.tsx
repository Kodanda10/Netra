import React, { Suspense } from 'react'
import AmoghHeader from './components/AmoghHeader'
import ErrorBoundary from './components/ErrorBoundary'
import { Routes, Route, Navigate } from 'react-router-dom'
import Finance from './pages/Finance'
import Market from './pages/Market'
const Social = React.lazy(() => import('./pages/Social'))

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-dvh bg-[#121212] text-white">
        <AmoghHeader />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Suspense fallback={<div aria-live="polite" className="text-white/80">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/hi/finance" replace />} />
              <Route path= "/:lang/finance" element={<Finance />} />
              <Route path= "/:lang/market" element={<Market />} />
              <Route path= "/:lang/social" element={<Social />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App 