import React from 'react'

export const MarketTabs: React.FC<{ tabs: { id:string; labelHi:string; labelEn:string }[]; lang:'hi'|'en'; onChange:(id:string)=>void; active:string }>
  = ({ tabs, lang, onChange, active }) => {
  return (
    <div className="glass-liquid rounded-full p-1 inline-flex gap-1">
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)}
          className={`px-3 py-1.5 rounded-full text-sm ${active===t.id?'bg-white/10 text-white':'text-white/80 hover:bg-white/5'}`}
        >{lang==='hi'? t.labelHi : t.labelEn}</button>
      ))}
    </div>
  )
}

