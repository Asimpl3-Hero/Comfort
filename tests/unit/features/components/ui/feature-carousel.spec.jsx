import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FeatureCarousel } from '../../../../../src/features/components/ui/FeatureCarousel.jsx'

const products = Array.from({ length: 7 }, (_, index) => ({
  id: `p-${index + 1}`,
  name: `Product ${index + 1}`,
  description: 'Desc',
  priceInCents: 1000 + index * 100,
  stock: 10 + index,
  currency: 'COP',
  imageUrl: '',
}))

describe('FeatureCarousel', () => {
  it('renders nothing when products list is empty', () => {
    const { container } = render(<FeatureCarousel products={[]} />)
    expect(container.querySelector('.feature-carousel-section')).toBeNull()
  })

  it('renders 5 random products duplicated for infinite loop', () => {
    const { container } = render(<FeatureCarousel products={products} />)

    expect(screen.getByText('carousel.title')).toBeInTheDocument()
    const cards = Array.from(container.querySelectorAll('.feature-carousel-card'))
    expect(cards).toHaveLength(10)

    const uniqueProductTitles = new Set(
      Array.from(container.querySelectorAll('.feature-carousel-card-title')).map(
        (element) => element.textContent,
      ),
    )
    expect(uniqueProductTitles.size).toBe(5)
  })

  it('notifies product click when selecting a card', () => {
    const onProductClick = vi.fn()
    render(<FeatureCarousel products={products} onProductClick={onProductClick} />)

    const [firstCardButton] = screen.getAllByRole('button')
    fireEvent.click(firstCardButton)

    expect(onProductClick).toHaveBeenCalledTimes(1)
    expect(onProductClick.mock.calls[0][0]).toHaveProperty('id')
  })
})
