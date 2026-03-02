import { describe, expect, it } from 'vitest'

import { ThemeModeSync } from '../../../../src/features/theme/containers/ThemeModeSync.jsx'
import { renderWithProviders } from '../../../helpers/render-with-providers.jsx'

describe('ThemeModeSync', () => {
  it('adds dark class when theme mode is dark', () => {
    renderWithProviders(<ThemeModeSync />, {
      preloadedState: {
        theme: { mode: 'dark' },
        cart: { itemsByProductId: {} },
        checkout: {
          isCartOpen: false,
          isCheckoutOpen: false,
          selectedProductId: null,
          isSubmittingOrder: false,
          submitError: '',
          submitPhase: '',
          isLongPending: false,
          transactionMessage: '',
        },
        products: { items: [], favoriteIds: [], status: 'idle', error: null },
      },
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
