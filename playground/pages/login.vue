<template>
  <h1>Login</h1>
  <form @submit.prevent="login()">
    <input type="email" v-model="email" placeholder="email" />
    <input type="password" v-model="password" placeholder="password" />
    <p v-if="errors">{{ errors }}</p>
    <button type="submit">Login</button>
  </form>
  <NuxtLink to="/register">Register</NuxtLink>
</template>

<script setup lang="ts">
import { definePageMeta, ref, navigateTo, useAuthLogin } from '#imports'

definePageMeta({ middleware: 'not-auth' })

const email = ref('')
const password = ref('')
const errors = ref('')

async function login() {
  errors.value = ''
  try {
    await useAuthLogin(email.value, password.value)
    navigateTo('/dashboard')
  } catch (error: any) {
    errors.value = error.statusMessage
  }
}
</script>
<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  gap: 10px;
}
</style>
