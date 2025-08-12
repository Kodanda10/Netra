import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'

// Simplify motion for this test to avoid AnimatePresence gating
vi.mock('framer-motion', async (orig) => {
  const actual = await (orig as any)()
  const motionProxy = new Proxy({}, {
    get: (_target, tag: string) => (props: any) => React.createElement(tag, props),
  })
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: motionProxy,
  }
})
import { MemoryRouter } from 'react-router-dom'
import AmoghHeader from '../../src/components/AmoghHeader'

describe('AmoghHeader subtitle rotation', () => {
  it('toggles subtitle after interval', () => {
    vi.useFakeTimers()
    try {
      render(
        <MemoryRouter>
          <AmoghHeader />
        </MemoryRouter>
      )
      expect(screen.getByText(/इंटेलिजेंट वित्तीय डैशबोर्ड/)).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(3600)
      })
      expect(screen.getByText(/Intelligent Finance Dashboard/)).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})




