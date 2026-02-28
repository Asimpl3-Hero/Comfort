import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getProducts } from '../../../shared/api/productsApi.js'

const initialState = {
  items: [],
  favoriteIds: [],
  status: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getProducts({ signal })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleFavorite(state, action) {
      const productId = action.payload
      const index = state.favoriteIds.indexOf(productId)

      if (index >= 0) {
        state.favoriteIds.splice(index, 1)
        return
      }

      state.favoriteIds.push(productId)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Could not load products'
      })
  },
})

export const { toggleFavorite } = productsSlice.actions
export default productsSlice.reducer
