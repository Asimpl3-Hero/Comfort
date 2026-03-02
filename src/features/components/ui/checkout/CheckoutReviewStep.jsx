import { formatCurrencyFromCents } from '../../../../shared/utils/currency.js'
import { describePaymentMethod } from '../../../shop/checkout/lib/checkout-form.js'

export function CheckoutReviewStep({
  t,
  language,
  product,
  productQuantity = 1,
  cartTotalQuantity = 1,
  shippingForm,
  paymentForm,
  paymentMethodType,
  paymentMethodDataForm,
  detectedBrand,
  detectedBrandMeta,
  unitPriceInCents,
  productAmountInCents,
  baseFeeInCents,
  deliveryFeeInCents,
  totalInCents,
  currency,
}) {
  return (
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
            {describePaymentMethod(paymentMethodType, paymentForm, paymentMethodDataForm, detectedBrand, t)}
          </p>
          {paymentMethodType === 'CARD' && <p>{t('checkout.summary.exp', { value: paymentForm.expiry })}</p>}
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
              <p className="checkout-muted-line">
                {t('checkout.summary.productQuantity', { count: productQuantity })}
              </p>
              <p className="checkout-muted-line">
                {t('checkout.summary.unitPrice', {
                  price: formatCurrencyFromCents(unitPriceInCents, currency, language),
                })}
              </p>
            </div>
            <p className="checkout-strong">
              {formatCurrencyFromCents(productAmountInCents, currency, language)}
            </p>
          </div>
          <div className="checkout-cart-item">
            <p>{t('checkout.summary.cartItems')}</p>
            <p>{cartTotalQuantity}</p>
          </div>
          <div className="checkout-cart-item">
            <p>{t('checkout.summary.productSubtotal')}</p>
            <p>{formatCurrencyFromCents(productAmountInCents, currency, language)}</p>
          </div>
          <div className="checkout-cart-item">
            <p>{t('checkout.summary.baseFee')}</p>
            <p>{formatCurrencyFromCents(baseFeeInCents, currency, language)}</p>
          </div>
          <div className="checkout-cart-item">
            <p>{t('checkout.summary.deliveryFee')}</p>
            <p>{formatCurrencyFromCents(deliveryFeeInCents, currency, language)}</p>
          </div>
        </div>
        <div className="checkout-total">
          <p>{t('checkout.summary.totalToPay')}</p>
          <p>{formatCurrencyFromCents(totalInCents, currency, language)}</p>
        </div>
      </article>
    </section>
  )
}
