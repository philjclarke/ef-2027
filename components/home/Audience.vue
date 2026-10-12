<script setup lang="ts">
import homepage from '~/data/homepage.json'

const a = homepage.audience
const bg: Record<string, string> = { 'teal-50': '#D7EBEB', 'sky-50': '#D6E6F5' }
</script>

<template>
  <section class="pb-10 pt-14 md:pt-[72px]">
    <div class="container-x flex flex-col gap-9">
      <div class="flex max-w-[760px] flex-col gap-2.5">
        <h2 class="h2-section">{{ a.h2 }}</h2>
        <p class="m-0 text-lg leading-normal text-muted md:text-[19px]">{{ a.intro }}</p>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(500px,100%),1fr))] gap-7">
        <article
          v-for="c in a.cards"
          :key="c.level"
          class="lift zoom flex flex-col overflow-hidden rounded-[32px]"
          :style="{ background: bg[c.bg] }"
        >
          <div class="relative h-[220px] overflow-hidden md:h-[280px]">
            <img :src="c.image" :alt="c.alt" width="800" height="492" loading="lazy" class="cover block h-full w-full object-cover" />
            <span class="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-sm font-extrabold tracking-[0.04em]">{{ c.eyebrow }}</span>
          </div>
          <div class="flex flex-col gap-[18px] px-6 pb-8 pt-7 md:px-9 md:pb-9 md:pt-8">
            <h3 class="m-0 text-[34px] font-extrabold leading-[1.05] md:text-[40px]">{{ c.level }}</h3>
            <p class="m-0 max-w-[460px] text-lg leading-normal">{{ c.text }}</p>
            <div class="flex flex-wrap items-center gap-2.5">
              <NuxtLink
                v-for="age in c.ages"
                :key="age"
                :to="{ path: '/search', query: { age } }"
                class="rounded-full px-5 py-[11px] font-extrabold"
                :style="{ background: ageInfo[age as keyof typeof ageInfo].colour }"
              >
                <span class="sr-only">Ages </span>{{ ageLabel(age) }}
              </NuxtLink>
              <NuxtLink
                :to="{ path: '/search', query: { age: c.ages.join(',') } }"
                class="btn-navy ml-auto px-[22px] py-[13px]"
              >
                {{ c.cta }}<AppIcon name="arrow" :stroke="2.4" />
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
