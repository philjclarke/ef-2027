<script setup lang="ts">
import homepage from '~/data/homepage.json'

const it = homepage.interactives
const base = { format: 'Interactive', tab: 'resources' }
</script>

<template>
  <section class="bg-lilac-50 pb-[72px] pt-2 md:pb-[88px]">
    <div class="container-x">
      <div class="zoom flex flex-wrap overflow-hidden rounded-[32px] bg-yellow">
        <div class="relative min-h-[240px] flex-[1.1_1_420px] overflow-hidden md:min-h-[360px]">
          <img :src="it.image" :alt="it.alt" width="800" height="492" loading="lazy" class="cover absolute inset-0 block h-full w-full object-cover" />
        </div>
        <div class="relative flex flex-[1_1_380px] flex-col justify-center gap-[18px] px-7 pb-10 pt-8 md:px-12 md:pb-[52px] md:pt-12">
          <span class="inline-flex items-center gap-2 self-start rounded-full bg-navy px-3.5 py-[7px] text-[13px] font-extrabold tracking-[0.06em] text-white">
            <AppIcon name="launch" :size="16" :stroke="2.4" />{{ it.eyebrow }}
          </span>
          <h2 class="m-0 text-[32px] font-extrabold leading-[1.06] tracking-[-0.015em] md:text-[44px]">{{ it.h2 }}</h2>
          <p class="m-0 max-w-[460px] text-lg leading-[1.55]">{{ it.text }}</p>
          <div class="mt-1 flex flex-wrap items-center gap-2.5">
            <NuxtLink :to="{ path: '/search', query: base }" class="btn-navy px-6 py-3.5">
              Explore interactives<AppIcon name="arrow" :stroke="2.4" />
            </NuxtLink>
            <NuxtLink :to="{ path: '/search', query: { ...base, age: '4-7,7-11' } }" class="rounded-full bg-white px-5 py-[13px] font-extrabold">
              Primary
            </NuxtLink>
            <NuxtLink :to="{ path: '/search', query: { ...base, age: '11-14,14-16' } }" class="rounded-full bg-white px-5 py-[13px] font-extrabold">
              Secondary
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
