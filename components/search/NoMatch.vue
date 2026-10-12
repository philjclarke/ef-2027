<script setup lang="ts">
// Body of the "No exact match" page: closest matches (if any), related collections,
// browse by age, and a "Still can't find it?" panel. Never a dead end.
import type { Item } from '~/utils/catalogue'
import type { SearchMode } from '~/utils/search'

const props = defineProps<{ items: Item[]; mode: SearchMode; term: string | null; related: Item[] }>()
const suggest = ref<{ open: () => void } | null>(null)
const shown = computed(() => props.items.slice(0, 12))
const hint = computed(() => (props.mode === 'substring' && props.term ? `Mentions “${props.term}”` : undefined))
const relatedMeta = (c: Item) => [`Collection`, collectionCountLabel(c), c.ages.length === 1 ? ageLabel(c.ages[0]) : ''].filter(Boolean).join(' · ')
</script>

<template>
  <div class="container-x flex flex-col gap-16 pb-24 pt-12">
    <section v-if="items.length" class="flex flex-col gap-[22px]" aria-labelledby="closest-h">
      <h2 id="closest-h" class="m-0 text-[28px] font-extrabold">
        Closest matches <span class="font-body text-lg font-bold text-muted">({{ items.length }})</span>
      </h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-[22px]">
        <ResourceCard v-for="i in shown" :key="i.id" :item="i" :hint="hint" :action="i.kind === 'resource'" />
      </div>
      <NuxtLink
        v-if="items.length > shown.length && term"
        :to="{ path: '/search', query: { q: term } }"
        class="self-center rounded-full border-2 border-navy bg-white px-7 py-3.5 text-base font-extrabold"
      >
        See all {{ items.length }} results for “{{ term }}”
      </NuxtLink>
    </section>

    <section class="flex flex-col gap-[22px]" aria-labelledby="related-h">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <h2 id="related-h" class="m-0 text-[28px] font-extrabold">Explore a related collection</h2>
        <NuxtLink to="/search?tab=collections" class="link-strong text-base">Browse all collections</NuxtLink>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-[22px]">
        <a
          v-for="c in related"
          :key="c.id"
          :href="c.liveUrl"
          target="_blank"
          rel="noopener"
          class="lift relative block h-[240px] overflow-hidden rounded-[22px] text-white hover:text-white"
        >
          <img :src="c.img" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover" />
          <span aria-hidden="true" class="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,14,99,0)_30%,rgba(17,14,99,0.88)_100%)]" />
          <span class="absolute bottom-[18px] left-5 right-5 flex flex-col gap-1">
            <strong class="font-heading text-[21px] leading-[1.2]">{{ c.title }}</strong>
            <span class="text-sm font-bold">{{ relatedMeta(c) }}</span>
            <span class="sr-only">(opens in a new tab)</span>
          </span>
        </a>
      </div>
    </section>

    <section class="flex flex-wrap gap-6">
      <div class="flex min-w-0 flex-[1_1_380px] flex-col gap-[18px] rounded-[28px] bg-lilac-50 p-6 md:p-8">
        <h2 class="m-0 text-2xl font-extrabold">Browse by age instead</h2>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(130px,100%),1fr))] gap-2.5">
          <NuxtLink
            v-for="a in AGES"
            :key="a"
            :to="{ path: '/search', query: { age: a } }"
            class="flex flex-col gap-0.5 rounded-[18px] p-[18px]"
            :style="{ background: ageInfo[a].colour }"
          >
            <strong class="font-heading text-[22px]"><span class="sr-only">Ages </span>{{ ageLabel(a) }}</strong>
            <span class="text-sm font-bold">{{ ageInfo[a].level }}</span>
          </NuxtLink>
        </div>
        <p class="m-0 text-[15px] leading-normal text-muted">Tip: one key word works best, like a topic name.</p>
      </div>

      <div class="relative flex min-w-0 flex-[1_1_380px] flex-col justify-between gap-[18px] overflow-hidden rounded-[28px] bg-navy p-6 text-white md:p-8">
        <img src="/brand/assorted-icons-1.svg" alt="" aria-hidden="true" class="doodle -bottom-[90px] -right-[120px] w-[480px] opacity-10 invert" />
        <div class="relative flex flex-col gap-2.5">
          <h2 class="m-0 text-2xl font-extrabold">Still can’t find it?</h2>
          <p class="m-0 max-w-[420px] text-[17px] leading-normal text-on-navy">
            Tell us what you’re teaching. Requests like yours help shape the resources we make next.
          </p>
        </div>
        <button
          type="button"
          class="relative cursor-pointer self-start rounded-full border-0 bg-yellow px-6 py-3.5 font-body text-base font-extrabold text-navy hover:bg-white"
          @click="suggest?.open()"
        >
          Suggest a resource
        </button>
      </div>
    </section>
    <SearchSuggestDialog ref="suggest" />
  </div>
</template>
