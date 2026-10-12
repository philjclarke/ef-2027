<script setup lang="ts">
// Header for homepage options B and C: sticky, with a "fat" mega menu.
// Disclosure pattern: each panel follows its button in the DOM so Tab flows into it;
// hover opens after a short delay, click toggles, Esc closes and returns focus.
import type { Age, Item } from '~/utils/catalogue'

const { open: searchOpen } = useSearchOverlay()
const { prefs, nation } = usePersonalisation()
const route = useRoute()

type PanelId = 'primary' | 'secondary' | 'collections' | 'interactives' | 'careers'
const items: { id: PanelId | null; label: string; to?: string }[] = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'collections', label: 'Collections' },
  { id: 'interactives', label: 'Interactives' },
  { id: 'careers', label: 'Careers' },
  { id: null, label: 'Ultimate STEM Challenge', to: '#' },
  { id: null, label: 'CPD', to: '#' },
]

// ---------------------------------------------------------------- panel content
const topicCount = (topic: string, ages: Age[]) =>
  catalogue.filter((i) => i.topics.includes(topic) && i.ages.some((a) => ages.includes(a))).length
// Six most-populated topics for each level, so no menu link leads to an empty or near-empty search.
const topTopics = (ages: Age[]) =>
  config.topics
    .map((t) => ({ name: t.name, n: topicCount(t.name, ages) }))
    .filter((t) => t.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 6)
    .map((t) => t.name)

const levels = {
  primary: { name: 'primary', ages: ['4-7', '7-11'] as Age[], topics: [] as string[] },
  secondary: { name: 'secondary', ages: ['11-14', '14-16'] as Age[], topics: [] as string[] },
}
levels.primary.topics = topTopics(levels.primary.ages)
levels.secondary.topics = topTopics(levels.secondary.ages)
function suggested(level: 'primary' | 'secondary') {
  const ages = levels[level].ages
  const mine = prefs.value?.ages.filter((a) => ages.includes(a)) ?? []
  const list = recommendFor(
    { nation: nation.value, ages: mine.length ? mine : ages, regionId: prefs.value?.regionId ?? null },
    { limit: 3 },
  )
  const title = mine.length
    ? `Suggested for ${mine.map((a) => bandLabel(nation.value, a)).join(' and ')}`
    : `Popular in ${level}`
  return { title, list }
}
const suggestions = computed(() => ({ primary: suggested('primary'), secondary: suggested('secondary') }))

const featuredCollections = ['electricity-and-batteries', 'living-things-and-their-habitats', 'rocket-science-primary', 'knowledge-organisers']
  .map(getItem)
  .filter((i): i is Item => !!i)
const seasonal = [
  { label: 'Halloween science', id: 'halloween-resources' },
  { label: 'Bonfire Night', id: 'the-secret-science-of-bonfire-night' },
  { label: 'Black History Month', id: 'resources-celebrating-black-scientists' },
  { label: 'World Space Week', id: 'world-space-week-resources' },
].map((s) => ({ ...s, item: getItem(s.id) }))
const interactives = ['circuits-interactive-online-experiment', 'animal-explorer-interactive-7-11', 'periodic-table-challenge', 'rock-explorer-virtual-rock-kit']
  .map(getItem)
  .filter((i): i is Item => !!i)
const careerPeople = people

// ---------------------------------------------------------------- open/close
const active = ref<PanelId | null>(null)
const triggers = ref<Record<string, HTMLButtonElement | null>>({})
let timer: ReturnType<typeof setTimeout> | undefined
let hoverOpenedAt = 0

function openSoon(id: PanelId, e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  clearTimeout(timer)
  timer = setTimeout(
    () => {
      if (active.value !== id) hoverOpenedAt = Date.now()
      active.value = id
    },
    active.value ? 0 : 110,
  )
}
function closeSoon(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  clearTimeout(timer)
  timer = setTimeout(() => (active.value = null), 220)
}
const keep = () => clearTimeout(timer)
function toggle(id: PanelId) {
  clearTimeout(timer)
  // A click straight after hover-open shouldn't immediately close it again.
  if (active.value === id && Date.now() - hoverOpenedAt < 450) return
  active.value = active.value === id ? null : id
}
function close(focusTrigger = false) {
  const id = active.value
  active.value = null
  if (focusTrigger && id) nextTick(() => triggers.value[id]?.focus())
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && active.value) close(true)
}
watch(() => route.fullPath, () => {
  close()
  menuOpen.value = false
})
watch(active, (v) => v && (searchOpen.value = false))
watch(searchOpen, (v) => v && close())
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  clearTimeout(timer)
})

// Mobile menu (below 1024px): accordion of the same sections.
const menuOpen = ref(false)
const mobileSection = ref<PanelId | null>(null)
</script>

<template>
  <header class="sticky top-0 bg-white/95 backdrop-blur" :class="active || searchOpen || menuOpen ? 'z-50' : 'z-30'" @pointerleave="closeSoon">
    <div class="container-x flex items-center gap-x-5 py-3 xl:gap-x-8">
      <NuxtLink to="/" aria-label="Energising Futures home" class="block flex-none leading-none">
        <img src="/brand/ef-logo.svg" alt="" width="84" height="64" class="h-12 w-auto lg:h-16" />
      </NuxtLink>

      <nav aria-label="Main" class="hidden flex-1 lg:block">
        <ul class="m-0 flex list-none items-center gap-x-0.5 p-0 text-[15px] font-bold xl:gap-x-1 xl:text-base">
          <li v-for="n in items" :key="n.label">
            <button
              v-if="n.id"
              :ref="(el) => (triggers[n.id!] = el as HTMLButtonElement)"
              type="button"
              class="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border-0 px-2.5 py-2.5 font-body font-bold text-navy transition-colors xl:px-3.5"
              :class="active === n.id ? 'bg-navy text-white' : 'bg-transparent hover:bg-lilac-50'"
              :aria-expanded="active === n.id"
              :aria-controls="`mega-${n.id}`"
              @click="toggle(n.id)"
              @pointerenter="openSoon(n.id, $event)"
            >
              {{ n.label }}
              <AppIcon name="chevron" :size="14" :stroke="2.6" class="hidden transition-transform xl:block" :class="active === n.id ? 'rotate-180' : ''" />
            </button>
            <a v-else :href="n.to" class="block whitespace-nowrap rounded-full px-2.5 py-2.5 hover:bg-lilac-50 xl:px-3.5">{{ n.label }}</a>

            <!-- Panel -->
            <Transition name="mega">
              <div
                v-if="n.id && active === n.id"
                :id="`mega-${n.id}`"
                class="absolute inset-x-0 top-full border-t border-line bg-white shadow-[0_30px_60px_rgba(17,14,99,0.18)]"
                @pointerenter="keep"
              >
                <div class="container-x grid gap-10 py-8 text-base font-normal" :class="'grid-cols-[minmax(0,240px)_minmax(0,220px)_minmax(0,1fr)]'">
                  <!-- Primary / Secondary -->
                  <template v-if="n.id === 'primary' || n.id === 'secondary'">
                    <div class="flex flex-col gap-2">
                      <p class="eyebrow m-0 mb-1">By age</p>
                      <NuxtLink
                        v-for="a in levels[n.id].ages"
                        :key="a"
                        :to="{ path: '/search', query: { age: a } }"
                        class="flex items-center gap-3 rounded-2xl p-3 hover:bg-lilac-50"
                      >
                        <AgePill :age="a" size="md" />
                        <span class="text-[15px] font-bold">{{ bandLabel(nation, a) }}</span>
                      </NuxtLink>
                      <NuxtLink :to="{ path: '/search', query: { age: levels[n.id].ages.join(',') } }" class="mt-2 inline-flex items-center gap-2 px-3 font-extrabold hover:underline">
                        All {{ levels[n.id].name }}<AppIcon name="arrow" :size="16" :stroke="2.4" />
                      </NuxtLink>
                      <a
                        v-if="!prefs"
                        href="#personalise"
                        class="mt-4 block rounded-2xl bg-pop-sun-soft p-4 text-sm font-semibold leading-snug hover:text-navy"
                        @click="close()"
                      >
                        <strong class="mb-1 block font-extrabold">Teaching in Scotland, Wales or Northern Ireland?</strong>
                        Tell us your nation and classes and we’ll label everything to match.
                      </a>
                    </div>
                    <div class="flex flex-col gap-1">
                      <p class="eyebrow m-0 mb-2">Popular topics</p>
                      <NuxtLink
                        v-for="t in levels[n.id].topics"
                        :key="t"
                        :to="{ path: '/search', query: { q: t.toLowerCase(), age: levels[n.id].ages.join(',') } }"
                        class="flex items-baseline justify-between gap-3 rounded-xl px-3 py-2 font-bold hover:bg-lilac-50"
                      >
                        {{ t }}<span class="text-sm font-semibold text-muted">{{ topicCount(t, levels[n.id].ages) }}</span>
                      </NuxtLink>
                    </div>
                    <div class="flex min-w-0 flex-col gap-3">
                      <p class="eyebrow m-0 flex items-center gap-1.5">
                        <AltAiMark v-if="prefs" />{{ suggestions[n.id].title }}
                      </p>
                      <div class="grid grid-cols-3 gap-5">
                        <AltMiniCard v-for="i in suggestions[n.id].list" :key="i.id" :item="i" />
                      </div>
                    </div>
                  </template>

                  <!-- Collections -->
                  <template v-else-if="n.id === 'collections'">
                    <div class="flex flex-col gap-1">
                      <p class="eyebrow m-0 mb-2">Browse</p>
                      <NuxtLink to="/search?tab=collections" class="rounded-xl px-3 py-2 font-bold hover:bg-lilac-50">All collections</NuxtLink>
                      <NuxtLink to="/search?tab=collections&age=4-7,7-11" class="rounded-xl px-3 py-2 font-bold hover:bg-lilac-50">Primary collections</NuxtLink>
                      <NuxtLink to="/search?tab=collections&age=11-14,14-16" class="rounded-xl px-3 py-2 font-bold hover:bg-lilac-50">Secondary collections</NuxtLink>
                    </div>
                    <div class="flex flex-col gap-1">
                      <p class="eyebrow m-0 mb-2">This term</p>
                      <a
                        v-for="s in seasonal"
                        :key="s.id"
                        :href="s.item?.liveUrl ?? '#'"
                        target="_blank"
                        rel="noopener"
                        class="rounded-xl px-3 py-2 font-bold hover:bg-lilac-50"
                      >
                        {{ s.label }}<span class="sr-only"> (opens in a new tab)</span>
                      </a>
                    </div>
                    <div class="flex min-w-0 flex-col gap-3">
                      <p class="eyebrow m-0">Featured collections</p>
                      <div class="grid grid-cols-4 gap-5">
                        <AltMiniCard v-for="i in featuredCollections" :key="i.id" :item="i" />
                      </div>
                    </div>
                  </template>

                  <!-- Interactives -->
                  <template v-else-if="n.id === 'interactives'">
                    <div class="col-span-2 flex flex-col gap-4 rounded-3xl bg-pop-sun p-6">
                      <AppIcon name="launch" :size="28" :stroke="2.2" />
                      <p class="m-0 font-heading text-2xl font-extrabold leading-tight">Science games pupils actually want to play</p>
                      <p class="m-0 text-[15px] leading-normal">They launch in the browser, on the whiteboard or on pupils’ own devices. Nothing to download.</p>
                      <div class="mt-auto flex flex-wrap gap-2">
                        <NuxtLink to="/search?format=Interactive&tab=resources" class="btn-navy px-5 py-3 text-[15px]">All interactives<AppIcon name="arrow" :size="16" :stroke="2.4" /></NuxtLink>
                        <NuxtLink to="/search?format=Interactive&tab=resources&age=4-7,7-11" class="rounded-full bg-white px-4 py-3 text-[15px] font-extrabold">Primary</NuxtLink>
                        <NuxtLink to="/search?format=Interactive&tab=resources&age=11-14,14-16" class="rounded-full bg-white px-4 py-3 text-[15px] font-extrabold">Secondary</NuxtLink>
                      </div>
                    </div>
                    <div class="grid min-w-0 grid-cols-4 gap-5">
                      <AltMiniCard v-for="i in interactives" :key="i.id" :item="i" />
                    </div>
                  </template>

                  <!-- Careers -->
                  <template v-else-if="n.id === 'careers'">
                    <div class="flex flex-col gap-1">
                      <p class="eyebrow m-0 mb-2">Careers resources</p>
                      <NuxtLink to="/search?kind=careers&tab=resources" class="rounded-xl px-3 py-2 font-bold hover:bg-lilac-50">All careers resources</NuxtLink>
                      <NuxtLink to="/search?q=job%20card&kind=careers&tab=resources" class="rounded-xl px-3 py-2 font-bold hover:bg-lilac-50">Job cards</NuxtLink>
                      <NuxtLink to="/search?q=careers%20poster&tab=resources" class="rounded-xl px-3 py-2 font-bold hover:bg-lilac-50">Careers posters</NuxtLink>
                      <NuxtLink to="/search?q=meet%20a&kind=careers&tab=resources" class="rounded-xl px-3 py-2 font-bold hover:bg-lilac-50">Meet a… presentations</NuxtLink>
                    </div>
                    <div class="col-span-2 flex min-w-0 flex-col gap-3">
                      <p class="eyebrow m-0">Meet the people</p>
                      <div class="grid grid-cols-3 gap-5">
                        <a
                          v-for="p in careerPeople"
                          :key="p.id"
                          :href="getItem(p.itemId)?.liveUrl ?? '#'"
                          target="_blank"
                          rel="noopener"
                          class="group flex items-center gap-4 rounded-3xl p-4 hover:text-navy"
                          :class="{ 'bg-pop-sun-soft': p.cardColour === 'yellow', 'bg-pop-mint-soft': p.cardColour === 'green', 'bg-pop-lilac-soft': p.cardColour === 'white' }"
                        >
                          <img :src="p.image" alt="" width="72" height="72" class="h-[72px] w-[72px] flex-none rounded-full bg-white object-cover" />
                          <span class="flex flex-col">
                            <strong class="font-heading text-lg leading-tight group-hover:underline">{{ p.name }}</strong>
                            <span class="text-sm font-semibold">{{ p.role }}</span>
                            <span class="mt-1 text-xs font-extrabold text-muted">{{ p.badge }}</span>
                          </span>
                          <span class="sr-only">(opens in a new tab)</span>
                        </a>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </Transition>
          </li>
        </ul>
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
        <HeaderAccount compact />
        <button
          type="button"
          class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-lilac-100 text-navy lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mega-mobile"
          :aria-label="menuOpen ? 'Close menu' : 'Menu'"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <nav
      v-show="menuOpen"
      id="mega-mobile"
      aria-label="Main"
      class="absolute inset-x-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-white shadow-lift lg:hidden"
    >
      <ul class="container-x m-0 flex list-none flex-col py-2">
        <li v-for="n in items" :key="n.label" class="border-b border-line">
          <button
            v-if="n.id"
            type="button"
            class="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent py-4 font-body text-lg font-bold text-navy"
            :aria-expanded="mobileSection === n.id"
            :aria-controls="`mega-m-${n.id}`"
            @click="mobileSection = mobileSection === n.id ? null : n.id"
          >
            {{ n.label }}
            <AppIcon name="chevron" :size="18" :class="mobileSection === n.id ? 'rotate-180' : ''" />
          </button>
          <a v-else :href="n.to" class="block py-4 text-lg font-bold">{{ n.label }}</a>
          <div v-if="n.id && mobileSection === n.id" :id="`mega-m-${n.id}`" class="flex flex-col gap-1 pb-4">
            <template v-if="n.id === 'primary' || n.id === 'secondary'">
              <NuxtLink v-for="a in levels[n.id].ages" :key="a" :to="{ path: '/search', query: { age: a } }" class="flex items-center gap-3 py-2">
                <AgePill :age="a" /><span class="font-bold">{{ bandLabel(nation, a) }}</span>
              </NuxtLink>
              <NuxtLink
                v-for="t in levels[n.id].topics"
                :key="t"
                :to="{ path: '/search', query: { q: t.toLowerCase(), age: levels[n.id].ages.join(',') } }"
                class="py-2 font-semibold"
              >
                {{ t }}
              </NuxtLink>
            </template>
            <template v-else-if="n.id === 'collections'">
              <NuxtLink to="/search?tab=collections" class="py-2 font-semibold">All collections</NuxtLink>
              <a v-for="s in seasonal" :key="s.id" :href="s.item?.liveUrl ?? '#'" target="_blank" rel="noopener" class="py-2 font-semibold">{{ s.label }}</a>
            </template>
            <template v-else-if="n.id === 'interactives'">
              <NuxtLink to="/search?format=Interactive&tab=resources" class="py-2 font-semibold">All interactives</NuxtLink>
              <a v-for="i in interactives" :key="i.id" :href="i.liveUrl" target="_blank" rel="noopener" class="py-2 font-semibold">{{ i.title }}</a>
            </template>
            <template v-else-if="n.id === 'careers'">
              <NuxtLink to="/search?kind=careers&tab=resources" class="py-2 font-semibold">All careers resources</NuxtLink>
              <a v-for="p in careerPeople" :key="p.id" :href="getItem(p.itemId)?.liveUrl ?? '#'" target="_blank" rel="noopener" class="py-2 font-semibold">
                Meet {{ p.name }}, {{ p.role.toLowerCase() }}
              </a>
            </template>
          </div>
        </li>
      </ul>
    </nav>

    <HeaderSearch />

    <Teleport to="body">
      <Transition name="mega-fade">
        <div v-if="active" class="fixed inset-0 z-40 bg-navy/25" aria-hidden="true" @click="close()" />
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.mega-enter-active {
  transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.mega-leave-active {
  transition: opacity 0.12s ease;
}
.mega-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.mega-leave-to {
  opacity: 0;
}
.mega-fade-enter-active,
.mega-fade-leave-active {
  transition: opacity 0.2s ease;
}
.mega-fade-enter-from,
.mega-fade-leave-to {
  opacity: 0;
}
</style>
