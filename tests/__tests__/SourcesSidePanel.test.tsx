import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SourcesSidePanel } from '../../src/features/finance/components/SourcesSidePanel'

describe('SourcesSidePanel', () => {
  it('opens as dialog and closes via button and scrim', () => {
    const onClose = vi.fn()
    const ref = { current: null } as any
    const sources = [{ source: 'rss', count: 10 }, { source: 'gnews', count: 5 }]
    render(<SourcesSidePanel open onClose={onClose} sources={sources} panelRef={ref} />)
    expect(screen.getByRole('dialog', { name: 'Sources' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})


