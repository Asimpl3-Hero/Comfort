function getWompiBaseUrl() {
  return (import.meta.env.VITE_WOMPI_BASE_URL?.trim() ?? '').replace(/\/$/, '')
}

function getWompiPublicKey() {
  return import.meta.env.VITE_WOMPI_PUBLIC_KEY?.trim() ?? ''
}

function buildCardTokenPayload(cardData = {}) {
  return {
    number: String(cardData.cardNumber ?? '').replace(/\s+/g, ''),
    cvc: String(cardData.cardCvc ?? '').trim(),
    exp_month: String(cardData.cardExpMonth ?? '').trim().padStart(2, '0'),
    exp_year: String(cardData.cardExpYear ?? '').trim(),
    card_holder: String(cardData.cardHolder ?? '').trim(),
  }
}

function resolveWompiErrorMessage(payload, status) {
  return (
    payload?.error?.reason ??
    payload?.error?.messages?.number?.[0] ??
    payload?.error?.messages?.cvc?.[0] ??
    payload?.message ??
    `Wompi card tokenization failed (${status}).`
  )
}

export async function createWompiCardToken(cardData, { signal } = {}) {
  const wompiBaseUrl = getWompiBaseUrl()
  if (!wompiBaseUrl) {
    throw new Error('Wompi base URL is not configured.')
  }

  const publicKey = getWompiPublicKey()
  if (!publicKey) {
    throw new Error('Wompi public key is not configured.')
  }

  const response = await fetch(`${wompiBaseUrl}/tokens/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${publicKey}`,
    },
    body: JSON.stringify(buildCardTokenPayload(cardData)),
    signal,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(resolveWompiErrorMessage(payload, response.status))
  }

  const token = payload?.data?.id
  if (!token) {
    throw new Error('Wompi did not return a valid card token.')
  }

  return token
}
