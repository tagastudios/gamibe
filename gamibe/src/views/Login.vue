<template>
    <main>
        <h1 class="sr-only m-auto text-5xl font-black">Login</h1>
        <div v-if="loginError">{{ loginError }}</div>
        <button @click="login('redirect')">SignIn with Google (Redirect)</button>
        <button @click="login('popup')">SignIn with Google (Popup)</button>
    </main>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/useUser'
const { login, loginError } = useUser()
</script>
