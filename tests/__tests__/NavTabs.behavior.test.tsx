import { render, screen, fireEvent } from '@testing-library/react'
import NavTabs from '../../src/components/NavTabs'

describe('NavTabs behavior', () => {
  it('renders bilingual labels and sets initial active', () => {
    render(
      <NavTabs
        lang="hi"
        tabs={[
          { id: 'finance-news', labelHi: 'वित्तीय समाचार', labelEn: 'Finance News' },
          { id: 'stock-market', labelHi: 'शेयर बाजार', labelEn: 'Stock Market' },
        ]}
        initialActiveId="stock-market"
      />
    )
    expect(screen.getByTestId('tab-stock-market')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('शेयर बाजार')).toBeInTheDocument()
  })

  it('changes active on click and calls onChange', () => {
    const onChange = vi.fn()
    render(
      <NavTabs
        lang="en"
        onChange={onChange}
        tabs={[
          { id: 'finance-news', labelHi: 'वित्तीय समाचार', labelEn: 'Finance News' },
          { id: 'fdi', labelHi: 'एफडीआई', labelEn: 'FDI' },
        ]}
      />
    )
    const fdi = screen.getByTestId('tab-fdi')
    fireEvent.click(fdi)
    expect(fdi).toHaveAttribute('aria-selected', 'true')
    expect(onChange).toHaveBeenCalledWith('fdi')
  })

  it('supports keyboard navigation', () => {
    render(
      <NavTabs
        tabs={[
          { id: 'finance-news', labelHi: 'वित्तीय समाचार', labelEn: 'Finance News' },
          { id: 'stock-market', labelHi: 'शेयर बाजार', labelEn: 'Stock Market' },
          { id: 'fdi', labelHi: 'एफडीआई', labelEn: 'FDI' },
        ]}
      />
    )
    const finance = screen.getByTestId('tab-finance-news')
    finance.focus()
    fireEvent.keyDown(finance, { key: 'ArrowRight' })
    expect(screen.getByTestId('tab-stock-market')).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' })
    expect(screen.getByTestId('tab-fdi')).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(document.activeElement as Element, { key: 'Home' })
    expect(screen.getByTestId('tab-finance-news')).toHaveAttribute('aria-selected', 'true')
  })
})


