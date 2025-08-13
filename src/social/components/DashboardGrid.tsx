import React from 'react'

export const DashboardGrid: React.FC<{ children: React.ReactNode }>
  = ({ children }) => (
  <div className="grid grid-cols-12 gap-5 px-6 pb-10 auto-rows-[var(--card-h)] [--card-h:240px]">
    {children}
  </div>
)

export default DashboardGrid

