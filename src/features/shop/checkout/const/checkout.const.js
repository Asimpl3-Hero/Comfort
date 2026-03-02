export const defaultShipping = {
  fullName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
}

export const defaultPayment = {
  cardholder: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

export const defaultPaymentMethodData = {
  nequiPhoneNumber: '',
  pseUserType: '0',
  pseUserLegalIdType: 'CC',
  pseUserLegalId: '',
  pseFinancialInstitutionCode: '1',
  psePaymentDescription: '',
  bancolombiaPaymentDescription: '',
  bancolombiaSandboxStatus: 'APPROVED',
}

export const checkoutMockShipping = {
  fullName: 'John Doe',
  address1: '123 Minimalist St.',
  address2: 'Apt 4B',
  city: 'New York',
  state: 'NY',
  zip: '10001',
}

export const checkoutMockPayment = {
  cardholder: 'John Doe',
  cardNumber: '4242424242424242',
  expiry: '12/25',
  cvv: '123',
}

export const checkoutMockPaymentMethodData = {
  nequiPhoneNumber: '3991111111',
  pseUserType: '0',
  pseUserLegalIdType: 'CC',
  pseUserLegalId: '1999888777',
  pseFinancialInstitutionCode: '1',
  psePaymentDescription: 'Pago Comfort',
  bancolombiaPaymentDescription: 'Pago Comfort',
  bancolombiaSandboxStatus: 'APPROVED',
}

export const CARD_BRANDS = {
  VISA: {
    key: 'VISA',
    label: 'Visa',
    logo: '/logos/visa.svg',
  },
  MASTERCARD: {
    key: 'MASTERCARD',
    label: 'Mastercard',
    logo: '/logos/mastercard.svg',
  },
  AMEX: {
    key: 'AMEX',
    label: 'Amex',
    logo: '/logos/amex.svg',
  },
}

export const PAYMENT_METHOD_OPTIONS = [
  {
    value: 'CARD',
    badge: 'CARD',
    logoSrc: '/images/logos/Credit%20cards.jpg',
    labelKey: 'checkout.paymentMethods.creditCard',
    logoAltKey: 'checkout.paymentMethods.creditCardsLogoAlt',
  },
  {
    value: 'NEQUI',
    badge: 'NEQUI',
    logoSrc: '/images/logos/Nequi-removebg-preview.png',
    labelKey: 'checkout.paymentMethods.nequi',
    logoAltKey: 'checkout.paymentMethods.nequiLogoAlt',
  },
  {
    value: 'PSE',
    badge: 'PSE',
    logoSrc: '/images/logos/PSE-removebg-preview.png',
    labelKey: 'checkout.paymentMethods.pse',
    logoAltKey: 'checkout.paymentMethods.pseLogoAlt',
  },
  {
    value: 'BANCOLOMBIA_TRANSFER',
    badge: 'BANCO',
    logoSrc: '/images/logos/Bancolombia-removebg-preview.png',
    labelKey: 'checkout.paymentMethods.bancolombiaTransfer',
    logoAltKey: 'checkout.paymentMethods.bancolombiaLogoAlt',
  },
]
