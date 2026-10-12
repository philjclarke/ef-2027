<script setup lang="ts">
// Dropdown for SearchField: scope toggle, suggestions, topics, people, top matches, "See all".
// Options are not focusable; the input keeps focus and points at the active one with
// aria-activedescendant. mousedown.prevent stops clicks from blurring the input.
import type { Item, Person } from '~/utils/catalogue'
import type { Suggestion, Typeahead } from '~/utils/search'

export interface TypeaheadOption {
  id: string
  type: 'suggestion' | 'topic' | 'person' | 'item' | 'all'
  suggestion?: Suggestion
  topic?: string
  person?: Person
  item?: Item
}

type Scope = 'all' | 'primary' | 'secondary'

const props = defineProps<{
  id: string
  data: Typeahead | null
  options: TypeaheadOption[]
  activeId?: string
  scope: Scope
  wide?: boolean
}>()
const emit = defineEmits<{ pick: [o: TypeaheadOption]; hover: [i: number]; 'update:scope': [s: Scope] }>()

const of = (type: TypeaheadOption['type']) => props.options.filter((o) => o.type === type)
const indexOf = (o: TypeaheadOption) => props.options.indexOf(o)
const allOpt = computed(() => props.options.find((o) => o.type === 'all'))
const personBg = (p: Person) => ({ yellow: '#FFCF2C', green: '#5FBE98', white: '#F3F3F9' })[p.cardColour]
const scopes: { key: Scope; label: string; bg: string }[] = [
  { key: 'all', label: 'All ages', bg: '' },
  { key: 'primary', label: 'Primary 4–11', bg: '#D7EBEB' },
  { key: 'secondary', label: 'Secondary 11–16', bg: '#D6E6F5' },
]
const itemMeta = (i: Item) =>
  i.kind === 'collection'
    ? i.level.length === 1
      ? i.level[0]
      : collectionCountLabel(i)
    : badgeFor(i)
        .split(' · ')
        .map((s) => (s === 'POWERPOINT' ? 'PowerPoint' : s === 'PDF' ? 'PDF' : s.charAt(0) + s.slice(1).toLowerCase()))
        .join(' · ')
</script>

<template>
  <div
    class="absolute left-0 top-full flex max-h-[min(72vh,640px)] w-full flex-col overflow-y-auto rounded-b-[32px] bg-white shadow-[0_30px_70px_rgba(17,14,99,0.4)]"
    :class="wide ? 'lg:w-[max(100%,min(820px,calc(100vw-64px)))] lg:rounded-tr-[32px]' : ''"
  >
    <div class="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3.5 text-sm font-bold md:px-[26px]">
      <span class="mr-1 text-muted">Search in</span>
      <button
        v-for="s in scopes"
        :key="s.key"
        type="button"
        class="min-h-[40px] cursor-pointer rounded-full border-0 px-4 py-2 text-sm font-extrabold"
        :class="scope === s.key ? 'bg-navy text-white' : 'text-navy'"
        :style="scope === s.key ? {} : { background: s.bg || '#F1F1F8' }"
        :aria-pressed="scope === s.key"
        @mousedown.prevent
        @click="emit('update:scope', s.key)"
      >
        {{ s.label }}
      </button>
    </div>

    <div :id="id" role="listbox" aria-label="Search suggestions">
      <div class="flex flex-wrap">
        <!-- Left column -->
        <div
          class="flex min-w-0 flex-[1_1_240px] flex-col gap-0.5 border-line bg-[#FBFBFE] px-5 pb-6 pt-5 md:border-r md:px-[26px]"
        >
          <div v-if="of('suggestion').length" role="group" :aria-labelledby="`${id}-sugg`" class="flex flex-col gap-0.5">
            <span :id="`${id}-sugg`" class="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-muted">Suggestions</span>
            <div
              v-for="o in of('suggestion')"
              :id="o.id"
              :key="o.id"
              role="option"
              :aria-selected="activeId === o.id"
              class="-mx-3 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-[11px] text-[17px]"
              :class="activeId === o.id ? 'bg-lilac-150' : 'hover:bg-lilac-50'"
              @mousedown.prevent
              @mousemove="emit('hover', indexOf(o))"
              @click="emit('pick', o)"
            >
              <AppIcon name="search" :size="16" />
              <span>{{ o.suggestion!.typed }}<strong>{{ o.suggestion!.completion }}</strong></span>
            </div>
          </div>

          <div v-if="of('topic').length" role="group" :aria-labelledby="`${id}-topics`">
            <span :id="`${id}-topics`" class="mb-2.5 mt-5 block text-xs font-extrabold uppercase tracking-[0.08em] text-muted">Topics</span>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="o in of('topic')"
                :id="o.id"
                :key="o.id"
                role="option"
                :aria-selected="activeId === o.id"
                class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-navy px-[13px] py-[7px] text-sm font-extrabold"
                :class="activeId === o.id ? 'bg-lilac-150' : 'hover:bg-lilac-50'"
                @mousedown.prevent
                @mousemove="emit('hover', indexOf(o))"
                @click="emit('pick', o)"
              >
                <span aria-hidden="true" class="text-muted">#</span>{{ o.topic }}
              </div>
            </div>
          </div>

          <div v-if="of('person').length" role="group" :aria-labelledby="`${id}-people`" class="flex flex-col">
            <span :id="`${id}-people`" class="mb-2.5 mt-5 text-xs font-extrabold uppercase tracking-[0.08em] text-muted">Meet the people</span>
            <div
              v-for="o in of('person')"
              :id="o.id"
              :key="o.id"
              role="option"
              :aria-selected="activeId === o.id"
              class="-mx-3 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2"
              :class="activeId === o.id ? 'bg-lilac-150' : 'hover:bg-lilac-50'"
              @mousedown.prevent
              @mousemove="emit('hover', indexOf(o))"
              @click="emit('pick', o)"
            >
              <img
                :src="o.person!.image"
                alt=""
                width="44"
                height="44"
                class="block h-11 w-11 rounded-full object-cover"
                :style="{ background: personBg(o.person!) }"
              />
              <span class="flex flex-col">
                <strong class="text-[15px]">{{ o.person!.name }}</strong>
                <span class="text-sm text-muted">{{ o.person!.role }}</span>
              </span>
            </div>
          </div>

          <p v-if="!options.some((o) => ['suggestion', 'topic', 'person'].includes(o.type))" class="m-0 text-[15px] text-muted">
            No suggestions. Try one key word, like a topic name.
          </p>
        </div>

        <!-- Right column -->
        <div role="group" :aria-labelledby="`${id}-top`" class="flex min-w-0 flex-[1.7_1_380px] flex-col gap-1 px-5 pb-6 pt-5 md:px-[26px]">
          <span :id="`${id}-top`" class="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-muted">Top matches</span>
          <div
            v-for="o in of('item')"
            :id="o.id"
            :key="o.id"
            role="option"
            :aria-selected="activeId === o.id"
            class="-mx-3 flex cursor-pointer items-center gap-4 rounded-2xl px-3 py-2.5"
            :class="activeId === o.id ? 'bg-lilac-150' : 'hover:bg-lilac-50'"
            @mousedown.prevent
            @mousemove="emit('hover', indexOf(o))"
            @click="emit('pick', o)"
          >
            <span class="relative h-16 w-[104px] flex-none">
              <span
                v-if="o.item!.kind === 'collection'"
                aria-hidden="true"
                class="absolute inset-x-1.5 -top-[5px] h-5 rounded-lg"
                :style="{ background: stackTint(o.item!).back }"
              />
              <img :src="o.item!.img" alt="" class="relative block h-16 w-[104px] rounded-[10px] object-cover" />
            </span>
            <span class="flex min-w-0 flex-1 flex-col gap-1">
              <span class="text-[17px] font-extrabold leading-tight">{{ o.item!.title }}</span>
              <span class="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
                <span class="font-extrabold text-navy">{{ o.item!.kind === 'collection' ? 'Collection' : 'Resource' }}</span>
                · {{ itemMeta(o.item!) }}
                <AgePill v-for="a in o.item!.ages" :key="a" :age="a" size="xs" />
              </span>
            </span>
          </div>
          <p v-if="!of('item').length" class="m-0 text-[15px] text-muted">No matches yet. Keep typing, or press Enter to search.</p>
        </div>
      </div>

      <div
        v-if="allOpt && data"
        :id="allOpt.id"
        role="option"
        :aria-selected="activeId === allOpt.id"
        class="flex cursor-pointer items-center justify-between gap-4 border-t border-line px-5 py-[18px] text-base font-extrabold md:px-[26px]"
        :class="activeId === allOpt.id ? 'bg-lilac-150' : 'bg-lilac-50'"
        @mousedown.prevent
        @mousemove="emit('hover', indexOf(allOpt))"
        @click="emit('pick', allOpt)"
      >
        <span>See all {{ data.seeAllCount }} results for “{{ data.seeAllQuery }}”</span>
        <span class="hidden items-center gap-2 text-[13px] font-bold text-muted sm:flex" aria-hidden="true">
          Press
          <kbd class="rounded-md border-[1.5px] border-[#B9B8D6] bg-white px-[7px] py-0.5 font-body text-xs font-extrabold text-navy">Enter</kbd>
        </span>
      </div>
    </div>
  </div>
</template>
