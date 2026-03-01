import '../styles/ui/checkout-stepper-modal.css'

import { useMemo, useState } from 'react'

import { useEscapeKey } from '../../../app/hooks/index.js'
import { StepperProgress } from './StepperProgress.jsx'

const defaultSteps = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

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

function formatMoney(amountInCents, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amountInCents) / 100)
}

export function CheckoutStepperModal({
  isOpen = false,
  onClose,
  title = 'Checkout',
  steps = defaultSteps,
  shipping = defaultShipping,
  payment = defaultPayment,
  product = null,
  baseFeeInCents = 1900,
  deliveryFeeInCents = 3500,
  isSubmitting = false,
  submitError = '',
  loadingMessage = 'Processing payment...',
  isPendingProlonged = false,
  onPlaceOrder,
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [shippingForm, setShippingForm] = useState({ ...defaultShipping, ...shipping })
  const [paymentForm, setPaymentForm] = useState({ ...defaultPayment, ...payment })
  const [shippingErrors, setShippingErrors] = useState({})
  const [paymentErrors, setPaymentErrors] = useState({})

  const maxStep = steps.length - 1
  const isLastStep = activeStepIndex === maxStep

  useEscapeKey(onClose, isOpen)

  const productAmountInCents = Number(product?.priceInCents ?? 0)
  const currency = product?.currency ?? 'COP'
  const totalInCents = useMemo(
    () => productAmountInCents + baseFeeInCents + deliveryFeeInCents,
    [baseFeeInCents, deliveryFeeInCents, productAmountInCents],
  )

  const primaryButtonClassName = isLastStep
    ? 'checkout-primary-btn checkout-place-order-btn'
    : 'checkout-primary-btn'

  const validateShipping = () => {
    const errors = {}
    if (!shippingForm.fullName.trim()) errors.fullName = 'Full name is required'
    if (!shippingForm.address1.trim()) errors.address1 = 'Address is required'
    if (!shippingForm.city.trim()) errors.city = 'City is required'
    if (!shippingForm.state.trim()) errors.state = 'State is required'
    if (!shippingForm.zip.trim()) errors.zip = 'ZIP code is required'
    setShippingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePayment = () => {
    const errors = {}
    const digits = getCardDigits(paymentForm.cardNumber)

    if (!paymentForm.cardholder.trim()) errors.cardholder = 'Cardholder name is required'
    if (digits.length < 13) errors.cardNumber = 'Card number is invalid'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.expiry)) {
      errors.expiry = 'Use MM/YY format'
    }
    if (!/^\d{3,4}$/.test(paymentForm.cvv)) errors.cvv = 'CVV is invalid'

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

  if (!isOpen || !product) {
    return null
  }

  return (
    <div
      className="checkout-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={isSubmitting ? undefined : onClose}
    >
      <div className="checkout-modal-backdrop" />
      <div className="checkout-modal-panel" aria-busy={isSubmitting} onClick={(event) => event.stopPropagation()}>
        <header className="checkout-modal-header">
          <div className="checkout-modal-headline">
            <h2>{title}</h2>
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
          <StepperProgress steps={steps} currentStep={activeStepIndex} ariaLabel="Checkout progress" />
        </header>

        <div className="checkout-modal-body">
          {activeStepIndex === 0 && (
            <section className="checkout-stage">
              <article className="checkout-card">
                <h3>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    local_shipping
                  </span>
                  Shipping Details
                </h3>
                <div className="checkout-form-grid">
                  <label className="checkout-field checkout-field-full">
                    <span>Full name</span>
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
                    <span>Address line 1</span>
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
                    <span>Address line 2</span>
                    <input
                      type="text"
                      value={shippingForm.address2}
                      disabled={isSubmitting}
                      onChange={handleShippingChange('address2')}
                    />
                  </label>
                  <label className="checkout-field">
                    <span>City</span>
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
                    <span>State</span>
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
                    <span>ZIP code</span>
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
                  Payment Method
                </h3>
                <div className="checkout-form-grid">
                  <label className="checkout-field checkout-field-full">
                    <span>Cardholder name</span>
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
                    <span>Card number</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={19}
                      value={paymentForm.cardNumber}
                      disabled={isSubmitting}
                      onChange={handlePaymentChange('cardNumber')}
                    />
                    {paymentErrors.cardNumber && (
                      <small className="checkout-error">{paymentErrors.cardNumber}</small>
                    )}
                  </label>
                  <label className="checkout-field">
                    <span>Expiry (MM/YY)</span>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="12/25"
                      value={paymentForm.expiry}
                      disabled={isSubmitting}
                      onChange={handlePaymentChange('expiry')}
                    />
                    {paymentErrors.expiry && (
                      <small className="checkout-error">{paymentErrors.expiry}</small>
                    )}
                  </label>
                  <label className="checkout-field">
                    <span>CVV</span>
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
                    Shipping
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
                    Payment
                  </h3>
                  <p className="checkout-strong">
                    {getCardBrand(paymentForm.cardNumber)} {getMaskedCard(paymentForm.cardNumber)}
                  </p>
                  <p>Exp: {paymentForm.expiry}</p>
                </article>
              </div>

              <article className="checkout-card">
                <h3>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    shopping_bag
                  </span>
                  Payment Summary
                </h3>
                <div className="checkout-cart-list">
                  <div className="checkout-cart-item">
                    <div>
                      <p className="checkout-strong">{product.name}</p>
                      <p>{product.description}</p>
                    </div>
                    <p className="checkout-strong">{formatMoney(productAmountInCents, currency)}</p>
                  </div>
                  <div className="checkout-cart-item">
                    <p>Base fee</p>
                    <p>{formatMoney(baseFeeInCents, currency)}</p>
                  </div>
                  <div className="checkout-cart-item">
                    <p>Delivery fee</p>
                    <p>{formatMoney(deliveryFeeInCents, currency)}</p>
                  </div>
                </div>
                <div className="checkout-total">
                  <p>Total to pay</p>
                  <p>{formatMoney(totalInCents, currency)}</p>
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
            <span>Secure encrypted transaction</span>
          </div>
          <div className="checkout-actions">
            <button
              type="button"
              className="checkout-secondary-btn"
              onClick={handleBack}
              disabled={activeStepIndex === 0 || isSubmitting}
            >
              Back
            </button>
            <button
              type="button"
              className={primaryButtonClassName}
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isLastStep ? (isSubmitting ? 'Processing payment...' : 'Pay with credit card') : 'Continue'}
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
            <p className="checkout-loading-title">{loadingMessage}</p>
            {isPendingProlonged && (
              <p className="checkout-loading-note">
                Payment is still pending. We will keep checking for confirmation.
              </p>
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
