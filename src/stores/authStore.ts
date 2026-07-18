import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../api/di/containers'
import { AuthError } from '../api/errors/AuthError'

import type { LoginCredentials } from '../models/LoginCredentials'
import type { RegisterCredentials } from '../models/RegisterCredentials'
import type { LoginResponse } from '../models/LoginResponse'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<LoginResponse['user'] | null>(null)
    const token = ref<string | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => user.value !== null || token.value !== null)

    async function fetchUser() {
        isLoading.value = true
        error.value = null
        try {
            const data = await authService.getCurrentUser()
            user.value = data.user || null
            token.value = data.token || null
        } catch (err) {
            user.value = null
            token.value = null
            if (err instanceof AuthError && err.status === 401) {
                // просто сбрасываем, не показываем ошибку
            } else {
                error.value = (err as Error).message
            }
        } finally {
            isLoading.value = false
        }
    }

    async function login(credentials: LoginCredentials) {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.login(credentials)
            // Сервис уже вернул готовый объект с user и token
            token.value = response.token ?? null
            user.value = response.user ?? null
        } catch (err) {
            user.value = null
            token.value = null
            if (err instanceof AuthError) {
                error.value = err.message
            } else {
                error.value = (err as Error).message
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function register(credentials: RegisterCredentials) {
        isLoading.value = true
        error.value = null
        try {
            const response = await authService.register(credentials)
            token.value = response.token ?? null
            user.value = response.user ?? null
        } catch (err) {
            user.value = null
            token.value = null
            if (err instanceof AuthError) {
                error.value = err.message
            } else {
                error.value = (err as Error).message
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function logout() {
        isLoading.value = true
        try {
            await authService.logout()
        } catch (err) {
            console.warn('Logout API error:', err)
        } finally {
            user.value = null
            token.value = null
            isLoading.value = false
        }
    }

    function reset() {
        user.value = null
        token.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        fetchUser,
        login,
        register,
        logout,
        reset,
    }
})