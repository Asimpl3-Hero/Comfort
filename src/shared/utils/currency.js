const DEFAULT_COP_TO_USD_RATE = 4000
const ENV_COP_TO_USD_RATE = Number(import.meta.env.VITE_COP_TO_USD_RATE)
const COP_TO_USD_RATE =
  Number.isFinite(ENV_COP_TO_USD_RATE) && ENV_COP_TO_USD_RATE > 0
    ? ENV_COP_TO_USD_RATE
    : DEFAULT_COP_TO_USD_RATE

function resolveDisplayCurrency(currency, language = 'es') {
  if (currency === 'COP' && language === 'en') {
    return 'USD'
  }

  return currency
}

function resolveLocale(displayCurrency, language = 'es') {
  if (displayCurrency === 'COP') {
    return 'es-CO'
  }

  if (displayCurrency === 'USD') {
    return 'en-US'
  }

  return language === 'es' ? 'es-CO' : 'en-US'
}

function resolveFractionDigits(displayCurrency) {
  if (displayCurrency === 'COP') {
    return { minimumFractionDigits: 0, maximumFractionDigits: 0 }
  }

  return { minimumFractionDigits: 2, maximumFractionDigits: 2 }
}

function convertAmount(amount, sourceCurrency, targetCurrency) {
  if (sourceCurrency === 'COP' && targetCurrency === 'USD') {
    return amount / COP_TO_USD_RATE
  }

  return amount
}

export function formatCurrencyFromCents(amountInCents, currency = 'COP', language = 'es') {
  const safeAmount = Number(amountInCents)
  const amount = Number.isFinite(safeAmount) ? safeAmount / 100 : 0
  const displayCurrency = resolveDisplayCurrency(currency, language)
  const convertedAmount = convertAmount(amount, currency, displayCurrency)
  const locale = resolveLocale(displayCurrency, language)
  const fractionDigits = resolveFractionDigits(displayCurrency)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: displayCurrency,
    ...fractionDigits,
  }).format(convertedAmount)
}
