<script setup lang="ts">
import homepage from '~/data/homepage.json'

const links = homepage.footer.links
// Two columns, filled down then across as in the design.
const half = Math.ceil(links.length / 2)
const ordered = links.slice(0, half).flatMap((l, i) => [l, links[half + i]].filter(Boolean))
</script>

<template>
  <footer class="bg-lilac-50">
    <div class="container-x flex flex-col gap-10 py-10">
      <div class="flex flex-wrap justify-between gap-10">
        <div class="flex max-w-[400px] flex-col gap-[18px]">
          <img src="/brand/ef-logo.svg" alt="Energising Futures" width="84" height="64" class="h-16 w-auto self-start" />
          <p class="m-0 text-[15px] leading-[1.55] text-muted">{{ homepage.footer.about }}</p>
        </div>
        <nav aria-label="Footer" class="grid grid-cols-[repeat(2,minmax(130px,auto))] gap-x-8 gap-y-3 text-[15px] font-bold sm:gap-x-14">
          <a v-for="l in ordered" :key="l" href="#" class="py-1 hover:underline">{{ l }}</a>
        </nav>
      </div>

      <p class="m-0 border-t border-line-strong pt-6 text-sm text-muted">{{ homepage.footer.copyright }}</p>
    </div>
  </footer>
</template>
