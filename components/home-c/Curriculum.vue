<script setup lang="ts">
// Resources for each of the teacher's classes, labelled with their nation's curriculum.
import type { Age } from '~/utils/catalogue'

const { prefs, nation } = usePersonalisation()
const bands = computed<Age[]>(() => (prefs.value?.ages.length ? prefs.value.ages : AGES))
const tab = ref<Age>(bands.value[0])
watch(bands, (b) => !b.includes(tab.value) && (tab.value = b[0]))
const items = computed(() =>
  recommendFor({ nation: nation.value, ages: [tab.value], regionId: prefs.value?.regionId ?? null }, { limit: 8 }),
)
const tabRefs = ref<HTMLButtonElement[]>([])
function onKey(e: KeyboardEvent, i: number) {
  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!d) return
  e.preventDefault()
  const n = (i + d + bands.value.length) % bands.value.length
  tab.value = bands.value[n]
  nextTick(() => tabRefs.value[n]?.focus())
}
</script>

<template>
  <section class="pt-20" aria-labelledby="curr-h">
    <div class="container-x flex flex-col gap-7">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex max-w-[720px] flex-col gap-2.5">
          <span class="eyebrow">{{ nations[nation].curriculum }}</span>
          <h2 id="curr-h" class="h2-section">Mapped to what you teach</h2>
          <p class="m-0 text-lg leading-normal text-muted">Every resource is labelled with where it fits in your curriculum.</p>
        </div>
        <NuxtLink :to="{ path: '/search', query: { age: tab } }" class="link-strong">See everything for {{ bandLabel(nation, tab) }}</NuxtLink>
      </div>

      <div role="tablist" aria-label="Your classes" class="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        <button
          v-for="(a, i) in bands"
          :id="`curr-tab-${a}`"
          :key="a"
          ref="tabRefs"
          type="button"
          role="tab"
          :aria-selected="tab === a"
          aria-controls="curr-panel"
          :tabindex="tab === a ? 0 : -1"
          class="flex flex-none cursor-pointer items-center gap-2.5 rounded-full border-[1.5px] py-1.5 pl-1.5 pr-5 font-body text-base font-extrabold"
          :class="tab === a ? 'border-navy bg-navy text-white' : 'border-line-strong bg-white text-navy hover:border-navy'"
          @click="tab = a"
          @keydown="onKey($event, i)"
        >
          <AgePill :age="a" size="md" />{{ bandLabel(nation, a) }}
          <span class="text-sm font-semibold opacity-80">{{ bandStage(nation, a) }}</span>
        </button>
      </div>

      <div id="curr-panel" role="tabpanel" :aria-labelledby="`curr-tab-${tab}`" class="grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-6">
        <ResourceCard
          v-for="i in items"
          :key="i.id"
          :item="i"
          :action="false"
          :hint="curriculumFor(i, nation, [tab]) ?? undefined"
        />
      </div>
    </div>
  </section>
</template>
