import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../../src/shared/api/httpClient.js', () => ({
  httpGet: vi.fn(),
}))

import { httpGet } from '../../../../src/shared/api/httpClient.js'
import { getProducts } from '../../../../src/shared/api/productsApi.js'

describe('productsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('normalizes product payload with snake_case fields', async () => {
    httpGet.mockResolvedValue([
      {
        id: 'p-1',
        name: 'Yoga Mat',
        description: 'Desc',
        price_in_cents: 1200,
        stock: 2,
        currency: 'COP',
        imageUrl: 'x.jpg',
      },
    ])

    const result = await getProducts()
    expect(result[0]).toEqual({
      id: 'p-1',
      name: 'Yoga Mat',
      description: 'Desc',
      priceInCents: 1200,
      stock: 2,
      currency: 'COP',
      imageUrl: 'x.jpg',
    })
  })

  it('normalizes object payload with items and fallback fields', async () => {
    httpGet.mockResolvedValue({
      items: [
        { id: 'p-2', name: 'Chair', tone: 'Nice', price: 10, imageUrl: '', stock: 1 },
      ],
    })

    const result = await getProducts()
    expect(result[0].description).toBe('Nice')
    expect(result[0].priceInCents).toBe(1000)
    expect(result[0].currency).toBe('COP')
  })
})
