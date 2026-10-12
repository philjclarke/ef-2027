<script setup lang="ts">
// "STEM on your doorstep": the region's story plus resources localised for it.
const { prefs, region } = usePersonalisation()
const items = computed(() => (prefs.value && region.value ? localItems(prefs.value, 3) : []))
</script>

<template>
  <section class="pt-20" aria-labelledby="local-h">
    <div class="container-x">
      <div v-if="region" class="overflow-hidden rounded-[32px] bg-navy text-white md:rounded-[40px]">
        <div class="relative min-h-[300px] md:min-h-[380px]">
          <img :src="region.image" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover" />
          <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,14,99,0.9)_0%,rgba(17,14,99,0.55)_55%,rgba(17,14,99,0.1)_100%)]" aria-hidden="true" />
          <div class="relative flex max-w-[720px] flex-col gap-5 p-8 md:p-12">
            <span class="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-extrabold tracking-[0.06em] backdrop-blur">
              <AltAiMark />ON YOUR DOORSTEP
            </span>
            <h2 id="local-h" class="m-0 text-[34px] font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[48px]">STEM in {{ region.place }}</h2>
            <ul class="m-0 flex list-none flex-col gap-3 p-0 text-[17px] leading-normal">
              <li v-for="f in region.facts" :key="f" class="flex gap-3">
                <span class="mt-2.5 h-2 w-2 flex-none rounded-full bg-pop-sun" aria-hidden="true" />{{ f }}
              </li>
            </ul>
            <p class="m-0 flex flex-wrap items-center gap-2 text-sm font-bold">
              Careers nearby:
              <span v-for="c in region.careers" :key="c" class="rounded-full bg-white/15 px-3 py-1">{{ c }}</span>
            </p>
          </div>
        </div>
        <div class="bg-white p-6 text-navy md:p-10">
          <div class="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 class="m-0 text-2xl font-extrabold">Resources localised for {{ region.name }}</h3>
            <p class="m-0 flex items-center gap-1.5 text-sm font-semibold text-muted"><AltAiMark />Adapted with AI, checked by our education team</p>
          </div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-6">
            <AltMiniCard v-for="i in items" :key="i.id" :item="i" :note="localiseFor(i, region).line" ai />
          </div>
          <p v-if="!items.length" class="m-0 text-muted">No localised resources for these classes yet. Try adding another class.</p>
        </div>
      </div>

      <div v-else class="flex flex-col items-start gap-5 rounded-[32px] bg-pop-sun-soft p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div class="flex max-w-[640px] flex-col gap-2">
          <h2 id="local-h" class="m-0 text-[28px] font-extrabold leading-tight">See STEM on your doorstep</h2>
          <p class="m-0 text-[17px] leading-normal">Add your school’s postcode and we’ll bring in local places, industries and careers, from offshore wind in Hull to satellites built in Glasgow.</p>
        </div>
        <a href="#personalise" class="btn-navy flex-none px-6 py-3.5">Add your postcode<AppIcon name="arrow" :stroke="2.4" /></a>
      </div>
    </div>
  </section>
</template>
