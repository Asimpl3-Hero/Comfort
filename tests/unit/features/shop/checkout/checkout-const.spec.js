import { describe, expect, it } from 'vitest'

import {
  CARD_BRANDS,
  checkoutMockPayment,
  checkoutMockPaymentMethodData,
  checkoutMockShipping,
  defaultPayment,
  defaultPaymentMethodData,
  defaultShipping,
  PAYMENT_METHOD_OPTIONS,
} from '../../../../../src/features/shop/checkout/const/index.js'

describe('checkout constants', () => {
  it('exports clean default forms', () => {
    expect(defaultShipping.fullName).toBe('')
    expect(defaultPayment.cardNumber).toBe('')
    expect(defaultPaymentMethodData.nequiPhoneNumber).toBe('')
  })

  it('exports mock form presets', () => {
    expect(checkoutMockShipping.fullName).toBeTruthy()
    expect(checkoutMockPayment.cardNumber).toBeTruthy()
    expect(checkoutMockPaymentMethodData.nequiPhoneNumber).toHaveLength(10)
  })

  it('exports card brands and payment methods', () => {
    expect(Object.keys(CARD_BRANDS)).toEqual(expect.arrayContaining(['VISA', 'MASTERCARD', 'AMEX']))
    expect(PAYMENT_METHOD_OPTIONS.length).toBeGreaterThanOrEqual(4)
  })
})
