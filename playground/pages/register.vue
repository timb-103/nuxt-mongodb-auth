<template>
  <main>
    <!-- Title -->
    <h1>Register</h1>

    <!-- Register Form -->
    <form @submit.prevent="register()">
      <!-- Email & Password Inputs -->
      <div>
        <input type="email" v-model="email" placeholder="email" />
      </div>
      <div>
        <input type="password" v-model="password" placeholder="password (min 6 chars)" />
      </div>

      <!-- Errors -->
      <div v-if="errors">
        <code>{{ errors }}</code>
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="loading">Register</button>
    </form>

    <!-- Link to Login -->
    <NuxtLink to="/login">Login</NuxtLink>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta, ref, useAuthRegister, navigateTo } from '#imports'

definePageMeta({ middleware: 'not-auth' })

const email = ref('')
const password = ref('')
const errors = ref('')
const loading = ref(false)

async function register() {
  loading.value = true
  errors.value = ''
  try {
    await useAuthRegister(email.value, password.value)
    navigateTo('/dashboard')
  } catch (error: any) {
    errors.value = error.statusMessage
  }
  loading.value = false
}
</script>
