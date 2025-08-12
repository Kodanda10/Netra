import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AmoghHeader from '../../src/components/AmoghHeader'

describe('AmoghHeader', () => {
  it('renders logo img and tablist', () => {
    render(
      <MemoryRouter>
        <AmoghHeader />
      </MemoryRouter>
    )
    expect(screen.getByRole('img', { name: 'अमोघ' })).toBeInTheDocument()
    // Exact name to avoid matching the compact variant
    expect(screen.getByRole('tablist', { name: 'Amogh sections' })).toBeInTheDocument()
  })
})


