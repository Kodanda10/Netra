import React from 'react'

export const DashboardGrid: React.FC<{ children: React.ReactNode }>
  = ({ children }) => (
  <div className="grid grid-cols-12 gap-8 px-6 pb-12 auto-rows-[var(--card-h)] [--card-h:300px]">
    {children}
  </div>
)

export default DashboardGrid

