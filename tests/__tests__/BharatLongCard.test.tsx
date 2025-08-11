import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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


