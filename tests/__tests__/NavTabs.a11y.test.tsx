import { render } from '@testing-library/react'
import NavTabs from '../../src/components/NavTabs'
import { axe } from 'jest-axe'

describe('NavTabs accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <NavTabs
        lang="hi"
        tabs={[
          { id: 'finance-news', labelHi: 'वित्तीय समाचार', labelEn: 'Finance News' },
          { id: 'stock-market', labelHi: 'शेयर बाजार', labelEn: 'Stock Market' },
        ]}
      />
    )
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})


