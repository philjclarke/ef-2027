<script setup lang="ts">
import homepage from '~/data/homepage.json'

const c = homepage.careers
const list = c.people.map((id) => people.find((p) => p.id === id)).filter((p) => !!p)
</script>

<template>
  <section class="relative overflow-hidden bg-navy pb-20 pt-16 text-white md:pb-24 md:pt-20">
    <img src="/brand/assorted-icons-1.svg" alt="" aria-hidden="true" class="doodle -bottom-20 -left-[120px] w-[760px] opacity-[0.08] invert" />
    <div class="container-x relative flex flex-wrap items-center gap-14">
      <div class="flex min-w-0 flex-[1_1_400px] flex-col gap-[22px]">
        <span class="text-sm font-extrabold uppercase tracking-[0.08em] text-yellow">{{ c.eyebrow }}</span>
        <h2 class="m-0 text-[36px] font-extrabold leading-[1.04] tracking-[-0.02em] md:text-[54px]">{{ c.h2 }}</h2>
        <p class="m-0 max-w-[500px] text-lg leading-[1.55] text-on-navy md:text-[19px]">{{ c.text }}</p>
        <NuxtLink
          :to="{ path: '/search', query: { kind: 'careers', tab: 'resources' } }"
          class="inline-flex items-center gap-2.5 self-start rounded-full bg-yellow px-[26px] py-[15px] text-[17px] font-extrabold text-navy hover:bg-white hover:text-navy"
        >
          {{ c.cta }}<AppIcon name="arrow" :size="20" :stroke="2.4" />
        </NuxtLink>
      </div>
      <div class="grid min-w-0 flex-[1.3_1_560px] grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] items-end gap-5">
        <RoleModelCard v-for="(p, i) in list" :key="p.id" :person="p" :class="i === 1 ? 'md:-translate-y-7 md:hover:-translate-y-8' : ''" />
      </div>
    </div>
  </section>
</template>
