import { describe, expect, it } from 'vitest'

import {
  describePaymentMethod,
  getCardBrand,
  getCardDigits,
  getMaskedCard,
  mapPaymentMethodData,
  validatePayment,
  validateShipping,
} from '../../../../../src/features/shop/checkout/lib/checkout-form.js'

const t = (key) => key

describe('checkout-form utils', () => {
  it('extracts card digits and brand', () => {
    expect(getCardDigits('4111 1111-1111')).toBe('411111111111')
    expect(getCardBrand('4111111111111111')).toBe('VISA')
    expect(getCardBrand('5111111111111111')).toBe('MASTERCARD')
    expect(getCardBrand('371111111111111')).toBe('AMEX')
    expect(getCardBrand('999')).toBe('CARD')
  })

  it('masks card with last 4 digits', () => {
    expect(getMaskedCard('4111111111111234')).toBe('**** 1234')
    expect(getMaskedCard('')).toBe('**** 0000')
  })

  it('maps payment method data by type', () => {
    expect(mapPaymentMethodData('CARD', {})).toBeUndefined()
    expect(mapPaymentMethodData('NEQUI', { nequiPhoneNumber: '3991111111' })).toEqual({
      phoneNumber: '3991111111',
    })
    expect(
      mapPaymentMethodData('PSE', {
        pseUserType: '1',
        pseUserLegalIdType: 'CC',
        pseUserLegalId: '123',
        pseFinancialInstitutionCode: '1',
        psePaymentDescription: 'Pago',
      }),
    ).toEqual({
      userType: 1,
      userLegalIdType: 'CC',
      userLegalId: '123',
      financialInstitutionCode: '1',
      paymentDescription: 'Pago',
    })
  })

  it('describes payment methods', () => {
    expect(
      describePaymentMethod('CARD', { cardNumber: '4111111111111234' }, {}, 'VISA', t),
    ).toContain('**** 1234')
    expect(
      describePaymentMethod('NEQUI', {}, { nequiPhoneNumber: '3991111111' }, 'CARD', t),
    ).toBe('NEQUI 3991111111')
  })

  it('validates shipping form', () => {
    const errors = validateShipping(
      { fullName: '', address1: '', city: '', state: '', zip: '' },
      t,
    )
    expect(Object.keys(errors)).toHaveLength(5)
  })

  it('validates payment form by method', () => {
    const cardErrors = validatePayment(
      'CARD',
      { cardholder: '', cardNumber: '123', expiry: '00/00', cvv: '1' },
      {},
      t,
    )
    expect(cardErrors.cardholder).toBeTruthy()
    expect(cardErrors.cardNumber).toBeTruthy()

    const nequiErrors = validatePayment(
      'NEQUI',
      {},
      { nequiPhoneNumber: '123' },
      t,
    )
    expect(nequiErrors.nequiPhoneNumber).toBeTruthy()

    const pseErrors = validatePayment(
      'PSE',
      {},
      { pseUserLegalId: '', psePaymentDescription: '' },
      t,
    )
    expect(pseErrors.pseUserLegalId).toBeTruthy()

    const bancoErrors = validatePayment(
      'BANCOLOMBIA_TRANSFER',
      {},
      { bancolombiaPaymentDescription: '' },
      t,
    )
    expect(bancoErrors.bancolombiaPaymentDescription).toBeTruthy()
  })
})
