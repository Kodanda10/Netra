import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewsCard } from '../../src/features/finance/components/NewsCard'

describe('NewsCard', () => {
  it('renders title and link', () => {
    render(<NewsCard title="Alpha" url="https://e/1" source="rss" timeAgo="1h" />)
    const link = screen.getByRole('link', { name: /Alpha/i })
    expect(link).toHaveAttribute('href', 'https://e/1')
  })
})


