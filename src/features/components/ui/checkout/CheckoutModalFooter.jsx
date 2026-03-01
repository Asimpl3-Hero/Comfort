export function CheckoutModalFooter({
  t,
  isSubmitting,
  activeStepIndex,
  isLastStep,
  primaryButtonClassName,
  onBack,
  onNext,
}) {
  return (
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
          onClick={onBack}
          disabled={activeStepIndex === 0 || isSubmitting}
        >
          {t('checkout.buttons.back')}
        </button>
        <button
          type="button"
          className={primaryButtonClassName}
          onClick={onNext}
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
  )
}
