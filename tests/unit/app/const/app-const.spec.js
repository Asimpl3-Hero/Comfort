import { describe, expect, it } from 'vitest'

import {
  BENEFITS_DATA,
  DEFAULT_LANGUAGE,
  FOOTER_NAVIGATION_LINKS,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  TOP_NAVIGATION_LINKS,
} from '../../../../src/app/const/index.js'

describe('app constants', () => {
  it('exports navigation constants', () => {
    expect(TOP_NAVIGATION_LINKS).toHaveLength(3)
    expect(FOOTER_NAVIGATION_LINKS).toHaveLength(3)
  })

  it('exports i18n constants', () => {
    expect(DEFAULT_LANGUAGE).toBe('es')
    expect(SUPPORTED_LANGUAGES).toContain('en')
    expect(LANGUAGE_STORAGE_KEY).toBe('comfort_lang')
  })

  it('exports benefits constants', () => {
    expect(BENEFITS_DATA.length).toBeGreaterThan(0)
  })
})
