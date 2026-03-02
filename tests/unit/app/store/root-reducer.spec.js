import { describe, expect, it } from 'vitest'

import { rootReducer } from '../../../../src/app/store/rootReducer.js'

describe('rootReducer', () => {
  it('creates state tree with expected slices', () => {
    const state = rootReducer(undefined, { type: '@@INIT' })
    expect(Object.keys(state)).toEqual(
      expect.arrayContaining(['cart', 'checkout', 'products', 'theme']),
    )
  })
})
