<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Create your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
        <div v-if="formError" class="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {{ formError }}
        </div>

        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
          <div class="mt-2">
            <input id="email" v-model="email" type="email" name="email" required autocomplete="email"
              :disabled="loading"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              :class="{ 'border-red-500': emailError }" @input="clearFieldError('email')" />
          </div>
          <p v-if="emailError" class="mt-1 text-sm text-red-400">{{ emailError }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
          <div class="mt-2">
            <input id="password" v-model="password" type="password" name="password" required autocomplete="new-password"
              :disabled="loading"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              :class="{ 'border-red-500': passwordError }" @input="clearFieldError('password')" />
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-400">{{ passwordError }}</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-100">Confirm password</label>
          <div class="mt-2">
            <input id="confirmPassword" v-model="confirmPassword" type="password" name="confirmPassword" required
              autocomplete="new-password" :disabled="loading"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              :class="{ 'border-red-500': confirmPasswordError }" @input="clearFieldError('confirmPassword')" />
          </div>
          <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-400">{{ confirmPasswordError }}</p>
        </div>

        <div>
          <button type="submit" :disabled="loading || !isFormValid"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-400">
        Already have an account?
        <router-link to="/login" class="font-semibold text-indigo-400 hover:text-indigo-300">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../../../services/authService'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const formError = ref('')
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const router = useRouter()

const validateEmail = (value: string): string => {
  if (!value) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return 'Please enter a valid email address'
  return ''
}

const validatePassword = (value: string): string => {
  if (!value) return 'Password is required'
  if (value.length < 6) return 'Password must be at least 6 characters'
  return ''
}

const validateConfirmPassword = (value: string): string => {
  if (!value) return 'Please confirm your password'
  if (value !== password.value) return 'Passwords do not match'
  return ''
}

const isFormValid = computed(() => {
  return !validateEmail(email.value) && !validatePassword(password.value) && !validateConfirmPassword(confirmPassword.value)
})

const clearFieldError = (field: 'name' | 'email' | 'password' | 'confirmPassword') => {
  if (field === 'name') nameError.value = ''
  else if (field === 'email') emailError.value = ''
  else if (field === 'password') passwordError.value = ''
  else confirmPasswordError.value = ''
}

const handleSubmit = async () => {
  emailError.value = validateEmail(email.value)
  passwordError.value = validatePassword(password.value)
  confirmPasswordError.value = validateConfirmPassword(confirmPassword.value)

  if (nameError.value || emailError.value || passwordError.value || confirmPasswordError.value) {
    formError.value = 'Please fix the errors above'
    return
  }

  loading.value = true
  formError.value = ''

  try {
    await register({
      email: email.value.trim(),
      password: password.value,
    })

    router.replace('/').catch(err => {
      console.error('Router replace error:', err)
    })
  } catch (error) {
    if (error instanceof Error) {
      formError.value = error.message || 'An unexpected error occurred'
    } else {
      formError.value = 'An unexpected error occurred'
    }
  } finally {
    loading.value = false
  }
}
</script>