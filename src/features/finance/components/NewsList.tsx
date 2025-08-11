import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { NewsCard } from './NewsCard'

export type Row = { title: string; url: string; source?: string; timeAgo?: string }

export const NewsList: React.FC<{ items: Row[]; height?: number }>
  = ({ items, height = 420 }) => {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Virtuoso
        style={{ height }}
        data={items}
        itemContent={(idx, it) => (
          <NewsCard key={idx} title={it.title} url={it.url} source={it.source} timeAgo={it.timeAgo} />
        )}
      />
    </div>
  )
}

