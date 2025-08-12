import React from 'react'

export const DashboardGrid: React.FC<{ children: React.ReactNode }>
  = ({ children }) => (
  <div className="grid grid-cols-12 gap-4 px-6 pb-8 auto-rows-[var(--card-h)] [--card-h:220px]">
    {children}
  </div>
)

export default DashboardGrid

