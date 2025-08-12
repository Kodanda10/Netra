import React from 'react'

export const DashboardGrid: React.FC<{ children: React.ReactNode }>
  = ({ children }) => (
  <div className="grid grid-cols-12 gap-4 px-6 pb-8 [--card-h:220px]" style={{ ['--card-h-tall' as any]: '456px' }}>
    {children}
  </div>
)

export default DashboardGrid

