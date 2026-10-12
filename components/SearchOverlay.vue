<script setup lang="ts">
// Search opened from the header button: a modal with the type-ahead field.
const { open, hide } = useSearchOverlay()
const route = useRoute()
watch(() => route.fullPath, hide)

let lastFocus: HTMLElement | null = null
watch(open, (v) => {
  if (v) lastFocus = document.activeElement as HTMLElement
  else nextTick(() => lastFocus?.focus())
  document.documentElement.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Search">
      <div class="fixed inset-0 bg-navy/40" aria-hidden="true" @click="hide" />
      <div class="relative min-h-full bg-sky px-4 pb-10 pt-6 md:px-8 md:pb-16 md:pt-10">
        <img src="/brand/assorted-icons-1.svg" alt="" aria-hidden="true" class="doodle -right-16 top-0 w-[700px] opacity-20" />
        <div class="relative mx-auto flex max-w-[820px] flex-col gap-5">
          <div class="flex items-center justify-between">
            <p class="m-0 font-heading text-2xl font-extrabold md:text-[32px]">What are you teaching?</p>
            <button
              type="button"
              aria-label="Close search"
              class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-navy"
              @click="hide"
            >
              <AppIcon name="close" :size="20" :stroke="2.4" />
            </button>
          </div>
          <SearchField
            id="overlay-search"
            size="results"
            typeahead
            autofocus
            :scrim="false"
            placeholder="Try ‘electricity’, ‘year 5 circuits’ or ‘habitats’"
            @submitted="hide"
            @close="hide"
          />
          <div class="h-[min(60vh,560px)]" aria-hidden="true" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
