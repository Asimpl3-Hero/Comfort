import { combineReducers } from '@reduxjs/toolkit'
import productsReducer from '../../entities/product/model/productsSlice.js'
import themeReducer from '../../features/theme/model/themeSlice.js'

export const rootReducer = combineReducers({
  products: productsReducer,
  theme: themeReducer,
})
