<script setup lang="ts">
useHead({ title: 'Free STEM resources for ages 4–16', titleTemplate: 'Energising Futures · %s' })
const { signedIn } = usePreviewState()
</script>

<template>
  <div>
    <HomeWelcome v-if="signedIn" />
    <HomeHero v-else />
    <HomePartners />
    <HomeAudience />
    <HomeThisTerm />
    <HomeNewThisMonth />
    <HomeInteractives />
    <HomeCareers />
    <HomeCollections />
  </div>
</template>
