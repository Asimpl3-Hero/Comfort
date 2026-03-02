import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StoreProvider } from '../../../../src/app/providers/StoreProvider.jsx'

describe('StoreProvider', () => {
  it('renders children', () => {
    render(
      <StoreProvider>
        <div>child</div>
      </StoreProvider>,
    )

    expect(screen.getByText('child')).toBeInTheDocument()
  })
})
