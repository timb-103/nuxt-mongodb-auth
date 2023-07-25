<template>
  <h1>Register</h1>
  <form @submit.prevent="register()">
    <input type="email" v-model="email" placeholder="email" />
    <input type="password" v-model="password" placeholder="password (min 6 chars)" />
    <p v-if="errors">{{ errors }}</p>
    <button type="submit">Register</button>
  </form>
  <NuxtLink to="/login">Login</NuxtLink>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'not-auth' })

const email = ref('')
const password = ref('')
const errors = ref('')

async function register() {
  errors.value = ''
  try {
    await authRegister(email.value, password.value)
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
