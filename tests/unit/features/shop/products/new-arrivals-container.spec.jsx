import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const dispatchMock = vi.fn()
const selectorState = {
  products: [{ id: 'p-1' }],
  favoriteIds: [],
  status: 'idle',
  error: null,
}

vi.mock('../../../../../src/app/hooks/index.js', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector) =>
    selector({
      products: {
        items: selectorState.products,
        favoriteIds: selectorState.favoriteIds,
        status: selectorState.status,
        error: selectorState.error,
      },
    }),
}))

vi.mock('../../../../../src/features/components/ui/NewArrivalsSection.jsx', () => ({
  NewArrivalsSection: () => <div>NewArrivalsSectionMock</div>,
}))

vi.mock('../../../../../src/features/shop/products/state/index.js', () => ({
  fetchProducts: vi.fn(() => ({ type: 'products/fetchProducts' })),
  selectFavoriteIds: (state) => state.products.favoriteIds,
  selectProducts: (state) => state.products.items,
  selectProductsError: (state) => state.products.error,
  selectProductsStatus: (state) => state.products.status,
  toggleFavorite: vi.fn((id) => ({ type: 'products/toggleFavorite', payload: id })),
}))

import { NewArrivalsSectionContainer } from '../../../../../src/features/shop/products/containers/NewArrivalsSectionContainer.jsx'

describe('NewArrivalsSectionContainer', () => {
  beforeEach(() => {
    dispatchMock.mockClear()
  })

  it('dispatches fetchProducts on idle state', () => {
    selectorState.status = 'idle'
    render(<NewArrivalsSectionContainer />)
    expect(dispatchMock).toHaveBeenCalled()
  })
})
