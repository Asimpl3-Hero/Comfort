import { beforeEach, describe, expect, it, vi } from 'vitest'

import { loadCartState, saveCartState } from '../../../../src/app/store/cartStorage.js'

describe('cartStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns undefined when there is no saved state', () => {
    expect(loadCartState()).toBeUndefined()
  })

  it('loads valid cart state from localStorage', () => {
    window.localStorage.setItem(
      'comfort_cart_v1',
      JSON.stringify({ itemsByProductId: { 'p-1': 2 } }),
    )

    expect(loadCartState()).toEqual({ itemsByProductId: { 'p-1': 2 } })
  })

  it('returns undefined for invalid JSON', () => {
    window.localStorage.setItem('comfort_cart_v1', '{broken-json')
    expect(loadCartState()).toBeUndefined()
  })

  it('saves cart state', () => {
    saveCartState({ itemsByProductId: { 'p-2': 4 } })
    expect(window.localStorage.getItem('comfort_cart_v1')).toContain('"p-2":4')
  })

  it('swallows storage write errors', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })

    expect(() => saveCartState({ itemsByProductId: {} })).not.toThrow()
    setItemSpy.mockRestore()
  })
})
