import { describe, expect, it } from 'vitest'

import {
  CARD_BRANDS,
  defaultPayment,
  defaultPaymentMethodData,
  defaultShipping,
  PAYMENT_METHOD_OPTIONS,
} from '../../../../../src/features/shop/checkout/const/index.js'

describe('checkout constants', () => {
  it('exports default forms', () => {
    expect(defaultShipping.fullName).toBeTruthy()
    expect(defaultPayment.cardNumber).toBeTruthy()
    expect(defaultPaymentMethodData.nequiPhoneNumber).toHaveLength(10)
  })

  it('exports card brands and payment methods', () => {
    expect(Object.keys(CARD_BRANDS)).toEqual(expect.arrayContaining(['VISA', 'MASTERCARD', 'AMEX']))
    expect(PAYMENT_METHOD_OPTIONS.length).toBeGreaterThanOrEqual(4)
  })
})
