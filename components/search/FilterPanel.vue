<script setup lang="ts">
import type { Age, Format } from '~/utils/catalogue'

const props = defineProps<{
  ages: Age[]
  formats: Format[]
  counts: { ages: Record<Age, number>; formats: Record<Format, number> }
  headingId?: string
}>()
const emit = defineEmits<{ toggleAge: [a: Age]; toggleFormat: [f: Format]; clear: [] }>()
const hasFilters = computed(() => props.ages.length + props.formats.length > 0)
</script>

<template>
  <div class="flex flex-col gap-[26px]">
    <div class="flex min-h-[44px] items-center justify-between">
      <h2 :id="headingId" class="m-0 text-xl font-extrabold">Filter</h2>
      <!-- Clearing never closes anything -->
      <button
        v-if="hasFilters"
        type="button"
        class="cursor-pointer border-0 bg-transparent py-2.5 text-[15px] font-bold text-navy underline"
        @click="emit('clear')"
      >
        Clear all
      </button>
    </div>
    <p class="-mt-3 mb-0 text-sm leading-[1.45] text-muted">
      Numbers show how many results each choice gives, so you never filter down to nothing.
    </p>

    <fieldset class="m-0 flex flex-col gap-1 border-0 p-0">
      <legend class="mb-2 p-0 text-base font-extrabold">Age</legend>
      <SearchFilterOption
        v-for="a in AGES"
        :key="a"
        :checked="ages.includes(a)"
        :count="counts.ages[a]"
        @toggle="emit('toggleAge', a)"
      >
        <AgePill :age="a" class="text-sm" />
        <span class="whitespace-nowrap text-sm text-muted">{{ ageInfo[a].hint }}</span>
      </SearchFilterOption>
    </fieldset>

    <fieldset class="m-0 flex flex-col gap-1 border-0 p-0">
      <legend class="mb-2 p-0 text-base font-extrabold">Resource format</legend>
      <SearchFilterOption
        v-for="f in FORMATS"
        :key="f"
        :checked="formats.includes(f)"
        :count="counts.formats[f]"
        @toggle="emit('toggleFormat', f)"
      >
        <span>{{ f }}</span>
      </SearchFilterOption>
    </fieldset>
  </div>
</template>
