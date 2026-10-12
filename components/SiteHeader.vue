<script setup lang="ts">
// Logo, main nav, search button and My resources (or the avatar menu when previewing as signed in).
// Nav collapses to a menu button below 1024px only.
const { open: searchOpen } = useSearchOverlay()
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
watch(() => route.fullPath, () => {
  menuOpen.value = false
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') menuOpen.value = false
}
onMounted(() => {
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="relative bg-white" :class="searchOpen ? 'z-50' : 'z-[2]'">
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
          :aria-label="searchOpen ? 'Close search' : 'Search'"
          :aria-expanded="searchOpen"
          aria-controls="header-search"
          class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 transition-colors"
          :class="searchOpen ? 'bg-navy text-white' : 'bg-lilac-100 text-navy hover:bg-line'"
          @click="searchOpen = !searchOpen"
        >
          <AppIcon :name="searchOpen ? 'close' : 'search'" :size="20" :stroke="searchOpen ? 2.4 : 2.2" />
        </button>

        <HeaderAccount />

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

    <HeaderSearch />
  </header>
</template>
