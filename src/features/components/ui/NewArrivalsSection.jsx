import { ProductCard } from './ProductCard.jsx'

export function NewArrivalsSection({
  products = [],
  favoriteIds = [],
  status = 'idle',
  error = null,
  title = 'New Arrivals',
  viewAllLabel = 'View all products ->',
  viewAllHref = '#',
  onRetry,
  onToggleFavorite,
  retryLabel = 'Retry',
  emptyMessage = 'No products available yet.',
  defaultErrorMessage = 'Could not load products from backend',
  skeletonCount = 3,
}) {
  const isLoading = status === 'loading' || status === 'idle'
  const hasError = status === 'failed'
  const isEmpty = status === 'succeeded' && products.length === 0
  const isReady = status === 'succeeded' && products.length > 0

  return (
    <section className="new-arrivals-section">
      <div className="container">
        <div className="section-heading">
          <h2>{title}</h2>
          <a href={viewAllHref} className="view-all-link">
            {viewAllLabel}
          </a>
        </div>

        {isLoading && (
          <div className="products-grid" aria-live="polite">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div className="product-skeleton" key={index.toString()} />
            ))}
          </div>
        )}

        {hasError && (
          <div className="products-state-card" role="status" aria-live="polite">
            <p>{error ?? defaultErrorMessage}</p>
            <button type="button" onClick={onRetry}>
              {retryLabel}
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="products-state-card" role="status" aria-live="polite">
            <p>{emptyMessage}</p>
          </div>
        )}

        {isReady && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favoriteIds.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
