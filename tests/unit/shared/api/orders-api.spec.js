import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../../src/shared/api/httpClient.js', () => ({
  httpGet: vi.fn(),
  httpPost: vi.fn(),
}))

import { httpGet, httpPost } from '../../../../src/shared/api/httpClient.js'
import { createOrder, getOrderById } from '../../../../src/shared/api/ordersApi.js'

describe('ordersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates order using POST /orders', async () => {
    httpPost.mockResolvedValue({ orderId: 'o-1', status: 'PENDING' })

    const payload = {
      productId: 'p-1',
      paymentMethodType: 'CARD',
      paymentMethodData: undefined,
    }
    const result = await createOrder(payload)

    expect(httpPost).toHaveBeenCalledWith('/orders', payload, { signal: undefined })
    expect(result.orderId).toBe('o-1')
  })

  it('gets order by id', async () => {
    httpGet.mockResolvedValue({ id: 'o-2', status: 'APPROVED' })

    const result = await getOrderById('o-2')

    expect(httpGet).toHaveBeenCalledWith('/orders/o-2', { signal: undefined })
    expect(result.status).toBe('APPROVED')
  })
})
