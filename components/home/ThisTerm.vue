<script setup lang="ts">
import homepage from '~/data/homepage.json'

const t = homepage.thisTerm
const feature = getItem(t.feature.id)!
const items = t.items.map(getItem).filter((i) => !!i)
const calendar = getItem(t.link.id)
</script>

<template>
  <section class="pb-[72px] pt-14">
    <div class="container-x flex flex-col gap-8">
      <HomeSectionHead
        :eyebrow="t.eyebrow"
        :title="t.h2"
        :link="calendar ? { text: t.link.text, to: calendar.liveUrl, external: true } : undefined"
      />
      <div class="flex flex-wrap gap-7">
        <FeatureCollection
          class="flex-[2_1_560px]"
          variant="feature"
          :item="feature"
          :badge="t.feature.badge"
          :title="t.feature.title"
          :text="t.feature.text"
          :image="t.feature.image"
          :cta="t.feature.cta"
        />
        <ResourceCard
          v-for="i in items"
          :key="i.id"
          :item="i"
          size="md"
          description
          :action="false"
          class="min-w-0 flex-[1_1_280px]"
        />
      </div>
    </div>
  </section>
</template>
