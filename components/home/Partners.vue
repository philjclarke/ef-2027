<script setup lang="ts">
import homepage from '~/data/homepage.json'

// Text for now; swap in partner logos when we have them.
const p = homepage.partners
</script>

<template>
  <section class="pb-2 pt-6" aria-label="Partners">
    <div class="container-x flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-center text-base font-bold">
      <span class="font-semibold text-muted">{{ p.label }}</span>
      <template v-for="(name, i) in p.items" :key="name">
        <span v-if="i > 0" aria-hidden="true" class="hidden h-1.5 w-1.5 rounded-full bg-on-navy-label md:block" />
        <span>{{ name }}</span>
      </template>
    </div>
  </section>
</template>
