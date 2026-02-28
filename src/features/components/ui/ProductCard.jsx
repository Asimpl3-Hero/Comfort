import '../styles/ui/product-card.css'

const fallbackProduct = {
  id: '',
  name: 'Unnamed product',
  tone: '',
  price: 0,
  imageUrl: '',
}

const defaultFormatPrice = (value) => `$${Number(value).toFixed(0)}`

export function ProductCard({
  product = fallbackProduct,
  isFavorite = false,
  onToggleFavorite,
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
          <p>{safeProduct.tone}</p>
        </div>
        <strong>{formatPrice(safeProduct.price)}</strong>
      </div>
    </article>
  )
}
