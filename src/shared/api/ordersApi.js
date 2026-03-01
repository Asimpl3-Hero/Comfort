import { httpGet, httpPost } from './httpClient.js'

export async function createOrder({ productId }, { signal } = {}) {
  return httpPost('/orders', { productId }, { signal })
}

export async function getOrderById(orderId, { signal } = {}) {
  return httpGet(`/orders/${orderId}`, { signal })
}
