<script setup lang="ts">
// Seasonal bento: one big photo tile and three smaller ones.
const halloween = getItem('halloween-resources')
const bonfire = getItem('the-secret-science-of-bonfire-night')
const bhm = getItem('brilliant-black-scientists-shaping-our-world-primary')
const bhmAll = getItem('resources-celebrating-black-scientists')
const aaf = getItem('aaf-challenge-presentation-primary')
</script>

<template>
  <section class="pt-24" aria-labelledby="term-h">
    <div class="container-x flex flex-col gap-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col gap-2">
          <span class="eyebrow">Autumn term</span>
          <h2 id="term-h" class="h2-section">Ready for this half term</h2>
        </div>
      </div>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[300px_300px]">
        <!-- Big tile -->
        <a
          :href="halloween?.liveUrl"
          target="_blank"
          rel="noopener"
          class="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[32px] text-white hover:text-white md:col-span-2 lg:row-span-2"
        >
          <img src="/photos/halloween.jpg" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span class="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,14,99,0)_35%,rgba(17,14,99,0.9)_100%)]" aria-hidden="true" />
          <span class="relative flex flex-col gap-3 p-7 md:p-9">
            <span class="self-start rounded-full bg-pop-coral px-3.5 py-1.5 text-[13px] font-extrabold tracking-[0.04em] text-navy">HALLOWEEN · 31 OCTOBER</span>
            <span class="font-heading text-[30px] font-extrabold leading-[1.05] md:text-[40px]">Spooky science for the end of half term</span>
            <span class="max-w-[460px] text-[17px] leading-normal text-white/90">Dancing ghosts, flying bats and the scientists behind spooky season. Hands-on activities for primary and secondary.</span>
            <span class="mt-1 inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 font-extrabold text-navy">
              Explore the collection<AppIcon name="arrow" :stroke="2.4" />
            </span>
            <span class="sr-only">(opens in a new tab)</span>
          </span>
        </a>

        <!-- Black History Month -->
        <a
          :href="bhmAll?.liveUrl ?? bhm?.liveUrl"
          target="_blank"
          rel="noopener"
          class="group flex flex-col gap-4 overflow-hidden rounded-[32px] bg-pop-lilac-soft p-6 text-navy hover:text-navy md:col-span-2 md:flex-row md:items-center lg:p-7"
        >
          <span class="flex flex-1 flex-col gap-2.5">
            <span class="self-start rounded-full bg-pop-lilac px-3 py-1 text-xs font-extrabold tracking-[0.04em]">BLACK HISTORY MONTH</span>
            <span class="font-heading text-2xl font-extrabold leading-tight md:text-[28px]">Brilliant Black scientists shaping our world</span>
            <span class="text-[15px] leading-normal">Posters and resources celebrating trailblazing Black British scientists.</span>
          </span>
          <img
            v-if="bhm"
            :src="bhm.img"
            alt=""
            loading="lazy"
            class="w-full rounded-2xl object-cover shadow-card transition-transform duration-500 group-hover:-rotate-2 md:w-[46%]"
          />
          <span class="sr-only">(opens in a new tab)</span>
        </a>

        <!-- Bonfire Night -->
        <a
          :href="bonfire?.liveUrl"
          target="_blank"
          rel="noopener"
          class="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[32px] text-white hover:text-white"
        >
          <img src="/photos/fireworks.jpg" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span class="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,14,99,0)_25%,rgba(17,14,99,0.88)_100%)]" aria-hidden="true" />
          <span class="relative flex flex-col gap-1.5 p-6">
            <span class="text-xs font-extrabold tracking-[0.06em] text-pop-sun">BONFIRE NIGHT · 5 NOVEMBER</span>
            <span class="font-heading text-[22px] font-extrabold leading-tight">The secret science of Bonfire Night</span>
            <span class="sr-only">(opens in a new tab)</span>
          </span>
        </a>

        <!-- Asteroid Action Force -->
        <a
          :href="aaf?.liveUrl"
          target="_blank"
          rel="noopener"
          class="group flex min-h-[260px] flex-col justify-between gap-4 overflow-hidden rounded-[32px] bg-pop-blue p-6 text-navy hover:text-navy"
        >
          <span class="self-start rounded-full bg-white px-3 py-1 text-xs font-extrabold tracking-[0.04em]">NEW COMPETITION</span>
          <span class="flex flex-col gap-1.5">
            <span class="font-heading text-[22px] font-extrabold leading-tight">Asteroid Action Force</span>
            <span class="text-[15px] font-semibold leading-snug">Pupils design a way to deflect an asteroid, then enter it into the competition.</span>
          </span>
          <span class="inline-flex items-center gap-2 font-extrabold">Find out more<AppIcon name="arrow" :stroke="2.4" class="transition-transform group-hover:translate-x-1" /></span>
          <span class="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  </section>
</template>
