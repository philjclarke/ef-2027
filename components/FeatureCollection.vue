<script setup lang="ts">
// Large navy two-column collection card: "Best match" on search, and the seasonal feature on the homepage.
import type { Item } from '~/utils/catalogue'

const props = withDefaults(
  defineProps<{
    item: Item
    variant?: 'best' | 'feature'
    badge?: string
    title?: string
    text?: string
    image?: string
    cta?: string
    topics?: string[]
  }>(),
  { variant: 'best', topics: () => [] },
)
const tint = computed(() => stackTint(props.item))
const meta = computed(() => `COLLECTION · ${props.item.level.join(', ').toUpperCase()}`)
</script>

<template>
  <!-- Homepage feature -->
  <article
    v-if="variant === 'feature'"
    class="lift relative flex min-w-0 flex-wrap overflow-hidden rounded-[32px] bg-navy text-white"
  >
    <div class="flex min-h-[260px] flex-[1_1_300px] items-center justify-center bg-yellow p-5 md:min-h-[340px]">
      <img :src="image ?? item.img" alt="" width="800" height="492" class="block h-auto w-full rounded-xl" />
    </div>
    <div class="flex flex-[1_1_300px] flex-col justify-center gap-4 p-7 md:p-10">
      <span v-if="badge" class="self-start rounded-full bg-yellow px-3.5 py-1.5 text-[13px] font-extrabold tracking-[0.04em] text-navy">
        {{ badge }}
      </span>
      <h3 class="m-0 text-[28px] font-extrabold leading-[1.1] md:text-[36px]">
        <a :href="item.liveUrl" target="_blank" rel="noopener" class="card-link text-white hover:text-white">
          {{ title ?? item.title }}<span class="sr-only"> (opens in a new tab)</span>
        </a>
      </h3>
      <p class="m-0 text-[17px] leading-[1.55] text-on-navy">{{ text ?? summaryFor(item) }}</p>
      <span aria-hidden="true" class="mt-1.5 inline-flex items-center gap-2 self-start rounded-full bg-white px-[22px] py-[13px] font-extrabold text-navy">
        {{ cta ?? 'Explore the collection' }}<AppIcon name="arrow" :stroke="2.4" />
      </span>
    </div>
  </article>

  <!-- Search "Best match" -->
  <article v-else class="lift relative mt-3.5 rounded-[28px]">
    <div aria-hidden="true" class="absolute inset-x-8 -top-3.5 h-[60px] rounded-[28px]" :style="{ background: tint.back }" />
    <div aria-hidden="true" class="absolute inset-x-4 -top-[7px] h-[60px] rounded-[28px]" :style="{ background: tint.mid }" />
    <div class="relative flex flex-wrap overflow-hidden rounded-[28px] bg-navy text-white">
      <div class="relative min-h-[220px] flex-[1.1_1_320px] md:min-h-[300px]">
        <img :src="item.img" alt="" class="absolute inset-0 block h-full w-full object-cover" />
        <span class="absolute left-[18px] top-[18px] rounded-full bg-yellow px-3.5 py-1.5 text-[13px] font-extrabold tracking-[0.04em] text-navy">
          BEST MATCH
        </span>
      </div>
      <div class="flex flex-[1_1_320px] flex-col justify-center gap-3.5 px-7 py-7 md:px-9 md:py-[34px]">
        <div class="flex flex-wrap items-center gap-2 text-[13px] font-extrabold">
          <span class="tracking-[0.06em] text-on-navy-label">{{ meta }}</span>
          <AgePill v-for="a in item.ages" :key="a" :age="a" />
        </div>
        <h2 class="m-0 text-[28px] font-extrabold leading-[1.1] md:text-[34px]">
          <a :href="item.liveUrl" target="_blank" rel="noopener" class="card-link text-white hover:text-white">
            {{ item.title }}<span class="sr-only"> (collection, opens in a new tab)</span>
          </a>
        </h2>
        <p class="m-0 text-[17px] leading-[1.55] text-on-navy">{{ summaryFor(item) }}</p>
        <div v-if="topics.length" class="flex flex-wrap gap-2">
          <TopicTag v-for="t in topics" :key="t" :topic="t" variant="navy" />
        </div>
        <div class="mt-1 flex flex-wrap items-center gap-3.5">
          <span aria-hidden="true" class="inline-flex items-center gap-2 rounded-full bg-white px-[22px] py-[13px] font-extrabold text-navy">
            View collection<AppIcon name="arrow" :stroke="2.4" />
          </span>
          <span class="inline-flex items-center gap-2 text-base font-extrabold">
            <AppIcon name="stack" />{{ collectionCountLabel(item) }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>
