const CART_STORAGE_KEY = 'comfort_cart_v1'

export function loadCartState() {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return undefined
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return undefined
    }

    const itemsByProductId = parsed.itemsByProductId
    if (!itemsByProductId || typeof itemsByProductId !== 'object') {
      return undefined
    }

    return { itemsByProductId }
  } catch {
    return undefined
  }
}

export function saveCartState(cartState) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState))
  } catch {
    // Ignore storage errors (quota, privacy mode, etc.)
  }
}
