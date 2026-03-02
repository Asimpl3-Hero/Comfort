import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const dispatchMock = vi.fn()
const mockState = {
  products: {
    items: [
      {
        id: 'p-1',
        name: 'Yoga Mat Pro',
        description: 'Desc',
        priceInCents: 1200,
        stock: 2,
        currency: 'COP',
      },
    ],
    favoriteIds: [],
    status: 'succeeded',
    error: null,
  },
  cart: {
    itemsByProductId: {},
  },
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
  theme: {
    mode: 'light',
  },
}

vi.mock('../../../../src/app/hooks/index.js', async () => {
  const actual = await vi.importActual('../../../../src/app/hooks/index.js')
  return {
    ...actual,
    useAppDispatch: () => dispatchMock,
    useAppSelector: (selector) => selector(mockState),
  }
})

vi.mock('../../../../src/features/components/ux/AppLayout.jsx', () => ({
  AppLayout: ({ children }) => <div>{children}</div>,
}))
vi.mock('../../../../src/features/components/ui/HeroSection.jsx', () => ({
  HeroSection: () => <div>HeroSection</div>,
}))
vi.mock('../../../../src/features/components/ui/FeaturesSection.jsx', () => ({
  FeaturesSection: () => <div>FeaturesSection</div>,
}))
vi.mock('../../../../src/features/components/ui/NewsletterSection.jsx', () => ({
  NewsletterSection: () => <div>NewsletterSection</div>,
}))
vi.mock('../../../../src/features/components/ui/ProductDetailsModal.jsx', () => ({
  ProductDetailsModal: () => <div>ProductDetailsModal</div>,
}))
vi.mock('../../../../src/features/components/ui/CartStatusModal.jsx', () => ({
  CartStatusModal: () => <div>CartStatusModal</div>,
}))
vi.mock('../../../../src/features/components/ui/CheckoutStepperModal.jsx', () => ({
  CheckoutStepperModal: () => <div>CheckoutStepperModal</div>,
}))
vi.mock('../../../../src/features/shop/products/containers/NewArrivalsSectionContainer.jsx', () => ({
  NewArrivalsSectionContainer: ({ onAddToCart }) => (
    <button type="button" onClick={() => onAddToCart?.(mockState.products.items[0])}>
      AddMock
    </button>
  ),
}))

vi.mock('../../../../src/features/shop/cart/state/index.js', async () => {
  const actual = await vi.importActual('../../../../src/features/shop/cart/state/index.js')
  return {
    ...actual,
    addItemToCart: vi.fn((payload) => ({ type: 'cart/add', payload })),
    clearCart: vi.fn(() => ({ type: 'cart/clear' })),
  }
})

vi.mock('../../../../src/features/shop/checkout/state/index.js', async () => {
  const actual = await vi.importActual('../../../../src/features/shop/checkout/state/index.js')
  return {
    ...actual,
    dismissTransactionMessage: vi.fn(() => ({ type: 'checkout/dismiss' })),
    openCartModal: vi.fn(() => ({ type: 'checkout/openCart' })),
    setTransactionMessage: vi.fn((payload) => ({ type: 'checkout/message', payload })),
    submitOrder: vi.fn(() => ({ type: 'checkout/submit' })),
  }
})

import { addItemToCart } from '../../../../src/features/shop/cart/state/index.js'
import { HomePage } from '../../../../src/pages/home/HomePage.jsx'

describe('HomePage', () => {
  beforeEach(() => {
    dispatchMock.mockClear()
    mockState.cart.itemsByProductId = {}
    mockState.checkout.transactionMessage = ''
  })

  it('renders main sections', () => {
    render(<HomePage />)
    expect(screen.getByText('HeroSection')).toBeInTheDocument()
    expect(screen.getByText('FeaturesSection')).toBeInTheDocument()
    expect(screen.getByText('NewsletterSection')).toBeInTheDocument()
  })

  it('dispatches addItemToCart when adding an in-stock product', () => {
    render(<HomePage />)
    fireEvent.click(screen.getByRole('button', { name: 'AddMock' }))

    expect(addItemToCart).toHaveBeenCalledWith({ productId: 'p-1' })
    expect(dispatchMock).toHaveBeenCalled()
  })
})
