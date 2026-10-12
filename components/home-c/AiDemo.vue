<script setup lang="ts">
// Scripted demo of AI localisation: the same slide, original vs localised for a region.
const { region: myRegion } = usePersonalisation()
const item = getItem('electricity-from-the-wind-presentation')!
const regionId = ref(myRegion.value?.id ?? 'humber')
watch(myRegion, (r) => r && (regionId.value = r.id))
const region = computed(() => getRegion(regionId.value)!)

const working = ref(false)
let t: ReturnType<typeof setTimeout> | undefined
watch(regionId, () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  working.value = true
  clearTimeout(t)
  t = setTimeout(() => (working.value = false), 650)
})
onBeforeUnmount(() => clearTimeout(t))

const original = {
  title: 'Where does our electricity come from?',
  bullets: [
    'Power stations and renewable sources generate the electricity we use.',
    'Wind turbines and solar panels transfer energy without burning fuel.',
    'The UK has wind farms on land and at sea.',
  ],
  curriculum: curriculumFor(item, 'england'),
}
const localised = computed(() => ({
  bullets: [original.bullets[0], original.bullets[1]],
  local: region.value.demoLine,
  careers: `Careers nearby: ${region.value.careers.slice(0, 2).join(', ').toLowerCase()}.`,
  curriculum: curriculumFor(item, region.value.nation),
}))
</script>

<template>
  <section class="pt-20" aria-labelledby="ai-h">
    <div class="container-x">
      <div class="rounded-[32px] bg-pop-cream p-6 md:rounded-[40px] md:p-10 lg:p-12">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div class="flex max-w-[640px] flex-col gap-2.5">
            <span class="eyebrow flex items-center gap-1.5"><AltAiMark />AI localisation</span>
            <h2 id="ai-h" class="h2-section">One resource, made local</h2>
            <p class="m-0 text-lg leading-normal text-muted">
              We adapt the worked examples, places and careers in a resource for your area, and map it to your curriculum. A subject specialist checks every version before it’s published.
            </p>
          </div>
          <div class="flex w-full min-w-0 flex-col gap-2 sm:w-[340px]">
            <label for="ai-region" class="text-sm font-extrabold">Show it for</label>
            <select
              id="ai-region"
              v-model="regionId"
              class="min-h-[48px] w-full min-w-0 cursor-pointer rounded-full border-[1.5px] border-navy bg-white px-5 font-body text-base font-bold text-navy"
            >
              <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.place }}</option>
            </select>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Original -->
          <figure class="m-0 flex flex-col gap-3">
            <figcaption class="text-sm font-extrabold uppercase tracking-[0.06em] text-muted">Original</figcaption>
            <div class="slide flex flex-col overflow-hidden rounded-2xl bg-white shadow-card">
              <div class="flex items-center justify-between bg-navy px-5 py-3 text-white">
                <span class="font-heading text-lg font-extrabold">{{ original.title }}</span>
                <img src="/brand/ef-logo.svg" alt="" class="h-8 w-auto rounded bg-white p-0.5" />
              </div>
              <ul class="m-0 flex flex-1 list-disc flex-col gap-3 py-5 pl-10 pr-6 text-[16px] leading-snug">
                <li v-for="b in original.bullets" :key="b">{{ b }}</li>
              </ul>
              <p class="m-0 border-t border-line px-5 py-3 text-sm font-bold text-muted">{{ original.curriculum }}</p>
            </div>
          </figure>

          <!-- Localised -->
          <figure class="m-0 flex flex-col gap-3">
            <figcaption class="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-[0.06em]">
              <AltAiMark />Localised for {{ region.name }}
            </figcaption>
            <div class="slide relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-2 ring-pop-coral" aria-live="polite">
              <div class="flex items-center justify-between bg-navy px-5 py-3 text-white">
                <span class="font-heading text-lg font-extrabold">{{ original.title }}</span>
                <img src="/brand/ef-logo.svg" alt="" class="h-8 w-auto rounded bg-white p-0.5" />
              </div>
              <ul class="m-0 flex flex-1 list-disc flex-col gap-3 py-5 pl-10 pr-6 text-[16px] leading-snug">
                <li v-for="b in localised.bullets" :key="b">{{ b }}</li>
                <li><mark class="changed">{{ localised.local }}</mark></li>
                <li><mark class="changed">{{ localised.careers }}</mark></li>
              </ul>
              <p class="m-0 border-t border-line px-5 py-3 text-sm font-bold">
                <mark v-if="localised.curriculum !== original.curriculum" class="changed">{{ localised.curriculum }}</mark>
                <span v-else class="text-muted">{{ localised.curriculum }}</span>
              </p>
              <Transition name="fade">
                <div v-if="working" class="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm" role="status">
                  <span class="flex items-center gap-2 font-heading text-lg font-extrabold"><AltAiMark />Localising for {{ region.name }}…</span>
                </div>
              </Transition>
            </div>
          </figure>
        </div>

        <ul class="m-0 mt-8 grid list-none gap-4 p-0 md:grid-cols-3">
          <li class="rounded-2xl bg-white p-5">
            <strong class="mb-1 block">A local worked example</strong>
            <span class="text-[15px] leading-snug text-muted">Real places pupils might know, instead of a generic one.</span>
          </li>
          <li class="rounded-2xl bg-white p-5">
            <strong class="mb-1 block">Careers nearby</strong>
            <span class="text-[15px] leading-snug text-muted">Jobs in local industries, so the link to STEM careers feels real.</span>
          </li>
          <li class="rounded-2xl bg-white p-5">
            <strong class="mb-1 block">Your curriculum</strong>
            <span class="text-[15px] leading-snug text-muted">Labelled in your nation’s terms, from KS3 to Third level.</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide {
  min-height: 300px;
}
.changed {
  background: #ffe6de;
  color: inherit;
  border-radius: 6px;
  padding: 1px 4px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
