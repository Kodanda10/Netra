import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Finance from '@/pages/Finance'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/hi/finance" replace />} />
        <Route path="/:lang/finance" element={<Finance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

