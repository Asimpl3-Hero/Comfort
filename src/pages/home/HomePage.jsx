import '../../features/components/styles/ui/home-sections.css'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '../../app/hooks/index.js'
import { CartStatusModal } from '../../features/components/ui/CartStatusModal.jsx'
import { CheckoutStepperModal } from '../../features/components/ui/CheckoutStepperModal.jsx'
import { FeaturesSection } from '../../features/components/ui/FeaturesSection.jsx'
import { HeroSection } from '../../features/components/ui/HeroSection.jsx'
import { NewsletterSection } from '../../features/components/ui/NewsletterSection.jsx'
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
  dismissTransactionMessage,
  openCartModal,
  proceedToCheckoutFromCart,
  selectIsCartOpen,
  selectIsCheckoutOpen,
  selectIsLongPending,
  selectIsSubmittingOrder,
  selectSelectedProductId,
  selectSubmitError,
  selectSubmitPhase,
  selectTransactionMessage,
  setTransactionMessage,
  submitOrder,
} from '../../features/shop/checkout/state/index.js'
import { NewArrivalsSectionContainer } from '../../features/shop/products/containers/NewArrivalsSectionContainer.jsx'
import { selectProducts } from '../../features/shop/products/state/index.js'
import { toggleTheme } from '../../features/theme/state/index.js'
import { benefitsData } from '../../shared/config/benefitsData.js'
import { footerNavigationLinks, topNavigationLinks } from '../../shared/config/navigation.js'

export function HomePage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

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
  const transactionMessage = useAppSelector(selectTransactionMessage)

  const localizedTopNavigationLinks = useMemo(
    () =>
      topNavigationLinks.map((item) => ({
        ...item,
        label: t(`navigation.top.${item.id}`),
      })),
    [t],
  )

  const localizedFooterNavigationLinks = useMemo(
    () =>
      footerNavigationLinks.map((item) => ({
        ...item,
        label: t(`navigation.footer.${item.id}`),
      })),
    [t],
  )

  const localizedBenefits = useMemo(
    () =>
      benefitsData.map((item) => ({
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

  const handleAddToCart = (product) => {
    if (!product?.id) {
      return
    }

    const selectedQty = Number(cartItemsByProductId[product.id] ?? 0)
    const availableStock = Number(product.stock ?? 0)
    if (selectedQty >= availableStock) {
      dispatch(setTransactionMessage(t('home.maxStockReached', { name: product.name })))
      return
    }

    dispatch(addItemToCart({ productId: product.id }))
    dispatch(setTransactionMessage(t('home.productAdded', { name: product.name })))
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
      <NewArrivalsSectionContainer onAddToCart={handleAddToCart} />
      <FeaturesSection items={localizedBenefits} />
      <NewsletterSection />

      {transactionMessage && (
        <section className="container" style={{ marginBottom: '1.5rem' }}>
          <div className="products-state-card" role="status" aria-live="polite">
            <p>{transactionMessage}</p>
            <button type="button" onClick={() => dispatch(dismissTransactionMessage())}>
              {t('home.dismiss')}
            </button>
          </div>
        </section>
      )}

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
          onPlaceOrder={handlePlaceOrder}
          isSubmitting={isSubmittingOrder}
          submitError={submitError}
          loadingMessage={
            loadingMessageByPhase[submitPhase] ?? t('home.loading.processingPayment')
          }
          isPendingProlonged={isLongPending}
        />
      )}
    </AppLayout>
  )
}
