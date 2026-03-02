import '../styles/ui/checkout-stepper-modal.css'

import { useTranslation } from 'react-i18next'

import { useEscapeKey } from '../../../app/hooks/index.js'
import {
  defaultPayment,
  defaultShipping,
  PAYMENT_METHOD_OPTIONS,
} from '../../shop/checkout/const/index.js'
import { useCheckoutStepper } from '../../shop/checkout/hooks/useCheckoutStepper.js'
import { CheckoutLoadingOverlay } from './checkout/CheckoutLoadingOverlay.jsx'
import { CheckoutModalFooter } from './checkout/CheckoutModalFooter.jsx'
import { CheckoutPaymentStep } from './checkout/CheckoutPaymentStep.jsx'
import { CheckoutReviewStep } from './checkout/CheckoutReviewStep.jsx'
import { CheckoutShippingStep } from './checkout/CheckoutShippingStep.jsx'
import { StepperProgress } from './StepperProgress.jsx'

export function CheckoutStepperModal({
  isOpen = false,
  onClose,
  title,
  steps,
  shipping = defaultShipping,
  payment = defaultPayment,
  product = null,
  productQuantity = 1,
  cartTotalQuantity = 1,
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

  useEscapeKey(onClose, isOpen)

  const {
    activeStepIndex,
    currency,
    detectedBrand,
    detectedBrandMeta,
    handleBack,
    handleNext,
    handlePaymentChange,
    handlePaymentMethodDataChange,
    handlePaymentMethodTypeChange,
    handleShippingChange,
    handleFillWithMockData,
    isLastStep,
    paymentErrors,
    paymentForm,
    paymentMethodDataForm,
    paymentMethodType,
    primaryButtonClassName,
    productQuantity: normalizedProductQuantity,
    unitPriceInCents,
    productAmountInCents,
    shippingErrors,
    shippingForm,
    totalInCents,
  } = useCheckoutStepper({
    initialShipping: { ...defaultShipping, ...shipping },
    initialPayment: { ...defaultPayment, ...payment },
    product,
    productQuantity,
    baseFeeInCents,
    deliveryFeeInCents,
    resolvedSteps,
    onPlaceOrder,
    t,
  })
  const isShippingStep = activeStepIndex === 0

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
        className={`checkout-modal-panel${isShippingStep ? ' is-shipping-step' : ''}`}
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

        <div className={`checkout-modal-body${isShippingStep ? ' is-shipping-step' : ''}`}>
          {activeStepIndex < 2 && (
            <div className="checkout-fill-action">
              <button
                type="button"
                className="checkout-fill-btn"
                onClick={handleFillWithMockData}
                disabled={isSubmitting}
              >
                {t('checkout.buttons.fillTestData')}
              </button>
            </div>
          )}

          {activeStepIndex === 0 && (
            <CheckoutShippingStep
              t={t}
              isSubmitting={isSubmitting}
              shippingForm={shippingForm}
              shippingErrors={shippingErrors}
              onShippingChange={handleShippingChange}
            />
          )}

          {activeStepIndex === 1 && (
            <CheckoutPaymentStep
              t={t}
              isSubmitting={isSubmitting}
              paymentMethodType={paymentMethodType}
              paymentMethodOptions={PAYMENT_METHOD_OPTIONS}
              paymentForm={paymentForm}
              paymentMethodDataForm={paymentMethodDataForm}
              paymentErrors={paymentErrors}
              detectedBrandMeta={detectedBrandMeta}
              onPaymentMethodTypeChange={handlePaymentMethodTypeChange}
              onPaymentChange={handlePaymentChange}
              onPaymentMethodDataChange={handlePaymentMethodDataChange}
            />
          )}

          {activeStepIndex === 2 && (
            <CheckoutReviewStep
              t={t}
              language={language}
              product={product}
              cartTotalQuantity={cartTotalQuantity}
              shippingForm={shippingForm}
              paymentForm={paymentForm}
              paymentMethodType={paymentMethodType}
              paymentMethodDataForm={paymentMethodDataForm}
              detectedBrand={detectedBrand}
              detectedBrandMeta={detectedBrandMeta}
              productQuantity={normalizedProductQuantity}
              unitPriceInCents={unitPriceInCents}
              productAmountInCents={productAmountInCents}
              baseFeeInCents={baseFeeInCents}
              deliveryFeeInCents={deliveryFeeInCents}
              totalInCents={totalInCents}
              currency={currency}
            />
          )}
        </div>

        <CheckoutModalFooter
          t={t}
          isSubmitting={isSubmitting}
          activeStepIndex={activeStepIndex}
          isLastStep={isLastStep}
          primaryButtonClassName={primaryButtonClassName}
          onBack={handleBack}
          onNext={handleNext}
        />

        {isSubmitting && (
          <CheckoutLoadingOverlay
            t={t}
            loadingMessage={resolvedLoadingMessage}
            isPendingProlonged={isPendingProlonged}
          />
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
