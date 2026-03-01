import { vi } from 'vitest'

export const i18nMock = {
  resolvedLanguage: 'es',
  changeLanguage: vi.fn(),
}

export const tMock = (key, options) => {
  if (!options || typeof options !== 'object') {
    return key
  }

  return `${key} ${JSON.stringify(options)}`
}

export function resetI18nMock() {
  i18nMock.resolvedLanguage = 'es'
  i18nMock.changeLanguage.mockReset()
}
