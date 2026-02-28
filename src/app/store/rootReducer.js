import { combineReducers } from '@reduxjs/toolkit'
import themeReducer from '../../features/theme/model/themeSlice.js'

export const rootReducer = combineReducers({
  theme: themeReducer,
})
