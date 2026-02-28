import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../../app/store/hooks.js'
import { fetchProducts } from '../../products/model/productsSlice.js'
import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '../../products/model/selectors.js'
import { ProductCard } from './ProductCard.jsx'

export function NewArrivalsSection() {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectProductsStatus)
  const error = useAppSelector(selectProductsError)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  const handleRetry = () => {
    dispatch(fetchProducts())
  }

  return (
    <section className="new-arrivals-section">
      <div className="container">
        <div className="section-heading">
          <h2>New Arrivals</h2>
          <a href="#" className="view-all-link">
            View all products &rarr;
          </a>
        </div>

        {status === 'loading' && (
          <div className="products-grid" aria-live="polite">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="product-skeleton" key={index.toString()} />
            ))}
          </div>
        )}

        {status === 'failed' && (
          <div className="products-state-card" role="status" aria-live="polite">
            <p>{error ?? 'Could not load products from backend'}</p>
            <button type="button" onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}

        {status === 'succeeded' && products.length === 0 && (
          <div className="products-state-card" role="status" aria-live="polite">
            <p>No products available yet.</p>
          </div>
        )}

        {status === 'succeeded' && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
