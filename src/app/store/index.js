import { configureStore } from '@reduxjs/toolkit'

import { loadCartState, saveCartState } from './cartStorage.js'
import { rootReducer } from './rootReducer.js'

const preloadedCartState = loadCartState()

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedCartState ? { cart: preloadedCartState } : undefined,
})

let lastSavedCartState

store.subscribe(() => {
  const cartState = store.getState().cart
  const serialized = JSON.stringify(cartState)
  if (serialized === lastSavedCartState) {
    return
  }

  lastSavedCartState = serialized
  saveCartState(cartState)
})
