import { describe, expect, it } from 'vitest'

import { formatCurrencyFromCents } from '../../../../src/shared/utils/currency.js'

describe('formatCurrencyFromCents', () => {
  it('formats COP in Spanish locale with no decimals', () => {
    const value = formatCurrencyFromCents(1290000, 'COP', 'es')
    expect(value).toContain('12.900')
  })

  it('converts COP to USD for English locale', () => {
    const value = formatCurrencyFromCents(400000, 'COP', 'en')
    expect(value).toContain('$')
    expect(value).toContain('1.00')
  })

  it('handles non-finite values safely', () => {
    const value = formatCurrencyFromCents(Number.NaN, 'COP', 'es')
    expect(value).toMatch(/0/)
  })

  it('keeps decimals for USD', () => {
    const value = formatCurrencyFromCents(12345, 'USD', 'en')
    expect(value).toContain('123.45')
  })
})
