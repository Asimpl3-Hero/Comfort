import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NewArrivalsSection } from '../../../../../src/features/components/ui/NewArrivalsSection.jsx'
import { productFixture } from '../../../../helpers/fixtures.js'

describe('NewArrivalsSection', () => {
  it('shows loading skeletons', () => {
    render(<NewArrivalsSection status="loading" skeletonCount={2} />)
    expect(document.querySelectorAll('.product-skeleton')).toHaveLength(2)
  })

  it('shows error state and retry action', () => {
    const onRetry = vi.fn()
    render(<NewArrivalsSection status="failed" error="fail" onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: 'newArrivals.retry' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows empty state', () => {
    render(<NewArrivalsSection status="succeeded" products={[]} />)
    expect(screen.getByText('newArrivals.empty')).toBeInTheDocument()
  })

  it('renders products when ready', () => {
    render(
      <NewArrivalsSection
        status="succeeded"
        products={[productFixture]}
        favoriteIds={[]}
      />,
    )
    expect(screen.getByText('Yoga Mat Pro')).toBeInTheDocument()
  })

  it('shows first 3 products and expands all on view all click', () => {
    const products = Array.from({ length: 5 }, (_, index) => ({
      ...productFixture,
      id: `p-${index + 1}`,
      name: `Product ${index + 1}`,
    }))

    render(<NewArrivalsSection status="succeeded" products={products} favoriteIds={[]} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
    expect(screen.getByText('Product 3')).toBeInTheDocument()
    expect(screen.queryByText('Product 4')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'newArrivals.viewAll' }))

    expect(screen.getByText('Product 4')).toBeInTheDocument()
    expect(screen.getByText('Product 5')).toBeInTheDocument()
  })
})
