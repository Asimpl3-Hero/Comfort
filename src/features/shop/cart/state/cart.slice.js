import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  itemsByProductId: {},
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const productId = action.payload.productId
      const currentQty = state.itemsByProductId[productId] ?? 0
      state.itemsByProductId[productId] = currentQty + 1
    },
    decrementItemFromCart(state, action) {
      const productId = action.payload.productId
      const units = Math.max(1, Math.floor(Number(action.payload.units ?? 1)))
      const currentQty = state.itemsByProductId[productId] ?? 0
      if (currentQty <= units) {
        delete state.itemsByProductId[productId]
        return
      }

      state.itemsByProductId[productId] = currentQty - units
    },
    removeItemFromCart(state, action) {
      const productId = action.payload.productId
      delete state.itemsByProductId[productId]
    },
    clearCart(state) {
      state.itemsByProductId = {}
    },
  },
})

export const {
  addItemToCart,
  decrementItemFromCart,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer
