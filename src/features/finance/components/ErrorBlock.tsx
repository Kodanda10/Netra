import React from 'react'

export const ErrorBlock: React.FC<{ error?: unknown; retry?: () => void }> = ({ error, retry }) => (
  <div role="alert" className="glass-card p-6 text-center">
    <div className="text-red-300 font-semibold mb-2">Error loading</div>
    <div className="text-white/70 text-sm mb-4">{String((error as any)?.message || error || 'Unknown error')}</div>
    {retry && (
      <button onClick={retry} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 focus-ring">Retry</button>
    )}
  </div>
)

