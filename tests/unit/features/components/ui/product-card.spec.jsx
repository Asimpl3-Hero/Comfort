import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductCard } from '../../../../../src/features/components/ui/ProductCard.jsx'
import { productFixture } from '../../../../helpers/fixtures.js'

describe('ProductCard', () => {
  it('renders product and triggers callbacks', () => {
    const onToggleFavorite = vi.fn()
    const onOpenDetails = vi.fn()
    const onAddToCart = vi.fn()

    render(
      <ProductCard
        product={productFixture}
        onToggleFavorite={onToggleFavorite}
        onOpenDetails={onOpenDetails}
        onAddToCart={onAddToCart}
      />,
    )

    expect(screen.getByText('Yoga Mat Pro')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /product.toggleFavorite/ }))
    fireEvent.click(screen.getByRole('button', { name: /product.addToCart/ }))
    fireEvent.click(screen.getByRole('button', { name: /product.viewDetails/ }))

    expect(onToggleFavorite).toHaveBeenCalledWith(productFixture.id)
    expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: productFixture.id }))
    expect(onOpenDetails).toHaveBeenCalledWith(expect.objectContaining({ id: productFixture.id }))
  })

  it('disables add button when stock is 0', () => {
    render(<ProductCard product={{ ...productFixture, stock: 0 }} />)
    expect(screen.getByRole('button', { name: /product.outOfStock/ })).toBeDisabled()
  })
})
