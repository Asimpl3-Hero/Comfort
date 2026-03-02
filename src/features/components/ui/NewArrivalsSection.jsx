import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ProductCard } from './ProductCard.jsx'

const INITIAL_VISIBLE_PRODUCTS = 3

export function NewArrivalsSection({
  products = [],
  favoriteIds = [],
  status = 'idle',
  error = null,
  title,
  viewAllLabel,
  onRetry,
  onToggleFavorite,
  onOpenDetails,
  onAddToCart,
  recentlyAddedByProductId = {},
  retryLabel,
  emptyMessage,
  defaultErrorMessage,
  skeletonCount = 3,
}) {
  const { t } = useTranslation()
  const [showAllProducts, setShowAllProducts] = useState(false)

  const resolvedTitle = title ?? t('newArrivals.title')
  const resolvedViewAllLabel = viewAllLabel ?? t('newArrivals.viewAll')
  const resolvedRetryLabel = retryLabel ?? t('newArrivals.retry')
  const resolvedEmptyMessage = emptyMessage ?? t('newArrivals.empty')
  const resolvedErrorMessage = defaultErrorMessage ?? t('newArrivals.errorDefault')

  const isLoading = status === 'loading' || status === 'idle'
  const hasError = status === 'failed'
  const isEmpty = status === 'succeeded' && products.length === 0
  const isReady = status === 'succeeded' && products.length > 0
  const shouldShowViewAllButton = isReady && products.length > INITIAL_VISIBLE_PRODUCTS && !showAllProducts
  const visibleProducts = useMemo(
    () => (showAllProducts ? products : products.slice(0, INITIAL_VISIBLE_PRODUCTS)),
    [products, showAllProducts],
  )

  useEffect(() => {
    setShowAllProducts(false)
  }, [products])

  return (
    <section className="new-arrivals-section">
      <div className="container">
        <div className="section-heading">
          <h2>{resolvedTitle}</h2>
          {shouldShowViewAllButton ? (
            <button type="button" className="view-all-link" onClick={() => setShowAllProducts(true)}>
              {resolvedViewAllLabel}
            </button>
          ) : null}
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
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favoriteIds.includes(product.id)}
                isRecentlyAdded={Boolean(recentlyAddedByProductId[product.id])}
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
