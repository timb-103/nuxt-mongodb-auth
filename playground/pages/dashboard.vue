<template>
  <main>
    <!-- Title -->
    <h1>Dashboard</h1>

    <!-- Loading Text -->
    <p v-if="loading">loading...</p>

    <!-- User Data -->
    <pre v-else><code>User: {{ user }}</code></pre>

    <!-- Logout Button -->
    <button @click="useAuthLogout()">Logout</button>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta, ref, onMounted, useAuthLogout, useAuthUser } from '#imports'
import { User } from '../../src/user'

definePageMeta({ middleware: 'auth' })

const user = ref<User | null>(null)
const loading = ref(true)

async function getUser() {
  loading.value = true
  try {
    user.value = await useAuthUser()
  } catch (error) {
    console.log('Error getting user')
  }
  loading.value = false
}

onMounted(() => getUser())
</script>
