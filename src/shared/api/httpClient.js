const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() ?? '').replace(
  /\/$/,
  '',
)

function buildUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  if (!API_BASE_URL) {
    return path
  }

  return `${API_BASE_URL}${path}`
}

export async function httpGet(path, { signal } = {}) {
  return request(path, {
    method: 'GET',
    signal,
  })
}

export async function httpPost(path, body, { signal } = {}) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
    signal,
  })
}

async function request(path, init) {
  const response = await fetch(buildUrl(path), {
    method: init.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: init.body,
    signal: init.signal,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload?.message ?? `Request failed (${response.status})`
    throw new Error(message)
  }

  return response.json()
}
