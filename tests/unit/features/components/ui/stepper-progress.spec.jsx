import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StepperProgress } from '../../../../../src/features/components/ui/StepperProgress.jsx'

describe('StepperProgress', () => {
  it('renders fallback step when steps are empty', () => {
    render(<StepperProgress steps={[]} currentStep={0} />)
    expect(screen.getByText('checkout.steps.shipping')).toBeInTheDocument()
  })

  it('renders all steps and marks current step', () => {
    render(
      <StepperProgress
        steps={[
          { id: 'shipping', label: 'Shipping' },
          { id: 'payment', label: 'Payment' },
          { id: 'review', label: 'Review' },
        ]}
        currentStep={1}
      />,
    )

    expect(screen.getByText('Shipping')).toBeInTheDocument()
    expect(screen.getByText('Payment')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Payment')
  })
})
