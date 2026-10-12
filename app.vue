<script setup lang="ts">
const route = useRoute()
const { load } = usePreviewState()
// Preview state lives in localStorage, so it's applied after hydration.
onMounted(() => load(route.query))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
