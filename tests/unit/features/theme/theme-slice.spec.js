import { describe, expect, it, vi } from 'vitest'

import reducer, { toggleTheme } from '../../../../src/features/theme/state/theme.slice.js'
import { selectThemeMode } from '../../../../src/features/theme/state/theme.selectors.js'

describe('themeSlice', () => {
  it('uses light by default when no dark preference', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.mode).toBe('light')
  })

  it('toggles mode', () => {
    const state = reducer({ mode: 'light' }, toggleTheme())
    expect(state.mode).toBe('dark')
  })

  it('selects mode', () => {
    expect(selectThemeMode({ theme: { mode: 'dark' } })).toBe('dark')
  })
})
