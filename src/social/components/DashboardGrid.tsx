import React from 'react'

export const DashboardGrid: React.FC<{ children: React.ReactNode }>
  = ({ children }) => (
  <div className="grid grid-cols-12 gap-6 px-6 pb-10 auto-rows-[var(--card-h)] [--card-h:260px]">
    {children}
  </div>
)

export default DashboardGrid

