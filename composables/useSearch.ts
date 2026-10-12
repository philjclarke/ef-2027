// Reactive wrapper around the search engine in utils/search.ts.
// Everything the UI needs goes through here, so the engine can later be swapped
// for a server endpoint or Algolia without touching components.
import type { Age, Format, Item, ResourceKind } from '~/utils/catalogue'
import type { Filters, SortKey } from '~/utils/search'

export type Tab = 'all' | 'collections' | 'resources'
export type KindChip = 'all' | ResourceKind

export interface SearchState {
  q: string
  ages: Age[]
  formats: Format[]
  tab: Tab
  kind: KindChip
  sort: SortKey
}

export function useSearch(state: Ref<SearchState>) {
  const result = computed(() => search(state.value.q))
  const filters = computed<Filters>(() => ({ ages: state.value.ages, formats: state.value.formats }))
  const filtered = computed(() => applyFilters(result.value.results, filters.value))
  const sorted = computed(() => sortResults(filtered.value, state.value.sort))

  const collections = computed(() => sorted.value.filter((r) => r.item.kind === 'collection').map((r) => r.item))
  const resources = computed(() => sorted.value.filter((r) => r.item.kind === 'resource').map((r) => r.item))
  const kindCount = (k: KindChip) => resources.value.filter((i) => k === 'all' || i.resourceKind === k).length
  const kindResources = computed(() =>
    resources.value.filter((i) => state.value.kind === 'all' || i.resourceKind === state.value.kind),
  )

  const best = computed<Item | null>(() =>
    state.value.sort === 'best' ? bestMatch(filtered.value, result.value.mode)?.item ?? null : null,
  )
  const counts = computed(() => facetCounts(result.value.results, filters.value))
  const topics = computed(() =>
    result.value.mode === 'browse' ? [] : queryTopics(result.value.parsed, result.value.results),
  )
  /** Exact results, or a fallback ("no exact matches… showing results for X"). */
  const isExact = computed(() => result.value.mode === 'exact' || result.value.mode === 'browse')
  const related = computed(() =>
    relatedCollections(
      [...topics.value, ...result.value.results.slice(0, 5).flatMap((r) => r.item.topics)],
      result.value.results.map((r) => r.item.id),
      [...new Set(result.value.results.slice(0, 5).flatMap((r) => r.item.ages))],
    ),
  )

  return { result, filtered, collections, resources, kindResources, kindCount, best, counts, topics, isExact, related }
}

/** Debounced type-ahead (opens after 2 characters, 120ms debounce). */
export function useTypeahead(text: Ref<string>, scope: Ref<Age[]>) {
  const debounced = ref('')
  let t: ReturnType<typeof setTimeout> | undefined
  watch(
    text,
    (v) => {
      clearTimeout(t)
      t = setTimeout(() => (debounced.value = v), 120)
    },
    { immediate: true },
  )
  onBeforeUnmount(() => clearTimeout(t))
  const enabled = computed(() => debounced.value.trim().length >= 2)
  const data = computed(() => (enabled.value ? typeahead(debounced.value, scope.value) : null))
  return { data, enabled }
}
