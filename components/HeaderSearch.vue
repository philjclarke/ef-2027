<script setup lang="ts">
// Search opened from the header button: a panel that drops down from under the header.
// The header stays put and the page is dimmed rather than covered, so you keep your place.
import homepage from '~/data/homepage.json'

const { open, hide } = useSearchOverlay()
const route = useRoute()
watch(() => route.fullPath, hide)

const popular = homepage.hero.popular

// Return focus to the header search button when the panel closes.
watch(open, (v) => {
  if (!v) nextTick(() => document.querySelector<HTMLElement>('[aria-controls="header-search"]')?.focus())
})

function onKey(e: KeyboardEvent) {
  // The field handles Esc first (closing suggestions) and marks it handled.
  if (open.value && e.key === 'Escape' && !e.defaultPrevented) hide()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <Transition name="drop">
      <div
        v-if="open"
        id="header-search"
        class="absolute inset-x-0 top-full border-t border-line bg-sky-50 shadow-[0_24px_48px_rgba(17,14,99,0.18)]"
      >
        <!-- Clipped separately so the suggestions can still hang below the band -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <img src="/brand/assorted-icons-1.svg" alt="" class="doodle -top-[120px] right-0 w-[560px] opacity-[0.14]" />
        </div>
        <div class="container-x relative flex flex-col gap-3.5 pb-6 pt-5 md:pb-7 md:pt-6">
          <div class="max-w-[820px]">
            <SearchField
              id="header-search-input"
              size="results"
              typeahead
              autofocus
              :scrim="false"
              placeholder="What are you teaching? Try ‘electricity’ or ‘year 5 circuits’"
              @submitted="hide"
              @close="hide"
            />
          </div>
          <div class="flex flex-wrap items-center gap-2 text-[15px]">
            <span class="mr-1 font-bold">Popular:</span>
            <NuxtLink
              v-for="p in popular"
              :key="p"
              :to="{ path: '/search', query: { q: p.toLowerCase() } }"
              class="rounded-full bg-white/70 px-[15px] py-[7px] font-bold hover:bg-white"
            >
              {{ p }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="open" class="fixed inset-0 z-40 bg-navy/25" aria-hidden="true" @click="hide" />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
