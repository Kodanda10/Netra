import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import FinancePageHi from '../../src/routes/hi/finance/Page'
import FinancePageEn from '../../src/routes/en/finance/Page'

// Stub fetch to avoid real network
global.fetch = ((url: string) => {
  const now = new Date().toISOString()
  const body = JSON.stringify({
    items: Array.from({ length: 5 }).map((_, i) => ({ title: `headline ${i+1}`, url: `https://e/${i+1}`, source: i%2? 'rss':'gnews', publishedAt: now })),
    sources: [{ source: 'rss', count: 3 }, { source: 'gnews', count: 2 }],
    updatedAt: now,
  })
  return Promise.resolve(new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } }))
}) as any

describe('Finance pages smoke', () => {
  it('renders HI finance page layout', async () => {
    render(
      <MemoryRouter initialEntries={["/hi/finance"]}>
        <Routes>
          <Route path="/hi/finance" element={<FinancePageHi />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText(/स्रोत|Sources|more|सभी स्रोत/i)).toBeInTheDocument()
  })

  it('renders EN finance page layout', async () => {
    render(
      <MemoryRouter initialEntries={["/en/finance"]}>
        <Routes>
          <Route path="/en/finance" element={<FinancePageEn />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText(/Sources|More|View All/i)).toBeInTheDocument()
  })
})


