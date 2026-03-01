import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

import { i18nMock, tMock } from '../helpers/i18n.mock.js'

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: tMock,
    i18n: i18nMock,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}))
