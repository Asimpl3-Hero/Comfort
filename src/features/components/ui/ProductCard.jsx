import '../styles/ui/product-card.css'

const fallbackProduct = {
  id: '',
  name: 'Unnamed product',
  description: 'No description available.',
  priceInCents: 0,
  stock: 0,
  currency: 'COP',
  imageUrl: '',
}

const defaultFormatPrice = (valueInCents, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(valueInCents) / 100)

export function ProductCard({
  product = fallbackProduct,
  isFavorite = false,
  onToggleFavorite,
  onBuyWithCard,
  formatPrice = defaultFormatPrice,
}) {
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
          aria-label={`Toggle favorite for ${safeProduct.name}`}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite?.(safeProduct.id)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>
      <div className="product-card-meta">
        <div>
          <h3>{safeProduct.name}</h3>
          <p className="product-card-description">{safeProduct.description}</p>
          <p className="product-card-stock">Stock: {safeProduct.stock} units</p>
        </div>
        <strong>{formatPrice(safeProduct.priceInCents, safeProduct.currency)}</strong>
      </div>
      <button
        type="button"
        className="pay-with-card-btn"
        onClick={() => onBuyWithCard?.(safeProduct)}
        disabled={safeProduct.stock <= 0}
      >
        {safeProduct.stock > 0 ? 'Pay with credit card' : 'Out of stock'}
      </button>
    </article>
  )
}
