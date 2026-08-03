<script setup lang="ts">
import { ref } from 'vue';

const accessToken = ref<string | null>(null);
const error = ref<string | null>(null);

const refresh = async () => {
    try {
        const response = await fetch('/api/refresh', {
            method: 'POST',
            credentials: 'include', // обязательно для отправки кук
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Обработка ошибок (401 и др.)
            error.value = `Ошибка ${response.status}`;
            return;
        }

        const data = await response.json();
        accessToken.value = data.accessToken; // поле из ответа: { AccessToken: string }
        // Здесь можно сохранить токен в хранилище (Vuex, Pinia, localStorage и т.д.)
        console.log('Новый токен:', accessToken.value);
    } catch (err) {
        error.value = 'Сетевая ошибка';
        console.error(err);
    }
};
</script>
<template>
    <button @click="refresh"
        class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
        Refresh Token
    </button>
</template>