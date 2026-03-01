import '../styles/ui/product-card.css'

import { useTranslation } from 'react-i18next'

export function ProductCard({
  product = {},
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  formatPrice,
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'es'
  const locale = language === 'es' ? 'es-CO' : 'en-US'
  const resolvedFormatPrice =
    formatPrice ??
    ((valueInCents, currency = 'COP') =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(Number(valueInCents) / 100))
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

  return (
    <article className="product-card">
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
          onClick={() => onToggleFavorite?.(safeProduct.id)}
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
        className="pay-with-card-btn"
        onClick={() => onAddToCart?.(safeProduct)}
        disabled={safeProduct.stock <= 0}
      >
        {safeProduct.stock > 0 ? t('product.addToCart') : t('product.outOfStock')}
      </button>
    </article>
  )
}
