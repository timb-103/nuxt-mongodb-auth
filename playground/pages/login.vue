<template>
  <main>
    <!-- Title -->
    <h1>Login</h1>

    <!-- Login Form -->
    <form @submit.prevent="login()">
      <!-- Email & Password Inputs-->
      <div>
        <input type="email" v-model="email" placeholder="email" />
      </div>
      <div>
        <input type="password" v-model="password" placeholder="password" />
      </div>

      <!-- Errors -->
      <div v-if="errors">
        <code>{{ errors }}</code>
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="loading">Login</button>
    </form>

    <!-- Link to Register-->
    <NuxtLink to="/register">Register</NuxtLink>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta, ref, navigateTo, useAuthLogin, onMounted } from '#imports'

definePageMeta({ middleware: 'not-auth' })

const email = ref('')
const password = ref('')
const errors = ref('')
const loading = ref(false)

async function login() {
  errors.value = ''
  loading.value = true
  try {
    await useAuthLogin(email.value, password.value)
    navigateTo('/dashboard')
  } catch (error: any) {
    errors.value = error.statusMessage
  }
  loading.value = false
}

onMounted(() => $fetch('/api/user/get'))
</script>
