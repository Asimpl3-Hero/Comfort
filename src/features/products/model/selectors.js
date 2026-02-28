export const selectProducts = (state) => state.products.items
export const selectProductsError = (state) => state.products.error
export const selectProductsStatus = (state) => state.products.status

export const selectIsProductFavorite = (productId) => (state) =>
  state.products.favoriteIds.includes(productId)
