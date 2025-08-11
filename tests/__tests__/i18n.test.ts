import { describe, it, expect } from 'vitest'
import { t } from '../../src/features/finance/i18n'

describe('i18n dict', () => {
  it('has expected keys and helpers', () => {
    expect(t.hi.titleBharat).toMatch(/भारत/)
    expect(t.en.titleBharat).toMatch(/Bharat/)
    expect(t.hi.updated(3)).toMatch(/3/)
    expect(t.en.updated(5)).toMatch(/5m/)
  })
})


