import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductDetailsModal } from '../../../../../src/features/components/ui/ProductDetailsModal.jsx'
import { productFixture } from '../../../../helpers/fixtures.js'

describe('ProductDetailsModal', () => {
  it('returns null when not open', () => {
    render(<ProductDetailsModal isOpen={false} product={productFixture} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders and allows adding to cart', () => {
    const onAddToCart = vi.fn()
    const onClose = vi.fn()

    render(
      <ProductDetailsModal
        isOpen
        product={productFixture}
        onAddToCart={onAddToCart}
        onClose={onClose}
      />,
    )

    expect(screen.getByText('Yoga Mat Pro')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'product.addToCart' }))
    fireEvent.click(screen.getByRole('dialog'))

    expect(onAddToCart).toHaveBeenCalledWith(productFixture)
    expect(onClose).toHaveBeenCalled()
  })

  it('disables add button when out of stock', () => {
    render(<ProductDetailsModal isOpen product={{ ...productFixture, stock: 0 }} />)
    expect(screen.getByRole('button', { name: 'product.outOfStock' })).toBeDisabled()
  })
})
