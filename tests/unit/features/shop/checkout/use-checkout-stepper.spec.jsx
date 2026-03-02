import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { defaultPayment, defaultShipping } from '../../../../../src/features/shop/checkout/const/index.js'
import { useCheckoutStepper } from '../../../../../src/features/shop/checkout/hooks/useCheckoutStepper.js'
import { checkoutStepsFixture, productFixture } from '../../../../helpers/fixtures.js'

const t = (key) => key

describe('useCheckoutStepper', () => {
  it('initializes computed fields', () => {
    const { result } = renderHook(() =>
      useCheckoutStepper({
        initialShipping: defaultShipping,
        initialPayment: defaultPayment,
        product: productFixture,
        baseFeeInCents: 100,
        deliveryFeeInCents: 200,
        resolvedSteps: checkoutStepsFixture,
        onPlaceOrder: vi.fn(),
        t,
      }),
    )

    expect(result.current.activeStepIndex).toBe(0)
    expect(result.current.productAmountInCents).toBe(productFixture.priceInCents)
    expect(result.current.totalInCents).toBe(productFixture.priceInCents + 300)
  })

  it('validates and does not advance with invalid shipping', async () => {
    const { result } = renderHook(() =>
      useCheckoutStepper({
        initialShipping: { fullName: '', address1: '', city: '', state: '', zip: '' },
        initialPayment: defaultPayment,
        product: productFixture,
        baseFeeInCents: 100,
        deliveryFeeInCents: 200,
        resolvedSteps: checkoutStepsFixture,
        onPlaceOrder: vi.fn(),
        t,
      }),
    )

    await act(async () => {
      await result.current.handleNext()
    })

    expect(result.current.activeStepIndex).toBe(0)
    expect(result.current.shippingErrors.fullName).toBeTruthy()
  })

  it('advances and submits on last step', async () => {
    const onPlaceOrder = vi.fn()
    const { result } = renderHook(() =>
      useCheckoutStepper({
        initialShipping: defaultShipping,
        initialPayment: defaultPayment,
        product: productFixture,
        baseFeeInCents: 100,
        deliveryFeeInCents: 200,
        resolvedSteps: checkoutStepsFixture,
        onPlaceOrder,
        t,
      }),
    )

    await act(async () => {
      await result.current.handleNext()
    })
    expect(result.current.activeStepIndex).toBe(1)

    await act(async () => {
      await result.current.handleNext()
    })
    expect(result.current.activeStepIndex).toBe(2)

    await act(async () => {
      await result.current.handleNext()
    })
    expect(onPlaceOrder).toHaveBeenCalledTimes(1)
  })

  it('updates payment/card number sanitizing digits', () => {
    const { result } = renderHook(() =>
      useCheckoutStepper({
        initialShipping: defaultShipping,
        initialPayment: defaultPayment,
        product: productFixture,
        baseFeeInCents: 100,
        deliveryFeeInCents: 200,
        resolvedSteps: checkoutStepsFixture,
        onPlaceOrder: vi.fn(),
        t,
      }),
    )

    act(() => {
      result.current.handlePaymentChange('cardNumber')({ target: { value: '4111-11ab' } })
    })
    expect(result.current.paymentForm.cardNumber).toBe('411111')
    expect(result.current.detectedBrand).toBe('VISA')

    act(() => {
      result.current.handleBack()
    })
    expect(result.current.activeStepIndex).toBe(0)
  })
})
