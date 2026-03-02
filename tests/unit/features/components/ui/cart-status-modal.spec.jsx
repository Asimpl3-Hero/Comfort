import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CartStatusModal } from '../../../../../src/features/components/ui/CartStatusModal.jsx'
import { productFixture } from '../../../../helpers/fixtures.js'

describe('CartStatusModal', () => {
  it('does not render when closed', () => {
    render(<CartStatusModal isOpen={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<CartStatusModal isOpen items={[]} />)
    expect(screen.getByText('cart.empty')).toBeInTheDocument()
  })

  it('renders items and action buttons', () => {
    const onClearCart = vi.fn()
    const onProceedToPayment = vi.fn()
    const onClose = vi.fn()

    render(
      <CartStatusModal
        isOpen
        onClose={onClose}
        onClearCart={onClearCart}
        onProceedToPayment={onProceedToPayment}
        items={[
          {
            productId: productFixture.id,
            quantity: 2,
            totalInCents: 2000,
            product: productFixture,
          },
        ]}
        totalQuantity={2}
        totalInCents={2000}
      />,
    )

    expect(screen.getByText('Yoga Mat Pro')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'cart.clear' }))
    fireEvent.click(screen.getByRole('button', { name: 'cart.proceed' }))
    fireEvent.click(screen.getByRole('dialog'))

    expect(onClearCart).toHaveBeenCalledTimes(1)
    expect(onProceedToPayment).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalled()
  })
})
