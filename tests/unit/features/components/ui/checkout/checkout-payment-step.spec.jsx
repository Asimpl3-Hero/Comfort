import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckoutPaymentStep } from '../../../../../../src/features/components/ui/checkout/CheckoutPaymentStep.jsx'
import { PAYMENT_METHOD_OPTIONS } from '../../../../../../src/features/shop/checkout/const/index.js'

function baseProps(overrides = {}) {
  return {
    t: (key) => key,
    isSubmitting: false,
    paymentMethodType: 'CARD',
    paymentMethodOptions: PAYMENT_METHOD_OPTIONS,
    paymentForm: {
      cardholder: 'John Doe',
      cardNumber: '4111111111111111',
      expiry: '12/30',
      cvv: '123',
    },
    paymentMethodDataForm: {
      nequiPhoneNumber: '3991111111',
      pseUserType: '0',
      pseUserLegalIdType: 'CC',
      pseUserLegalId: '123',
      pseFinancialInstitutionCode: '1',
      psePaymentDescription: 'Pago',
      bancolombiaPaymentDescription: 'Pago',
      bancolombiaSandboxStatus: 'APPROVED',
    },
    paymentErrors: {},
    detectedBrandMeta: { logo: '/logos/visa.svg', label: 'Visa' },
    onPaymentMethodTypeChange: vi.fn(),
    onPaymentChange: vi.fn((field) => () => field),
    onPaymentMethodDataChange: vi.fn((field) => () => field),
    ...overrides,
  }
}

describe('CheckoutPaymentStep', () => {
  it('renders CARD fields and responds to changes', () => {
    const props = baseProps()
    render(<CheckoutPaymentStep {...props} />)

    expect(screen.getByText('checkout.fields.cardholderName')).toBeInTheDocument()
    fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'Jane' } })
    expect(props.onPaymentChange).toHaveBeenCalledWith('cardholder')
  })

  it('renders NEQUI specific field', () => {
    const props = baseProps({ paymentMethodType: 'NEQUI' })
    render(<CheckoutPaymentStep {...props} />)

    expect(screen.getByText('checkout.fields.nequiPhoneNumber')).toBeInTheDocument()
  })

  it('renders PSE specific fields', () => {
    const props = baseProps({ paymentMethodType: 'PSE' })
    render(<CheckoutPaymentStep {...props} />)

    expect(screen.getByText('checkout.fields.documentType')).toBeInTheDocument()
    expect(screen.getByText('checkout.fields.sandboxBank')).toBeInTheDocument()
  })

  it('renders BANCOLOMBIA_TRANSFER fields', () => {
    const props = baseProps({ paymentMethodType: 'BANCOLOMBIA_TRANSFER' })
    render(<CheckoutPaymentStep {...props} />)

    expect(screen.getByText('checkout.fields.sandboxResult')).toBeInTheDocument()
  })
})
