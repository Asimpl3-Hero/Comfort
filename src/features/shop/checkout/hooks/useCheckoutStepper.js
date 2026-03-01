import { useMemo, useState } from 'react'

import { CARD_BRANDS, defaultPaymentMethodData } from '../const/index.js'
import {
  getCardBrand,
  getCardDigits,
  mapPaymentMethodData,
  validatePayment,
  validateShipping,
} from '../lib/checkout-form.js'

export function useCheckoutStepper({
  initialShipping,
  initialPayment,
  product,
  baseFeeInCents,
  deliveryFeeInCents,
  resolvedSteps,
  onPlaceOrder,
  t,
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [shippingForm, setShippingForm] = useState(initialShipping)
  const [paymentForm, setPaymentForm] = useState(initialPayment)
  const [shippingErrors, setShippingErrors] = useState({})
  const [paymentErrors, setPaymentErrors] = useState({})
  const [paymentMethodType, setPaymentMethodType] = useState('CARD')
  const [paymentMethodDataForm, setPaymentMethodDataForm] = useState(defaultPaymentMethodData)

  const maxStep = resolvedSteps.length - 1
  const isLastStep = activeStepIndex === maxStep
  const productAmountInCents = Number(product?.priceInCents ?? 0)
  const currency = product?.currency ?? 'COP'
  const detectedBrand = getCardBrand(paymentForm.cardNumber)
  const detectedBrandMeta = CARD_BRANDS[detectedBrand] ?? null
  const totalInCents = useMemo(
    () => productAmountInCents + baseFeeInCents + deliveryFeeInCents,
    [baseFeeInCents, deliveryFeeInCents, productAmountInCents],
  )

  const primaryButtonClassName = isLastStep
    ? 'checkout-primary-btn checkout-place-order-btn'
    : 'checkout-primary-btn'

  const handleNext = async () => {
    if (activeStepIndex === 0) {
      const errors = validateShipping(shippingForm, t)
      setShippingErrors(errors)
      if (Object.keys(errors).length > 0) {
        return
      }
    }

    if (activeStepIndex === 1) {
      const errors = validatePayment(paymentMethodType, paymentForm, paymentMethodDataForm, t)
      setPaymentErrors(errors)
      if (Object.keys(errors).length > 0) {
        return
      }
    }

    if (isLastStep) {
      await onPlaceOrder?.({
        shipping: shippingForm,
        payment: paymentForm,
        paymentMethodType,
        paymentMethodData: mapPaymentMethodData(paymentMethodType, paymentMethodDataForm),
        product,
        summary: {
          productAmountInCents,
          baseFeeInCents,
          deliveryFeeInCents,
          totalInCents,
          currency,
        },
      })
      return
    }

    setActiveStepIndex((current) => Math.min(current + 1, maxStep))
  }

  const handleBack = () => {
    setActiveStepIndex((current) => Math.max(current - 1, 0))
  }

  const handleShippingChange = (field) => (event) => {
    setShippingForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handlePaymentChange = (field) => (event) => {
    const value = event.target.value
    if (field === 'cardNumber') {
      setPaymentForm((current) => ({ ...current, [field]: getCardDigits(value) }))
      return
    }

    setPaymentForm((current) => ({ ...current, [field]: value }))
  }

  const handlePaymentMethodTypeChange = (event) => {
    setPaymentMethodType(event.target.value)
  }

  const handlePaymentMethodDataChange = (field) => (event) => {
    setPaymentMethodDataForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  return {
    activeStepIndex,
    currency,
    detectedBrand,
    detectedBrandMeta,
    handleBack,
    handleNext,
    handlePaymentChange,
    handlePaymentMethodDataChange,
    handlePaymentMethodTypeChange,
    handleShippingChange,
    isLastStep,
    paymentErrors,
    paymentForm,
    paymentMethodDataForm,
    paymentMethodType,
    primaryButtonClassName,
    productAmountInCents,
    shippingErrors,
    shippingForm,
    totalInCents,
  }
}
