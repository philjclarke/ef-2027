<script setup lang="ts">
// Collection card with two tinted "stack" layers peeking out behind it.
// The whole card links to the collection (View collection is the only action).
import type { Item } from '~/utils/catalogue'

const props = withDefaults(defineProps<{ item: Item; size?: 'sm' | 'lg'; description?: boolean }>(), {
  size: 'sm',
  description: false,
})
const tint = computed(() => stackTint(props.item))
const lg = computed(() => props.size === 'lg')
</script>

<template>
  <article class="relative" :class="lg ? 'zoom rounded-3xl' : 'lift rounded-[22px]'">
    <div
      aria-hidden="true"
      class="absolute"
      :class="lg ? 'inset-x-6 -top-4 h-[60px] rounded-3xl' : 'inset-x-5 -top-3 h-[50px] rounded-[20px]'"
      :style="{ background: tint.back }"
    />
    <div
      aria-hidden="true"
      class="absolute"
      :class="lg ? 'inset-x-3 -top-2 h-[60px] rounded-3xl' : 'inset-x-2.5 -top-1.5 h-[50px] rounded-[20px]'"
      :style="{ background: tint.mid }"
    />
    <div
      class="relative flex h-full flex-col overflow-hidden bg-white"
      :class="lg ? 'rounded-3xl shadow-card' : 'rounded-[22px] shadow-card-sm'"
    >
      <div class="relative overflow-hidden leading-none" :class="lg ? 'h-[200px]' : ''">
        <img
          :src="item.img"
          alt=""
          width="800"
          height="492"
          loading="lazy"
          decoding="async"
          class="cover block w-full object-cover"
          :class="lg ? 'h-full' : 'aspect-[800/492]'"
        />
        <span
          class="absolute flex items-center gap-1.5 rounded-full bg-navy text-[13px] font-extrabold leading-[1.2] text-white"
          :class="lg ? 'bottom-3 right-3 px-3 py-1.5' : 'bottom-2.5 right-2.5 px-[11px] py-1.5'"
        >
          <AppIcon name="stack" :size="lg ? 14 : 13" :stroke="2.5" />{{ collectionCountLabel(item) }}
        </span>
      </div>
      <div class="flex flex-col" :class="lg ? 'gap-2.5 px-[22px] pb-6 pt-[22px]' : 'gap-2 px-[18px] pb-5 pt-4'">
        <div class="flex flex-wrap items-center gap-1.5 text-[13px] font-bold">
          <span class="mr-0.5 text-muted">{{ levelLabel(item) }}</span>
          <AgePill v-for="a in item.ages" :key="a" :age="a" />
        </div>
        <h3 class="m-0 font-extrabold" :class="lg ? 'text-[22px] leading-[1.2]' : 'text-lg leading-[1.3]'">
          <a :href="item.liveUrl" target="_blank" rel="noopener" class="card-link">
            {{ item.title }}<span class="sr-only"> (collection, opens in a new tab)</span>
          </a>
        </h3>
        <p v-if="description" class="m-0 line-clamp-3 text-[15px] leading-normal text-muted">{{ summaryFor(item) }}</p>
      </div>
    </div>
  </article>
</template>
