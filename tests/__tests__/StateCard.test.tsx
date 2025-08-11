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

import { StateCard } from '../../src/features/finance/components/StateCard'

describe('StateCard', () => {
  const items = Array.from({ length: 3 }).map((_, i) => ({ title: `news ${i+1}`, url: `https://e/${i+1}`, source: 'gnews' }))
  const sources = [{ source: 'gnews', count: 3 }]
  it('renders icon title and list', () => {
    render(<StateCard title="छत्तीसगढ़" iconName="Landmark" items={items} sources={sources} viewAllLabel="और" />)
    expect(screen.getByText('छत्तीसगढ़')).toBeInTheDocument()
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
  })
})


