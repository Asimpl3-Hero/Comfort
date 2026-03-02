import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../../../src/shared/api/productsApi.js', () => ({
  getProducts: vi.fn(),
}))

vi.mock('../../../../../src/features/i18n/index.js', () => ({
  default: {
    t: vi.fn((key) => key),
  },
}))

import { getProducts } from '../../../../../src/shared/api/productsApi.js'
import reducer, {
  fetchProducts,
  toggleFavorite,
} from '../../../../../src/features/shop/products/state/products.slice.js'

describe('productsSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('toggles favorites', () => {
    const first = reducer(undefined, toggleFavorite('p-1'))
    expect(first.favoriteIds).toEqual(['p-1'])
    const second = reducer(first, toggleFavorite('p-1'))
    expect(second.favoriteIds).toEqual([])
  })

  it('handles fetchProducts fulfilled', async () => {
    getProducts.mockResolvedValue([{ id: 'p-1', name: 'Yoga' }])
    const store = configureStore({ reducer: { products: reducer } })

    await store.dispatch(fetchProducts())
    const state = store.getState().products
    expect(state.status).toBe('succeeded')
    expect(state.items).toEqual([{ id: 'p-1', name: 'Yoga' }])
  })

  it('handles fetchProducts rejected', async () => {
    getProducts.mockRejectedValue(new Error('boom'))
    const store = configureStore({ reducer: { products: reducer } })

    await store.dispatch(fetchProducts())
    const state = store.getState().products
    expect(state.status).toBe('failed')
    expect(state.error).toBe('boom')
  })
})
