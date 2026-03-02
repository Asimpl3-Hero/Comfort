import { describe, expect, it } from 'vitest'

import {
  selectCheckoutState,
  selectIsCartOpen,
  selectIsCheckoutOpen,
  selectIsLongPending,
  selectIsSubmittingOrder,
  selectSelectedProductId,
  selectSubmitError,
  selectSubmitPhase,
  selectTransactionMessage,
} from '../../../../../src/features/shop/checkout/state/checkout.selectors.js'

describe('checkout selectors', () => {
  const state = {
    checkout: {
      isCartOpen: true,
      isCheckoutOpen: false,
      selectedProductId: 'p-1',
      isSubmittingOrder: true,
      submitError: 'err',
      submitPhase: 'creating-order',
      isLongPending: true,
      transactionMessage: 'ok',
    },
  }

  it('returns checkout slices', () => {
    expect(selectCheckoutState(state)).toEqual(state.checkout)
    expect(selectIsCartOpen(state)).toBe(true)
    expect(selectIsCheckoutOpen(state)).toBe(false)
    expect(selectSelectedProductId(state)).toBe('p-1')
    expect(selectIsSubmittingOrder(state)).toBe(true)
    expect(selectSubmitError(state)).toBe('err')
    expect(selectSubmitPhase(state)).toBe('creating-order')
    expect(selectIsLongPending(state)).toBe(true)
    expect(selectTransactionMessage(state)).toBe('ok')
  })
})
