export function CheckoutPaymentStep({
  t,
  isSubmitting,
  paymentMethodType,
  paymentMethodOptions,
  paymentForm,
  paymentMethodDataForm,
  paymentErrors,
  detectedBrandMeta,
  onPaymentMethodTypeChange,
  onPaymentChange,
  onPaymentMethodDataChange,
}) {
  return (
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
              {paymentMethodOptions.map((option) => (
                <label
                  key={option.value}
                  className={`payment-method-option${paymentMethodType === option.value ? ' is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethodType"
                    value={option.value}
                    checked={paymentMethodType === option.value}
                    disabled={isSubmitting}
                    onChange={onPaymentMethodTypeChange}
                  />
                  <span className="payment-method-main">
                    <span className="payment-method-badge" aria-hidden="true">
                      {option.logoSrc ? <img src={option.logoSrc} alt={t(option.logoAltKey)} /> : option.badge}
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
                  onChange={onPaymentChange('cardholder')}
                />
                {paymentErrors.cardholder && <small className="checkout-error">{paymentErrors.cardholder}</small>}
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
                    onChange={onPaymentChange('cardNumber')}
                  />
                  {detectedBrandMeta ? (
                    <img
                      className="card-brand-input-logo"
                      src={detectedBrandMeta.logo}
                      alt={`${detectedBrandMeta.label} logo`}
                    />
                  ) : null}
                </div>
                {paymentErrors.cardNumber && <small className="checkout-error">{paymentErrors.cardNumber}</small>}
              </label>
              <label className="checkout-field">
                <span>{t('checkout.fields.expiry')}</span>
                <input
                  type="text"
                  maxLength={5}
                  placeholder={t('checkout.placeholders.expiry')}
                  value={paymentForm.expiry}
                  disabled={isSubmitting}
                  onChange={onPaymentChange('expiry')}
                />
                {paymentErrors.expiry && <small className="checkout-error">{paymentErrors.expiry}</small>}
              </label>
              <label className="checkout-field">
                <span>{t('checkout.fields.cvv')}</span>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={paymentForm.cvv}
                  disabled={isSubmitting}
                  onChange={onPaymentChange('cvv')}
                />
                {paymentErrors.cvv && <small className="checkout-error">{paymentErrors.cvv}</small>}
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
                onChange={onPaymentMethodDataChange('nequiPhoneNumber')}
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
                  onChange={onPaymentMethodDataChange('pseUserType')}
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
                  onChange={onPaymentMethodDataChange('pseUserLegalIdType')}
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
                  onChange={onPaymentMethodDataChange('pseUserLegalId')}
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
                  onChange={onPaymentMethodDataChange('pseFinancialInstitutionCode')}
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
                  onChange={onPaymentMethodDataChange('psePaymentDescription')}
                />
                {paymentErrors.psePaymentDescription && (
                  <small className="checkout-error">{paymentErrors.psePaymentDescription}</small>
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
                  onChange={onPaymentMethodDataChange('bancolombiaPaymentDescription')}
                />
                {paymentErrors.bancolombiaPaymentDescription && (
                  <small className="checkout-error">{paymentErrors.bancolombiaPaymentDescription}</small>
                )}
              </label>
              <label className="checkout-field checkout-field-full">
                <span>{t('checkout.fields.sandboxResult')}</span>
                <select
                  value={paymentMethodDataForm.bancolombiaSandboxStatus}
                  disabled={isSubmitting}
                  onChange={onPaymentMethodDataChange('bancolombiaSandboxStatus')}
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
  )
}
