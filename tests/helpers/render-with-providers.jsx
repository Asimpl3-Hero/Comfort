import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'

import { rootReducer } from '../../src/app/store/rootReducer.js'

export function createTestStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export function renderWithProviders(ui, { preloadedState, store = createTestStore(preloadedState) } = {}) {
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}
