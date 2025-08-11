import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HiFinance from '@/pages/HiFinance'
import EnFinance from '@/pages/EnFinance'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/hi/finance" replace />} />
        <Route path="/hi/finance" element={<HiFinance />} />
        <Route path="/en/finance" element={<EnFinance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

