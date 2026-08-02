import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../api/dependency-injection/containers'
import { AuthError } from '../api/errors/authError'

import type { LoginCredentials } from '../models/loginCredentials'
import type { RegisterCredentials } from '../models/registerCredentials'
import type { LoginResponse } from '../models/loginResponse'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<LoginResponse['user'] | null>(null)
    const accessToken = ref<string | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => user.value !== null || accessToken.value !== null)

    async function fetchUser() {
        isLoading.value = true
        error.value = null
        try {
            const data = await authService.getCurrentUser()
            user.value = data.user || null
            accessToken.value = data.accessToken || null
        } catch (err) {
            user.value = null
            accessToken.value = null
            if (err instanceof AuthError && err.status === 401) {
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
            accessToken.value = response.accessToken ?? null
            user.value = response.user ?? null
        } catch (err) {
            user.value = null
            accessToken.value = null
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
            accessToken.value = response.accessToken ?? null
            user.value = response.user ?? null
        } catch (err) {
            user.value = null
            accessToken.value = null
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
            accessToken.value = null
            isLoading.value = false
        }
    }

    function reset() {
        user.value = null
        accessToken.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        user,
        accessToken,
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