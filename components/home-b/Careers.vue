<script setup lang="ts">
import homepage from '~/data/homepage.json'

const c = homepage.careers
const bg: Record<string, string> = { yellow: '#FFC629', green: '#46C596', white: '#B39BF6' }
</script>

<template>
  <section class="pt-24" aria-labelledby="careers-b-h">
    <div class="container-x">
      <div class="grid overflow-hidden rounded-[32px] bg-navy text-white md:rounded-[40px] lg:grid-cols-[1.05fr_1fr]">
        <div class="relative min-h-[320px] lg:min-h-[560px]">
          <img src="/photos/careers.jpg" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover" />
          <span class="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-extrabold text-navy backdrop-blur">Real people. Real STEM jobs.</span>
        </div>
        <div class="flex flex-col justify-center gap-6 p-8 md:p-12 lg:p-14">
          <span class="text-sm font-extrabold uppercase tracking-[0.08em] text-pop-sun">{{ c.eyebrow }}</span>
          <h2 id="careers-b-h" class="m-0 text-[36px] font-extrabold leading-[1.04] tracking-[-0.02em] md:text-[52px]">{{ c.h2 }}</h2>
          <p class="m-0 max-w-[520px] text-lg leading-[1.55] text-on-navy">{{ c.text }}</p>
          <ul class="m-0 flex list-none flex-col gap-3 p-0">
            <li v-for="p in people" :key="p.id">
              <a
                :href="getItem(p.itemId)?.liveUrl"
                target="_blank"
                rel="noopener"
                class="group flex items-center gap-4 rounded-full bg-white/10 py-2 pl-2 pr-5 hover:bg-white/15 hover:text-white"
              >
                <img :src="p.image" alt="" width="56" height="56" class="h-14 w-14 flex-none rounded-full object-cover" :style="{ background: bg[p.cardColour] }" />
                <span class="flex flex-1 flex-col">
                  <strong class="font-heading text-lg leading-tight">{{ p.name }}</strong>
                  <span class="text-[15px] text-on-navy">{{ p.role }}</span>
                </span>
                <span class="hidden rounded-full px-3 py-1 text-xs font-extrabold text-navy sm:inline" :style="{ background: bg[p.cardColour] }">{{ p.badge }}</span>
                <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
          <NuxtLink
            :to="{ path: '/search', query: { kind: 'careers', tab: 'resources' } }"
            class="inline-flex items-center gap-2.5 self-start rounded-full bg-pop-sun px-[26px] py-[15px] text-[17px] font-extrabold text-navy hover:bg-white hover:text-navy"
          >
            {{ c.cta }}<AppIcon name="arrow" :size="20" :stroke="2.4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
