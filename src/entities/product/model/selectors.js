export const selectProducts = (state) => state.products.items

export const selectIsProductFavorite = (productId) => (state) =>
  state.products.favoriteIds.includes(productId)
