<script setup lang="ts">
import type { Item } from '~/utils/catalogue'

const list = ['circuits-interactive-online-experiment', 'animal-explorer-interactive-7-11', 'periodic-table-challenge']
  .map(getItem)
  .filter((i): i is Item => !!i)
</script>

<template>
  <section class="pt-24" aria-labelledby="int-b-h">
    <div class="container-x">
      <div class="grid items-center gap-8 overflow-hidden rounded-[32px] bg-pop-mint-soft p-6 md:rounded-[40px] md:p-10 lg:grid-cols-[1fr_1.3fr] lg:gap-12 lg:p-12">
        <div class="flex flex-col gap-5">
          <span class="inline-flex items-center gap-2 self-start rounded-full bg-navy px-3.5 py-[7px] text-[13px] font-extrabold tracking-[0.06em] text-white">
            <AppIcon name="launch" :size="16" :stroke="2.4" />INTERACTIVES
          </span>
          <h2 id="int-b-h" class="m-0 text-[32px] font-extrabold leading-[1.06] tracking-[-0.015em] md:text-[44px]">Science games pupils actually want to play</h2>
          <p class="m-0 max-w-[460px] text-lg leading-[1.55]">Sort, test and explore on the whiteboard or on their own devices. Interactives launch in the browser, so there’s nothing to download.</p>
          <div class="flex flex-wrap gap-2.5">
            <NuxtLink to="/search?format=Interactive&tab=resources" class="btn-navy px-6 py-3.5">Explore interactives<AppIcon name="arrow" :stroke="2.4" /></NuxtLink>
            <NuxtLink to="/search?format=Interactive&tab=resources&age=4-7,7-11" class="rounded-full bg-white px-5 py-[13px] font-extrabold">Primary</NuxtLink>
            <NuxtLink to="/search?format=Interactive&tab=resources&age=11-14,14-16" class="rounded-full bg-white px-5 py-[13px] font-extrabold">Secondary</NuxtLink>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
          <img src="/photos/interactives.jpg" alt="" loading="lazy" class="h-full min-h-[240px] w-full rounded-[24px] object-cover" />
          <div class="flex flex-col gap-4">
            <a
              v-for="i in list"
              :key="i.id"
              :href="i.liveUrl"
              target="_blank"
              rel="noopener"
              class="group flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 hover:text-navy"
            >
              <img :src="i.img" alt="" loading="lazy" class="h-14 w-20 flex-none rounded-xl object-cover" />
              <span class="flex flex-col">
                <span class="text-[15px] font-extrabold leading-snug group-hover:underline">{{ i.title }}</span>
                <span class="flex gap-1"><AgePill v-for="a in i.ages" :key="a" :age="a" size="xs" /></span>
              </span>
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
