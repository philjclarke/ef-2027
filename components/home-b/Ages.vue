<script setup lang="ts">
// Four big photo tiles, one per age band, labelled in the teacher's nation's terms.
import type { Age } from '~/utils/catalogue'

const { nation } = usePersonalisation()
const tiles: { age: Age; img: string; bg: string; alt: string }[] = [
  { age: '4-7', img: '/photos/age-4-7.jpg', bg: '#B39BF6', alt: '' },
  { age: '7-11', img: '/photos/age-7-11.jpg', bg: '#46C596', alt: '' },
  { age: '11-14', img: '/photos/age-11-14.jpg', bg: '#FFC629', alt: '' },
  { age: '14-16', img: '/photos/age-14-16.jpg', bg: '#6AA6EA', alt: '' },
]
const count = (a: Age) => catalogue.filter((i) => i.ages.includes(a)).length
</script>

<template>
  <section class="pt-20" aria-labelledby="ages-h">
    <div class="container-x flex flex-col gap-8">
      <div class="flex max-w-[760px] flex-col gap-2.5">
        <h2 id="ages-h" class="h2-section">Who are you teaching?</h2>
        <p class="m-0 text-lg leading-normal text-muted md:text-[19px]">Start from your class. Everything is tagged by age, so you only see what fits.</p>
      </div>
      <ul class="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4 lg:gap-6">
        <li v-for="t in tiles" :key="t.age">
          <NuxtLink
            :to="{ path: '/search', query: { age: t.age } }"
            class="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[24px] text-navy hover:text-navy md:rounded-[32px]"
          >
            <img :src="t.img" :alt="t.alt" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span class="relative m-2.5 flex items-end justify-between gap-2 rounded-[18px] p-4 md:m-3 md:rounded-[22px] md:p-5" :style="{ background: t.bg }">
              <span class="flex flex-col">
                <span class="font-heading text-[26px] font-extrabold leading-none md:text-[34px]">{{ ageLabel(t.age) }}</span>
                <span class="mt-1.5 text-sm font-bold md:text-base">{{ bandLabel(nation, t.age) }}</span>
                <span class="text-xs font-semibold md:text-sm">{{ count(t.age) }} resources</span>
              </span>
              <span class="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/70 transition-transform group-hover:translate-x-0.5 md:h-12 md:w-12">
                <AppIcon name="arrow" :stroke="2.4" />
              </span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
