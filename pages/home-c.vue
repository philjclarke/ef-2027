<script setup lang="ts">
// Homepage option C: personalisation-first. Set nation, classes and area; the page rebuilds around them.
definePageMeta({ layout: 'alt' })
useHead({ title: 'Option C · Personalised', titleTemplate: 'Energising Futures · %s' })
</script>

<template>
  <div class="pb-24">
    <HomeCStudio />
    <div id="your-page" class="scroll-mt-24">
      <HomeCSaved />
      <HomeCCurriculum />
      <HomeCLocalBand />
    </div>
    <HomeCAiDemo />
    <AltTopics />
    <div class="pt-24"><HomeNewThisMonth /></div>
  </div>
</template>
