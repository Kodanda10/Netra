import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SourceTray } from '../../src/features/finance/components/SourceTray'

describe('SourceTray', () => {
  it('renders first six sources and handles open all', () => {
    const onOpen = vi.fn()
    const sources = Array.from({ length: 8 }).map((_, i) => ({ source: `s${i+1}`, count: i+1 }))
    render(<SourceTray sources={sources} onOpenAll={onOpen} viewAllLabel="All" />)
    for (let i=1;i<=6;i++) {
      expect(screen.getByText(`s${i} · ${i}`)).toBeInTheDocument()
    }
    expect(screen.queryByText('s7 · 7')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(onOpen).toHaveBeenCalled()
  })
})


