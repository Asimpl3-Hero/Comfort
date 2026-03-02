import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckoutModalFooter } from '../../../../../../src/features/components/ui/checkout/CheckoutModalFooter.jsx'

describe('CheckoutModalFooter', () => {
  it('renders buttons and handles actions', () => {
    const onBack = vi.fn()
    const onNext = vi.fn()
    const t = (key) => key

    render(
      <CheckoutModalFooter
        t={t}
        isSubmitting={false}
        activeStepIndex={1}
        isLastStep={false}
        primaryButtonClassName="primary"
        onBack={onBack}
        onNext={onNext}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'checkout.buttons.back' }))
    fireEvent.click(screen.getByRole('button', { name: 'checkout.buttons.continue' }))
    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
