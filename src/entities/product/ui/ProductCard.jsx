import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../model/productsSlice.js'
import './product-card.css'

export function ProductCard({ product }) {
  const dispatch = useDispatch()
  const isFavorite = useSelector((state) =>
    state.products.favoriteIds.includes(product.id),
  )

  return (
    <article className="product-card">
      <div className="product-card-media">
        <div
          className="product-card-image"
          role="img"
          aria-label={product.name}
          style={{ backgroundImage: `url('${product.imageUrl}')` }}
        />
        <button
          type="button"
          className="favorite-button"
          aria-label={`Toggle favorite for ${product.name}`}
          aria-pressed={isFavorite}
          onClick={() => dispatch(toggleFavorite(product.id))}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>
      <div className="product-card-meta">
        <div>
          <h3>{product.name}</h3>
          <p>{product.tone}</p>
        </div>
        <strong>${product.price}</strong>
      </div>
    </article>
  )
}
