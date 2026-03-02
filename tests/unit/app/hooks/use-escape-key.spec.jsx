import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useEscapeKey } from '../../../../src/app/hooks/useEscapeKey.js'

function TestComponent({ onEscape, enabled }) {
  useEscapeKey(onEscape, enabled)
  return <div>test</div>
}

describe('useEscapeKey', () => {
  it('calls callback when Escape key is pressed', () => {
    const onEscape = vi.fn()
    render(<TestComponent onEscape={onEscape} enabled />)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('does nothing when disabled', () => {
    const onEscape = vi.fn()
    render(<TestComponent onEscape={onEscape} enabled={false} />)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onEscape).not.toHaveBeenCalled()
  })
})
