<script setup lang="ts">
defineProps<{ label: string }>()
const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-label="`Remove filter: ${label}`"
    class="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full border-0 bg-navy py-2 pl-4 pr-3 text-sm font-extrabold text-white hover:bg-navy-700"
    @click="emit('remove')"
  >
    {{ label }}<AppIcon name="close" :size="14" :stroke="2.8" />
  </button>
</template>
