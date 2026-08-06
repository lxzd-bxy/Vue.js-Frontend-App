<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/authStore";
import { AuthError } from "../../../api/errors/authError";
import { validateEmail } from "../../../utils/validators/validateEmail";
import { validatePassword } from "../../../utils/validators/validatePassword";
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const formError = ref("");
const emailError = ref("");
const passwordError = ref("");

const router = useRouter();

const isFormValid = computed(() => {
  return !validateEmail(email.value) && !validatePassword(password.value);
});

const clearFieldError = (field: "email" | "password") => {
  if (field === "email") emailError.value = "";
  else passwordError.value = "";
};

const handleSubmit = async () => {
  emailError.value = validateEmail(email.value);
  passwordError.value = validatePassword(password.value);

  if (emailError.value || passwordError.value) {
    formError.value = "Please fix the errors above";
    return;
  }

  loading.value = true;
  formError.value = "";

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    router.replace("/").catch((err) => {
      console.error("Router replace error:", err);
    });
  } catch (error) {
    if (error instanceof AuthError) {
      formError.value = error.message;
    } else if (error instanceof Error) {
      formError.value = error.message || "An unexpected error occurred";
    } else {
      formError.value = "An unexpected error occurred";
    }
  } finally {
    loading.value = false;
  }
};

const goToForgotPassword = () => {
  router.push("/forgot-password");
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div v-if="formError" class="error-message text-red-400 sm:mx-auto mb-4">
      {{ formError }}
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white"
      >
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-100">
            Email address
          </label>
          <div class="mt-2">
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              required
              :disabled="loading"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              :class="{ 'outline-red-500': emailError }"
              @input="clearFieldError('email')"
            />
          </div>
          <p v-if="emailError" class="mt-1 text-sm text-red-400">
            {{ emailError }}
          </p>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-100"
            >
              Password
            </label>
            <div class="text-sm">
              <a
                href="#"
                class="font-semibold text-indigo-400 hover:text-indigo-300"
                @click.prevent="goToForgotPassword"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              autocomplete="current-password"
              required
              :disabled="loading"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              :class="{ 'outline-red-500': passwordError }"
              @input="clearFieldError('password')"
            />
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-400">
            {{ passwordError }}
          </p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "Signing in..." : "Sign in" }}
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-400">
        Not a Member?
        <router-link
          to="/signup"
          class="font-semibold text-indigo-400 hover:text-indigo-300"
          >Sign Up</router-link
        >
      </p>
    </div>
  </div>
</template>
