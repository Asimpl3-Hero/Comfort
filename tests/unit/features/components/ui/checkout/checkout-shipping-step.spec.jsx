import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckoutShippingStep } from '../../../../../../src/features/components/ui/checkout/CheckoutShippingStep.jsx'

describe('CheckoutShippingStep', () => {
  it('renders fields and validation messages', () => {
    const onShippingChange = vi.fn((field) => () => field)
    render(
      <CheckoutShippingStep
        t={(key) => key}
        isSubmitting={false}
        shippingForm={{
          fullName: 'John',
          email: 'john@example.com',
          address1: 'Street',
          address2: '',
          city: 'City',
          state: 'State',
          zip: '123',
        }}
        shippingErrors={{ fullName: 'error-full' }}
        onShippingChange={onShippingChange}
      />,
    )

    expect(screen.getByText('error-full')).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('John'), { target: { value: 'Jane' } })
    expect(onShippingChange).toHaveBeenCalledWith('fullName')
  })
})
