import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CheckoutLoadingOverlay } from '../../../../../../src/features/components/ui/checkout/CheckoutLoadingOverlay.jsx'

describe('CheckoutLoadingOverlay', () => {
  it('renders loading message and optional pending note', () => {
    render(
      <CheckoutLoadingOverlay
        t={(key) => key}
        loadingMessage="Loading..."
        isPendingProlonged
      />,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText('checkout.loading.pendingNote')).toBeInTheDocument()
  })
})
