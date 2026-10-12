<script setup lang="ts">
import type { KindChip } from '~/composables/useSearch'

defineProps<{ modelValue: KindChip; count: (k: KindChip) => number }>()
const emit = defineEmits<{ 'update:modelValue': [k: KindChip] }>()
const chips: { key: KindChip; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'careers', label: 'Careers & role models' },
  { key: 'teaching', label: 'Teaching resources' },
]
</script>

<template>
  <div role="group" aria-label="Resource kind" class="flex flex-wrap gap-2">
    <button
      v-for="c in chips"
      :key="c.key"
      type="button"
      :aria-pressed="modelValue === c.key"
      class="min-h-[44px] cursor-pointer rounded-full text-[15px]"
      :class="
        modelValue === c.key
          ? 'border-0 bg-navy px-[18px] py-2.5 font-extrabold text-white'
          : 'border-[1.5px] border-line-strong bg-white px-[17px] py-[9px] font-bold text-navy hover:border-navy'
      "
      @click="emit('update:modelValue', c.key)"
    >
      {{ c.label }} · {{ count(c.key) }}
    </button>
  </div>
</template>
