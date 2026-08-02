import { HttpClient } from '../client/httpClient'
import type { LoginCredentials } from '../../models/loginCredentials'
import type { RegisterCredentials } from '../../models/registerCredentials'
import type { LoginResponse } from '../../models/loginResponse'

export class AuthApi {
    private httpClient: HttpClient

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient
    }

    login(credentials: LoginCredentials): Promise<LoginResponse> {
        return this.httpClient.request<LoginResponse>('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })
    }

    register(credentials: RegisterCredentials): Promise<LoginResponse> {
        return this.httpClient.request<LoginResponse>('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })
    }

    getCurrentUser(): Promise<LoginResponse> {
        return this.httpClient.request<LoginResponse>('/api/me', {
            method: 'GET',
        })
    }

    logout(): Promise<void> {
        return this.httpClient.request<void>('/api/logout', {
            method: 'POST',
        })
    }
}