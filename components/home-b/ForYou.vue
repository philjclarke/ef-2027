<script setup lang="ts">
// Appears once the teacher has personalised: picks for their classes, with local notes.
const { prefs, region, nation } = usePersonalisation()
const picks = computed(() => (prefs.value ? recommendFor(prefs.value, { limit: 4 }) : []))
function note(i: (typeof picks.value)[number]) {
  if (region.value) {
    const l = localiseFor(i, region.value)
    if (l.specific) return { text: l.line, ai: true }
  }
  return { text: curriculumFor(i, nation.value, prefs.value?.ages) ?? '', ai: false }
}
</script>

<template>
  <section v-if="prefs" class="pb-4 pt-16" aria-labelledby="for-you-h">
    <div class="container-x flex flex-col gap-7">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col gap-2">
          <span class="eyebrow flex items-center gap-1.5"><AltAiMark />Picked for your classes</span>
          <h2 id="for-you-h" class="h2-section">For {{ prefsSummary(prefs) }}</h2>
        </div>
        <NuxtLink :to="{ path: '/search', query: { age: prefs.ages.join(',') || undefined, sort: 'newest' } }" class="link-strong">See all for your classes</NuxtLink>
      </div>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-6">
        <AltMiniCard v-for="i in picks" :key="i.id" :item="i" :note="note(i).text" :ai="note(i).ai" />
      </div>
    </div>
  </section>
</template>
