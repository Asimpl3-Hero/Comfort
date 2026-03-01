import '../../features/components/styles/ui/home-sections.css'

import { useState } from 'react'

import { useAppDispatch, useModalState } from '../../app/hooks/index.js'
import { CheckoutStepperModal } from '../../features/components/ui/CheckoutStepperModal.jsx'
import { FeaturesSection } from '../../features/components/ui/FeaturesSection.jsx'
import { HeroSection } from '../../features/components/ui/HeroSection.jsx'
import { NewsletterSection } from '../../features/components/ui/NewsletterSection.jsx'
import { AppLayout } from '../../features/components/ux/AppLayout.jsx'
import { NewArrivalsSectionContainer } from '../../features/products/containers/NewArrivalsSectionContainer.jsx'
import { fetchProducts } from '../../features/products/model/productsSlice.js'
import { toggleTheme } from '../../features/theme/model/themeSlice.js'
import { createOrder, getOrderById } from '../../shared/api/ordersApi.js'
import { benefitsData } from '../../shared/config/benefitsData.js'
import { footerNavigationLinks, topNavigationLinks } from '../../shared/config/navigation.js'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function waitForOrderFinalStatus(orderId, { onPendingTooLong } = {}) {
  const startedAt = Date.now()
  let longPendingNotified = false

  while (Date.now() - startedAt < 60_000) {
    const order = await getOrderById(orderId)
    if (order?.status === 'APPROVED' || order?.status === 'DECLINED') {
      return order
    }

    if (!longPendingNotified && Date.now() - startedAt >= 20_000) {
      longPendingNotified = true
      onPendingTooLong?.()
    }

    await sleep(5000)
  }

  return null
}

export function HomePage() {
  const { isOpen: isCheckoutOpen, open: openCheckout, close: closeCheckout } = useModalState(false)
  const dispatch = useAppDispatch()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitPhase, setSubmitPhase] = useState('')
  const [isLongPending, setIsLongPending] = useState(false)
  const [transactionMessage, setTransactionMessage] = useState('')

  const handleOpenCheckout = (product) => {
    setSelectedProduct(product)
    setSubmitError('')
    setSubmitPhase('')
    setIsLongPending(false)
    openCheckout()
  }

  const handleCloseCheckout = () => {
    if (isSubmittingOrder) {
      return
    }

    closeCheckout()
  }

  const handlePlaceOrder = async () => {
    if (!selectedProduct) {
      setSubmitError('No product selected.')
      return
    }

    try {
      setIsSubmittingOrder(true)
      setSubmitError('')
      setSubmitPhase('creating-order')
      setIsLongPending(false)

      const createdOrder = await createOrder({
        productId: selectedProduct.id,
      })

      setSubmitPhase('opening-checkout')
      if (createdOrder?.checkoutUrl) {
        window.open(createdOrder.checkoutUrl, '_blank', 'noopener,noreferrer')
      }

      setSubmitPhase('confirming-payment')
      const finalOrder = await waitForOrderFinalStatus(createdOrder.orderId, {
        onPendingTooLong: () => setIsLongPending(true),
      })
      if (!finalOrder) {
        setTransactionMessage(
          `Order ${createdOrder.orderId} is still pending. Check status in a moment.`,
        )
      } else if (finalOrder.status === 'APPROVED') {
        setTransactionMessage(`Payment approved. Order ${createdOrder.orderId} confirmed.`)
      } else {
        setTransactionMessage(`Payment declined for order ${createdOrder.orderId}.`)
      }

      closeCheckout()
      setSelectedProduct(null)
      dispatch(fetchProducts())
    } catch (error) {
      setSubmitError(error.message ?? 'Could not create the order.')
    } finally {
      setIsSubmittingOrder(false)
      setSubmitPhase('')
      setIsLongPending(false)
    }
  }

  const loadingMessageByPhase = {
    'creating-order': 'Creating your order...',
    'opening-checkout': 'Opening secure checkout...',
    'confirming-payment': 'Confirming payment status...',
  }

  return (
    <AppLayout
      navLinks={topNavigationLinks}
      footerLinks={footerNavigationLinks}
      footerCopy="(c) 2024 Comfort Inc."
      onThemeToggle={() => dispatch(toggleTheme())}
      showStoreFab={false}
    >
      <HeroSection />
      <NewArrivalsSectionContainer onBuyWithCard={handleOpenCheckout} />
      <FeaturesSection items={benefitsData} />
      <NewsletterSection />
      {transactionMessage && (
        <section className="container" style={{ marginBottom: '1.5rem' }}>
          <div className="products-state-card" role="status" aria-live="polite">
            <p>{transactionMessage}</p>
            <button type="button" onClick={() => setTransactionMessage('')}>
              Dismiss
            </button>
          </div>
        </section>
      )}
      {isCheckoutOpen && (
        <CheckoutStepperModal
          isOpen={isCheckoutOpen}
          onClose={handleCloseCheckout}
          product={selectedProduct}
          onPlaceOrder={handlePlaceOrder}
          isSubmitting={isSubmittingOrder}
          submitError={submitError}
          loadingMessage={loadingMessageByPhase[submitPhase] ?? 'Processing payment...'}
          isPendingProlonged={isLongPending}
        />
      )}
    </AppLayout>
  )
}
