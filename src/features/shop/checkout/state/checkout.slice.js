import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { createOrder, getOrderById } from '../../../../shared/api/ordersApi.js'
import { createWompiCardToken } from '../../../../shared/api/wompiApi.js'
import i18n from '../../../i18n/index.js'
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
  transactionResult: {
    isOpen: false,
    status: null,
    orderId: '',
    transactionId: '',
  },
}

export const proceedToCheckoutFromCart = createAsyncThunk(
  'checkout/proceedToCheckoutFromCart',
  async (_, { getState, rejectWithValue }) => {
    const state = getState()
    const cartEntries = Object.entries(state.cart.itemsByProductId)
    if (cartEntries.length === 0) {
      return rejectWithValue(i18n.t('checkout.async.emptyCart'))
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
      return rejectWithValue(i18n.t('checkout.async.noProductSelected'))
    }

    const product = state.products.items.find((item) => item.id === productId)
    if (!product) {
      return rejectWithValue(i18n.t('checkout.async.productUnavailable'))
    }

    try {
      dispatch(setSubmitPhase('creating-order'))
      dispatch(setPendingProlonged(false))

      const paymentMethodType = checkoutData?.paymentMethodType ?? 'CARD'
      let paymentMethodData = checkoutData?.paymentMethodData
      const shippingData = checkoutData?.shipping
      const customerEmail = shippingData?.email?.trim()

      if (paymentMethodType === 'CARD') {
        const cardToken = await createWompiCardToken(paymentMethodData, { signal })
        paymentMethodData = { cardToken }
      }

      const createdOrder = await createOrder(
        {
          productId,
          customerEmail,
          shippingData,
          paymentMethodType,
          paymentMethodData,
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
            i18n.t('checkout.async.orderStillPending', {
              orderId: createdOrder.orderId,
            }),
          ),
        )
      } else if (finalOrder.status === 'APPROVED') {
        dispatch(
          setTransactionResult({
            status: 'APPROVED',
            orderId: createdOrder.orderId,
            transactionId:
              finalOrder.wompi_transaction_id ?? finalOrder.wompiTransactionId ?? '',
          }),
        )
        dispatch(decrementItemFromCart({ productId }))
      } else {
        dispatch(
          setTransactionResult({
            status: 'DECLINED',
            orderId: createdOrder.orderId,
            transactionId:
              finalOrder.wompi_transaction_id ?? finalOrder.wompiTransactionId ?? '',
          }),
        )
      }

      await dispatch(fetchProducts())
      return { orderId: createdOrder.orderId, status: finalOrder?.status ?? 'PENDING' }
    } catch (error) {
      return rejectWithValue(error.message ?? i18n.t('checkout.async.couldNotCreateOrder'))
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
    setTransactionResult(state, action) {
      state.transactionResult = {
        isOpen: true,
        status: action.payload?.status ?? null,
        orderId: action.payload?.orderId ?? '',
        transactionId: action.payload?.transactionId ?? '',
      }
    },
    dismissTransactionResult(state) {
      state.transactionResult = {
        isOpen: false,
        status: null,
        orderId: '',
        transactionId: '',
      }
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
        state.transactionResult = {
          isOpen: false,
          status: null,
          orderId: '',
          transactionId: '',
        }
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
        state.submitError = action.payload ?? i18n.t('checkout.async.couldNotCreateOrder')
      })
  },
})

export const {
  openCartModal,
  closeCartModal,
  closeCheckoutModal,
  setTransactionMessage,
  dismissTransactionMessage,
  setTransactionResult,
  dismissTransactionResult,
  setSubmitPhase,
  setPendingProlonged,
} = checkoutSlice.actions

export default checkoutSlice.reducer
