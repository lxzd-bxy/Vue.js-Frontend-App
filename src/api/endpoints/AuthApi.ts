import { HttpClient } from '../client/HttpClient'
import type { LoginCredentials } from '../../models/LoginCredentials'
import type { RegisterCredentials } from '../../models/RegisterCredentials'
import type { LoginResponse } from '../../models/LoginResponse'

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