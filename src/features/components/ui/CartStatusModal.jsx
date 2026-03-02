import '../styles/ui/cart-status-modal.css'

import { useTranslation } from 'react-i18next'

import { useEscapeKey } from '../../../app/hooks/index.js'
import { formatCurrencyFromCents } from '../../../shared/utils/currency.js'

export function CartStatusModal({
  isOpen = false,
  onClose,
  items = [],
  totalQuantity = 0,
  totalInCents = 0,
  currency = 'COP',
  onClearCart,
  onProceedToPayment,
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'es'

  useEscapeKey(onClose, isOpen)

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="cart-modal"
      role="dialog"
      aria-modal="true"
      aria-label={t('cart.ariaLabel')}
      onClick={onClose}
    >
      <div className="cart-modal-backdrop" />
      <div className="cart-modal-panel" onClick={(event) => event.stopPropagation()}>
        <header className="cart-modal-header">
          <h2>{t('cart.title')}</h2>
          <button type="button" className="cart-modal-close" onClick={onClose}>
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </header>

        <div className="cart-modal-body">
          {items.length === 0 ? (
            <div className="cart-modal-empty">
              <p>{t('cart.empty')}</p>
            </div>
          ) : (
            <>
              <ul className="cart-modal-list">
                {items.map((item) => (
                  <li key={item.productId} className="cart-modal-item">
                    <div className="cart-modal-item-main">
                      <p className="cart-modal-item-title">{item.product.name}</p>
                      <p className="cart-modal-item-meta">
                        {t('cart.itemQuantity', {
                          count: item.quantity,
                        })}
                      </p>
                      <p className="cart-modal-item-meta">
                        {t('cart.itemStock', {
                          count: item.product.stock,
                        })}
                      </p>
                      <p className="cart-modal-item-meta">
                        {t('cart.unitPrice', {
                          price: formatCurrencyFromCents(
                            item.product.priceInCents,
                            item.product.currency,
                            language,
                          ),
                        })}
                      </p>
                    </div>
                    <p className="cart-modal-item-total">
                      {t('cart.itemSubtotal', {
                        total: formatCurrencyFromCents(
                          item.totalInCents,
                          item.product.currency,
                          language,
                        ),
                      })}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="cart-modal-summary">
                <p>{t('cart.totalItems', { count: totalQuantity })}</p>
                <p>
                  {t('cart.total', {
                    total: formatCurrencyFromCents(totalInCents, currency, language),
                  })}
                </p>
              </div>
            </>
          )}
        </div>

        <footer className="cart-modal-footer">
          <button
            type="button"
            className="cart-secondary-btn"
            onClick={onClearCart}
            disabled={items.length === 0}
          >
            {t('cart.clear')}
          </button>
          <button
            type="button"
            className="cart-primary-btn"
            onClick={onProceedToPayment}
            disabled={items.length === 0}
          >
            {t('cart.proceed')}
          </button>
        </footer>
      </div>
    </div>
  )
}
