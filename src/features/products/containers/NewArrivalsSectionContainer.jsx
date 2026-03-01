import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../../app/hooks/index.js'
import { NewArrivalsSection } from '../../components/ui/NewArrivalsSection.jsx'
import { fetchProducts, toggleFavorite } from '../model/productsSlice.js'
import {
  selectFavoriteIds,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '../model/selectors.js'

export function NewArrivalsSectionContainer({ onBuyWithCard }) {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const favoriteIds = useAppSelector(selectFavoriteIds)
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

  const handleToggleFavorite = (productId) => {
    dispatch(toggleFavorite(productId))
  }

  const handleBuyWithCard = (product) => {
    onBuyWithCard?.(product)
  }

  return (
    <NewArrivalsSection
      products={products}
      favoriteIds={favoriteIds}
      status={status}
      error={error}
      onRetry={handleRetry}
      onToggleFavorite={handleToggleFavorite}
      onBuyWithCard={handleBuyWithCard}
    />
  )
}
