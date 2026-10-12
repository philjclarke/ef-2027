<script setup lang="ts">
import homepage from '~/data/homepage.json'

const n = homepage.newThisMonth
const items = n.items.map(getItem).filter((i) => !!i)
</script>

<template>
  <section class="bg-lilac-50 py-14 md:py-[72px]">
    <div class="container-x flex flex-col gap-8">
      <HomeSectionHead :title="n.h2" :link="{ text: 'See everything new', to: '/search?sort=newest' }" />
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-6">
        <ResourceCard v-for="i in items" :key="i.id" :item="i" size="md" :bordered="false" :action="false" />
      </div>
    </div>
  </section>
</template>
