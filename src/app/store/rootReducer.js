import { combineReducers } from '@reduxjs/toolkit'

import productsReducer from '../../features/products/model/productsSlice.js'
import themeReducer from '../../features/theme/model/themeSlice.js'

export const rootReducer = combineReducers({
  products: productsReducer,
  theme: themeReducer,
})
