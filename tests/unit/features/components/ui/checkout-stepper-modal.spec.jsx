import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckoutStepperModal } from '../../../../../src/features/components/ui/CheckoutStepperModal.jsx'
import { productFixture } from '../../../../helpers/fixtures.js'

describe('CheckoutStepperModal', () => {
  it('does not render when closed', () => {
    render(<CheckoutStepperModal isOpen={false} product={productFixture} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders first step when open', () => {
    render(<CheckoutStepperModal isOpen product={productFixture} onClose={() => {}} />)
    expect(screen.getByText('checkout.sections.shippingDetails')).toBeInTheDocument()
  })

  it('shows loading overlay while submitting', () => {
    render(
      <CheckoutStepperModal
        isOpen
        product={productFixture}
        isSubmitting
        loadingMessage="Processing"
      />,
    )
    expect(screen.getByText('Processing')).toBeInTheDocument()
  })

  it('calls onClose by clicking backdrop', () => {
    const onClose = vi.fn()
    render(<CheckoutStepperModal isOpen product={productFixture} onClose={onClose} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('fills checkout form with mock data from helper button', () => {
    render(<CheckoutStepperModal isOpen product={productFixture} onClose={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'checkout.buttons.fillTestData' }))
    expect(screen.getByDisplayValue('Juan Perez')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cra 7 #45-12')).toBeInTheDocument()
  })
})
