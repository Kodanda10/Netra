import React from 'react'

export const SourceTray: React.FC<{ sources: { source: string; count: number }[]; onOpenAll: () => void; viewAllLabel: string }>
  = ({ sources, onOpenAll, viewAllLabel }) => {
  return (
    <div className="flex items-center justify-between mt-3">
      <div className="flex flex-wrap gap-1.5">
        {sources.slice(0, 6).map(s => (
          <span key={s.source} className="px-2 py-1 rounded-full text-xs bg-white/8 border border-white/10 text-white/75">
            {s.source} · {s.count}
          </span>
        ))}
      </div>
      <button onClick={onOpenAll} className="text-xs px-2 py-1 rounded-lg hover:bg-white/10 focus-ring text-metallic">
        {viewAllLabel}
      </button>
    </div>
  )
}

