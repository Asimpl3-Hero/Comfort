import '../styles/ui/product-card.css'

import { useTranslation } from 'react-i18next'

import { formatCurrencyFromCents } from '../../../shared/utils/currency.js'

export function ProductCard({
  product = {},
  isFavorite = false,
  isRecentlyAdded = false,
  onToggleFavorite,
  onOpenDetails,
  onAddToCart,
  formatPrice,
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'es'
  const resolvedFormatPrice =
    formatPrice ??
    ((valueInCents, currency = 'COP') =>
      formatCurrencyFromCents(valueInCents, currency, language))
  const fallbackProduct = {
    id: '',
    name: t('product.unnamed'),
    description: t('product.noDescription'),
    priceInCents: 0,
    stock: 0,
    currency: 'COP',
    imageUrl: '',
  }

  const safeProduct = { ...fallbackProduct, ...product }
  const isDetailsEnabled = typeof onOpenDetails === 'function'

  const handleOpenDetails = () => {
    onOpenDetails?.(safeProduct)
  }

  return (
    <article
      className={`product-card${isDetailsEnabled ? ' is-clickable' : ''}`}
      role={isDetailsEnabled ? 'button' : undefined}
      tabIndex={isDetailsEnabled ? 0 : undefined}
      aria-label={isDetailsEnabled ? t('product.viewDetails', { name: safeProduct.name }) : undefined}
      onClick={isDetailsEnabled ? handleOpenDetails : undefined}
      onKeyDown={
        isDetailsEnabled
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleOpenDetails()
              }
            }
          : undefined
      }
    >
      <div className="product-card-media">
        <div
          className="product-card-image"
          role="img"
          aria-label={safeProduct.name}
          style={{ backgroundImage: `url('${safeProduct.imageUrl}')` }}
        />
        <button
          type="button"
          className="favorite-button"
          aria-label={t('product.toggleFavorite', { name: safeProduct.name })}
          aria-pressed={isFavorite}
          onClick={(event) => {
            event.stopPropagation()
            onToggleFavorite?.(safeProduct.id)
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>
      <div className="product-card-meta">
        <div className="product-card-copy">
          <h3 className="product-card-title">{safeProduct.name}</h3>
          <p className="product-card-description">{safeProduct.description}</p>
          <p className="product-card-stock">{t('product.stock', { count: safeProduct.stock })}</p>
        </div>
        <strong>{resolvedFormatPrice(safeProduct.priceInCents, safeProduct.currency)}</strong>
      </div>
      <button
        type="button"
        className={`pay-with-card-btn${isRecentlyAdded ? ' is-added' : ''}`}
        onClick={(event) => {
          event.stopPropagation()
          onAddToCart?.(safeProduct)
        }}
        disabled={safeProduct.stock <= 0}
      >
        {safeProduct.stock > 0
          ? isRecentlyAdded
            ? t('product.addedToCart')
            : t('product.addToCart')
          : t('product.outOfStock')}
      </button>
    </article>
  )
}
