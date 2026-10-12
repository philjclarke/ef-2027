<script setup lang="ts">
// Nation, classes and school postcode. Used as a compact bar on option B and a larger
// "studio" card on option C (which also plays a short "tailoring" sequence on submit).
import type { Age } from '~/utils/catalogue'
import type { NationId } from '~/utils/personalise'

const props = withDefaults(defineProps<{ variant?: 'bar' | 'studio'; idPrefix: string }>(), { variant: 'bar' })
const emit = defineEmits<{ done: [] }>()

const { prefs, set } = usePersonalisation()
const nation = ref<NationId>(prefs.value?.nation ?? 'england')
const ages = ref<Age[]>([...(prefs.value?.ages ?? [])])
const postcode = ref(prefs.value?.postcode ?? '')
watch(prefs, (p) => {
  if (!p) return
  nation.value = p.nation
  ages.value = [...p.ages]
  postcode.value = p.postcode ?? ''
})

const region = computed(() => (postcode.value.trim() ? regionFromPostcode(postcode.value) : null))
// A recognised postcode sets the nation (still changeable).
watch(region, (r) => r && (nation.value = r.nation))

const demoPostcodes = [
  { label: 'Hull', pc: 'HU1 1AA' },
  { label: 'Glasgow', pc: 'G1 1AA' },
  { label: 'Belfast', pc: 'BT1 1AA' },
  { label: 'Cardiff', pc: 'CF10 1AA' },
]

const toggleAge = (a: Age) => (ages.value = ages.value.includes(a) ? ages.value.filter((x) => x !== a) : [...ages.value, a])

// Studio variant: a short, scripted "tailoring" sequence so the AI step feels real.
const tailoring = ref(false)
const step = ref(0)
const steps = computed(() => [
  `Matching to the ${nations[nation.value].curriculum}`,
  region.value ? `Finding examples from ${region.value.name}` : 'Choosing examples from across the UK',
  `Picking resources for ${ages.value.length ? AGES.filter((a) => ages.value.includes(a)).map((a) => bandLabel(nation.value, a)).join(' and ') : 'all ages'}`,
])

async function submit() {
  const p = { nation: nation.value, ages: AGES.filter((a) => ages.value.includes(a)), regionId: region.value?.id ?? null, postcode: postcode.value.trim() }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (props.variant === 'studio' && !reduced) {
    tailoring.value = true
    for (step.value = 0; step.value < steps.value.length; step.value++) await new Promise((r) => setTimeout(r, 520))
    await new Promise((r) => setTimeout(r, 250))
    tailoring.value = false
  }
  set(p)
  emit('done')
}
</script>

<template>
  <form
    class="relative"
    :class="variant === 'studio' ? 'flex flex-col gap-6' : 'flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-start lg:gap-x-8 lg:gap-y-5'"
    :aria-busy="tailoring"
    @submit.prevent="submit"
  >
    <fieldset class="m-0 min-w-0 border-0 p-0" :class="variant === 'bar' ? 'lg:flex-none' : ''">
      <legend class="mb-2 p-0 text-sm font-extrabold">Where do you teach?</legend>
      <div class="flex flex-wrap gap-1.5">
        <label
          v-for="id in NATION_IDS"
          :key="id"
          class="relative flex min-h-[44px] cursor-pointer items-center rounded-full border-[1.5px] px-4 text-[15px] font-bold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-yellow"
          :class="nation === id ? 'border-navy bg-navy text-white' : 'border-line-strong bg-white hover:border-navy'"
        >
          <input v-model="nation" type="radio" :name="`${idPrefix}-nation`" :value="id" class="sr-only" />
          {{ nations[id].name }}
        </label>
      </div>
    </fieldset>

    <fieldset class="m-0 min-w-0 border-0 p-0" :class="variant === 'bar' ? 'lg:flex-none' : ''">
      <legend class="mb-2 p-0 text-sm font-extrabold">Which classes?</legend>
      <div class="flex flex-wrap gap-1.5">
        <label
          v-for="a in AGES"
          :key="a"
          class="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border-[1.5px] py-1 pl-1.5 pr-4 text-[15px] font-bold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-yellow"
          :class="ages.includes(a) ? 'border-navy bg-lilac-50' : 'border-line-strong bg-white hover:border-navy'"
        >
          <input type="checkbox" :checked="ages.includes(a)" class="sr-only" @change="toggleAge(a)" />
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full"
            :style="{ background: ageInfo[a].colour }"
            aria-hidden="true"
          >
            <AppIcon v-if="ages.includes(a)" name="check" :size="15" :stroke="3" />
          </span>
          {{ bandLabel(nation, a) }}
        </label>
      </div>
    </fieldset>

    <div class="flex min-w-0 flex-col gap-2" :class="variant === 'bar' ? 'lg:w-[240px] lg:flex-none' : ''">
      <label :for="`${idPrefix}-postcode`" class="text-sm font-extrabold">
        School postcode <span class="font-semibold text-muted">(for local examples)</span>
      </label>
      <input
        :id="`${idPrefix}-postcode`"
        v-model="postcode"
        type="text"
        autocomplete="postal-code"
        placeholder="e.g. HU1 2AA"
        class="min-h-[48px] rounded-full border-[1.5px] border-line-strong bg-white px-5 font-body text-base font-bold text-navy placeholder:font-medium placeholder:text-muted focus:border-navy"
        :aria-describedby="`${idPrefix}-postcode-note`"
      />
    </div>

    <button
      type="submit"
      class="btn-navy min-h-[52px] flex-none cursor-pointer justify-center border-0 px-7 font-body text-base"
      :class="variant === 'studio' ? 'self-start' : 'self-start lg:mt-7'"
    >
      <AltAiMark />{{ variant === 'studio' ? 'Personalise my homepage' : 'Personalise' }}
    </button>

    <p
      :id="`${idPrefix}-postcode-note`"
      class="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
      :class="variant === 'bar' ? 'lg:basis-full' : ''"
      aria-live="polite"
    >
      <template v-if="region">
        <AppIcon name="check" :size="16" :stroke="3" class="text-[#1F8A5E]" />
        <span class="font-bold">Local examples from {{ region.place }}</span>
      </template>
      <template v-else-if="postcode.trim()">
        <span class="font-semibold text-muted">We don’t have local examples for that area yet. You’ll see examples from across the UK.</span>
      </template>
      <template v-else>
        <span class="font-semibold text-muted">Try:</span>
        <button
          v-for="d in demoPostcodes"
          :key="d.label"
          type="button"
          class="cursor-pointer rounded-full border-0 bg-transparent px-1 py-0.5 font-body text-sm font-bold text-navy underline decoration-line-strong underline-offset-4 hover:decoration-navy"
          @click="postcode = d.pc"
        >
          {{ d.label }}
        </button>
      </template>
    </p>

    <!-- Studio: scripted tailoring sequence -->
    <Transition name="fade">
      <div
        v-if="tailoring"
        class="absolute -inset-4 z-10 flex flex-col justify-center gap-4 rounded-[28px] bg-white/95 p-8 backdrop-blur-sm"
        role="status"
      >
        <p class="m-0 flex items-center gap-2 font-heading text-xl font-extrabold"><AltAiMark />Tailoring Energising Futures…</p>
        <ul class="m-0 flex list-none flex-col gap-3 p-0">
          <li v-for="(s, i) in steps" :key="s" class="flex items-center gap-3 text-base font-bold transition-opacity" :class="i <= step ? 'opacity-100' : 'opacity-30'">
            <span class="flex h-7 w-7 flex-none items-center justify-center rounded-full" :class="i < step ? 'bg-pop-mint' : 'bg-lilac-50'">
              <AppIcon v-if="i < step" name="check" :size="15" :stroke="3" />
              <span v-else-if="i === step" class="h-3 w-3 animate-ping rounded-full bg-pop-coral" />
            </span>
            {{ s }}
          </li>
        </ul>
      </div>
    </Transition>
  </form>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
