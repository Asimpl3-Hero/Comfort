import { describe, expect, it } from 'vitest'

import reducer, {
  addItemToCart,
  clearCart,
  decrementItemFromCart,
  removeItemFromCart,
} from '../../../../../src/features/shop/cart/state/cart.slice.js'

describe('cartSlice', () => {
  it('adds item to cart', () => {
    const state = reducer(undefined, addItemToCart({ productId: 'p-1' }))
    expect(state.itemsByProductId['p-1']).toBe(1)
  })

  it('increments item quantity', () => {
    const initial = { itemsByProductId: { 'p-1': 1 } }
    const state = reducer(initial, addItemToCart({ productId: 'p-1' }))
    expect(state.itemsByProductId['p-1']).toBe(2)
  })

  it('decrements item and removes when quantity reaches 0', () => {
    const state = reducer({ itemsByProductId: { 'p-1': 1 } }, decrementItemFromCart({ productId: 'p-1' }))
    expect(state.itemsByProductId['p-1']).toBeUndefined()
  })

  it('decrements multiple units when units payload is provided', () => {
    const state = reducer(
      { itemsByProductId: { 'p-1': 5 } },
      decrementItemFromCart({ productId: 'p-1', units: 3 }),
    )
    expect(state.itemsByProductId['p-1']).toBe(2)
  })

  it('removes specific item', () => {
    const state = reducer({ itemsByProductId: { 'p-1': 3, 'p-2': 1 } }, removeItemFromCart({ productId: 'p-1' }))
    expect(state.itemsByProductId).toEqual({ 'p-2': 1 })
  })

  it('clears all items', () => {
    const state = reducer({ itemsByProductId: { 'p-1': 3 } }, clearCart())
    expect(state.itemsByProductId).toEqual({})
  })
})
