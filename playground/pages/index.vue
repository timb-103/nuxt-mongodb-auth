<template><p>hi</p></template>
<script setup lang="ts">
import { onMounted } from '#imports'

onMounted(() => $fetch('/api/user/get'))
</script>
