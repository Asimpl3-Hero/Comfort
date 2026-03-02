import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { HeroSection } from '../../../../../src/features/components/ui/HeroSection.jsx'

describe('HeroSection', () => {
  it('renders defaults and triggers CTA', () => {
    const onCtaClick = vi.fn()
    render(<HeroSection onCtaClick={onCtaClick} />)

    expect(screen.getByText('hero.title')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'hero.ctaLabel' }))
    expect(onCtaClick).toHaveBeenCalledTimes(1)
  })
})
