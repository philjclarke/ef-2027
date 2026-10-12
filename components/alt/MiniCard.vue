<script setup lang="ts">
// Compact thumbnail + title tile, used in the mega menu and personalised rows.
import type { Item } from '~/utils/catalogue'

withDefaults(defineProps<{ item: Item; note?: string; ai?: boolean }>(), { ai: false })
</script>

<template>
  <a :href="item.liveUrl" target="_blank" rel="noopener" class="group flex min-w-0 flex-col gap-2 hover:text-navy">
    <span class="relative block overflow-hidden rounded-2xl bg-lilac-50">
      <img
        :src="item.img"
        alt=""
        width="800"
        height="492"
        loading="lazy"
        class="block aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span
        class="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-extrabold leading-none"
        :class="item.kind === 'collection' ? 'bg-navy text-white' : 'bg-white text-navy'"
      >
        {{ item.kind === 'collection' ? `COLLECTION · ${item.resourceCount}` : badgeFor(item) }}
      </span>
    </span>
    <span class="text-[15px] font-extrabold leading-snug group-hover:underline">{{ item.title }}</span>
    <span v-if="note" class="flex items-start gap-1.5 text-[13px] font-semibold leading-snug text-muted">
      <AltAiMark v-if="ai" class="mt-0.5" />{{ note }}
    </span>
    <span class="sr-only">(opens in a new tab)</span>
  </a>
</template>
