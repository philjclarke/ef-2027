<script setup lang="ts">
// Eyebrow + H2 (+ intro) on the left, a text link on the right.
defineProps<{ eyebrow?: string; title: string; intro?: string; link?: { text: string; to: string; external?: boolean } }>()
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex max-w-[680px] flex-col gap-2">
      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <h2 class="h2-section">{{ title }}</h2>
      <p v-if="intro" class="m-0 mt-0.5 text-lg leading-normal text-muted md:text-[19px]">{{ intro }}</p>
    </div>
    <template v-if="link">
      <a v-if="link.external" :href="link.to" target="_blank" rel="noopener" class="link-strong">
        {{ link.text }}<span class="sr-only"> (opens in a new tab)</span>
      </a>
      <NuxtLink v-else :to="link.to" class="link-strong">{{ link.text }}</NuxtLink>
    </template>
  </div>
</template>
