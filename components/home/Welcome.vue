<script setup lang="ts">
// Signed-in replacement for the hero, plus "Pick up where you left off" and "New for your classes".
import { demoTeacher } from '~/composables/usePreviewState'

const { saved, savedLabel } = usePreviewState()
const teacher = demoTeacher
const savedItems = computed(() => saved.value.map((s) => getItem(s.id)).filter((i) => !!i).slice(0, 4))
const newItems = teacher.newForYou
  .map(getItem)
  .filter((i) => !!i && i.ages.some((a) => teacher.ages.includes(a)))
const agesText = teacher.ages.map(ageLabel).join(' and ')
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-sky">
      <img src="/brand/assorted-icons-1.svg" alt="" aria-hidden="true" class="doodle -right-[60px] -top-10 w-[820px] opacity-[0.22]" />
      <div class="container-x relative flex flex-wrap items-end justify-between gap-8 pb-[60px] pt-10 md:pt-[52px]">
        <div class="flex min-w-0 flex-[1_1_560px] flex-col gap-5">
          <h1 class="m-0 text-[40px] font-extrabold leading-[1.02] tracking-[-0.02em] md:text-[56px]">Welcome back, {{ teacher.name }}</h1>
          <div class="flex flex-wrap items-center gap-2 text-base font-bold">
            <span>Showing you resources for</span>
            <AgePill v-for="a in teacher.ages" :key="a" :age="a" size="md" />
            <a href="#" class="px-1 py-1.5 font-extrabold underline decoration-2 underline-offset-4">Change<span class="sr-only"> age groups</span></a>
          </div>
          <div class="max-w-[640px]">
            <SearchField id="welcome-search" size="hero" typeahead placeholder="What are you teaching next?" />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="#" class="flex min-w-[150px] flex-col gap-0.5 rounded-[22px] bg-white px-[22px] py-[18px]">
            <strong class="font-heading text-[32px] leading-none">{{ saved.length }}</strong>
            <span class="text-[15px] font-bold">Saved resources</span>
          </a>
          <a href="#" class="flex min-w-[150px] flex-col gap-0.5 rounded-[22px] bg-navy px-[22px] py-[18px] text-white hover:text-white">
            <strong class="font-heading text-[32px] leading-none">{{ teacher.studentResources }}</strong>
            <span class="text-[15px] font-bold">Student resources</span>
          </a>
        </div>
      </div>
    </section>

    <section class="pb-16 pt-10">
      <div class="container-x flex flex-col gap-7">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="flex flex-col gap-1.5">
            <h2 class="m-0 text-[32px] font-extrabold leading-[1.1] tracking-[-0.015em] md:text-[40px]">Pick up where you left off</h2>
            <p class="m-0 text-[17px] text-muted">Your saved resources and collections.</p>
          </div>
          <a href="#" class="link-strong">Go to My resources</a>
        </div>
        <div v-if="savedItems.length" class="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-6">
          <ResourceCard v-for="i in savedItems" :key="i.id" :item="i" :action="false" :saved-label="savedLabel(i.id)" />
        </div>
        <p v-else class="m-0 rounded-3xl bg-lilac-50 p-8 text-[17px] text-muted">
          Nothing saved yet. Use the bookmark on any resource to keep it here.
        </p>
      </div>
    </section>

    <section class="bg-lilac-50 pb-20 pt-16">
      <div class="container-x flex flex-col gap-7">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="flex flex-col gap-1.5">
            <h2 class="m-0 text-[32px] font-extrabold leading-[1.1] tracking-[-0.015em] md:text-[40px]">New for your classes</h2>
            <p class="m-0 text-[17px] text-muted">Added since your last visit, for ages {{ agesText }}.</p>
          </div>
          <NuxtLink :to="{ path: '/search', query: { sort: 'newest', age: teacher.ages.join(',') } }" class="link-strong">See everything new</NuxtLink>
        </div>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-6">
          <ResourceCard v-for="i in newItems" :key="i!.id" :item="i!" :bordered="false" :action="false" is-new />
        </div>
      </div>
    </section>
  </div>
</template>
