import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../../../src/shared/api/ordersApi.js', () => ({
  createOrder: vi.fn(),
  getOrderById: vi.fn(),
}))

vi.mock('../../../../../src/shared/api/wompiApi.js', () => ({
  createWompiCardToken: vi.fn(),
}))

vi.mock('../../../../../src/features/i18n/index.js', () => ({
  default: {
    t: vi.fn((key, options) => (options?.orderId ? `${key}:${options.orderId}` : key)),
  },
}))

vi.mock('../../../../../src/features/shop/products/state/index.js', () => ({
  fetchProducts: vi.fn(() => ({ type: 'products/fetchProducts/mock' })),
}))

vi.mock('../../../../../src/features/shop/cart/state/index.js', async () => {
  const actual = await vi.importActual('../../../../../src/features/shop/cart/state/index.js')
  return {
    ...actual,
    decrementItemFromCart: vi.fn((payload) => ({ type: 'cart/decrementItemFromCart', payload })),
  }
})

import { createOrder, getOrderById } from '../../../../../src/shared/api/ordersApi.js'
import { createWompiCardToken } from '../../../../../src/shared/api/wompiApi.js'
import { decrementItemFromCart } from '../../../../../src/features/shop/cart/state/index.js'
import checkoutReducer, {
  closeCartModal,
  closeCheckoutModal,
  dismissTransactionMessage,
  dismissTransactionResult,
  openCartModal,
  proceedToCheckoutFromCart,
  setPendingProlonged,
  setSubmitPhase,
  setTransactionResult,
  setTransactionMessage,
  submitOrder,
} from '../../../../../src/features/shop/checkout/state/checkout.slice.js'
import cartReducer from '../../../../../src/features/shop/cart/state/cart.slice.js'
import productsReducer from '../../../../../src/features/shop/products/state/products.slice.js'

describe('checkoutSlice', () => {
  const cardPaymentData = {
    cardNumber: '4111111111111111',
    cardCvc: '123',
    cardExpMonth: '12',
    cardExpYear: '30',
    cardHolder: 'Jane Doe',
  }
  const shippingData = {
    email: 'buyer@example.com',
  }

  const baseCheckoutState = {
    isCartOpen: false,
    isCheckoutOpen: true,
    selectedProductId: 'p-1',
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

  const baseProductsState = {
    items: [{ id: 'p-1', name: 'Yoga', priceInCents: 1000, stock: 5, currency: 'COP' }],
    favoriteIds: [],
    status: 'idle',
    error: null,
  }

  function makeStore(preloadedState = {}) {
    return configureStore({
      reducer: { checkout: checkoutReducer, cart: cartReducer, products: productsReducer },
      preloadedState: {
        checkout: baseCheckoutState,
        cart: { itemsByProductId: { 'p-1': 2 } },
        products: baseProductsState,
        ...preloadedState,
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    createWompiCardToken.mockResolvedValue('tok_test_123')
  })

  it('handles modal and message reducers', () => {
    let state = checkoutReducer(undefined, openCartModal())
    expect(state.isCartOpen).toBe(true)

    state = checkoutReducer(state, closeCartModal())
    expect(state.isCartOpen).toBe(false)

    state = checkoutReducer(state, setTransactionMessage('hello'))
    expect(state.transactionMessage).toBe('hello')

    state = checkoutReducer(state, dismissTransactionMessage())
    expect(state.transactionMessage).toBe('')

    state = checkoutReducer(
      state,
      setTransactionResult({
        status: 'APPROVED',
        orderId: 'o-1',
        transactionId: 'tx-1',
      }),
    )
    expect(state.transactionResult).toEqual({
      isOpen: true,
      status: 'APPROVED',
      orderId: 'o-1',
      transactionId: 'tx-1',
    })

    state = checkoutReducer(state, dismissTransactionResult())
    expect(state.transactionResult).toEqual({
      isOpen: false,
      status: null,
      orderId: '',
      transactionId: '',
    })

    state = checkoutReducer(state, setSubmitPhase('creating-order'))
    expect(state.submitPhase).toBe('creating-order')

    state = checkoutReducer(state, setPendingProlonged(true))
    expect(state.isLongPending).toBe(true)

    state = checkoutReducer(
      { ...state, isCheckoutOpen: true, selectedProductId: 'p-1', submitError: 'x' },
      closeCheckoutModal(),
    )
    expect(state.isCheckoutOpen).toBe(false)
    expect(state.selectedProductId).toBeNull()
    expect(state.submitError).toBe('')
  })

  it('proceedToCheckoutFromCart rejects when cart is empty', async () => {
    const store = configureStore({
      reducer: { checkout: checkoutReducer, cart: cartReducer, products: productsReducer },
    })
    const action = await store.dispatch(proceedToCheckoutFromCart())
    expect(action.type).toBe('checkout/proceedToCheckoutFromCart/rejected')
  })

  it('proceedToCheckoutFromCart opens checkout with first cart item', async () => {
    const store = configureStore({
      reducer: { checkout: checkoutReducer, cart: cartReducer, products: productsReducer },
      preloadedState: {
        cart: { itemsByProductId: { 'p-2': 1 } },
      },
    })

    await store.dispatch(proceedToCheckoutFromCart())
    const state = store.getState().checkout
    expect(state.isCheckoutOpen).toBe(true)
    expect(state.selectedProductId).toBe('p-2')
    expect(state.isCartOpen).toBe(false)
  })

  it('submitOrder rejects when no product is selected', async () => {
    const store = makeStore({
      checkout: { ...baseCheckoutState, selectedProductId: null },
    })

    const action = await store.dispatch(submitOrder({ paymentMethodType: 'CARD' }))
    const state = store.getState().checkout

    expect(action.type).toBe('checkout/submitOrder/rejected')
    expect(state.submitError).toBe('checkout.async.noProductSelected')
  })

  it('submitOrder rejects when product is unavailable', async () => {
    const store = makeStore({
      checkout: { ...baseCheckoutState, selectedProductId: 'p-missing' },
    })

    const action = await store.dispatch(submitOrder({ paymentMethodType: 'CARD' }))
    const state = store.getState().checkout

    expect(action.type).toBe('checkout/submitOrder/rejected')
    expect(state.submitError).toBe('checkout.async.productUnavailable')
  })

  it('submitOrder approves, opens checkout URL and closes modal', async () => {
    createOrder.mockResolvedValue({ orderId: 'o-1', checkoutUrl: 'https://wompi.test/checkout' })
    getOrderById.mockResolvedValue({
      id: 'o-1',
      status: 'APPROVED',
      wompi_transaction_id: 'tx-1',
    })
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const store = makeStore()

    await store.dispatch(
      submitOrder({
        shipping: shippingData,
        paymentMethodType: 'CARD',
        paymentMethodData: cardPaymentData,
      }),
    )
    const state = store.getState().checkout
    expect(state.isSubmittingOrder).toBe(false)
    expect(state.isCheckoutOpen).toBe(false)
    expect(state.selectedProductId).toBeNull()
    expect(state.transactionResult).toEqual({
      isOpen: true,
      status: 'APPROVED',
      orderId: 'o-1',
      transactionId: 'tx-1',
    })
    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(createWompiCardToken).toHaveBeenCalledTimes(1)
    expect(createOrder).toHaveBeenCalledWith(
      {
        productId: 'p-1',
        quantity: 2,
        customerEmail: 'buyer@example.com',
        shippingData: {
          email: 'buyer@example.com',
        },
        paymentMethodType: 'CARD',
        paymentMethodData: { cardToken: 'tok_test_123' },
      },
      { signal: expect.anything() },
    )
    expect(decrementItemFromCart).toHaveBeenCalledWith({ productId: 'p-1', units: 2 })
    openSpy.mockRestore()
  })

  it('submitOrder handles declined transactions', async () => {
    createOrder.mockResolvedValue({ orderId: 'o-2', checkoutUrl: null })
    getOrderById.mockResolvedValue({
      id: 'o-2',
      status: 'DECLINED',
      wompi_transaction_id: 'tx-2',
    })
    const store = makeStore()

    const action = await store.dispatch(
      submitOrder({ shipping: shippingData, paymentMethodType: 'PSE' }),
    )
    const state = store.getState().checkout

    expect(action.type).toBe('checkout/submitOrder/fulfilled')
    expect(action.payload.status).toBe('DECLINED')
    expect(state.transactionResult).toEqual({
      isOpen: true,
      status: 'DECLINED',
      orderId: 'o-2',
      transactionId: 'tx-2',
    })
    expect(createWompiCardToken).not.toHaveBeenCalled()
    expect(decrementItemFromCart).not.toHaveBeenCalled()
  })

  it('submitOrder handles prolonged pending and timeout fallback', async () => {
    vi.useFakeTimers()
    createOrder.mockResolvedValue({ orderId: 'o-3', checkoutUrl: null })
    getOrderById.mockResolvedValue({ id: 'o-3', status: 'PENDING' })
    const store = makeStore()

    const dispatchPromise = store.dispatch(
      submitOrder({
        shipping: shippingData,
        paymentMethodType: 'CARD',
        paymentMethodData: cardPaymentData,
      }),
    )
    await vi.advanceTimersByTimeAsync(25_000)
    expect(store.getState().checkout.isLongPending).toBe(true)

    await vi.advanceTimersByTimeAsync(40_000)
    const action = await dispatchPromise
    const state = store.getState().checkout

    expect(action.type).toBe('checkout/submitOrder/fulfilled')
    expect(action.payload.status).toBe('PENDING')
    expect(state.transactionMessage).toContain('checkout.async.orderStillPending')
    expect(state.isCheckoutOpen).toBe(false)
  })

  it('submitOrder uses fallback error message when API throws non-Error', async () => {
    createOrder.mockRejectedValue({})
    const store = makeStore()

    const action = await store.dispatch(
      submitOrder({
        shipping: shippingData,
        paymentMethodType: 'CARD',
        paymentMethodData: cardPaymentData,
      }),
    )
    const state = store.getState().checkout

    expect(action.type).toBe('checkout/submitOrder/rejected')
    expect(state.submitError).toBe('checkout.async.couldNotCreateOrder')
  })

  it('submitOrder rejects when card tokenization fails', async () => {
    createWompiCardToken.mockRejectedValue(new Error('Tokenization failed'))
    const store = makeStore()

    const action = await store.dispatch(
      submitOrder({
        shipping: shippingData,
        paymentMethodType: 'CARD',
        paymentMethodData: cardPaymentData,
      }),
    )
    const state = store.getState().checkout

    expect(action.type).toBe('checkout/submitOrder/rejected')
    expect(state.submitError).toBe('Tokenization failed')
    expect(createOrder).not.toHaveBeenCalled()
  })
})
