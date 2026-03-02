import { httpGet, httpPost } from './httpClient.js'

export async function createOrder(
  { productId, customerEmail, paymentMethodType, paymentMethodData },
  { signal } = {},
) {
  return httpPost(
    '/orders',
    {
      productId,
      customerEmail,
      paymentMethodType,
      paymentMethodData,
    },
    { signal },
  )
}

export async function getOrderById(orderId, { signal } = {}) {
  return httpGet(`/orders/${orderId}`, { signal })
}
