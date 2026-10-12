<script setup lang="ts">
// Homepage option B: contemporary, image-led. Mega menu, richer palette, no doodles.
definePageMeta({ layout: 'alt' })
useHead({ title: 'Option B · Image-led', titleTemplate: 'Energising Futures · %s' })
</script>

<template>
  <div class="pb-24">
    <HomeBHero />
    <HomeBPersonalise />
    <HomeBForYou />
    <HomeBAges />
    <HomeBThisTerm />
    <AltTopics />
    <HomeBCareers />
    <HomeBInteractives />
    <div class="pt-24"><HomeCollections /></div>
  </div>
</template>
