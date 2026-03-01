export const selectCartItemsByProductId = (state) => state.cart.itemsByProductId

export const selectCartTotalQuantity = (state) =>
  Object.values(state.cart.itemsByProductId).reduce(
    (acc, quantity) => acc + Number(quantity),
    0,
  )

export const selectCartProducts = (state) => {
  const products = state.products.items
  const itemsMap = state.cart.itemsByProductId
  const productById = new Map(products.map((item) => [item.id, item]))

  return Object.entries(itemsMap)
    .map(([productId, quantity]) => {
      const product = productById.get(productId)
      if (!product) {
        return null
      }

      return {
        productId,
        quantity: Number(quantity),
        product,
        totalInCents: Number(quantity) * Number(product.priceInCents ?? 0),
      }
    })
    .filter(Boolean)
}

export const selectCartTotalInCents = (state) =>
  selectCartProducts(state).reduce((acc, item) => acc + item.totalInCents, 0)
