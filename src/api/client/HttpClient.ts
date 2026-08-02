import { AuthError } from '../errors/authError'
import { NetworkError } from '../errors/networkError'
import type { HttpClientConfig } from './interfaces/httpClientConfig'
import type { HttpRequestOptions } from './interfaces/httpRequestOptions'

export class HttpClient {
    private config: HttpClientConfig
    constructor(config: HttpClientConfig) {
        this.config = config
    }

    async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
        const urls = this.buildUrlCandidates(path)
        let lastError: unknown = null

        for (const url of urls) {
            try {
                const response = await fetch(url, {
                    ...options,
                    credentials: options.credentials ?? 'include',
                })
                const data = await this.parseResponse<T>(response)

                if (response.ok || [400, 401, 403, 409].includes(response.status)) {
                    return data ?? ({} as T)
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

    private buildUrlCandidates(path: string): string[] {
        const normalized = path.startsWith('/') ? path : `/${path}`
        const candidates = new Set<string>()

        this.config.baseUrls.forEach(base => {
            candidates.add(`${base.replace(/\/$/, '')}${normalized}`)
        })

        candidates.add(normalized)

        return Array.from(candidates)
    }

    private async parseResponse<T>(response: Response): Promise<T | null> {
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
            return response.json() as Promise<T>
        }
        const text = await response.text()
        if (!text) return null
        try {
            return JSON.parse(text) as T
        } catch {
            return { message: text } as T
        }
    }
}