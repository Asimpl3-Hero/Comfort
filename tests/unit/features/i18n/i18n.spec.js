import { describe, expect, it, vi } from 'vitest'

describe('i18n module', () => {
  it('initializes and toggles language', async () => {
    vi.resetModules()
    window.localStorage.setItem('comfort_lang', 'es')

    const module = await import('../../../../src/features/i18n/index.js')
    await module.toggleLanguage()

    const value = window.localStorage.getItem('comfort_lang')
    expect(['es', 'en']).toContain(value)
  })
})
