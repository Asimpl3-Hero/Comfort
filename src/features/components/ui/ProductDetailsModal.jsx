import '../styles/ui/product-details-modal.css'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useEscapeKey } from '../../../app/hooks/index.js'
import { formatCurrencyFromCents } from '../../../shared/utils/currency.js'

export function ProductDetailsModal({
  isOpen = false,
  product = null,
  isRecentlyAdded = false,
  currentCartQuantity = 0,
  onClose,
  onAddToCart,
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'es'

  useEscapeKey(onClose, isOpen)

  const stock = Number(product?.stock ?? 0)
  const selectedInCart = Number(currentCartQuantity ?? 0)
  const remainingStock = Math.max(0, stock - selectedInCart)
  const isOutOfStock = remainingStock <= 0
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setQuantity(remainingStock > 0 ? 1 : 0)
  }, [product?.id, isOpen, remainingStock])

  const canDecrease = quantity > 1
  const canIncrease = quantity < remainingStock

  const handleDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  const handleIncrease = () => {
    setQuantity((current) => Math.min(remainingStock, current + 1))
  }

  if (!isOpen || !product) {
    return null
  }

  const price = formatCurrencyFromCents(product.priceInCents ?? 0, product.currency, language)

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
              {t('product.stock', { count: stock })}
            </p>
            <div className="product-details-quantity-wrap">
              <p className="product-details-remaining">
                {t('productModal.remainingStock', { count: remainingStock })}
              </p>
              <div className="product-details-quantity-control" role="group" aria-label={t('productModal.quantity')}>
                <button
                  type="button"
                  className="product-details-qty-btn"
                  aria-label={t('productModal.decreaseQuantity')}
                  onClick={handleDecrease}
                  disabled={isOutOfStock || !canDecrease}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    remove
                  </span>
                </button>
                <span className="product-details-qty-value">{quantity}</span>
                <button
                  type="button"
                  className="product-details-qty-btn"
                  aria-label={t('productModal.increaseQuantity')}
                  onClick={handleIncrease}
                  disabled={isOutOfStock || !canIncrease}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    add
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="product-details-footer">
          <button type="button" className="product-details-secondary" onClick={onClose}>
            {t('productModal.close')}
          </button>
          <button
            type="button"
            className={`product-details-primary${isRecentlyAdded ? ' is-added' : ''}`}
            onClick={() => onAddToCart?.(product, quantity)}
            disabled={isOutOfStock}
          >
            {isOutOfStock
              ? t('product.outOfStock')
              : isRecentlyAdded
                ? t('product.addedToCart')
                : t('product.addToCart')}
          </button>
        </footer>
      </div>
    </div>
  )
}
