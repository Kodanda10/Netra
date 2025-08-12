import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Finance from '@/pages/Finance';
import Fdi from '@/pages/Fdi';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/hi/finance" replace />} />
        <Route path="/:lang/finance" element={<Finance />} />
        <Route path="/:lang/fdi" element={<Fdi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

