import { mockProducts } from '../config/mockProducts.js'
import { httpGet } from './httpClient.js'

function normalizeProduct(rawProduct) {
  return {
    id: rawProduct.id,
    name: rawProduct.name,
    tone: rawProduct.tone,
    price: Number(rawProduct.price),
    imageUrl: rawProduct.imageUrl,
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
