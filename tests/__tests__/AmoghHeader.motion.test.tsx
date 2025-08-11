import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AmoghHeader from '../../src/components/AmoghHeader'

describe('AmoghHeader motion (reduced-motion off)', () => {
  it('renders subtitle element (smoke)', () => {
    // mock reduced motion false
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){}, onchange:null, dispatchEvent(){return true} }))
    render(
      <MemoryRouter>
        <AmoghHeader />
      </MemoryRouter>
    )
    expect(screen.getByText(/इंटेलिजेंट|Intelligent/)).toBeInTheDocument()
  })
})


