export function CheckoutShippingStep({
  t,
  isSubmitting,
  shippingForm,
  shippingErrors,
  onShippingChange,
}) {
  return (
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
              onChange={onShippingChange('fullName')}
            />
            {shippingErrors.fullName && <small className="checkout-error">{shippingErrors.fullName}</small>}
          </label>
          <label className="checkout-field checkout-field-full">
            <span>{t('checkout.fields.address1')}</span>
            <input
              type="text"
              value={shippingForm.address1}
              disabled={isSubmitting}
              onChange={onShippingChange('address1')}
            />
            {shippingErrors.address1 && <small className="checkout-error">{shippingErrors.address1}</small>}
          </label>
          <label className="checkout-field checkout-field-full">
            <span>{t('checkout.fields.address2')}</span>
            <input
              type="text"
              value={shippingForm.address2}
              disabled={isSubmitting}
              onChange={onShippingChange('address2')}
            />
          </label>
          <label className="checkout-field">
            <span>{t('checkout.fields.city')}</span>
            <input
              type="text"
              value={shippingForm.city}
              disabled={isSubmitting}
              onChange={onShippingChange('city')}
            />
            {shippingErrors.city && <small className="checkout-error">{shippingErrors.city}</small>}
          </label>
          <label className="checkout-field">
            <span>{t('checkout.fields.state')}</span>
            <input
              type="text"
              value={shippingForm.state}
              disabled={isSubmitting}
              onChange={onShippingChange('state')}
            />
            {shippingErrors.state && <small className="checkout-error">{shippingErrors.state}</small>}
          </label>
          <label className="checkout-field checkout-field-full">
            <span>{t('checkout.fields.zip')}</span>
            <input
              type="text"
              value={shippingForm.zip}
              disabled={isSubmitting}
              onChange={onShippingChange('zip')}
            />
            {shippingErrors.zip && <small className="checkout-error">{shippingErrors.zip}</small>}
          </label>
        </div>
      </article>
    </section>
  )
}
