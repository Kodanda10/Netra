import { describe, it, expect, fireEvent } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { useSidePanel } from '../../src/features/finance/components/useSidePanel'

function Harness(){
  const { open, setOpen, panelRef } = useSidePanel()
  return (
    <div>
      <button onClick={() => setOpen(true)}>open</button>
      {open && (
        <div ref={panelRef}>
          <button autoFocus>first</button>
          <button onClick={() => setOpen(false)}>close</button>
        </div>
      )}
    </div>
  )
}

describe('useSidePanel', () => {
  it('focuses into panel on open and restores focus on close', async () => {
    render(<Harness />)
    const openBtn = screen.getByRole('button', { name: 'open' })
    openBtn.focus()
    fireEvent.click(openBtn)
    // focus should move inside panel soon
    await screen.findByRole('button', { name: 'first' })
    // close returns focus
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(document.activeElement).toBe(openBtn)
  })
})


