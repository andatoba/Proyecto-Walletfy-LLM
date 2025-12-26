// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { spawn } from 'node:child_process'

const PRODUCT_PORT = 3030
const CHAT_PORT = 4000
const READ_KEY = 'test-read-key'
const WRITE_KEY = 'test-write-key'
const CHAT_KEY = 'test-chat-key'

const PRODUCT_BASE_URL = `http://localhost:${PRODUCT_PORT}`
const CHAT_BASE_URL = `http://localhost:${CHAT_PORT}`

const waitForServer = async (
  url: string,
  options: RequestInit,
  timeoutMs = 10000
) => {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(2000),
      })
      if (response.ok) {
        return
      }
    } catch (error) {
      // Ignore until server is available.
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`Timeout esperando al servidor: ${url}`)
}

const fetchJson = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const data = await response.json().catch(() => null)
  return { response, data }
}

describe.sequential('OWASP A1-A3 - Verificaciones basicas', () => {
  let productProcess: ReturnType<typeof spawn> | null = null
  let chatProcess: ReturnType<typeof spawn> | null = null

  beforeAll(async () => {
    productProcess = spawn('node', ['products-server.js'], {
      env: {
        ...process.env,
        WALLETFY_READ_KEY: READ_KEY,
        WALLETFY_WRITE_KEY: WRITE_KEY,
      },
      stdio: 'ignore',
    })

    chatProcess = spawn('node', ['chat-server.mjs'], {
      env: {
        ...process.env,
        WALLETFY_CHAT_KEY: CHAT_KEY,
      },
      stdio: 'ignore',
    })

    await waitForServer(`${PRODUCT_BASE_URL}/api/health`, {
      headers: { 'x-api-key': READ_KEY },
    })
    await waitForServer(`${CHAT_BASE_URL}/api/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CHAT_KEY,
      },
      body: JSON.stringify({
        input: 'Ping',
        params: { temperature: 0.1, reasoning_effort: 'low' },
      }),
    })
  })

  afterAll(() => {
    if (productProcess && !productProcess.killed) {
      productProcess.kill('SIGINT')
    }
    if (chatProcess && !chatProcess.killed) {
      chatProcess.kill('SIGINT')
    }
  })

  it('A1: rechaza acceso a productos sin API key', async () => {
    const { response } = await fetchJson(`${PRODUCT_BASE_URL}/api/products`)
    expect(response.status).toBe(401)
  })

  it('A1: permite lectura con key de lectura', async () => {
    const { response, data } = await fetchJson(`${PRODUCT_BASE_URL}/api/products`, {
      headers: {
        'x-api-key': READ_KEY,
      },
    })
    expect(response.status).toBe(200)
    expect(data?.success).toBe(true)
    expect(Array.isArray(data?.data)).toBe(true)
  })

  it('A1: bloquea escritura con key de lectura', async () => {
    const payload = {
      name: 'Producto lectura',
      price: 10,
      category: 'electronics',
    }
    const { response } = await fetchJson(`${PRODUCT_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'x-api-key': READ_KEY,
      },
      body: JSON.stringify(payload),
    })
    expect(response.status).toBe(403)
  })

  it('A1: permite escritura con key de escritura', async () => {
    const payload = {
      name: 'Producto seguro',
      price: 10,
      category: 'electronics',
    }
    const { response, data } = await fetchJson(`${PRODUCT_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'x-api-key': WRITE_KEY,
      },
      body: JSON.stringify(payload),
    })
    expect(response.status).toBe(201)
    expect(data?.success).toBe(true)
  })

  it('A3: rechaza payload con operador NoSQL', async () => {
    const payload = {
      name: 'Producto malicioso',
      price: 10,
      category: { $ne: 'electronics' },
    }
    const { response } = await fetchJson(`${PRODUCT_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'x-api-key': WRITE_KEY,
      },
      body: JSON.stringify(payload),
    })
    expect(response.status).toBe(400)
  })

  it('A3: sanitiza parametros de consulta maliciosos', async () => {
    const { response } = await fetchJson(`${PRODUCT_BASE_URL}/api/products?name[$ne]=x`, {
      headers: {
        'x-api-key': READ_KEY,
      },
    })
    expect(response.status).toBe(200)
  })

  it('A1: rechaza chat sin API key', async () => {
    const { response } = await fetchJson(`${CHAT_BASE_URL}/api/completion`, {
      method: 'POST',
      body: JSON.stringify({
        input: 'Hola',
        params: { temperature: 0.5, reasoning_effort: 'low' },
      }),
    })
    expect(response.status).toBe(401)
  })

  it('A1: permite chat con API key', async () => {
    const { response, data } = await fetchJson(`${CHAT_BASE_URL}/api/completion`, {
      method: 'POST',
      headers: {
        'x-api-key': CHAT_KEY,
      },
      body: JSON.stringify({
        input: 'Balance actual',
        params: { temperature: 0.5, reasoning_effort: 'low' },
      }),
    })
    expect(response.status).toBe(200)
    expect(typeof data?.message).toBe('string')
  })

  it('A3: rechaza input de chat demasiado largo', async () => {
    const { response } = await fetchJson(`${CHAT_BASE_URL}/api/completion`, {
      method: 'POST',
      headers: {
        'x-api-key': CHAT_KEY,
      },
      body: JSON.stringify({
        input: 'a'.repeat(5000),
        params: { temperature: 0.5, reasoning_effort: 'low' },
      }),
    })
    expect(response.status).toBe(400)
  })
})
