import { createSlice } from '@reduxjs/toolkit'

const getInitialMode = () => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialMode(),
  },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
