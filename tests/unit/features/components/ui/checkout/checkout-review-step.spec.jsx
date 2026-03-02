import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CheckoutReviewStep } from '../../../../../../src/features/components/ui/checkout/CheckoutReviewStep.jsx'
import { productFixture } from '../../../../../helpers/fixtures.js'

describe('CheckoutReviewStep', () => {
  it('renders shipping, payment and summary details', () => {
    render(
      <CheckoutReviewStep
        t={(key) => key}
        language="es"
        product={productFixture}
        shippingForm={{
          fullName: 'John',
          address1: 'Street 1',
          address2: 'Apt 2',
          city: 'Bogota',
          state: 'CUN',
          zip: '110111',
        }}
        paymentForm={{ cardNumber: '4111111111111111', expiry: '12/25' }}
        paymentMethodType="CARD"
        paymentMethodDataForm={{}}
        detectedBrand="VISA"
        detectedBrandMeta={{ logo: '/logos/visa.svg', label: 'Visa' }}
        productAmountInCents={1000}
        baseFeeInCents={100}
        deliveryFeeInCents={200}
        totalInCents={1300}
        currency="COP"
      />,
    )

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Yoga Mat Pro')).toBeInTheDocument()
    expect(screen.getByText('checkout.summary.totalToPay')).toBeInTheDocument()
  })
})
