<script setup lang="ts">
// /search?q=&age=&format=&tab=&kind=&sort= . All state lives in the URL so views can be
// shared and the back button works. Rendered client-side (see routeRules).
import type { Age, Format } from '~/utils/catalogue'
import type { KindChip, SearchState, Tab } from '~/composables/useSearch'
import type { SortKey } from '~/utils/search'

const route = useRoute()
const router = useRouter()

const list = (v: unknown) => (typeof v === 'string' && v ? v.split(',') : [])
const pickOne = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback

const state = computed<SearchState>(() => ({
  q: typeof route.query.q === 'string' ? route.query.q : '',
  ages: list(route.query.age).filter((a): a is Age => (AGES as string[]).includes(a)),
  formats: list(route.query.format).filter((f): f is Format => (FORMATS as string[]).includes(f)),
  tab: pickOne<Tab>(route.query.tab, ['all', 'collections', 'resources'], 'all'),
  kind: pickOne<KindChip>(route.query.kind, ['all', 'careers', 'teaching'], 'all'),
  sort: pickOne<SortKey>(route.query.sort, ['best', 'newest', 'az'], 'best'),
}))

function update(patch: Partial<SearchState>, replace = false) {
  const s = { ...state.value, ...patch }
  const query: Record<string, string> = {}
  if (s.q) query.q = s.q
  if (s.ages.length) query.age = AGES.filter((a) => s.ages.includes(a)).join(',')
  if (s.formats.length) query.format = FORMATS.filter((f) => s.formats.includes(f)).join(',')
  if (s.tab !== 'all') query.tab = s.tab
  if (s.kind !== 'all') query.kind = s.kind
  if (s.sort !== 'best') query.sort = s.sort
  router[replace ? 'replace' : 'push']({ path: '/search', query })
}
const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

// "year 5 circuits" → q=circuits & age=7-11, with a note saying why.
const autoNote = useState<{ q: string; text: string } | null>('search-auto-note', () => null)
watch(
  () => state.value.q,
  (q) => {
    const p = parseQuery(q)
    if (!p.extracted.length) {
      if (autoNote.value && autoNote.value.q !== q) autoNote.value = null
      return
    }
    const bits = p.extracted.map((e) => {
      const what = e.type === 'age' ? `ages ${ageLabel(e.value)}` : e.type === 'format' ? e.value : 'careers and role models'
      return `${what} for “${e.phrase}”`
    })
    autoNote.value = { q: p.text, text: `We’ve applied ${bits.join(' and ')}.` }
    update(
      {
        q: p.text,
        ages: [...new Set([...state.value.ages, ...p.ages])],
        formats: [...new Set([...state.value.formats, ...p.formats])],
        kind: p.kind ?? state.value.kind,
        tab: p.kind || p.formats.length ? 'resources' : state.value.tab,
      },
      true,
    )
  },
  { immediate: true },
)

const s = useSearch(state)
const { result, filtered, collections, resources, kindResources, kindCount, best, counts, topics, isExact, related } = s

const ready = ref(false)
onMounted(() => requestAnimationFrame(() => (ready.value = true)))

const total = computed(() => filtered.value.length)
const tabCounts = computed(() => ({ all: total.value, collections: collections.value.length, resources: resources.value.length }))
const shownCollections = computed(() =>
  state.value.tab === 'all' && best.value ? collections.value.filter((c) => c.id !== best.value!.id) : collections.value,
)
const shownResources = computed(() => (state.value.tab === 'all' ? kindResources.value.slice(0, 8) : kindResources.value))
const showCollections = computed(() => state.value.tab !== 'resources' && shownCollections.value.length > 0)
const showResources = computed(() => state.value.tab !== 'collections' && resources.value.length > 0)
const collectionLabel = computed(() =>
  state.value.tab === 'all' && best.value ? `${collections.value.length}, including best match` : `${collections.value.length}`,
)

const applied = computed(() => [
  ...state.value.ages.map((a) => ({ label: `Ages ${ageLabel(a)}`, remove: () => update({ ages: toggle(state.value.ages, a) }) })),
  ...state.value.formats.map((f) => ({ label: f, remove: () => update({ formats: toggle(state.value.formats, f) }) })),
])
const filterCount = computed(() => applied.value.length)
const clearAll = () => update({ ages: [], formats: [] })

const heading = computed(() => {
  const n = total.value
  if (state.value.q) return `${n} result${n === 1 ? '' : 's'} for “${state.value.q}”`
  return `${n} resource${n === 1 ? '' : 's'} and collections`
})

useHead(() => ({ title: state.value.q ? `Search: ${state.value.q}` : 'Browse resources' }))

// Mobile filter sheet
const sheetOpen = ref(false)
const sheetEl = ref<HTMLElement | null>(null)
const filterBtn = ref<HTMLButtonElement | null>(null)
watch(sheetOpen, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
  nextTick(() => (v ? sheetEl.value?.focus() : filterBtn.value?.focus()))
})
onBeforeUnmount(() => (document.documentElement.style.overflow = ''))

const filterHandlers = {
  onToggleAge: (a: Age) => update({ ages: toggle(state.value.ages, a) }),
  onToggleFormat: (f: Format) => update({ formats: toggle(state.value.formats, f) }),
  onClear: clearAll,
}
</script>

<template>
  <div>
    <!-- Header band -->
    <section class="relative overflow-hidden bg-sky-50">
      <img src="/brand/assorted-icons-1.svg" alt="" aria-hidden="true" class="doodle -right-10 -top-[60px] w-[640px] opacity-[0.18]" />
      <div class="container-x relative flex flex-col gap-6 pt-8 md:pt-10" :class="isExact ? '' : 'pb-12'">
        <div class="max-w-[760px]">
          <SearchField id="rs-search" size="results" :model-value="state.q" placeholder="Search resources" />
        </div>

        <template v-if="!ready">
          <div class="skeleton h-12 w-2/3 max-w-[560px] rounded-xl" aria-hidden="true" />
          <div class="h-[60px]" />
        </template>

        <template v-else-if="isExact">
          <div class="flex flex-wrap items-baseline justify-between gap-3">
            <h1 class="m-0 text-[32px] font-extrabold leading-[1.1] tracking-[-0.015em] md:text-[44px]">{{ heading }}</h1>
            <p v-if="topics.length" class="m-0 flex flex-wrap items-center gap-2 text-[15px] font-bold">
              Topics:
              <TopicTag v-for="t in topics" :key="t" :topic="t" />
            </p>
          </div>
          <p v-if="autoNote && autoNote.q === state.q" class="-mt-2 mb-0 text-base font-semibold">{{ autoNote.text }}</p>
          <SearchResultTabs
            :model-value="state.tab"
            :counts="tabCounts"
            panel-id="results-panel"
            @update:model-value="(t) => update({ tab: t })"
          />
        </template>

        <div v-else class="flex max-w-[820px] flex-col gap-2.5">
          <h1 class="m-0 text-[32px] font-extrabold leading-[1.1] tracking-[-0.015em] md:text-[44px]">
            No exact matches for “{{ state.q }}”
          </h1>
          <p v-if="result.correctedTerm && filtered.length" class="m-0 text-lg leading-normal md:text-[19px]">
            We looked for close matches instead. Showing results for <strong>{{ result.correctedTerm }}</strong>.
          </p>
          <p v-else class="m-0 text-lg leading-normal md:text-[19px]">
            We couldn’t find anything close. Try one key word, or explore below.
          </p>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="!ready" class="container-x grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-[22px] pb-24 pt-10">
      <SearchSkeletonCard v-for="n in 8" :key="n" />
      <span class="sr-only" role="status">Loading results</span>
    </div>

    <!-- No exact match -->
    <SearchNoMatch
      v-else-if="!isExact"
      :items="filtered.map((r) => r.item)"
      :mode="result.mode"
      :term="result.correctedTerm"
      :related="related"
    />

    <!-- Results -->
    <div v-else class="container-x flex flex-wrap items-start gap-12 pb-24 pt-8 lg:pt-10">
      <aside
        aria-labelledby="filter-h"
        class="hidden max-w-[290px] flex-[1_1_250px] rounded-3xl bg-lilac-25 p-[26px] lg:block"
      >
        <SearchFilterPanel
          heading-id="filter-h"
          :ages="state.ages"
          :formats="state.formats"
          :counts="counts"
          v-on="filterHandlers"
        />
      </aside>

      <div
        id="results-panel"
        role="tabpanel"
        :aria-labelledby="`tab-${state.tab}`"
        class="flex min-w-0 flex-[999_1_600px] flex-col gap-[52px]"
      >
        <div class="-mb-7 flex flex-wrap items-center gap-2" :class="filterCount ? '' : 'lg:hidden'">
          <button
            ref="filterBtn"
            type="button"
            class="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-navy bg-white px-4 py-2 text-[15px] font-extrabold text-navy lg:hidden"
            aria-haspopup="dialog"
            @click="sheetOpen = true"
          >
            <AppIcon name="filter" />Filters<template v-if="filterCount"> ({{ filterCount }})</template>
          </button>
          <span v-if="filterCount" class="ml-1 mr-1 text-[15px] font-bold">Showing:</span>
          <SearchAppliedFilterChip v-for="a in applied" :key="a.label" :label="a.label" @remove="a.remove" />
        </div>

        <FeatureCollection v-if="state.tab === 'all' && best" :item="best" variant="best" :topics="best.topics.slice(0, 2)" />

        <section v-if="showCollections" class="flex flex-col gap-[26px]" aria-labelledby="collections-h">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div class="flex flex-col gap-1">
              <h2 id="collections-h" class="m-0 text-[28px] font-extrabold leading-[1.2]">
                Collections <span class="font-body text-lg font-bold text-muted">({{ collectionLabel }})</span>
              </h2>
              <p class="m-0 text-base text-muted">Themed sets of resources, ready to teach.</p>
            </div>
            <SearchSortSelect v-if="state.tab === 'collections'" id="sort-c" :model-value="state.sort" @update:model-value="(v) => update({ sort: v })" />
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-x-[22px] gap-y-9 pt-3">
            <CollectionCard v-for="c in shownCollections" :key="c.id" :item="c" />
          </div>
        </section>

        <section v-if="showResources" class="flex flex-col gap-[22px]" aria-labelledby="resources-h">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div class="flex flex-col gap-1">
              <h2 id="resources-h" class="m-0 text-[28px] font-extrabold leading-[1.2]">
                Resources <span class="font-body text-lg font-bold text-muted">({{ resources.length }})</span>
              </h2>
              <p class="m-0 text-base text-muted">Single files to download or open in class.</p>
            </div>
            <SearchSortSelect id="sort-r" :model-value="state.sort" @update:model-value="(v) => update({ sort: v })" />
          </div>
          <SearchKindChips :model-value="state.kind" :count="kindCount" @update:model-value="(k) => update({ kind: k })" />
          <div class="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-[22px]">
            <ResourceCard v-for="r in shownResources" :key="r.id" :item="r" />
          </div>
          <button
            v-if="state.tab === 'all' && kindResources.length > 8"
            type="button"
            class="cursor-pointer self-center rounded-full border-2 border-navy bg-white px-7 py-3.5 font-body text-base font-extrabold text-navy hover:bg-lilac-50"
            @click="update({ tab: 'resources' })"
          >
            Show all {{ kindResources.length }} resources
          </button>
        </section>

        <div v-if="!total" class="flex flex-col items-start gap-4 rounded-3xl bg-lilac-50 p-8">
          <h2 class="m-0 text-2xl font-extrabold">Nothing matches these filters</h2>
          <button type="button" class="btn-navy cursor-pointer border-0 px-6 py-3.5 font-body text-base" @click="clearAll">Clear filters</button>
        </div>
      </div>
    </div>

    <!-- Mobile filter sheet -->
    <Teleport to="body">
      <div v-if="sheetOpen" class="fixed inset-0 z-50 lg:hidden" @keydown.esc="sheetOpen = false">
        <div class="absolute inset-0 bg-navy/50" aria-hidden="true" @click="sheetOpen = false" />
        <div
          ref="sheetEl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-filter-h"
          tabindex="-1"
          class="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-white focus:outline-none"
        >
          <div class="flex-1 overflow-y-auto p-6 pb-4">
            <SearchFilterPanel
              heading-id="sheet-filter-h"
              :ages="state.ages"
              :formats="state.formats"
              :counts="counts"
              v-on="filterHandlers"
            />
          </div>
          <div class="flex gap-3 border-t border-line p-4">
            <button
              type="button"
              aria-label="Close filters"
              class="flex h-[52px] w-[52px] flex-none cursor-pointer items-center justify-center rounded-full border-[1.5px] border-line-strong bg-white text-navy"
              @click="sheetOpen = false"
            >
              <AppIcon name="close" :size="18" :stroke="2.4" />
            </button>
            <button type="button" class="btn-navy flex-1 cursor-pointer justify-center border-0 py-3.5 font-body text-base" @click="sheetOpen = false">
              Show {{ total }} results
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
