<script setup lang="ts">
// "My resources" button, or the avatar menu when previewing as signed-in Sam.
// compact: icon-only "My resources" below 1280px, for the busier mega-menu header.
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const { signedIn, setSignedIn, saved } = usePreviewState()
const route = useRoute()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
watch(() => route.fullPath, () => (open.value = false))

function onDocClick(e: MouseEvent) {
  if (open.value && !root.value?.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div v-if="signedIn" ref="root" class="relative">
    <button
      type="button"
      aria-label="Account menu for Sam"
      :aria-expanded="open"
      aria-controls="account-menu"
      class="flex h-12 cursor-pointer items-center gap-2.5 rounded-full border-0 bg-navy pl-1.5 pr-4 text-[15px] font-bold text-white"
      @click="open = !open"
    >
      <span aria-hidden="true" class="flex h-9 w-9 items-center justify-center rounded-full bg-yellow font-extrabold text-navy">S</span>
      <span class="hidden sm:inline">Sam</span>
      <AppIcon name="chevron" :size="14" :stroke="2.6" />
    </button>
    <div
      v-show="open"
      id="account-menu"
      class="absolute right-0 top-[calc(100%+8px)] z-30 flex w-60 flex-col rounded-2xl bg-white p-2 text-[15px] font-bold shadow-lift"
    >
      <a href="#" class="rounded-xl px-3 py-3 hover:bg-lilac-50">My resources ({{ saved.length }})</a>
      <a href="#" class="rounded-xl px-3 py-3 hover:bg-lilac-50">Account settings</a>
      <button type="button" class="cursor-pointer rounded-xl border-0 bg-transparent px-3 py-3 text-left font-bold text-navy hover:bg-lilac-50" @click="setSignedIn(false)">
        Sign out (end preview)
      </button>
    </div>
  </div>
  <a
    v-else
    href="#"
    class="flex h-12 flex-none items-center gap-2 whitespace-nowrap rounded-full bg-navy text-[15px] font-bold text-white hover:bg-navy-700 hover:text-white"
    :class="compact ? 'w-12 justify-center xl:w-auto xl:justify-start xl:pl-4 xl:pr-5' : 'pl-4 pr-5'"
  >
    <AppIcon name="bookmark" /><span class="hidden" :class="compact ? 'xl:inline' : 'sm:inline'">My resources</span><span class="sr-only" :class="compact ? 'xl:hidden' : 'sm:hidden'">My resources</span>
  </a>
</template>
