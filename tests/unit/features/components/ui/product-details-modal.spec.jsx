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

    expect(onAddToCart).toHaveBeenCalledWith(productFixture, 1)
    expect(onClose).toHaveBeenCalled()
  })

  it('disables add button when out of stock', () => {
    render(<ProductDetailsModal isOpen product={{ ...productFixture, stock: 0 }} />)
    expect(screen.getByRole('button', { name: 'product.outOfStock' })).toBeDisabled()
  })

  it('limits quantity controls by remaining stock and prevents negatives', () => {
    const onAddToCart = vi.fn()
    render(
      <ProductDetailsModal
        isOpen
        product={{ ...productFixture, stock: 3 }}
        currentCartQuantity={1}
        onAddToCart={onAddToCart}
      />,
    )

    const decreaseBtn = screen.getByRole('button', {
      name: 'productModal.decreaseQuantity',
    })
    const increaseBtn = screen.getByRole('button', {
      name: 'productModal.increaseQuantity',
    })

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(decreaseBtn).toBeDisabled()

    fireEvent.click(increaseBtn)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(increaseBtn).toBeDisabled()

    fireEvent.click(decreaseBtn)
    expect(screen.getByText('1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'product.addToCart' }))
    expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: productFixture.id }), 1)
  })
})
