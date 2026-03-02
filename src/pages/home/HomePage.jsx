import '../../features/components/styles/ui/home-sections.css'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  BENEFITS_DATA,
  FOOTER_NAVIGATION_LINKS,
  TOP_NAVIGATION_LINKS,
} from '../../app/const/index.js'
import { useAppDispatch, useAppSelector } from '../../app/hooks/index.js'
import { CartStatusModal } from '../../features/components/ui/CartStatusModal.jsx'
import { CheckoutStepperModal } from '../../features/components/ui/CheckoutStepperModal.jsx'
import { FeatureCarousel } from '../../features/components/ui/FeatureCarousel.jsx'
import { FeaturesSection } from '../../features/components/ui/FeaturesSection.jsx'
import { HeroSection } from '../../features/components/ui/HeroSection.jsx'
import { NewsletterSection } from '../../features/components/ui/NewsletterSection.jsx'
import { ProductDetailsModal } from '../../features/components/ui/ProductDetailsModal.jsx'
import { PushNotificationToast } from '../../features/components/ui/PushNotificationToast.jsx'
import { TransactionResultModal } from '../../features/components/ui/TransactionResultModal.jsx'
import { AppLayout } from '../../features/components/ux/AppLayout.jsx'
import {
  addItemToCart,
  clearCart,
  selectCartItemsByProductId,
  selectCartProducts,
  selectCartTotalInCents,
  selectCartTotalQuantity,
} from '../../features/shop/cart/state/index.js'
import {
  closeCartModal,
  closeCheckoutModal,
  dismissTransactionResult,
  openCartModal,
  proceedToCheckoutFromCart,
  selectIsCartOpen,
  selectIsCheckoutOpen,
  selectIsLongPending,
  selectIsSubmittingOrder,
  selectSelectedProductId,
  selectSubmitError,
  selectSubmitPhase,
  selectTransactionResult,
  submitOrder,
} from '../../features/shop/checkout/state/index.js'
import { NewArrivalsSectionContainer } from '../../features/shop/products/containers/NewArrivalsSectionContainer.jsx'
import { selectProducts } from '../../features/shop/products/state/index.js'
import { toggleTheme } from '../../features/theme/state/index.js'

export function HomePage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [selectedDetailsProduct, setSelectedDetailsProduct] = useState(null)
  const [recentlyAddedByProductId, setRecentlyAddedByProductId] = useState({})
  const [pushNotification, setPushNotification] = useState(null)
  const addFeedbackTimersRef = useRef({})
  const notificationTimerRef = useRef(null)

  const products = useAppSelector(selectProducts)
  const cartItems = useAppSelector(selectCartProducts)
  const cartItemsByProductId = useAppSelector(selectCartItemsByProductId)
  const cartTotalQuantity = useAppSelector(selectCartTotalQuantity)
  const cartTotalInCents = useAppSelector(selectCartTotalInCents)

  const isCartOpen = useAppSelector(selectIsCartOpen)
  const isCheckoutOpen = useAppSelector(selectIsCheckoutOpen)
  const selectedProductId = useAppSelector(selectSelectedProductId)
  const isSubmittingOrder = useAppSelector(selectIsSubmittingOrder)
  const submitError = useAppSelector(selectSubmitError)
  const submitPhase = useAppSelector(selectSubmitPhase)
  const isLongPending = useAppSelector(selectIsLongPending)
  const transactionResult = useAppSelector(selectTransactionResult)

  const localizedTopNavigationLinks = useMemo(
    () =>
      TOP_NAVIGATION_LINKS.map((item) => ({
        ...item,
        label: t(`navigation.top.${item.id}`),
      })),
    [t],
  )

  const localizedFooterNavigationLinks = useMemo(
    () =>
      FOOTER_NAVIGATION_LINKS.map((item) => ({
        ...item,
        label: t(`navigation.footer.${item.id}`),
      })),
    [t],
  )

  const localizedBenefits = useMemo(
    () =>
      BENEFITS_DATA.map((item) => ({
        ...item,
        title: t(`features.items.${item.id}.title`),
        description: t(`features.items.${item.id}.description`),
      })),
    [t],
  )

  const loadingMessageByPhase = {
    'creating-order': t('home.loading.creatingOrder'),
    'opening-checkout': t('home.loading.openingCheckout'),
    'confirming-payment': t('home.loading.confirmingPayment'),
  }

  const selectedProduct = products.find((item) => item.id === selectedProductId) ?? null
  const selectedProductQuantity = selectedProductId
    ? Number(cartItemsByProductId[selectedProductId] ?? 1)
    : 1
  const selectedDetailsProductIsRecentlyAdded = Boolean(
    selectedDetailsProduct?.id && recentlyAddedByProductId[selectedDetailsProduct.id],
  )

  useEffect(
    () => () => {
      Object.values(addFeedbackTimersRef.current).forEach((timerId) => {
        clearTimeout(timerId)
      })
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current)
      }
    },
    [],
  )

  const markProductAsRecentlyAdded = (productId) => {
    if (!productId) {
      return
    }

    setRecentlyAddedByProductId((current) => ({
      ...current,
      [productId]: true,
    }))

    const existingTimer = addFeedbackTimersRef.current[productId]
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    addFeedbackTimersRef.current[productId] = setTimeout(() => {
      setRecentlyAddedByProductId((current) => {
        const next = { ...current }
        delete next[productId]
        return next
      })
      delete addFeedbackTimersRef.current[productId]
    }, 1500)
  }

  const showPushNotification = (kind, message, title) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current)
    }

    setPushNotification({
      kind,
      title,
      message,
    })

    notificationTimerRef.current = setTimeout(() => {
      setPushNotification(null)
    }, 2800)
  }

  const handleAddToCart = (product, quantity = 1) => {
    if (!product?.id) {
      return
    }

    const selectedQty = Number(cartItemsByProductId[product.id] ?? 0)
    const availableStock = Number(product.stock ?? 0)
    const remainingStock = Math.max(0, availableStock - selectedQty)
    const requestedQty = Math.max(1, Math.floor(Number(quantity) || 1))
    const qtyToAdd = Math.min(requestedQty, remainingStock)

    if (qtyToAdd <= 0) {
      showPushNotification(
        'warning',
        t('home.maxStockReached', { name: product.name }),
        t('home.notifications.stockLimitTitle'),
      )
      return
    }

    for (let index = 0; index < qtyToAdd; index += 1) {
      dispatch(addItemToCart({ productId: product.id }))
    }
    markProductAsRecentlyAdded(product.id)
    showPushNotification(
      'success',
      qtyToAdd === 1
        ? t('home.productAdded', { name: product.name })
        : t('home.productAddedMany', { name: product.name, count: qtyToAdd }),
      t('home.notifications.cartUpdated'),
    )
  }

  const handleCloseCheckout = () => {
    if (isSubmittingOrder) {
      return
    }

    dispatch(closeCheckoutModal())
  }

  const handlePlaceOrder = async (checkoutData) => {
    await dispatch(submitOrder(checkoutData))
  }

  const handleOpenProductDetails = (product) => {
    setSelectedDetailsProduct(product)
  }

  const handleCloseProductDetails = () => {
    setSelectedDetailsProduct(null)
  }

  return (
    <AppLayout
      navLinks={localizedTopNavigationLinks}
      footerLinks={localizedFooterNavigationLinks}
      footerCopy={t('app.footerCopy')}
      onThemeToggle={() => dispatch(toggleTheme())}
      showStoreFab
      onStoreFabClick={() => dispatch(openCartModal())}
      storeFabCount={cartTotalQuantity}
    >
      <HeroSection />
      <FeatureCarousel products={products} onProductClick={handleOpenProductDetails} />
      <NewArrivalsSectionContainer
        onAddToCart={handleAddToCart}
        onOpenDetails={handleOpenProductDetails}
        recentlyAddedByProductId={recentlyAddedByProductId}
      />
      <FeaturesSection items={localizedBenefits} />
      <NewsletterSection />

      <ProductDetailsModal
        isOpen={Boolean(selectedDetailsProduct)}
        product={selectedDetailsProduct}
        isRecentlyAdded={selectedDetailsProductIsRecentlyAdded}
        currentCartQuantity={
          selectedDetailsProduct?.id
            ? Number(cartItemsByProductId[selectedDetailsProduct.id] ?? 0)
            : 0
        }
        onClose={handleCloseProductDetails}
        onAddToCart={(product, quantity) => {
          handleAddToCart(product, quantity)
          handleCloseProductDetails()
        }}
      />

      {isCartOpen && (
        <CartStatusModal
          isOpen={isCartOpen}
          onClose={() => dispatch(closeCartModal())}
          items={cartItems}
          totalQuantity={cartTotalQuantity}
          totalInCents={cartTotalInCents}
          currency={cartItems[0]?.product?.currency ?? 'COP'}
          onClearCart={() => dispatch(clearCart())}
          onProceedToPayment={() => dispatch(proceedToCheckoutFromCart())}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutStepperModal
          isOpen={isCheckoutOpen}
          onClose={handleCloseCheckout}
          product={selectedProduct}
          productQuantity={selectedProductQuantity}
          cartTotalQuantity={cartTotalQuantity}
          onPlaceOrder={handlePlaceOrder}
          isSubmitting={isSubmittingOrder}
          submitError={submitError}
          loadingMessage={
            loadingMessageByPhase[submitPhase] ?? t('home.loading.processingPayment')
          }
          isPendingProlonged={isLongPending}
        />
      )}

      <TransactionResultModal
        isOpen={transactionResult?.isOpen}
        status={transactionResult?.status}
        transactionId={transactionResult?.transactionId}
        orderId={transactionResult?.orderId}
        onClose={() => dispatch(dismissTransactionResult())}
      />

      <PushNotificationToast
        notification={pushNotification}
        onClose={() => setPushNotification(null)}
      />
    </AppLayout>
  )
}
