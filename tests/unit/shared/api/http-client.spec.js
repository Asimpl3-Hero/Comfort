import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { httpGet, httpPost } from '../../../../src/shared/api/httpClient.js'

describe('httpClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('performs GET requests', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })

    const result = await httpGet('/products')
    expect(result).toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/products'),
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('performs POST requests', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'order-1' }),
    })

    const result = await httpPost('/orders', { productId: 'p-1' })
    expect(result).toEqual({ id: 'order-1' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ productId: 'p-1' }),
      }),
    )
  })

  it('throws API error message when response is not ok', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad request' }),
    })

    await expect(httpGet('/products')).rejects.toThrow('Bad request')
  })

  it('uses fallback error message when payload has no message', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    await expect(httpGet('/products')).rejects.toThrow('Request failed (500)')
  })
})
