<script setup lang="ts">
// Prototype-only strip above the header: homepage option switcher and the signed-in preview.
// Deliberately styled apart from the site (yellow, "Prototype" label) so it isn't mistaken for the design.
const { signedIn, setSignedIn } = usePreviewState()
const route = useRoute()
const options = [
  { key: 'A', to: '/', name: 'Current' },
  { key: 'B', to: '/home-b', name: 'Image-led' },
  { key: 'C', to: '/home-c', name: 'Personalised' },
]
</script>

<template>
  <div class="bg-yellow text-navy">
    <div class="container-x flex min-h-[48px] flex-nowrap items-center justify-between gap-x-3 py-1.5 text-sm font-bold">
      <div class="flex items-center gap-3">
        <span class="hidden rounded-full bg-navy px-2.5 py-0.5 text-xs font-extrabold tracking-[0.06em] text-white sm:inline">PROTOTYPE</span>
        <nav aria-label="Homepage options" class="flex items-center gap-1">
          <span class="mr-1 hidden md:inline">Homepage</span>
          <NuxtLink
            v-for="o in options"
            :key="o.key"
            :to="o.to"
            :aria-current="route.path === o.to ? 'page' : undefined"
            class="flex h-9 items-center gap-1.5 rounded-full px-3 font-extrabold"
            :class="route.path === o.to ? 'bg-navy text-white hover:text-white' : 'hover:bg-white/60'"
          >
            {{ o.key }}<span class="hidden lg:inline font-bold">· {{ o.name }}</span>
            <span class="sr-only lg:hidden">: {{ o.name }}</span>
          </NuxtLink>
        </nav>
      </div>
      <div class="flex items-center gap-3">
        <span id="preview-label" class="whitespace-nowrap"><span class="sm:hidden">Signed in</span><span class="hidden sm:inline">Preview as signed-in teacher</span></span>
        <button
          type="button"
          role="switch"
          :aria-checked="signedIn"
          aria-labelledby="preview-label"
          class="relative h-8 w-14 flex-none cursor-pointer rounded-full border-2 border-navy transition-colors"
          :class="signedIn ? 'bg-navy' : 'bg-white'"
          @click="setSignedIn(!signedIn)"
        >
          <span
            aria-hidden="true"
            class="absolute top-[2px] h-6 w-6 rounded-full transition-[left]"
            :class="signedIn ? 'left-[26px] bg-yellow' : 'left-[2px] bg-navy'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
