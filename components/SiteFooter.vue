<script setup lang="ts">
import homepage from '~/data/homepage.json'

const { signedIn, setSignedIn } = usePreviewState()
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

      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-line-strong pt-6">
        <p class="m-0 text-sm text-muted">{{ homepage.footer.copyright }}</p>
        <div class="flex items-center gap-3 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-sm font-bold">
          <span id="preview-label">Preview as signed-in teacher</span>
          <button
            type="button"
            role="switch"
            :aria-checked="signedIn"
            aria-labelledby="preview-label"
            class="relative h-8 w-14 cursor-pointer rounded-full border-0 transition-colors"
            :class="signedIn ? 'bg-navy' : 'bg-line-strong'"
            @click="setSignedIn(!signedIn)"
          >
            <span
              aria-hidden="true"
              class="absolute top-1 h-6 w-6 rounded-full bg-white transition-[left]"
              :class="signedIn ? 'left-7 bg-yellow' : 'left-1'"
            />
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
