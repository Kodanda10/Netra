import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NewsList } from '../../src/features/finance/components/NewsList'

vi.mock('react-virtuoso', () => ({
  Virtuoso: ({ data, itemContent }: any) => (
    <div data-testid="virt">
      {data.map((it: any, i: number) => (
        <div key={i}>{itemContent(i, it)}</div>
      ))}
    </div>
  ),
}))

describe('NewsList', () => {
  it('renders rows via Virtuoso itemContent', () => {
    const items = [
      { title: 't1', url: 'https://e/1', source: 'rss' },
      { title: 't2', url: 'https://e/2', source: 'gnews' },
    ]
    render(<NewsList items={items} height={200} />)
    expect(screen.getByText('t1')).toBeInTheDocument()
    expect(screen.getByText('t2')).toBeInTheDocument()
  })
})




