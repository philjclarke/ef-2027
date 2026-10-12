<script setup lang="ts">
// Large pill search field + navy Search button. With `typeahead`, it becomes a WAI-ARIA
// combobox (role=combobox, listbox with options, arrows / Enter / Esc) showing TypeaheadPanel.
import type { Age } from '~/utils/catalogue'
import type { TypeaheadOption } from './TypeaheadPanel.vue'

const props = withDefaults(
  defineProps<{
    id: string
    size?: 'hero' | 'results'
    modelValue?: string
    placeholder?: string
    typeahead?: boolean
    autofocus?: boolean
    /** Dim the page behind the open type-ahead (off inside the header overlay, which has its own). */
    scrim?: boolean
  }>(),
  { size: 'hero', modelValue: '', placeholder: '', typeahead: false, autofocus: false, scrim: true },
)
const emit = defineEmits<{ submitted: []; close: [] }>()

const router = useRouter()
const root = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const text = ref(props.modelValue)
watch(
  () => props.modelValue,
  (v) => (text.value = v),
)

// ------------------------------------------------------------ type-ahead
type Scope = 'all' | 'primary' | 'secondary'
const scope = ref<Scope>('all')
const scopeAges = computed<Age[]>(() =>
  scope.value === 'primary' ? ['4-7', '7-11'] : scope.value === 'secondary' ? ['11-14', '14-16'] : [],
)
const { data } = useTypeahead(text, scopeAges)
const focused = ref(false)
const dismissed = ref(false)
const open = computed(() => props.typeahead && focused.value && !dismissed.value && !!data.value && text.value.trim().length >= 2)
watch(text, () => (dismissed.value = false))

const listId = computed(() => `${props.id}-listbox`)
const options = computed<TypeaheadOption[]>(() => {
  const d = data.value
  if (!d) return []
  const out: TypeaheadOption[] = []
  const add = (o: Omit<TypeaheadOption, 'id'>) => out.push({ ...o, id: `${props.id}-opt-${out.length}` })
  d.suggestions.forEach((s) => add({ type: 'suggestion', suggestion: s }))
  d.topics.forEach((t) => add({ type: 'topic', topic: t }))
  d.people.forEach((p) => add({ type: 'person', person: p }))
  d.top.forEach((i) => add({ type: 'item', item: i }))
  add({ type: 'all' })
  return out
})
// The first suggestion is highlighted by default (Enter picks it).
const active = ref(0)
watch(options, (o) => (active.value = o[0]?.type === 'suggestion' ? 0 : -1))
const activeId = computed(() => (open.value && active.value >= 0 ? options.value[active.value]?.id : undefined))

function go(q: string) {
  const query: Record<string, string> = { q }
  if (scopeAges.value.length) query.age = scopeAges.value.join(',')
  dismissed.value = true
  input.value?.blur()
  emit('submitted')
  router.push({ path: '/search', query })
}

function pick(o: TypeaheadOption) {
  switch (o.type) {
    case 'suggestion':
      return go(o.suggestion!.text)
    case 'topic':
      return go(o.topic!.toLowerCase())
    case 'all':
      return go(data.value?.seeAllQuery ?? text.value)
    case 'person': {
      const item = getItem(o.person!.itemId)
      if (item) window.open(item.liveUrl, '_blank', 'noopener')
      return
    }
    case 'item':
      window.open(o.item!.liveUrl, '_blank', 'noopener')
  }
}

function onSubmit() {
  if (open.value && active.value >= 0 && options.value[active.value]) return pick(options.value[active.value])
  const q = text.value.trim()
  dismissed.value = true
  emit('submitted')
  router.push({ path: '/search', query: q ? { q } : {} })
}

function onKeydown(e: KeyboardEvent) {
  if (!props.typeahead) return
  const n = options.value.length
  if (e.key === 'ArrowDown' && open.value) {
    e.preventDefault()
    active.value = (active.value + 1) % n
  } else if (e.key === 'ArrowUp' && open.value) {
    e.preventDefault()
    active.value = active.value <= 0 ? n - 1 : active.value - 1
  } else if (e.key === 'Escape') {
    if (open.value) {
      e.preventDefault()
      dismissed.value = true
    } else emit('close')
  }
}

function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (!next || !root.value?.contains(next)) focused.value = false
}

function clear() {
  text.value = ''
  input.value?.focus()
}

// Make room for the panel: scroll the field near the top of the viewport when it opens.
watch(open, (v) => {
  if (!v || !root.value) return
  nextTick(() => {
    const top = root.value!.getBoundingClientRect().top
    if (top > window.innerHeight * 0.35) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollBy({ top: top - 24, behavior: smooth ? 'smooth' : 'auto' })
    }
  })
})

onMounted(() => {
  if (props.autofocus) input.value?.focus()
})

const big = computed(() => props.size === 'hero')
const announce = computed(() => {
  if (!open.value || !data.value) return ''
  const n = data.value.suggestions.length + data.value.top.length
  return `${n} suggestions available. Use up and down arrows to review.`
})
</script>

<template>
  <div ref="root" class="relative" :class="open ? 'z-50' : ''" @focusin="focused = true" @focusout="onFocusOut">
    <form role="search" class="relative" @submit.prevent="onSubmit">
      <label :for="id" class="sr-only">Search resources</label>
      <div
        class="relative flex items-center gap-2 bg-white py-2 pl-5 pr-2 md:pl-[26px]"
        :class="[
          open ? 'rounded-t-[32px] border-b border-line' : 'rounded-full',
          big ? 'shadow-search' : 'shadow-search-sm',
        ]"
      >
        <AppIcon name="search" :size="24" />
        <input
          :id="id"
          ref="input"
          v-model="text"
          type="search"
          :placeholder="placeholder"
          autocomplete="off"
          enterkeyhint="search"
          class="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-navy placeholder:text-muted focus:outline-none md:py-3.5"
          :class="big ? 'text-base font-medium md:text-lg' : 'text-lg font-bold md:text-xl'"
          v-bind="
            typeahead
              ? {
                  role: 'combobox',
                  'aria-expanded': open ? 'true' : 'false',
                  'aria-controls': listId,
                  'aria-autocomplete': 'list',
                  'aria-activedescendant': activeId,
                }
              : {}
          "
          @keydown="onKeydown"
        />
        <button
          v-if="typeahead && text"
          type="button"
          aria-label="Clear search"
          class="flex h-11 w-11 flex-none items-center justify-center rounded-full border-0 bg-lilac-50 text-navy"
          @mousedown.prevent
          @click="clear"
        >
          <AppIcon name="close" :size="16" :stroke="2.4" />
        </button>
        <button
          type="submit"
          class="btn-navy flex-none cursor-pointer border-0 px-5 py-3.5 text-base md:px-[30px] md:py-4 md:text-[17px]"
        >
          Search
        </button>
      </div>

      <TypeaheadPanel
        v-if="typeahead"
        v-show="open"
        :id="listId"
        :data="data"
        :options="options"
        :active-id="activeId"
        :scope="scope"
        :wide="big"
        @pick="pick"
        @hover="(i) => (active = i)"
        @update:scope="(s) => (scope = s)"
      />
    </form>
    <p class="sr-only" aria-live="polite">{{ announce }}</p>
    <Teleport to="body">
      <div v-if="open && scrim" class="fixed inset-0 z-40 bg-navy/30" aria-hidden="true" @click="dismissed = true" />
    </Teleport>
  </div>
</template>
