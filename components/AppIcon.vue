<script setup lang="ts">
// Line icons used across the designs (24px viewBox, stroke = currentColor).
export type IconName =
  | 'search' | 'bookmark' | 'arrow' | 'download' | 'play' | 'launch' | 'open'
  | 'stack' | 'close' | 'chevron' | 'menu' | 'gamepad' | 'filter' | 'check'

const props = withDefaults(defineProps<{ name: IconName; size?: number; stroke?: number; filled?: boolean }>(), {
  size: 18,
  stroke: 2.2,
  filled: false,
})
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    :fill="props.filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="props.stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    class="flex-none"
  >
    <template v-if="name === 'search'"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></template>
    <path v-else-if="name === 'bookmark'" d="M6 4h12v16l-6-4-6 4z" />
    <path v-else-if="name === 'arrow'" d="M5 12h14M13 6l6 6-6 6" />
    <path v-else-if="name === 'download'" d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    <template v-else-if="name === 'play'"><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5.5 3.5-5.5 3.5z" /></template>
    <template v-else-if="name === 'launch'"><rect x="2" y="6" width="20" height="12" rx="4" /><path d="M7 10v4M5 12h4M15 11h.01M18 13h.01" /></template>
    <path v-else-if="name === 'gamepad'" d="M7 10v4M5 12h4M15 11h.01M18 13h.01M6 6h12a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z" />
    <path v-else-if="name === 'open'" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    <template v-else-if="name === 'stack'"><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></template>
    <path v-else-if="name === 'close'" d="M6 6l12 12M18 6L6 18" />
    <path v-else-if="name === 'chevron'" d="M6 9l6 6 6-6" />
    <path v-else-if="name === 'menu'" d="M4 7h16M4 12h16M4 17h16" />
    <path v-else-if="name === 'filter'" d="M4 6h16M7 12h10M10 18h4" />
    <path v-else-if="name === 'check'" d="M5 12l5 5 9-10" />
  </svg>
</template>
