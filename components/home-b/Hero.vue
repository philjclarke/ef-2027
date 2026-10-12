<script setup lang="ts">
import homepage from '~/data/homepage.json'

const h = homepage.hero
const imisi = people.find((p) => p.id === 'imisi')!
const imisiItem = getItem(imisi.itemId)
</script>

<template>
  <section class="pt-3 md:pt-5">
    <div class="container-x">
      <div class="relative isolate flex min-h-[600px] overflow-hidden rounded-[28px] bg-navy md:rounded-[40px] lg:min-h-[640px]">
        <img
          src="/photos/hero-b.jpg"
          alt=""
          width="2000"
          height="1333"
          fetchpriority="high"
          class="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center]"
        />
        <div class="hero-shade absolute inset-0 -z-10" aria-hidden="true" />

        <div class="flex min-w-0 max-w-[720px] flex-col justify-end gap-6 p-6 pt-48 text-white md:p-12 lg:justify-center lg:p-16">
          <p class="m-0 inline-flex items-center gap-2.5 self-start rounded-full bg-white/15 py-1.5 pl-1.5 pr-4 text-sm font-bold backdrop-blur md:text-[15px]">
            <span class="rounded-full bg-pop-sun px-2.5 py-1 text-[13px] font-extrabold tracking-[0.04em] text-navy">{{ h.eyebrow.badge }}</span>
            {{ h.eyebrow.text }}
          </p>
          <h1 class="m-0 text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[52px] xl:text-[64px]">
            {{ h.h1 }} <span class="text-pop-sun">{{ h.h1Highlight }}</span>
          </h1>
          <p class="m-0 max-w-[560px] text-lg leading-normal text-white/90 md:text-xl">{{ h.intro }}</p>
          <div class="flex max-w-[620px] flex-col gap-3.5 text-navy">
            <SearchField id="hero-b-search" size="hero" typeahead :placeholder="h.searchPlaceholder" />
            <div class="flex flex-wrap items-center gap-2 text-[15px] text-white">
              <span class="mr-1 font-bold">Popular:</span>
              <NuxtLink
                v-for="p in h.popular"
                :key="p"
                :to="{ path: '/search', query: { q: p.toLowerCase() } }"
                class="rounded-full bg-white/15 px-[15px] py-[7px] font-bold backdrop-blur hover:bg-white hover:text-navy"
              >
                {{ p }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <a
          :href="imisiItem?.liveUrl"
          target="_blank"
          rel="noopener"
          class="absolute bottom-[88px] right-8 hidden items-center gap-4 rounded-full bg-white/95 py-2 pl-2 pr-6 text-navy shadow-lift backdrop-blur transition-transform hover:-translate-y-1 hover:text-navy xl:flex"
        >
          <img :src="imisi.image" alt="" width="64" height="64" class="h-16 w-16 rounded-full bg-pop-sun object-cover" />
          <span class="flex flex-col">
            <span class="text-xs font-extrabold uppercase tracking-[0.06em] text-muted">Meet {{ imisi.name }}</span>
            <span class="font-heading text-lg font-bold leading-tight">{{ imisi.role }}</span>
          </span>
          <AppIcon name="arrow" :stroke="2.4" class="ml-1" />
          <span class="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-shade {
  background: linear-gradient(0deg, rgba(17, 14, 99, 0.94) 0%, rgba(17, 14, 99, 0.78) 50%, rgba(17, 14, 99, 0.15) 85%);
}
@media (min-width: 1024px) {
  .hero-shade {
    background: linear-gradient(90deg, rgba(17, 14, 99, 0.92) 0%, rgba(17, 14, 99, 0.72) 42%, rgba(17, 14, 99, 0) 72%);
  }
}
</style>
