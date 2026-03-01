export function CheckoutLoadingOverlay({ t, loadingMessage, isPendingProlonged }) {
  return (
    <div className="checkout-loading-overlay" role="status" aria-live="polite">
      <span className="checkout-loading-spinner" aria-hidden="true" />
      <p className="checkout-loading-title">{loadingMessage}</p>
      {isPendingProlonged && <p className="checkout-loading-note">{t('checkout.loading.pendingNote')}</p>}
    </div>
  )
}
