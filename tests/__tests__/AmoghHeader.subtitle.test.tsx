import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import AmoghHeader from '../../src/components/AmoghHeader'

describe('AmoghHeader subtitle rotation', () => {
  it('toggles subtitle after interval', async () => {
    vi.useFakeTimers()
    render(
      <MemoryRouter>
        <AmoghHeader />
      </MemoryRouter>
    )
    // initial Hindi visible
    expect(screen.getByText(/इंटेलिजेंट वित्तीय डैशबोर्ड/)).toBeInTheDocument()
    // advance 3600ms wrapped in act and await appearance
    await act(async () => {
      vi.advanceTimersByTime(3610)
      vi.runOnlyPendingTimers()
    })
    await screen.findByText(/Intelligent Finance Dashboard/)
    vi.useRealTimers()
  })
})




