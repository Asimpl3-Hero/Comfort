import { combineReducers } from '@reduxjs/toolkit'

import { cartReducer } from '../../features/shop/cart/state/index.js'
import { checkoutReducer } from '../../features/shop/checkout/state/index.js'
import { productsReducer } from '../../features/shop/products/state/index.js'
import { themeReducer } from '../../features/theme/state/index.js'

export const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
  products: productsReducer,
  theme: themeReducer,
})
