<script setup lang="ts">
import type { SortKey } from '~/utils/search'

defineProps<{ id: string; modelValue: SortKey }>()
const emit = defineEmits<{ 'update:modelValue': [v: SortKey] }>()
</script>

<template>
  <div class="flex items-center gap-2.5">
    <label :for="id" class="text-[15px] font-bold">Sort</label>
    <select
      :id="id"
      :value="modelValue"
      class="min-h-[44px] cursor-pointer rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 py-2.5 font-body text-[15px] font-bold text-navy"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value as SortKey)"
    >
      <option value="best">Best match</option>
      <option value="newest">Newest</option>
      <option value="az">A–Z</option>
    </select>
  </div>
</template>
