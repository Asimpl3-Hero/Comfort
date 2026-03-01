import { describe, expect, it } from 'vitest'

import {
  selectCartItemsByProductId,
  selectCartProducts,
  selectCartTotalInCents,
  selectCartTotalQuantity,
} from '../../../../../src/features/shop/cart/state/cart.selectors.js'

describe('cart selectors', () => {
  const state = {
    cart: {
      itemsByProductId: {
        'p-1': 2,
        'p-2': 1,
        'missing': 3,
      },
    },
    products: {
      items: [
        { id: 'p-1', priceInCents: 1000, name: 'A' },
        { id: 'p-2', priceInCents: 2500, name: 'B' },
      ],
    },
  }

  it('returns items map', () => {
    expect(selectCartItemsByProductId(state)).toEqual(state.cart.itemsByProductId)
  })

  it('computes total quantity', () => {
    expect(selectCartTotalQuantity(state)).toBe(6)
  })

  it('returns resolved cart products filtering unknown products', () => {
    const result = selectCartProducts(state)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(
      expect.objectContaining({
        productId: 'p-1',
        quantity: 2,
        totalInCents: 2000,
      }),
    )
  })

  it('computes total amount', () => {
    expect(selectCartTotalInCents(state)).toBe(4500)
  })
})
