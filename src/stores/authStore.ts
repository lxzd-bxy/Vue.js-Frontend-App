import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout,
    fetchCurrentUser,
    type LoginCredentials,
    type RegisterCredentials,
    type LoginResponse,
    AuthError,
} from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<LoginResponse['user'] | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => user.value !== null)

    async function fetchUser() {
        isLoading.value = true
        error.value = null
        try {
            const data = await fetchCurrentUser()
            user.value = data.user || null
        } catch (err) {
            user.value = null
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
            const response = await apiLogin(credentials)
            user.value = response?.user ?? null
        } catch (err) {
            user.value = null
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
            const response = await apiRegister(credentials)
            user.value = response?.user ?? null
        } catch (err) {
            user.value = null
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
            await apiLogout()
        } catch (err) {
            console.warn('Logout API error:', err)
        } finally {
            user.value = null
            isLoading.value = false
        }
    }

    function reset() {
        user.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        user,
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