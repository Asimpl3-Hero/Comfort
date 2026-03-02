import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createWompiCardToken } from '../../../../src/shared/api/wompiApi.js'

describe('wompiApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubEnv('VITE_WOMPI_BASE_URL', 'https://api-sandbox.co.uat.wompi.dev/v1')
    vi.stubEnv('VITE_WOMPI_PUBLIC_KEY', 'pub_test_key')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('tokenizes card and returns token id', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 'tok_test_123' } }),
    })

    const token = await createWompiCardToken({
      cardNumber: '4111111111111111',
      cardCvc: '123',
      cardExpMonth: '12',
      cardExpYear: '30',
      cardHolder: 'Jane Doe',
    })

    expect(token).toBe('tok_test_123')
    expect(fetch).toHaveBeenCalledWith(
      'https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer pub_test_key',
        }),
      }),
    )
  })

  it('throws when wompi public key is missing', async () => {
    vi.stubEnv('VITE_WOMPI_PUBLIC_KEY', '')

    await expect(
      createWompiCardToken({
        cardNumber: '4111111111111111',
        cardCvc: '123',
        cardExpMonth: '12',
        cardExpYear: '30',
        cardHolder: 'Jane Doe',
      }),
    ).rejects.toThrow('Wompi public key is not configured.')
  })

  it('throws provider reason when tokenization fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ error: { reason: 'Invalid card data' } }),
    })

    await expect(
      createWompiCardToken({
        cardNumber: '4000000000000000',
        cardCvc: '000',
        cardExpMonth: '01',
        cardExpYear: '30',
        cardHolder: 'Sandbox User',
      }),
    ).rejects.toThrow('Invalid card data')
  })

  it('throws when wompi token is missing in successful response', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
    })

    await expect(
      createWompiCardToken({
        cardNumber: '4111111111111111',
        cardCvc: '123',
        cardExpMonth: '12',
        cardExpYear: '30',
        cardHolder: 'Jane Doe',
      }),
    ).rejects.toThrow('Wompi did not return a valid card token.')
  })
})
