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
    transactionResult: {
      isOpen: false,
      status: null,
      orderId: '',
      transactionId: '',
    },
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
  ProductDetailsModal: ({ isOpen, product, onClose, onAddToCart }) =>
    isOpen ? (
      <div>
        <button type="button" onClick={() => onAddToCart?.(product)}>
          DetailsAdd
        </button>
        <button type="button" onClick={onClose}>
          DetailsClose
        </button>
      </div>
    ) : null,
}))
vi.mock('../../../../src/features/components/ui/CartStatusModal.jsx', () => ({
  CartStatusModal: ({ isOpen, onClose, onClearCart, onProceedToPayment }) =>
    isOpen ? (
      <div>
        <button type="button" onClick={onClose}>
          CartClose
        </button>
        <button type="button" onClick={onClearCart}>
          CartClear
        </button>
        <button type="button" onClick={onProceedToPayment}>
          CartProceed
        </button>
      </div>
    ) : null,
}))
vi.mock('../../../../src/features/components/ui/CheckoutStepperModal.jsx', () => ({
  CheckoutStepperModal: ({ isOpen, onClose, onPlaceOrder }) =>
    isOpen ? (
      <div>
        <button type="button" onClick={onClose}>
          CheckoutClose
        </button>
        <button type="button" onClick={() => onPlaceOrder?.({ paymentMethodType: 'CARD' })}>
          CheckoutPlace
        </button>
      </div>
    ) : null,
}))
vi.mock('../../../../src/features/components/ui/TransactionResultModal.jsx', () => ({
  TransactionResultModal: ({ isOpen, onClose }) =>
    isOpen ? (
      <div>
        <button type="button" onClick={onClose}>
          TransactionResultClose
        </button>
      </div>
    ) : null,
}))
vi.mock('../../../../src/features/shop/products/containers/NewArrivalsSectionContainer.jsx', () => ({
  NewArrivalsSectionContainer: ({ onAddToCart, onOpenDetails }) => (
    <div>
      <button type="button" onClick={() => onAddToCart?.(mockState.products.items[0])}>
        AddMock
      </button>
      <button type="button" onClick={() => onAddToCart?.({})}>
        AddInvalid
      </button>
      <button type="button" onClick={() => onOpenDetails?.(mockState.products.items[0])}>
        OpenDetails
      </button>
    </div>
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
    closeCartModal: vi.fn(() => ({ type: 'checkout/closeCart' })),
    closeCheckoutModal: vi.fn(() => ({ type: 'checkout/closeCheckout' })),
    dismissTransactionMessage: vi.fn(() => ({ type: 'checkout/dismiss' })),
    dismissTransactionResult: vi.fn(() => ({ type: 'checkout/dismissResult' })),
    openCartModal: vi.fn(() => ({ type: 'checkout/openCart' })),
    proceedToCheckoutFromCart: vi.fn(() => ({ type: 'checkout/proceed' })),
    setTransactionMessage: vi.fn((payload) => ({ type: 'checkout/message', payload })),
    submitOrder: vi.fn((payload) => ({ type: 'checkout/submit', payload })),
  }
})

import { addItemToCart, clearCart } from '../../../../src/features/shop/cart/state/index.js'
import {
  closeCartModal,
  closeCheckoutModal,
  dismissTransactionMessage,
  dismissTransactionResult,
  proceedToCheckoutFromCart,
  setTransactionMessage,
  submitOrder,
} from '../../../../src/features/shop/checkout/state/index.js'
import { HomePage } from '../../../../src/pages/home/HomePage.jsx'

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    dispatchMock.mockClear()
    mockState.cart.itemsByProductId = {}
    mockState.checkout = {
      isCartOpen: false,
      isCheckoutOpen: false,
      selectedProductId: null,
      isSubmittingOrder: false,
      submitError: '',
      submitPhase: '',
      isLongPending: false,
      transactionMessage: '',
      transactionResult: {
        isOpen: false,
        status: null,
        orderId: '',
        transactionId: '',
      },
    }
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
    expect(setTransactionMessage).toHaveBeenCalled()
  })

  it('does not add product without id and blocks when max stock is reached', () => {
    mockState.cart.itemsByProductId = { 'p-1': 2 }
    render(<HomePage />)

    fireEvent.click(screen.getByRole('button', { name: 'AddInvalid' }))
    fireEvent.click(screen.getByRole('button', { name: 'AddMock' }))

    expect(addItemToCart).not.toHaveBeenCalled()
    expect(setTransactionMessage).toHaveBeenCalled()
  })

  it('renders and handles transaction message dismissal', () => {
    mockState.checkout.transactionMessage = 'Payment status message'
    render(<HomePage />)

    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(dismissTransactionMessage).toHaveBeenCalled()
  })

  it('renders cart modal actions when cart is open', () => {
    mockState.checkout.isCartOpen = true
    render(<HomePage />)

    fireEvent.click(screen.getByRole('button', { name: 'CartClear' }))
    fireEvent.click(screen.getByRole('button', { name: 'CartProceed' }))
    fireEvent.click(screen.getByRole('button', { name: 'CartClose' }))

    expect(clearCart).toHaveBeenCalled()
    expect(proceedToCheckoutFromCart).toHaveBeenCalled()
    expect(closeCartModal).toHaveBeenCalled()
  })

  it('submits order from checkout modal and closes only when not submitting', () => {
    mockState.checkout.isCheckoutOpen = true
    render(<HomePage />)

    fireEvent.click(screen.getByRole('button', { name: 'CheckoutPlace' }))
    fireEvent.click(screen.getByRole('button', { name: 'CheckoutClose' }))

    expect(submitOrder).toHaveBeenCalledWith({ paymentMethodType: 'CARD' })
    expect(closeCheckoutModal).toHaveBeenCalled()
  })

  it('prevents closing checkout while submitting', () => {
    mockState.checkout.isCheckoutOpen = true
    mockState.checkout.isSubmittingOrder = true
    render(<HomePage />)

    fireEvent.click(screen.getByRole('button', { name: 'CheckoutClose' }))
    expect(closeCheckoutModal).not.toHaveBeenCalled()
  })

  it('opens details modal and adds product from details action', () => {
    render(<HomePage />)
    fireEvent.click(screen.getByRole('button', { name: 'OpenDetails' }))
    fireEvent.click(screen.getByRole('button', { name: 'DetailsAdd' }))

    expect(addItemToCart).toHaveBeenCalledWith({ productId: 'p-1' })
    expect(setTransactionMessage).toHaveBeenCalled()
  })

  it('renders and closes transaction result modal', () => {
    mockState.checkout.transactionResult = {
      isOpen: true,
      status: 'APPROVED',
      orderId: 'o-1',
      transactionId: 'tx-1',
    }
    render(<HomePage />)

    fireEvent.click(screen.getByRole('button', { name: 'TransactionResultClose' }))
    expect(dismissTransactionResult).toHaveBeenCalled()
  })
})
