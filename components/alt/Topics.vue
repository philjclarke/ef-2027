<script setup lang="ts">
// "Explore by topic": photo tiles that run a search.
const topics = [
  { name: 'Electricity', img: '/photos/topic-electricity.jpg' },
  { name: 'Space', img: '/photos/topic-space.jpg' },
  { name: 'Living things and habitats', label: 'Living things', img: '/photos/topic-living-things.jpg' },
  { name: 'Human body', img: '/photos/topic-human-body.jpg' },
  { name: 'Materials', img: '/photos/topic-materials.jpg' },
  { name: 'Rocks and fossils', img: '/photos/topic-rocks.jpg' },
]
const count = (t: string) => catalogue.filter((i) => i.topics.includes(t)).length
</script>

<template>
  <section class="pt-24" aria-labelledby="topics-h">
    <div class="container-x flex flex-col gap-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex max-w-[680px] flex-col gap-2.5">
          <span class="eyebrow">Explore by topic</span>
          <h2 id="topics-h" class="h2-section">What are you teaching next?</h2>
        </div>
        <NuxtLink to="/search" class="link-strong">Browse everything</NuxtLink>
      </div>
      <ul class="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 lg:gap-6">
        <li v-for="t in topics" :key="t.name">
          <NuxtLink
            :to="{ path: '/search', query: { q: t.name.toLowerCase() } }"
            class="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[24px] text-white hover:text-white md:rounded-[28px]"
          >
            <img :src="t.img" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span class="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,14,99,0)_40%,rgba(17,14,99,0.85)_100%)]" aria-hidden="true" />
            <span class="relative flex items-end justify-between gap-3 p-4 md:p-6">
              <span class="flex flex-col">
                <span class="font-heading text-xl font-extrabold leading-tight md:text-[26px]">{{ t.label ?? t.name }}</span>
                <span class="text-sm font-bold text-white/85">{{ count(t.name) }} resources</span>
              </span>
              <span class="hidden h-11 w-11 flex-none items-center justify-center rounded-full bg-white text-navy transition-transform group-hover:translate-x-0.5 md:flex">
                <AppIcon name="arrow" :stroke="2.4" />
              </span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
