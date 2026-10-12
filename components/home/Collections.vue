<script setup lang="ts">
import homepage from '~/data/homepage.json'

const c = homepage.collections
const items = c.items.map(getItem).filter((i) => !!i)
</script>

<template>
  <section class="pb-20 pt-20 md:pb-[88px] md:pt-24">
    <div class="container-x flex flex-col gap-10">
      <HomeSectionHead
        :eyebrow="c.eyebrow"
        :title="c.h2"
        :intro="c.intro"
        :link="{ text: 'Browse all collections', to: '/search?tab=collections' }"
      />
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-x-7 gap-y-10 pt-4">
        <CollectionCard v-for="i in items" :key="i.id" :item="i" size="lg" description />
      </div>
    </div>
  </section>
</template>
