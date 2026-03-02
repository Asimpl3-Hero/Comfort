export function getCardDigits(value) {
  return value.replace(/\D/g, '')
}

export function getCardBrand(cardNumber) {
  const digits = getCardDigits(cardNumber)
  if (digits.startsWith('4')) return 'VISA'
  if (/^5[1-5]/.test(digits)) return 'MASTERCARD'
  if (/^3[47]/.test(digits)) return 'AMEX'
  return 'CARD'
}

export function getMaskedCard(cardNumber) {
  const digits = getCardDigits(cardNumber)
  const last4 = digits.slice(-4) || '0000'
  return `**** ${last4}`
}

export function mapPaymentMethodData(paymentMethodType, data, paymentForm = {}) {
  if (paymentMethodType === 'CARD') {
    const [expMonthRaw = '', expYearRaw = ''] = (paymentForm.expiry ?? '').split('/')

    return {
      cardNumber: getCardDigits(paymentForm.cardNumber ?? ''),
      cardCvc: (paymentForm.cvv ?? '').trim(),
      cardExpMonth: expMonthRaw.trim(),
      cardExpYear: expYearRaw.trim(),
      cardHolder: (paymentForm.cardholder ?? '').trim(),
    }
  }

  if (paymentMethodType === 'NEQUI') {
    return {
      phoneNumber: data.nequiPhoneNumber,
    }
  }

  if (paymentMethodType === 'PSE') {
    return {
      userType: Number(data.pseUserType),
      userLegalIdType: data.pseUserLegalIdType,
      userLegalId: data.pseUserLegalId,
      financialInstitutionCode: data.pseFinancialInstitutionCode,
      paymentDescription: data.psePaymentDescription,
    }
  }

  return {
    paymentDescription: data.bancolombiaPaymentDescription,
    sandboxStatus: data.bancolombiaSandboxStatus,
  }
}

export function describePaymentMethod(paymentMethodType, cardData, data, t) {
  if (paymentMethodType === 'CARD') {
    return getMaskedCard(cardData.cardNumber)
  }

  if (paymentMethodType === 'NEQUI') {
    return `NEQUI ${data.nequiPhoneNumber}`
  }

  if (paymentMethodType === 'PSE') {
    return `PSE ${data.pseUserLegalIdType} ${data.pseUserLegalId}`
  }

  return t('checkout.paymentDescription.bancolombiaTransfer')
}

export function validateShipping(shippingForm, t) {
  const errors = {}
  const email = (shippingForm.email ?? '').trim()

  if (!shippingForm.fullName.trim()) errors.fullName = t('checkout.validation.fullNameRequired')
  if (!email) {
    errors.email = t('checkout.validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = t('checkout.validation.emailInvalid')
  }
  if (!shippingForm.address1.trim()) errors.address1 = t('checkout.validation.addressRequired')
  if (!shippingForm.city.trim()) errors.city = t('checkout.validation.cityRequired')
  if (!shippingForm.state.trim()) errors.state = t('checkout.validation.stateRequired')
  if (!shippingForm.zip.trim()) errors.zip = t('checkout.validation.zipRequired')

  return errors
}

export function validatePayment(paymentMethodType, paymentForm, paymentMethodDataForm, t) {
  const errors = {}

  if (paymentMethodType === 'CARD') {
    const expiry = (paymentForm.expiry ?? '').trim()
    const digits = getCardDigits(paymentForm.cardNumber)
    if (!paymentForm.cardholder.trim()) {
      errors.cardholder = t('checkout.validation.cardholderRequired')
    }
    if (digits.length < 13) {
      errors.cardNumber = t('checkout.validation.cardNumberInvalid')
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      errors.expiry = t('checkout.validation.expiryFormat')
    } else if (!isFutureExpiry(expiry)) {
      errors.expiry = t('checkout.validation.expiryFuture')
    }
    if (!/^\d{3,4}$/.test(paymentForm.cvv)) {
      errors.cvv = t('checkout.validation.cvvInvalid')
    }
  }

  if (paymentMethodType === 'NEQUI') {
    if (!/^\d{10}$/.test(paymentMethodDataForm.nequiPhoneNumber)) {
      errors.nequiPhoneNumber = t('checkout.validation.nequiPhoneInvalid')
    }
  }

  if (paymentMethodType === 'PSE') {
    if (!paymentMethodDataForm.pseUserLegalId.trim()) {
      errors.pseUserLegalId = t('checkout.validation.documentRequired')
    }
    if (!paymentMethodDataForm.psePaymentDescription.trim()) {
      errors.psePaymentDescription = t('checkout.validation.descriptionRequired')
    } else if (paymentMethodDataForm.psePaymentDescription.trim().length > 30) {
      errors.psePaymentDescription = t('checkout.validation.descriptionMax30')
    }
  }

  if (paymentMethodType === 'BANCOLOMBIA_TRANSFER') {
    if (!paymentMethodDataForm.bancolombiaPaymentDescription.trim()) {
      errors.bancolombiaPaymentDescription = t('checkout.validation.descriptionRequired')
    } else if (paymentMethodDataForm.bancolombiaPaymentDescription.trim().length > 64) {
      errors.bancolombiaPaymentDescription = t('checkout.validation.descriptionMax64')
    }
  }

  return errors
}

function isFutureExpiry(expiry) {
  const [monthRaw, yearRaw] = expiry.split('/')
  const month = Number(monthRaw)
  const year = Number(yearRaw)
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1

  if (year > currentYear) {
    return true
  }

  if (year < currentYear) {
    return false
  }

  return month > currentMonth
}
