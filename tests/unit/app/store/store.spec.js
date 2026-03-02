import { describe, expect, it, vi } from 'vitest'

describe('store module', () => {
  it('loads preloaded cart state and persists updates', async () => {
    vi.resetModules()

    const loadCartState = vi.fn(() => ({ itemsByProductId: { 'p-1': 1 } }))
    const saveCartState = vi.fn()

    vi.doMock('../../../../src/app/store/cartStorage.js', () => ({
      loadCartState,
      saveCartState,
    }))

    const { store } = await import('../../../../src/app/store/index.js')
    const { addItemToCart } = await import('../../../../src/features/shop/cart/state/index.js')

    expect(store.getState().cart.itemsByProductId['p-1']).toBe(1)
    store.dispatch(addItemToCart({ productId: 'p-1' }))
    expect(saveCartState).toHaveBeenCalled()
  })
})
