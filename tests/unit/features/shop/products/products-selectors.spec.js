import { describe, expect, it } from 'vitest'

import {
  selectFavoriteIds,
  selectIsProductFavorite,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '../../../../../src/features/shop/products/state/products.selectors.js'

describe('products selectors', () => {
  const state = {
    products: {
      items: [{ id: 'p-1' }],
      error: 'err',
      status: 'loading',
      favoriteIds: ['p-1'],
    },
  }

  it('selects products state slices', () => {
    expect(selectProducts(state)).toEqual([{ id: 'p-1' }])
    expect(selectProductsError(state)).toBe('err')
    expect(selectProductsStatus(state)).toBe('loading')
    expect(selectFavoriteIds(state)).toEqual(['p-1'])
  })

  it('checks product favorite by id', () => {
    expect(selectIsProductFavorite('p-1')(state)).toBe(true)
    expect(selectIsProductFavorite('p-2')(state)).toBe(false)
  })
})
