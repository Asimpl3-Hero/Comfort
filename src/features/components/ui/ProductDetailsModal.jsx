import '../styles/ui/product-details-modal.css'

import { useTranslation } from 'react-i18next'

import { useEscapeKey } from '../../../app/hooks/index.js'
import { formatCurrencyFromCents } from '../../../shared/utils/currency.js'

export function ProductDetailsModal({
  isOpen = false,
  product = null,
  onClose,
  onAddToCart,
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'es'

  useEscapeKey(onClose, isOpen)

  if (!isOpen || !product) {
    return null
  }

  const price = formatCurrencyFromCents(product.priceInCents ?? 0, product.currency, language)
  const isOutOfStock = Number(product.stock ?? 0) <= 0

  return (
    <div
      className="product-details-modal"
      role="dialog"
      aria-modal="true"
      aria-label={t('productModal.ariaLabel')}
      onClick={onClose}
    >
      <div className="product-details-backdrop" />
      <div className="product-details-panel" onClick={(event) => event.stopPropagation()}>
        <header className="product-details-header">
          <h2>{t('productModal.title')}</h2>
          <button type="button" className="product-details-close" onClick={onClose}>
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </header>

        <div className="product-details-body">
          <div
            className="product-details-image"
            role="img"
            aria-label={product.name}
            style={{ backgroundImage: `url('${product.imageUrl ?? ''}')` }}
          />
          <div className="product-details-copy">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="product-details-price">{price}</p>
            <p className="product-details-stock">
              {t('product.stock', { count: Number(product.stock ?? 0) })}
            </p>
          </div>
        </div>

        <footer className="product-details-footer">
          <button type="button" className="product-details-secondary" onClick={onClose}>
            {t('productModal.close')}
          </button>
          <button
            type="button"
            className="product-details-primary"
            onClick={() => onAddToCart?.(product)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? t('product.outOfStock') : t('product.addToCart')}
          </button>
        </footer>
      </div>
    </div>
  )
}
