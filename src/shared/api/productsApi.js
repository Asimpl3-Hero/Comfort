import { mockProducts } from '../config/mockProducts.js'
import { httpGet } from './httpClient.js'

function normalizeProduct(rawProduct) {
  const cents = Number(
    rawProduct.price_in_cents ??
      rawProduct.priceInCents ??
      (rawProduct.price != null ? Number(rawProduct.price) * 100 : 0),
  )

  return {
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description ?? rawProduct.tone ?? '',
    priceInCents: Number.isFinite(cents) ? cents : 0,
    stock: Number(rawProduct.stock ?? 0),
    currency: rawProduct.currency ?? 'COP',
    imageUrl: rawProduct.imageUrl ?? '',
  }
}

export async function getProducts({ signal } = {}) {
  const shouldUseMocks = import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL
  if (shouldUseMocks) {
    return mockProducts.map(normalizeProduct)
  }

  const payload = await httpGet('/products', { signal })
  const list = Array.isArray(payload) ? payload : payload?.items ?? []
  return list.map(normalizeProduct)
}
