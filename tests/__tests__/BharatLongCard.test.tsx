import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../../src/features/finance/components/NewsList', () => ({
  NewsList: ({ items }: { items: { title: string; url: string }[] }) => (
    <div>
      {items.map((it) => (
        <a key={it.url} href={it.url}>{it.title}</a>
      ))}
    </div>
  ),
}))

import { BharatLongCard } from '../../src/features/finance/components/BharatLongCard'

describe('BharatLongCard', () => {
  const items = Array.from({ length: 5 }).map((_, i) => ({ title: `bharat ${i+1}`, url: `https://e/${i+1}`, source: 'rss' }))
  const sources = [{ source: 'rss', count: 5 }]
  it('renders title and list', () => {
    render(<BharatLongCard title="भारत समाचार" items={items} sources={sources} viewAllLabel="सभी स्रोत" />)
    expect(screen.getByText('भारत समाचार')).toBeInTheDocument()
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
  })
})


