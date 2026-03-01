import { httpGet, httpPost } from './httpClient.js'

export async function createOrder(
  { productId, paymentMethodType, paymentMethodData },
  { signal } = {},
) {
  return httpPost(
    '/orders',
    {
      productId,
      paymentMethodType,
      paymentMethodData,
    },
    { signal },
  )
}

export async function getOrderById(orderId, { signal } = {}) {
  return httpGet(`/orders/${orderId}`, { signal })
}
