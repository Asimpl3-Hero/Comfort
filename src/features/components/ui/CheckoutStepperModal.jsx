import '../styles/ui/checkout-stepper-modal.css'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useEscapeKey } from '../../../app/hooks/index.js'
import { StepperProgress } from './StepperProgress.jsx'

const defaultShipping = {
  fullName: 'John Doe',
  address1: '123 Minimalist St.',
  address2: 'Apt 4B',
  city: 'New York',
  state: 'NY',
  zip: '10001',
}

const defaultPayment = {
  cardholder: 'John Doe',
  cardNumber: '4242424242424242',
  expiry: '12/25',
  cvv: '123',
}

const defaultPaymentMethodData = {
  nequiPhoneNumber: '3991111111',
  pseUserType: '0',
  pseUserLegalIdType: 'CC',
  pseUserLegalId: '1999888777',
  pseFinancialInstitutionCode: '1',
  psePaymentDescription: 'Pago Comfort',
  bancolombiaPaymentDescription: 'Pago Comfort',
  bancolombiaSandboxStatus: 'APPROVED',
}

function getCardDigits(value) {
  return value.replace(/\D/g, '')
}

function getCardBrand(cardNumber) {
  const digits = getCardDigits(cardNumber)
  if (digits.startsWith('4')) return 'VISA'
  if (/^5[1-5]/.test(digits)) return 'MASTERCARD'
  if (/^3[47]/.test(digits)) return 'AMEX'
  return 'CARD'
}

function getMaskedCard(cardNumber) {
  const digits = getCardDigits(cardNumber)
  const last4 = digits.slice(-4) || '0000'
  return `**** ${last4}`
}

function formatMoney(amountInCents, currency = 'COP', language = 'es') {
  const locale = language === 'es' ? 'es-CO' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amountInCents) / 100)
}

function mapPaymentMethodData(paymentMethodType, data) {
  if (paymentMethodType === 'CARD') {
    return undefined
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

function describePaymentMethod(paymentMethodType, cardData, data, detectedBrand, t) {
  if (paymentMethodType === 'CARD') {
    return `${detectedBrand} ${getMaskedCard(cardData.cardNumber)}`
  }

  if (paymentMethodType === 'NEQUI') {
    return `NEQUI ${data.nequiPhoneNumber}`
  }

  if (paymentMethodType === 'PSE') {
    return `PSE ${data.pseUserLegalIdType} ${data.pseUserLegalId}`
  }

  return t('checkout.paymentDescription.bancolombiaTransfer')
}

const CARD_BRANDS = {
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

const PAYMENT_METHOD_OPTIONS = [
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

export function CheckoutStepperModal({
  isOpen = false,
  onClose,
  title,
  steps,
  shipping = defaultShipping,
  payment = defaultPayment,
  product = null,
  baseFeeInCents = 1900,
  deliveryFeeInCents = 3500,
  isSubmitting = false,
  submitError = '',
  loadingMessage,
  isPendingProlonged = false,
  onPlaceOrder,
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'es'

  const resolvedTitle = title ?? t('checkout.title')
  const resolvedSteps =
    steps ??
    [
      { id: 'shipping', label: t('checkout.steps.shipping') },
      { id: 'payment', label: t('checkout.steps.payment') },
      { id: 'review', label: t('checkout.steps.review') },
    ]
  const resolvedLoadingMessage = loadingMessage ?? t('home.loading.processingPayment')

  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [shippingForm, setShippingForm] = useState({ ...defaultShipping, ...shipping })
  const [paymentForm, setPaymentForm] = useState({ ...defaultPayment, ...payment })
  const [shippingErrors, setShippingErrors] = useState({})
  const [paymentErrors, setPaymentErrors] = useState({})
  const [paymentMethodType, setPaymentMethodType] = useState('CARD')
  const [paymentMethodDataForm, setPaymentMethodDataForm] = useState(defaultPaymentMethodData)

  const maxStep = resolvedSteps.length - 1
  const isLastStep = activeStepIndex === maxStep

  useEscapeKey(onClose, isOpen)

  const productAmountInCents = Number(product?.priceInCents ?? 0)
  const currency = product?.currency ?? 'COP'
  const detectedBrand = getCardBrand(paymentForm.cardNumber)
  const detectedBrandMeta = CARD_BRANDS[detectedBrand] ?? null
  const totalInCents = useMemo(
    () => productAmountInCents + baseFeeInCents + deliveryFeeInCents,
    [baseFeeInCents, deliveryFeeInCents, productAmountInCents],
  )

  const primaryButtonClassName = isLastStep
    ? 'checkout-primary-btn checkout-place-order-btn'
    : 'checkout-primary-btn'

  const validateShipping = () => {
    const errors = {}
    if (!shippingForm.fullName.trim()) errors.fullName = t('checkout.validation.fullNameRequired')
    if (!shippingForm.address1.trim()) errors.address1 = t('checkout.validation.addressRequired')
    if (!shippingForm.city.trim()) errors.city = t('checkout.validation.cityRequired')
    if (!shippingForm.state.trim()) errors.state = t('checkout.validation.stateRequired')
    if (!shippingForm.zip.trim()) errors.zip = t('checkout.validation.zipRequired')
    setShippingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePayment = () => {
    const errors = {}

    if (paymentMethodType === 'CARD') {
      const digits = getCardDigits(paymentForm.cardNumber)
      if (!paymentForm.cardholder.trim()) {
        errors.cardholder = t('checkout.validation.cardholderRequired')
      }
      if (digits.length < 13) {
        errors.cardNumber = t('checkout.validation.cardNumberInvalid')
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.expiry)) {
        errors.expiry = t('checkout.validation.expiryFormat')
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

    setPaymentErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = async () => {
    if (activeStepIndex === 0 && !validateShipping()) {
      return
    }

    if (activeStepIndex === 1 && !validatePayment()) {
      return
    }

    if (isLastStep) {
      await onPlaceOrder?.({
        shipping: shippingForm,
        payment: paymentForm,
        paymentMethodType,
        paymentMethodData: mapPaymentMethodData(paymentMethodType, paymentMethodDataForm),
        product,
        summary: {
          productAmountInCents,
          baseFeeInCents,
          deliveryFeeInCents,
          totalInCents,
          currency,
        },
      })
      return
    }

    setActiveStepIndex((current) => Math.min(current + 1, maxStep))
  }

  const handleBack = () => {
    setActiveStepIndex((current) => Math.max(current - 1, 0))
  }

  const handleShippingChange = (field) => (event) => {
    setShippingForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handlePaymentChange = (field) => (event) => {
    const value = event.target.value
    if (field === 'cardNumber') {
      setPaymentForm((current) => ({ ...current, [field]: getCardDigits(value) }))
      return
    }

    setPaymentForm((current) => ({ ...current, [field]: value }))
  }

  const handlePaymentMethodTypeChange = (event) => {
    setPaymentMethodType(event.target.value)
  }

  const handlePaymentMethodDataChange = (field) => (event) => {
    setPaymentMethodDataForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  if (!isOpen || !product) {
    return null
  }

  return (
    <div
      className="checkout-modal"
      role="dialog"
      aria-modal="true"
      aria-label={resolvedTitle}
      onClick={isSubmitting ? undefined : onClose}
    >
      <div className="checkout-modal-backdrop" />
      <div
        className="checkout-modal-panel"
        aria-busy={isSubmitting}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="checkout-modal-header">
          <div className="checkout-modal-headline">
            <h2>{resolvedTitle}</h2>
            <button
              type="button"
              className="checkout-modal-close"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
            </button>
          </div>
          <StepperProgress
            steps={resolvedSteps}
            currentStep={activeStepIndex}
            ariaLabel={t('checkout.progressAria')}
          />
        </header>

        <div className="checkout-modal-body">
          {activeStepIndex === 0 && (
            <section className="checkout-stage">
              <article className="checkout-card">
                <h3>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    local_shipping
                  </span>
                  {t('checkout.sections.shippingDetails')}
                </h3>
                <div className="checkout-form-grid">
                  <label className="checkout-field checkout-field-full">
                    <span>{t('checkout.fields.fullName')}</span>
                    <input
                      type="text"
                      value={shippingForm.fullName}
                      disabled={isSubmitting}
                      onChange={handleShippingChange('fullName')}
                    />
                    {shippingErrors.fullName && (
                      <small className="checkout-error">{shippingErrors.fullName}</small>
                    )}
                  </label>
                  <label className="checkout-field checkout-field-full">
                    <span>{t('checkout.fields.address1')}</span>
                    <input
                      type="text"
                      value={shippingForm.address1}
                      disabled={isSubmitting}
                      onChange={handleShippingChange('address1')}
                    />
                    {shippingErrors.address1 && (
                      <small className="checkout-error">{shippingErrors.address1}</small>
                    )}
                  </label>
                  <label className="checkout-field checkout-field-full">
                    <span>{t('checkout.fields.address2')}</span>
                    <input
                      type="text"
                      value={shippingForm.address2}
                      disabled={isSubmitting}
                      onChange={handleShippingChange('address2')}
                    />
                  </label>
                  <label className="checkout-field">
                    <span>{t('checkout.fields.city')}</span>
                    <input
                      type="text"
                      value={shippingForm.city}
                      disabled={isSubmitting}
                      onChange={handleShippingChange('city')}
                    />
                    {shippingErrors.city && (
                      <small className="checkout-error">{shippingErrors.city}</small>
                    )}
                  </label>
                  <label className="checkout-field">
                    <span>{t('checkout.fields.state')}</span>
                    <input
                      type="text"
                      value={shippingForm.state}
                      disabled={isSubmitting}
                      onChange={handleShippingChange('state')}
                    />
                    {shippingErrors.state && (
                      <small className="checkout-error">{shippingErrors.state}</small>
                    )}
                  </label>
                  <label className="checkout-field checkout-field-full">
                    <span>{t('checkout.fields.zip')}</span>
                    <input
                      type="text"
                      value={shippingForm.zip}
                      disabled={isSubmitting}
                      onChange={handleShippingChange('zip')}
                    />
                    {shippingErrors.zip && (
                      <small className="checkout-error">{shippingErrors.zip}</small>
                    )}
                  </label>
                </div>
              </article>
            </section>
          )}

          {activeStepIndex === 1 && (
            <section className="checkout-stage">
              <article className="checkout-card">
                <h3>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    credit_card
                  </span>
                  {t('checkout.sections.paymentMethod')}
                </h3>
                <div className="checkout-form-grid">
                  <fieldset className="checkout-field checkout-field-full payment-method-fieldset">
                    <legend>{t('checkout.fields.paymentType')}</legend>
                    <div
                      className="payment-method-options"
                      role="radiogroup"
                      aria-label={t('checkout.fields.paymentType')}
                    >
                      {PAYMENT_METHOD_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className={`payment-method-option${
                            paymentMethodType === option.value ? ' is-selected' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethodType"
                            value={option.value}
                            checked={paymentMethodType === option.value}
                            disabled={isSubmitting}
                            onChange={handlePaymentMethodTypeChange}
                          />
                          <span className="payment-method-main">
                            <span className="payment-method-badge" aria-hidden="true">
                              {option.logoSrc ? (
                                <img src={option.logoSrc} alt={t(option.logoAltKey)} />
                              ) : (
                                option.badge
                              )}
                            </span>
                            <span className="payment-method-label">{t(option.labelKey)}</span>
                          </span>
                          <span className="payment-method-radio-indicator" aria-hidden="true" />
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {paymentMethodType === 'CARD' && (
                    <>
                      <label className="checkout-field checkout-field-full">
                        <span>{t('checkout.fields.cardholderName')}</span>
                        <input
                          type="text"
                          value={paymentForm.cardholder}
                          disabled={isSubmitting}
                          onChange={handlePaymentChange('cardholder')}
                        />
                        {paymentErrors.cardholder && (
                          <small className="checkout-error">{paymentErrors.cardholder}</small>
                        )}
                      </label>
                      <label className="checkout-field checkout-field-full">
                        <span>{t('checkout.fields.cardNumber')}</span>
                        <div className="card-input-shell">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={19}
                            value={paymentForm.cardNumber}
                            disabled={isSubmitting}
                            onChange={handlePaymentChange('cardNumber')}
                          />
                          {detectedBrandMeta ? (
                            <img
                              className="card-brand-input-logo"
                              src={detectedBrandMeta.logo}
                              alt={`${detectedBrandMeta.label} logo`}
                            />
                          ) : null}
                        </div>
                        {paymentErrors.cardNumber && (
                          <small className="checkout-error">{paymentErrors.cardNumber}</small>
                        )}
                      </label>
                      <label className="checkout-field">
                        <span>{t('checkout.fields.expiry')}</span>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder={t('checkout.placeholders.expiry')}
                          value={paymentForm.expiry}
                          disabled={isSubmitting}
                          onChange={handlePaymentChange('expiry')}
                        />
                        {paymentErrors.expiry && (
                          <small className="checkout-error">{paymentErrors.expiry}</small>
                        )}
                      </label>
                      <label className="checkout-field">
                        <span>{t('checkout.fields.cvv')}</span>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={paymentForm.cvv}
                          disabled={isSubmitting}
                          onChange={handlePaymentChange('cvv')}
                        />
                        {paymentErrors.cvv && (
                          <small className="checkout-error">{paymentErrors.cvv}</small>
                        )}
                      </label>
                    </>
                  )}
                  {paymentMethodType === 'NEQUI' && (
                    <label className="checkout-field checkout-field-full">
                      <span>{t('checkout.fields.nequiPhoneNumber')}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={paymentMethodDataForm.nequiPhoneNumber}
                        disabled={isSubmitting}
                        onChange={handlePaymentMethodDataChange('nequiPhoneNumber')}
                      />
                      {paymentErrors.nequiPhoneNumber && (
                        <small className="checkout-error">{paymentErrors.nequiPhoneNumber}</small>
                      )}
                    </label>
                  )}
                  {paymentMethodType === 'PSE' && (
                    <>
                      <label className="checkout-field">
                        <span>{t('checkout.fields.userType')}</span>
                        <select
                          value={paymentMethodDataForm.pseUserType}
                          disabled={isSubmitting}
                          onChange={handlePaymentMethodDataChange('pseUserType')}
                        >
                          <option value="0">{t('checkout.options.naturalPerson')}</option>
                          <option value="1">{t('checkout.options.legalEntity')}</option>
                        </select>
                      </label>
                      <label className="checkout-field">
                        <span>{t('checkout.fields.documentType')}</span>
                        <select
                          value={paymentMethodDataForm.pseUserLegalIdType}
                          disabled={isSubmitting}
                          onChange={handlePaymentMethodDataChange('pseUserLegalIdType')}
                        >
                          <option value="CC">CC</option>
                          <option value="NIT">NIT</option>
                        </select>
                      </label>
                      <label className="checkout-field checkout-field-full">
                        <span>{t('checkout.fields.documentNumber')}</span>
                        <input
                          type="text"
                          value={paymentMethodDataForm.pseUserLegalId}
                          disabled={isSubmitting}
                          onChange={handlePaymentMethodDataChange('pseUserLegalId')}
                        />
                        {paymentErrors.pseUserLegalId && (
                          <small className="checkout-error">{paymentErrors.pseUserLegalId}</small>
                        )}
                      </label>
                      <label className="checkout-field">
                        <span>{t('checkout.fields.sandboxBank')}</span>
                        <select
                          value={paymentMethodDataForm.pseFinancialInstitutionCode}
                          disabled={isSubmitting}
                          onChange={handlePaymentMethodDataChange('pseFinancialInstitutionCode')}
                        >
                          <option value="1">{t('checkout.options.approvedBank')}</option>
                          <option value="2">{t('checkout.options.declinedBank')}</option>
                        </select>
                      </label>
                      <label className="checkout-field checkout-field-full">
                        <span>{t('checkout.fields.paymentDescription')}</span>
                        <input
                          type="text"
                          maxLength={30}
                          value={paymentMethodDataForm.psePaymentDescription}
                          disabled={isSubmitting}
                          onChange={handlePaymentMethodDataChange('psePaymentDescription')}
                        />
                        {paymentErrors.psePaymentDescription && (
                          <small className="checkout-error">
                            {paymentErrors.psePaymentDescription}
                          </small>
                        )}
                      </label>
                    </>
                  )}
                  {paymentMethodType === 'BANCOLOMBIA_TRANSFER' && (
                    <>
                      <label className="checkout-field checkout-field-full">
                        <span>{t('checkout.fields.paymentDescription')}</span>
                        <input
                          type="text"
                          maxLength={64}
                          value={paymentMethodDataForm.bancolombiaPaymentDescription}
                          disabled={isSubmitting}
                          onChange={handlePaymentMethodDataChange('bancolombiaPaymentDescription')}
                        />
                        {paymentErrors.bancolombiaPaymentDescription && (
                          <small className="checkout-error">
                            {paymentErrors.bancolombiaPaymentDescription}
                          </small>
                        )}
                      </label>
                      <label className="checkout-field checkout-field-full">
                        <span>{t('checkout.fields.sandboxResult')}</span>
                        <select
                          value={paymentMethodDataForm.bancolombiaSandboxStatus}
                          disabled={isSubmitting}
                          onChange={handlePaymentMethodDataChange('bancolombiaSandboxStatus')}
                        >
                          <option value="APPROVED">{t('checkout.options.approved')}</option>
                          <option value="DECLINED">{t('checkout.options.declined')}</option>
                        </select>
                      </label>
                    </>
                  )}
                </div>
              </article>
            </section>
          )}

          {activeStepIndex === 2 && (
            <section className="checkout-stage checkout-review-grid">
              <div className="checkout-review-stack">
                <article className="checkout-card">
                  <h3>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      local_shipping
                    </span>
                    {t('checkout.sections.shipping')}
                  </h3>
                  <p className="checkout-strong">{shippingForm.fullName}</p>
                  <p>{shippingForm.address1}</p>
                  {shippingForm.address2 && <p>{shippingForm.address2}</p>}
                  <p>
                    {shippingForm.city}, {shippingForm.state} {shippingForm.zip}
                  </p>
                </article>
                <article className="checkout-card">
                  <h3>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      credit_card
                    </span>
                    {t('checkout.sections.payment')}
                  </h3>
                  <p className="checkout-strong">
                    {paymentMethodType === 'CARD' && detectedBrandMeta ? (
                      <img
                        src={detectedBrandMeta.logo}
                        alt={`${detectedBrandMeta.label} logo`}
                        className="card-brand-inline-logo"
                      />
                    ) : null}
                    {describePaymentMethod(
                      paymentMethodType,
                      paymentForm,
                      paymentMethodDataForm,
                      detectedBrand,
                      t,
                    )}
                  </p>
                  {paymentMethodType === 'CARD' && (
                    <p>{t('checkout.summary.exp', { value: paymentForm.expiry })}</p>
                  )}
                </article>
              </div>

              <article className="checkout-card">
                <h3>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    shopping_bag
                  </span>
                  {t('checkout.sections.paymentSummary')}
                </h3>
                <div className="checkout-cart-list">
                  <div className="checkout-cart-item">
                    <div>
                      <p className="checkout-strong">{product.name}</p>
                      <p>{product.description}</p>
                    </div>
                    <p className="checkout-strong">
                      {formatMoney(productAmountInCents, currency, language)}
                    </p>
                  </div>
                  <div className="checkout-cart-item">
                    <p>{t('checkout.summary.baseFee')}</p>
                    <p>{formatMoney(baseFeeInCents, currency, language)}</p>
                  </div>
                  <div className="checkout-cart-item">
                    <p>{t('checkout.summary.deliveryFee')}</p>
                    <p>{formatMoney(deliveryFeeInCents, currency, language)}</p>
                  </div>
                </div>
                <div className="checkout-total">
                  <p>{t('checkout.summary.totalToPay')}</p>
                  <p>{formatMoney(totalInCents, currency, language)}</p>
                </div>
              </article>
            </section>
          )}
        </div>

        <footer className="checkout-modal-footer">
          <div className="checkout-secure">
            <span className="material-symbols-outlined" aria-hidden="true">
              lock
            </span>
            <span>{t('checkout.secureTransaction')}</span>
          </div>
          <div className="checkout-actions">
            <button
              type="button"
              className="checkout-secondary-btn"
              onClick={handleBack}
              disabled={activeStepIndex === 0 || isSubmitting}
            >
              {t('checkout.buttons.back')}
            </button>
            <button
              type="button"
              className={primaryButtonClassName}
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isLastStep
                ? isSubmitting
                  ? t('checkout.buttons.processingPayment')
                  : t('checkout.buttons.payWithCreditCard')
                : t('checkout.buttons.continue')}
              {!isLastStep && (
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              )}
            </button>
          </div>
        </footer>
        {isSubmitting && (
          <div className="checkout-loading-overlay" role="status" aria-live="polite">
            <span className="checkout-loading-spinner" aria-hidden="true" />
            <p className="checkout-loading-title">{resolvedLoadingMessage}</p>
            {isPendingProlonged && (
              <p className="checkout-loading-note">{t('checkout.loading.pendingNote')}</p>
            )}
          </div>
        )}
        {submitError && (
          <p className="checkout-error" style={{ padding: '0 1.5rem 1rem 1.5rem' }}>
            {submitError}
          </p>
        )}
      </div>
    </div>
  )
}
