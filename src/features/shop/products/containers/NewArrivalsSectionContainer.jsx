import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../../../app/hooks/index.js'
import { NewArrivalsSection } from '../../../components/ui/NewArrivalsSection.jsx'
import {
  fetchProducts,
  selectFavoriteIds,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
  toggleFavorite,
} from '../state/index.js'

export function NewArrivalsSectionContainer({
  onAddToCart,
  onOpenDetails,
  recentlyAddedByProductId,
}) {
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

  const handleAddToCart = (product) => {
    onAddToCart?.(product)
  }

  const handleOpenDetails = (product) => {
    onOpenDetails?.(product)
  }

  return (
    <NewArrivalsSection
      products={products}
      favoriteIds={favoriteIds}
      status={status}
      error={error}
      onRetry={handleRetry}
      onToggleFavorite={handleToggleFavorite}
      onOpenDetails={handleOpenDetails}
      onAddToCart={handleAddToCart}
      recentlyAddedByProductId={recentlyAddedByProductId}
    />
  )
}
