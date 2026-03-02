import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Footer } from '../../../../../src/features/components/ux/Footer.jsx'

describe('Footer', () => {
  it('renders links and copyright', () => {
    render(
      <Footer
        links={[{ id: 'privacy', href: '/privacy', label: 'Privacy' }]}
        copy="(c) 2026 Comfort"
      />,
    )

    expect(screen.getByRole('link', { name: 'Privacy' })).toBeInTheDocument()
    expect(screen.getByText('(c) 2026 Comfort')).toBeInTheDocument()
  })
})
