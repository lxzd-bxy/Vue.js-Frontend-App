import { AuthApi } from '../api/endpoints/AuthApi'
import { ValidationError } from '../api/errors/ValidationError'
import { AuthError } from '../api/errors/AuthError'
import { NetworkError } from '../api/errors/NetworkError'

import type { LoginCredentials } from '../models/LoginCredentials'
import type { RegisterCredentials } from '../models/RegisterCredentials'
import type { LoginResponse } from '../models/LoginResponse'

export class AuthService {
  private authApi: AuthApi

  constructor(authApi: AuthApi) {
    this.authApi = authApi
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    this.validate(credentials)
    try {
      return await this.authApi.login(credentials)
    } catch (error) {
      throw this.wrapError(error)
    }
  }

  async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    this.validate(credentials)
    try {
      return await this.authApi.register(credentials)
    } catch (error) {
      throw this.wrapError(error)
    }
  }

  async getCurrentUser(): Promise<LoginResponse> {
    return this.authApi.getCurrentUser()
  }

  async logout(): Promise<void> {
    return this.authApi.logout()
  }

  private validate(credentials: { email: string; password: string }): void {
    const { email, password } = credentials
    if (!email || !password) {
      throw new ValidationError('Email and password are required')
    }
  }

  private wrapError(error: unknown): Error {
    if (error instanceof AuthError) return error
    if (error instanceof TypeError) {
      return new NetworkError(`Network error – check HTTPS backend availability. ${error.message}`)
    }
    return new AuthError((error as Error).message || 'Unknown error occurred')
  }
}