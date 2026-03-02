export const defaultShipping = {
  fullName: '',
  email: '',
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
  fullName: 'Juan Perez',
  email: 'juan.perez@correo.co',
  address1: 'Cra 7 #45-12',
  address2: 'Apto 302',
  city: 'Bogota',
  state: 'Cundinamarca',
  zip: '110111',
}

export const checkoutMockPayment = {
  cardholder: 'JUAN PEREZ',
  cardNumber: '4242424242424242',
  expiry: '12/30',
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
