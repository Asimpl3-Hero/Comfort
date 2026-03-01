import { useTranslation } from 'react-i18next'

import { ProductCard } from './ProductCard.jsx'

export function NewArrivalsSection({
  products = [],
  favoriteIds = [],
  status = 'idle',
  error = null,
  title,
  viewAllLabel,
  viewAllHref = '#',
  onRetry,
  onToggleFavorite,
  onOpenDetails,
  onAddToCart,
  retryLabel,
  emptyMessage,
  defaultErrorMessage,
  skeletonCount = 3,
}) {
  const { t } = useTranslation()
  const resolvedTitle = title ?? t('newArrivals.title')
  const resolvedViewAllLabel = viewAllLabel ?? t('newArrivals.viewAll')
  const resolvedRetryLabel = retryLabel ?? t('newArrivals.retry')
  const resolvedEmptyMessage = emptyMessage ?? t('newArrivals.empty')
  const resolvedErrorMessage = defaultErrorMessage ?? t('newArrivals.errorDefault')

  const isLoading = status === 'loading' || status === 'idle'
  const hasError = status === 'failed'
  const isEmpty = status === 'succeeded' && products.length === 0
  const isReady = status === 'succeeded' && products.length > 0

  return (
    <section className="new-arrivals-section">
      <div className="container">
        <div className="section-heading">
          <h2>{resolvedTitle}</h2>
          <a href={viewAllHref} className="view-all-link">
            {resolvedViewAllLabel}
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
            <p>{error ?? resolvedErrorMessage}</p>
            <button type="button" onClick={onRetry}>
              {resolvedRetryLabel}
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="products-state-card" role="status" aria-live="polite">
            <p>{resolvedEmptyMessage}</p>
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
                onOpenDetails={onOpenDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
