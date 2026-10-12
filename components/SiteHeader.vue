<script setup lang="ts">
// Logo, main nav, search button and My resources (or the avatar menu when previewing as signed in).
// Nav collapses to a menu button below 1024px only.
const { signedIn, setSignedIn, saved } = usePreviewState()
const { show: showSearch } = useSearchOverlay()
const route = useRoute()

const nav = [
  { label: 'Primary', to: { path: '/search', query: { age: '4-7,7-11' } } },
  { label: 'Secondary', to: { path: '/search', query: { age: '11-14,14-16' } } },
  { label: 'Collections', to: { path: '/search', query: { tab: 'collections' } } },
  { label: 'Interactives', to: { path: '/search', query: { format: 'Interactive', tab: 'resources' } } },
  { label: 'Careers', to: { path: '/search', query: { kind: 'careers', tab: 'resources' } } },
  { label: 'Ultimate STEM Challenge', to: '#' },
  { label: 'CPD', to: '#' },
]

const menuOpen = ref(false)
const accountOpen = ref(false)
const accountRoot = ref<HTMLElement | null>(null)
watch(() => route.fullPath, () => {
  menuOpen.value = false
  accountOpen.value = false
})

function onDocClick(e: MouseEvent) {
  if (accountOpen.value && !accountRoot.value?.contains(e.target as Node)) accountOpen.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    accountOpen.value = false
    menuOpen.value = false
  }
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
  <header class="relative z-[2] bg-white">
    <div class="container-x flex items-center gap-x-6 gap-y-2 py-3 lg:flex-wrap lg:py-3.5 xl:gap-x-10">
      <NuxtLink to="/" aria-label="Energising Futures home" class="block flex-none leading-none">
        <img src="/brand/ef-logo.svg" alt="" width="95" height="72" class="h-14 w-auto lg:h-[72px]" />
      </NuxtLink>

      <nav aria-label="Main" class="hidden flex-[1_1_480px] flex-wrap items-center gap-x-5 gap-y-1 text-[15px] font-bold lg:flex xl:gap-x-[30px] xl:text-base">
        <NuxtLink v-for="n in nav" :key="n.label" :to="n.to" class="py-2.5 hover:underline hover:decoration-2 hover:underline-offset-8">
          {{ n.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Search"
          class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-lilac-100 text-navy hover:bg-line"
          @click="showSearch"
        >
          <AppIcon name="search" :size="20" />
        </button>

        <div v-if="signedIn" ref="accountRoot" class="relative">
          <button
            type="button"
            aria-label="Account menu for Sam"
            :aria-expanded="accountOpen"
            aria-controls="account-menu"
            class="flex h-12 cursor-pointer items-center gap-2.5 rounded-full border-0 bg-navy pl-1.5 pr-4 text-[15px] font-bold text-white"
            @click="accountOpen = !accountOpen"
          >
            <span aria-hidden="true" class="flex h-9 w-9 items-center justify-center rounded-full bg-yellow font-extrabold text-navy">S</span>
            <span class="hidden sm:inline">Sam</span>
            <AppIcon name="chevron" :size="14" :stroke="2.6" />
          </button>
          <div
            v-show="accountOpen"
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
          class="flex h-12 items-center gap-2 rounded-full bg-navy pl-4 pr-5 text-[15px] font-bold text-white hover:bg-navy-700 hover:text-white"
        >
          <AppIcon name="bookmark" /><span class="hidden sm:inline">My resources</span><span class="sr-only sm:hidden">My resources</span>
        </a>

        <button
          type="button"
          class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-lilac-100 text-navy lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="menuOpen ? 'Close menu' : 'Menu'"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <nav v-show="menuOpen" id="mobile-nav" aria-label="Main" class="border-t border-line bg-white lg:hidden">
      <ul class="container-x m-0 flex list-none flex-col py-2 text-lg font-bold">
        <li v-for="n in nav" :key="n.label">
          <NuxtLink :to="n.to" class="block border-b border-line py-3.5" @click="menuOpen = false">{{ n.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
