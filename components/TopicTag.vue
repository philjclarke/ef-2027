<script setup lang="ts">
// "#Topic" pill that runs a search for the topic.
withDefaults(defineProps<{ topic: string; variant?: 'light' | 'outline' | 'navy' }>(), { variant: 'light' })
</script>

<template>
  <NuxtLink
    :to="{ path: '/search', query: { q: topic.toLowerCase() } }"
    class="card-raise inline-flex items-center gap-1 rounded-full"
    :class="{
      'bg-white px-3 py-1.5 text-[15px] font-extrabold': variant === 'light',
      'border-[1.5px] border-navy px-[13px] py-[7px] text-sm font-extrabold': variant === 'outline',
      'border-[1.5px] border-[#5E5BA8] px-3 py-[5px] text-sm font-bold text-white hover:border-white hover:text-white': variant === 'navy',
    }"
  >
    <span aria-hidden="true" :class="variant === 'navy' ? 'text-on-navy-label' : 'text-muted'">#</span>{{ topic }}
  </NuxtLink>
</template>
