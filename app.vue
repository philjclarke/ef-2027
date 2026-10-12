<script setup lang="ts">
const route = useRoute()
const { load } = usePreviewState()
const { load: loadPrefs } = usePersonalisation()
// Preview state lives in localStorage, so it's applied after hydration.
onMounted(() => {
  load(route.query)
  loadPrefs()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
