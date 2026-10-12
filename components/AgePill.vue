<script setup lang="ts">
import type { Age } from '~/utils/catalogue'
// Coloured age band pill. Text is always navy; the white ring keeps it visible on any background.
const props = withDefaults(defineProps<{ age: string; size?: 'xs' | 'sm' | 'md' }>(), { size: 'sm' })
const bg = computed(() => ageInfo[props.age as Age]?.colour ?? '#E4E3F2')
</script>

<template>
  <span
    class="relative inline-block whitespace-nowrap rounded-full font-extrabold text-navy shadow-pill"
    :class="{
      'px-[9px] py-[2px] text-xs': size === 'xs',
      'px-[10px] py-[3px] text-[13px]': size === 'sm',
      'px-3 py-[5px] text-base': size === 'md',
    }"
    :style="{ background: bg }"
  >
    <span class="sr-only">Ages </span>{{ ageLabel(age) }}
  </span>
</template>
