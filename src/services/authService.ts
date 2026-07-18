export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user?: {
    id: string
    email: string
  }
}

export class AuthError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, 400)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends AuthError {
  constructor(message: string) {
    super(message, 0)
    this.name = 'NetworkError'
  }
}

function validateCredentials(credentials: { email: string; password: string }): void {
  const { email, password } = credentials
  if (!email || !password) {
    throw new ValidationError('Email and password are required')
  }
}

function getApiCandidates(path: string): string[] {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const candidates = new Set<string>()

  const configuredBaseUrls = [
    import.meta.env.VITE_API_BASE_URL?.trim(),
    import.meta.env.VITE_API_PROXY_TARGET?.trim(),
  ].filter((value): value is string => Boolean(value))

  configuredBaseUrls.forEach((baseUrl) => {
    candidates.add(`${baseUrl.replace(/\/$/, '')}${normalizedPath}`)
  })

  candidates.add(normalizedPath)

  if (import.meta.env.DEV) {
    const commonBaseUrls = ['https://localhost:7160']
    commonBaseUrls.forEach((baseUrl) => {
      candidates.add(`${baseUrl}${normalizedPath}`)
    })
  }

  return Array.from(candidates)
}

async function parseResponse<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as T
  } catch {
    return { message: text } as T
  }
}

async function fetchWithFallback<T>(
  path: string,
  init: RequestInit
): Promise<{ response: Response; responseData: T | null }> {
  const candidates = getApiCandidates(path)
  let lastError: unknown = null

  for (const url of candidates) {
    try {
      const response = await fetch(url, init)
      const responseData = await parseResponse<T>(response)

      if (response.ok || [400, 401, 403, 409].includes(response.status)) {
        return { response, responseData }
      }

      lastError = new AuthError(`Request failed with status ${response.status}`, response.status)
    } catch (error) {
      lastError = error
    }
  }

  if (lastError instanceof TypeError) {
    throw new NetworkError(`Network error – check HTTPS backend availability. ${lastError.message}`)
  }

  if (lastError instanceof AuthError) {
    throw lastError
  }

  throw new AuthError((lastError as Error)?.message || 'Unknown error occurred')
}

export async function fetchCurrentUser(): Promise<LoginResponse> {
  const { responseData } = await fetchWithFallback<LoginResponse>('/api/me', {
    method: 'GET',
    credentials: 'include',
  })
  return responseData || {}
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  validateCredentials(credentials)

  try {
    const { responseData } = await fetchWithFallback<LoginResponse>('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })
    return responseData || {}
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NetworkError(`Network error – check HTTPS backend availability. ${error.message}`)
    }
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError((error as Error).message || 'Unknown error occurred')
  }
}

export async function register(credentials: RegisterCredentials): Promise<LoginResponse> {
  validateCredentials(credentials)

  try {
    const { responseData } = await fetchWithFallback<LoginResponse>('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })
    return responseData || {}
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NetworkError(`Network error – check HTTPS backend availability. ${error.message}`)
    }
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError((error as Error).message || 'Unknown error occurred')
  }
}

export async function logout(): Promise<void> {
  await fetchWithFallback('/api/logout', {
    method: 'POST',
    credentials: 'include',
  })
}