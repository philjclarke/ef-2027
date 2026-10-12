<script setup lang="ts">
// Checkbox + label + live count. Disabled (and dimmed) at 0 unless already ticked,
// so you can never filter down to nothing.
const props = defineProps<{ checked: boolean; count: number }>()
const emit = defineEmits<{ toggle: [] }>()
const disabled = computed(() => props.count === 0 && !props.checked)
</script>

<template>
  <label
    class="flex min-h-[44px] items-center gap-3 text-base font-semibold"
    :class="disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'"
  >
    <input type="checkbox" :checked="checked" :disabled="disabled" @change="emit('toggle')" />
    <slot />
    <span class="ml-auto text-sm font-extrabold text-muted">
      {{ count }}<span class="sr-only"> results</span>
    </span>
  </label>
</template>
