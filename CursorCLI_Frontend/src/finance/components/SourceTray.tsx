import React from 'react'

export const SourceTray: React.FC<{ total:number; label:string; onOpen:()=>void }>
  = ({ total, label, onOpen }) => (
  <div className="flex items-center justify-end mt-3">
    <button onClick={onOpen} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/85 text-sm">
      {label} {total > 0 ? `(${total})` : ''}
    </button>
  </div>
)

