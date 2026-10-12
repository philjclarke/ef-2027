<script setup lang="ts">
// All / Collections / Resources tabs (role=tablist, arrow keys move between tabs).
import type { Tab } from '~/composables/useSearch'

const props = defineProps<{ modelValue: Tab; counts: Record<Tab, number>; panelId: string }>()
const emit = defineEmits<{ 'update:modelValue': [t: Tab] }>()
const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'collections', label: 'Collections' },
  { key: 'resources', label: 'Resources' },
]
const refs = ref<HTMLButtonElement[]>([])

function onKey(e: KeyboardEvent, i: number) {
  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!d) return
  e.preventDefault()
  const n = (i + d + tabs.length) % tabs.length
  emit('update:modelValue', tabs[n].key)
  nextTick(() => refs.value[n]?.focus())
}
</script>

<template>
  <div role="tablist" aria-label="Result type" class="-mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
    <button
      v-for="(t, i) in tabs"
      :id="`tab-${t.key}`"
      :key="t.key"
      ref="refs"
      type="button"
      role="tab"
      :aria-selected="props.modelValue === t.key"
      :aria-controls="panelId"
      :tabindex="props.modelValue === t.key ? 0 : -1"
      class="flex flex-none cursor-pointer items-center gap-2.5 rounded-t-[18px] border-0 px-5 py-4 text-[17px] text-navy md:px-6"
      :class="props.modelValue === t.key ? 'bg-white font-extrabold' : 'bg-transparent font-bold hover:bg-white/50'"
      @click="emit('update:modelValue', t.key)"
      @keydown="onKey($event, i)"
    >
      {{ t.label }}
      <span
        class="rounded-full px-2.5 py-0.5 text-[13px]"
        :class="props.modelValue === t.key ? 'bg-navy text-white' : 'bg-white/70'"
      >
        {{ counts[t.key] }}
      </span>
    </button>
  </div>
</template>
