import './product-card.css'

import { useAppDispatch, useAppSelector } from '../../../app/store/hooks.js'
import { toggleFavorite } from '../model/productsSlice.js'
import { selectIsProductFavorite } from '../model/selectors.js'

export function ProductCard({ product }) {
  const dispatch = useAppDispatch()
  const isFavorite = useAppSelector(selectIsProductFavorite(product.id))

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
