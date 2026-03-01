import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { createOrder, getOrderById } from '../../../../shared/api/ordersApi.js'
import { decrementItemFromCart } from '../../cart/state/index.js'
import { fetchProducts } from '../../products/state/index.js'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const initialState = {
  isCartOpen: false,
  isCheckoutOpen: false,
  selectedProductId: null,
  isSubmittingOrder: false,
  submitError: '',
  submitPhase: '',
  isLongPending: false,
  transactionMessage: '',
}

export const proceedToCheckoutFromCart = createAsyncThunk(
  'checkout/proceedToCheckoutFromCart',
  async (_, { getState, rejectWithValue }) => {
    const state = getState()
    const cartEntries = Object.entries(state.cart.itemsByProductId)
    if (cartEntries.length === 0) {
      return rejectWithValue('Your cart is empty.')
    }

    const [firstProductId] = cartEntries[0]
    return { productId: firstProductId }
  },
)

export const submitOrder = createAsyncThunk(
  'checkout/submitOrder',
  async (checkoutData, { dispatch, getState, rejectWithValue, signal }) => {
    const state = getState()
    const productId = state.checkout.selectedProductId

    if (!productId) {
      return rejectWithValue('No product selected.')
    }

    const product = state.products.items.find((item) => item.id === productId)
    if (!product) {
      return rejectWithValue('Selected product is not available.')
    }

    try {
      dispatch(setSubmitPhase('creating-order'))
      dispatch(setPendingProlonged(false))

      const createdOrder = await createOrder(
        {
          productId,
          paymentMethodType: checkoutData?.paymentMethodType ?? 'CARD',
          paymentMethodData: checkoutData?.paymentMethodData,
        },
        { signal },
      )

      dispatch(setSubmitPhase('opening-checkout'))
      if (createdOrder?.checkoutUrl && typeof window !== 'undefined') {
        window.open(createdOrder.checkoutUrl, '_blank', 'noopener,noreferrer')
      }

      dispatch(setSubmitPhase('confirming-payment'))

      const startedAt = Date.now()
      let longPendingNotified = false
      let finalOrder = null

      while (Date.now() - startedAt < 60_000) {
        const order = await getOrderById(createdOrder.orderId, { signal })
        if (order?.status === 'APPROVED' || order?.status === 'DECLINED') {
          finalOrder = order
          break
        }

        if (!longPendingNotified && Date.now() - startedAt >= 20_000) {
          longPendingNotified = true
          dispatch(setPendingProlonged(true))
        }

        await sleep(5000)
      }

      if (!finalOrder) {
        dispatch(
          setTransactionMessage(
            `Order ${createdOrder.orderId} is still pending. Check status in a moment.`,
          ),
        )
      } else if (finalOrder.status === 'APPROVED') {
        dispatch(setTransactionMessage(`Payment approved. Order ${createdOrder.orderId} confirmed.`))
        dispatch(decrementItemFromCart({ productId }))
      } else {
        dispatch(setTransactionMessage(`Payment declined for order ${createdOrder.orderId}.`))
      }

      await dispatch(fetchProducts())
      return { orderId: createdOrder.orderId, status: finalOrder?.status ?? 'PENDING' }
    } catch (error) {
      return rejectWithValue(error.message ?? 'Could not create the order.')
    }
  },
)

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    openCartModal(state) {
      state.isCartOpen = true
    },
    closeCartModal(state) {
      state.isCartOpen = false
    },
    closeCheckoutModal(state) {
      state.isCheckoutOpen = false
      state.selectedProductId = null
      state.submitError = ''
      state.submitPhase = ''
      state.isLongPending = false
    },
    setTransactionMessage(state, action) {
      state.transactionMessage = action.payload ?? ''
    },
    dismissTransactionMessage(state) {
      state.transactionMessage = ''
    },
    setSubmitPhase(state, action) {
      state.submitPhase = action.payload ?? ''
    },
    setPendingProlonged(state, action) {
      state.isLongPending = Boolean(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(proceedToCheckoutFromCart.fulfilled, (state, action) => {
        state.selectedProductId = action.payload.productId
        state.isCheckoutOpen = true
        state.isCartOpen = false
        state.submitError = ''
        state.submitPhase = ''
        state.isLongPending = false
      })
      .addCase(submitOrder.pending, (state) => {
        state.isSubmittingOrder = true
        state.submitError = ''
        state.submitPhase = ''
        state.isLongPending = false
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.isSubmittingOrder = false
        state.submitPhase = ''
        state.isLongPending = false
        state.isCheckoutOpen = false
        state.selectedProductId = null
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isSubmittingOrder = false
        state.submitPhase = ''
        state.isLongPending = false
        state.submitError = action.payload ?? 'Could not create the order.'
      })
  },
})

export const {
  openCartModal,
  closeCartModal,
  closeCheckoutModal,
  setTransactionMessage,
  dismissTransactionMessage,
  setSubmitPhase,
  setPendingProlonged,
} = checkoutSlice.actions

export default checkoutSlice.reducer
